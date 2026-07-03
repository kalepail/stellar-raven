# LumenLoop API — client snippets

Complete, minimal clients for `https://api.lumenloop.com/v1`. No dependencies
beyond the platform (`fetch` in Node 18+/Deno/browsers; `httpx` in Python). Each
implements the same contract: `POST /v1/tools/{name}` with
`Authorization: Bearer <key>`; parse the envelope
`{ success, data, error, meta: { tool, format } }` by `meta.format` — every
catalog tool now answers `json` (one parsed object, e.g. `search_directory` →
`{count, projects}`); keep the legacy `blocks` branch only as a fallback
(extract and JSON-parse the payload block); surface prose
results (counts, not-found notices, upstream failures) as messages, not payload;
retry only 429 (honoring `Retry-After`) and 5xx (exponential backoff with
jitter, capped attempts).

## TypeScript (fetch, zero dependencies)

```ts
// lumenloop.ts — Node 18+ / Deno / Bun. export { callTool, runResearch, LumenLoopError }

const BASE = "https://api.lumenloop.com/v1";
const KEY = process.env.LUMENLOOP_KEY!; // never hard-code; see the operational checklist

export class LumenLoopError extends Error {
  constructor(
    public status: number,        // HTTP status (200 for tool-level failures, e.g. a failed research run)
    public code: string,          // invalid_arguments | unauthorized | payment_required | ...
    message: string,
    public hint?: string,         // server's suggested next step
    public details?: unknown[],   // per-violation list on 400 invalid_arguments
    public retryAfter?: number,   // seconds, from the Retry-After header on 429
  ) {
    super(`${code}: ${message}`);
    this.name = "LumenLoopError";
  }
  get retryable(): boolean {
    return this.status === 429 || this.status >= 500;
  }
}

interface Envelope {
  success: boolean;
  data: any;
  error: string | null;
  code?: string;
  hint?: string;
  details?: unknown[];
  meta?: { tool: string; format: "json" | "text" | "blocks" };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// "blocks" is LEGACY — the catalog tools that used it now answer "json"
// (e.g. search_directory → {count, projects}). Kept as a fallback only:
// data is { content: [{ type: "text", text }] } — typically a count line plus
// the JSON payload as a string in a second block. Return the first block that
// parses as JSON; if none does, the result is a prose message.
function parseBlocks(data: { content?: Array<{ type: string; text?: string }> }): unknown {
  for (const block of data.content ?? []) {
    const text = (block.text ?? "").trim();
    if (text.startsWith("[") || text.startsWith("{")) {
      try { return JSON.parse(text); } catch { /* keep scanning */ }
    }
  }
  return { message: (data.content ?? []).map((b) => b.text ?? "").join("\n").trim() };
}

export async function callTool<T = unknown>(
  name: string,
  args: Record<string, unknown> = {},
  { maxRetries = 4 }: { maxRetries?: number } = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE}/tools/${name}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args), // tools with no arguments accept {}
    });
    const body = (await res.json()) as Envelope;

    if (!body.success) {
      const ra = res.headers.get("Retry-After");
      const err = new LumenLoopError(
        res.status, body.code ?? "unknown", body.error ?? res.statusText,
        body.hint, body.details, ra ? Number(ra) : undefined,
      );
      if (err.retryable && attempt < maxRetries) {
        const delayMs = err.retryAfter !== undefined
          ? err.retryAfter * 1000                                    // 429: server knows best
          : Math.min(30_000, 1000 * 2 ** attempt) * (0.5 + Math.random()); // 5xx: backoff + jitter
        await sleep(delayMs);
        continue;
      }
      throw err;
    }

    // Success — meta.format is fixed per tool.
    if (body.meta?.format === "blocks") return parseBlocks(body.data) as T;
    // "text" prose can be a count, a not-found notice ("No document found with
    // ID 4321 in articles"), or an upstream failure — surface it as a message,
    // never assume it is payload.
    return body.data as T; // json → object/array · text → { text }
  }
}

// --- Async research (partner tier): submit, persist run_id, long-poll ---

export async function runResearch(
  question: string,
  extraArgs: Record<string, unknown> = {},     // e.g. { output_format: "sources" }
  { timeoutMs = 30 * 60_000 } = {},
): Promise<any> {
  const { run_id } = await callTool<{ run_id: string }>(
    "request_research", { question, ...extraArgs },
  );
  console.error(`research run started: ${run_id}`); // persist this durably before polling
  return awaitResearch(run_id, { timeoutMs });
}

export async function awaitResearch(
  runId: string,
  { timeoutMs = 30 * 60_000 } = {},
): Promise<any> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    // wait_s (0-45) long-polls: the server holds the call until the run
    // completes, the phase changes, or the window expires — expiry returns the
    // normal running object, so this degrades gracefully to plain polling.
    const result = await callTool<any>("research_result", { run_id: runId, wait_s: 30 });
    // Statuses: "running" | "completed" | "failed". Anything that is not
    // "running" is terminal — never keep polling an unknown status.
    if (result.status === "completed") return result; // report | pack | data+basis, + sources
    if (result.status !== "running") {
      throw new LumenLoopError(200, "tool_failed",
        `research run ${runId} ended with status "${result.status}"`);
    }
    // While running, progress is rich: { phase, steps, searches_run, sources_read,
    // detail, elapsed_s, last_activity_s, stalled, eta_s, pct, poll_after_s, message }.
    // progress.message is partner-safe — relay it to your user verbatim.
    // stalled runs auto-fail server-side (~30 min) — keep polling, don't re-commission.
    if (result.progress?.message) console.error(result.progress.message);
    await sleep((result.progress?.poll_after_s ?? 30) * 1000); // honor the server's hint
  }
  throw new Error(`run ${runId} still running after ${timeoutMs / 1000}s — resume later via awaitResearch`);
}

// Usage:
//   const { projects } = await callTool<{ count: number; projects: any[] }>("search_directory", { query: "oracle", limit: 5 });
//   const report = await runResearch("Institutional adoption of Stellar in 2026 so far");
```

## Python (httpx)

```python
# lumenloop.py — Python 3.10+, `pip install httpx`
import json, os, random, time

import httpx

BASE = "https://api.lumenloop.com/v1"
KEY = os.environ["LUMENLOOP_KEY"]  # never hard-code


class LumenLoopError(Exception):
    def __init__(self, status, code, message, hint=None, details=None, retry_after=None):
        super().__init__(f"{code}: {message}")
        self.status = status            # HTTP status (200 for tool-level failures, e.g. a failed research run)
        self.code = code                # invalid_arguments | unauthorized | rate_limited | ...
        self.hint = hint                # server's suggested next step
        self.details = details          # per-violation list on 400 invalid_arguments
        self.retry_after = retry_after  # seconds, from Retry-After on 429

    @property
    def retryable(self) -> bool:
        return self.status == 429 or self.status >= 500


def _parse_blocks(data: dict):
    """Unwrap a LEGACY "blocks" result — the catalog tools that used it now
    answer "json" (e.g. search_directory -> {count, projects}); kept as a
    fallback only. A count/status line plus the JSON payload as a string in
    another block. Return the first block that parses as JSON; if none does,
    the result is a prose message."""
    for block in data.get("content") or []:
        text = (block.get("text") or "").strip()
        if text.startswith(("[", "{")):
            try:
                return json.loads(text)
            except ValueError:
                continue  # keep scanning
    return {"message": "\n".join(b.get("text") or "" for b in data.get("content") or []).strip()}


def call_tool(name: str, args: dict | None = None, *, max_retries: int = 4):
    """POST /v1/tools/{name}. Returns envelope `data`, interpreted by meta.format."""
    for attempt in range(max_retries + 1):
        resp = httpx.post(
            f"{BASE}/tools/{name}",
            headers={"Authorization": f"Bearer {KEY}"},
            json=args or {},  # tools with no arguments accept {}
            timeout=60,
        )
        body = resp.json()

        if not body["success"]:
            ra = resp.headers.get("Retry-After")
            err = LumenLoopError(
                resp.status_code, body.get("code", "unknown"), body.get("error") or "",
                body.get("hint"), body.get("details"), int(ra) if ra else None,
            )
            if err.retryable and attempt < max_retries:
                if err.retry_after is not None:                  # 429: server knows best
                    delay = err.retry_after
                else:                                            # 5xx: backoff + jitter
                    delay = min(30, 2 ** attempt) * (0.5 + random.random())
                time.sleep(delay)
                continue
            raise err

        data = body["data"]
        if body["meta"]["format"] == "blocks":
            return _parse_blocks(data)
        # "text" prose can be a count, a not-found notice ("No document found
        # with ID 4321 in articles"), or an upstream failure — surface it as a
        # message, never assume it is payload.
        return data  # json → dict/list · text → {"text": ...}


# --- Async research (partner tier): submit, persist run_id, long-poll ---

def run_research(question: str, extra_args: dict | None = None, *,
                 timeout_secs: int = 1800):
    run = call_tool("request_research", {"question": question, **(extra_args or {})})
    run_id = run["run_id"]
    print(f"research run started: {run_id}")  # persist this durably before polling
    return await_research(run_id, timeout_secs=timeout_secs)


def await_research(run_id: str, *, timeout_secs: int = 1800):
    deadline = time.monotonic() + timeout_secs
    while time.monotonic() < deadline:
        # wait_s (0-45) long-polls: the server holds the call until the run
        # completes, the phase changes, or the window expires — expiry returns
        # the normal running object, so this degrades to plain polling.
        result = call_tool("research_result", {"run_id": run_id, "wait_s": 30})
        status = result.get("status")
        # Statuses: "running" | "completed" | "failed". Anything that is not
        # "running" is terminal — never keep polling an unknown status.
        if status == "completed":
            return result  # report | pack | data+basis, plus sources/citations
        if status != "running":
            raise LumenLoopError(200, "tool_failed", f"research run {run_id} ended with status {status!r}")
        # While running, progress is rich: phase, steps, searches_run,
        # sources_read, detail, elapsed_s, last_activity_s, stalled, eta_s,
        # pct, poll_after_s, message. progress["message"] is partner-safe —
        # relay it to your user verbatim. stalled runs auto-fail server-side
        # (~30 min) — keep polling, don't re-commission.
        progress = result.get("progress") or {}
        if progress.get("message"):
            print(progress["message"])
        time.sleep(progress.get("poll_after_s") or 30)  # honor the server's hint
    raise TimeoutError(f"run {run_id} still running after {timeout_secs}s — resume later via await_research")


if __name__ == "__main__":
    print(call_tool("search_directory", {"query": "oracle", "limit": 5}))
```

## bash + jq (quick shell use)

```bash
# llcall NAME [JSON_BODY] — invoke a tool; prints the payload (blocks-format
# results are unwrapped to their JSON payload), exits non-zero on error envelopes
llcall() {
  local name=$1 body=$2
  [ -z "$body" ] && body='{}'
  curl -s -X POST "https://api.lumenloop.com/v1/tools/$name" \
    -H "Authorization: Bearer $LUMENLOOP_KEY" \
    -H "Content-Type: application/json" \
    -d "$body" |
    jq -e 'if .success
           then (.data
                 | if (type=="object" and has("content"))
                   then ([.content[].text | select(test("^[\\[{]")) | try fromjson][0]
                         // {message: ([.content[].text] | join("\n"))})
                   else . end)
           else ("\(.code): \(.error) — \(.hint // "no hint")" | halt_error) end'
}

llcall search_directory '{"query":"oracle","limit":3}'
llcall get_categories

# Who am I — tier, rate limits, billing/budget
curl -s -H "Authorization: Bearer $LUMENLOOP_KEY" https://api.lumenloop.com/v1/me | jq .data

# Watch the rate budget (headers are on every response)
curl -s -D - -o /dev/null -X POST https://api.lumenloop.com/v1/tools/get_categories \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" -d '{}' |
  grep -i '^x-ratelimit\|^retry-after'

# Async research from the shell: submit, long-poll (wait_s=30), save the result
run_id=$(llcall request_research '{"question":"Stablecoin issuers building on Stellar in 2026"}' | jq -r .run_id)
echo "run_id=$run_id"                       # a UUID — persist this; resumable any time
while :; do
  out=$(llcall research_result "{\"run_id\":\"$run_id\",\"wait_s\":30}")  # held server-side up to 30s
  status=$(jq -r .status <<<"$out")         # "running" | "completed" | "failed"
  echo "status=$status  $(jq -r '.progress.message // empty' <<<"$out")"  # message is safe to relay verbatim
  [ "$status" != "running" ] && break       # any non-running status is terminal
  sleep "$(jq -r '.progress.poll_after_s // 30' <<<"$out")"  # honor the server's check-back hint
done
llcall research_result "{\"run_id\":\"$run_id\"}" > report.json   # check .status == "completed" before trusting it
```

Notes: `jq -e ... halt_error` prints `code: error — hint` on stderr and exits
non-zero, so `set -e` scripts stop cleanly. The shell helpers do not retry
429/5xx — fine interactively, but use the TypeScript or Python client for
anything unattended. Every catalog tool now answers `json` (one parsed object —
e.g. `search_directory` → `{count, projects}`, `get_categories` →
`{count, categories}`); `llcall` keeps the blocks-unwrapping branch only as a
legacy fallback (a blocks result with no JSON block becomes
`{ "message": ... }`). Text-format tools return
`{ "text": "..." }` — that prose can be a count, a not-found notice, or an
upstream failure, so surface it as a message, not payload.

## Webhook receiver (Node, zero dependencies)

Server-to-server alternative to polling: register a public HTTPS URL with
`PUT /v1/me/webhook` (partner tier + billing account) — the response returns
the signing `secret` (`whsec_…`) **exactly once**. LumenLoop then POSTs
`research.run.started` / `research.run.completed` / `research.run.failed`
events, signed per the [Standard Webhooks](https://www.standardwebhooks.com/)
convention. Payloads carry identifiers only — fetch the result via
`research_result` with your own credential.

```js
// webhook-receiver.mjs — Node 18+. Run: node webhook-receiver.mjs
// Setup: PUT /v1/me/webhook {"url":"https://your.host/hooks/lumenloop"}
//        → store the returned secret as LUMENLOOP_WEBHOOK_SECRET (shown once).
import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";

const SECRET = process.env.LUMENLOOP_WEBHOOK_SECRET;            // "whsec_<base64 key>"
const KEY = Buffer.from(SECRET.replace(/^whsec_/, ""), "base64");

createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    // Standard Webhooks: webhook-signature = "v1,<base64 HMAC-SHA256(key, "{id}.{timestamp}.{body}")>"
    const id = req.headers["webhook-id"];
    const ts = req.headers["webhook-timestamp"];                // unix seconds
    const expected = createHmac("sha256", KEY).update(`${id}.${ts}.${body}`).digest("base64");
    const candidates = String(req.headers["webhook-signature"] ?? "")
      .split(" ").map((s) => s.replace(/^v1,/, ""));            // header may carry several signatures
    const fresh = Math.abs(Date.now() / 1000 - Number(ts)) < 300; // reject stale/replayed deliveries
    const ok = fresh && candidates.some((sig) =>
      sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
    if (!ok) { res.writeHead(401); res.end(); return; }

    const event = JSON.parse(body); // { type, run_id, status, occurred_at } — identifiers only
    if (event.type === "research.run.completed") {
      // Fetch the actual payload with YOUR credential, e.g.:
      //   const result = await callTool("research_result", { run_id: event.run_id });
      console.log(`run ${event.run_id} completed — fetch it via research_result`);
    }
    res.writeHead(200); res.end();              // respond 2xx fast; do real work async
  });
}).listen(8787);
```

Delivery is attempted 3 times with backoff (10s timeout per attempt);
`GET /v1/me/webhook` shows `last_delivery_at` / `last_status`. Treat webhooks
as a nudge, not the source of truth — keep a `research_result` poller (above)
as the fallback, and remove the config with `DELETE /v1/me/webhook` when the
receiver is retired.
