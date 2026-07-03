---
name: lumenloop-api-integrate
description: Build production clients, scripts, and agents on the LumenLoop REST API at https://api.lumenloop.com/v1 — agent-first tool wiring from the machine-readable catalog, typed clients generated from the OpenAPI spec, hand-rolled thin clients, and robust envelope, error, and rate-limit handling. Use when writing a script, service, or agent that calls the LumenLoop API, generating a typed client from the OpenAPI spec, handling envelopes, errors, or rate limits robustly, or wiring the API into an agent framework as a tool.
user-invocable: true
---

# Integrate with the LumenLoop REST API

This is the production-integration playbook for the **LumenLoop REST API**
(`https://api.lumenloop.com/v1`) — the HTTP face of the Stellar-ecosystem content
and directory platform. The API is deliberately shaped so a client stays small:

- **One uniform invoke route.** Every tool is `POST /v1/tools/{name}` with a JSON
  body — no per-endpoint quirks to learn.
- **A deterministic envelope.** Every response is
  `{ success, data, error, meta: { tool, format } }`, and `meta.format` tells you
  exactly how to read `data`. One parse function covers the whole API.
- **A machine-readable catalog + OpenAPI spec.** `GET /v1/tools` lists every tool
  with when-to-use guidance; `GET /v1/tools/{name}` carries its JSON Schema;
  `GET /v1/openapi.json` is an OpenAPI 3.1 document ready for codegen.
- **Explicit errors.** Failures come back as HTTP status + a machine-readable
  `code` + a `hint` with the next step — retry decisions can be table-driven.
- **A self-describing guide.** `GET /v1/docs` returns the full agent guide as
  markdown, written to be dropped straight into an LLM's context.

Three integration patterns below, ordered by how much code you want to own:
agent-first (no client code), codegen (typed client), hand-rolled (thin client).

## When to use this skill

- You are **writing a script, service, or cron job** that calls the LumenLoop API.
- You want a **typed client** generated from `GET /v1/openapi.json`.
- You are **wiring LumenLoop into an agent framework** as function-calling tools.
- You need to handle **envelopes, errors, and rate limits** robustly in production.
- A worker runs **async research jobs** and must survive crashes and restarts.
- You are deciding **REST vs MCP** for a new client.

## Related skills

- Contract basics — auth, tiers, first call → `../lumenloop-api-connect/SKILL.md`
- Which tool for which question → `../lumenloop-api-query/SKILL.md`
- Commissioned async research runs → `../lumenloop-api-research/SKILL.md`
- Per-agent keys, rotation, budget → `../lumenloop-api-keys/SKILL.md`

Complete, runnable TypeScript / Python / bash clients live in
**`reference/client-snippets.md`**.

---

## Pattern 1 — agent-first integration (no client code)

If your integration *is* an agent, let the API describe itself.

**Feed the guide to the agent.** `GET /v1/docs` returns the live agent guide as
markdown — envelope rules, error codes, tier ladder, workflows, and the full tool
catalog with curl examples. Fetch it into your agent's context at session start, or
point your agent at it as an llms.txt-style document:

```bash
curl -s https://api.lumenloop.com/v1/docs > lumenloop-guide.md   # no auth needed
```

**Map the catalog to function-calling tools.** `GET /v1/tools` is a
machine-readable catalog — each entry has `name`, `description`, `when_to_use`,
`returns`, `tier`, and a `detail` link; `GET /v1/tools/{name}` adds the
`input_schema` (JSON Schema) and `example_args`. Most agent frameworks accept
JSON Schema directly as a tool definition:

```ts
const BASE = "https://api.lumenloop.com/v1";
const HEADERS = { Authorization: `Bearer ${process.env.LUMENLOOP_KEY}` };

const catalog = (await (await fetch(`${BASE}/tools`, { headers: HEADERS })).json()).data.tools;
const tools = await Promise.all(catalog.map(async (t) => {
  const detail = (await (await fetch(`${BASE}/tools/${t.name}`, { headers: HEADERS })).json()).data;
  return {
    name: t.name,
    description: `${t.description}\nWhen to use: ${t.when_to_use}\nReturns: ${t.returns}`,
    parameters: detail.input_schema,   // JSON Schema — most frameworks take this as-is
  };
}));
// Register `tools` with your framework; execute each call via callTool(name, args) (Pattern 3).
```

Two notes: discovery responses are **per-credential projections** — fetch them
*with* your credential so the catalog matches what your key can actually invoke —
and treat them as cacheable for ~5 minutes per credential, so refresh the tool
list at most every few minutes, not per request. (The origin marks them
`private, max-age=300`, but the edge may rewrite caching headers — don't key
logic off the exact header.)

## Pattern 2 — typed client via codegen

`GET /v1/openapi.json` is an OpenAPI 3.1 spec: one POST operation per tool,
`operationId` equal to the tool name, request bodies carrying each tool's real
argument schema. Feed it to any generator:

```bash
# Fetch WITH your credential — the spec is filtered to the caller's tier,
# so an unauthenticated fetch only shows the guest surface.
curl -s -H "Authorization: Bearer $LUMENLOOP_KEY" \
  https://api.lumenloop.com/v1/openapi.json -o lumenloop.openapi.json

npx openapi-typescript lumenloop.openapi.json -o lumenloop-types.d.ts   # TypeScript types
openapi-python-client generate --path lumenloop.openapi.json            # Python package
```

- The spec is **tier-filtered and cacheable ~5 minutes per credential** (the
  origin marks it `private, max-age=300`; don't key logic off the exact header).
  Regenerate after a tier change or when new tools ship.
- Generated code gives you paths and argument types; responses still arrive in the
  standard envelope, so keep the small parse-by-`meta.format` shim from Pattern 3
  between the generated client and your business logic.

## Pattern 3 — hand-rolled thin client

The whole API reduces to one canonical request function. Short TypeScript version
(full TS + Python with retries and a research poller in
`reference/client-snippets.md`):

```ts
const BASE = "https://api.lumenloop.com/v1";

async function callTool(name: string, args: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/tools/${name}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LUMENLOOP_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),       // tools with no arguments accept {}
  });
  const body = await res.json();

  if (!body.success) {                // { success:false, data:null, error, code, hint? }
    throw Object.assign(new Error(`${body.code}: ${body.error}`), {
      status: res.status, code: body.code, hint: body.hint,
      details: body.details,          // present on 400 invalid_arguments
      retryAfter: res.headers.get("Retry-After"),
    });
  }

  // meta.format is fixed per tool: "json" | "text" | "blocks".
  // Every catalog tool now answers "json" (the formerly-blocks tools return
  // single objects like search_directory's {count, projects}). Keep the
  // "blocks" branch as a legacy fallback: data.content[] is a count/status
  // line plus the JSON payload as a string — extract the first block that
  // parses as JSON; none → it's a prose message.
  if (body.meta.format === "blocks") {
    for (const block of body.data.content ?? []) {
      const text = (block.text ?? "").trim();
      if (text.startsWith("[") || text.startsWith("{")) {
        try { return JSON.parse(text); } catch { /* keep scanning */ }
      }
    }
    return { message: (body.data.content ?? []).map((b) => b.text).join("\n") };
  }
  // "text" prose can be a count, a not-found notice ("No document found with
  // ID 4321 in articles"), or an upstream failure — surface data.text as a
  // message, never assume it is payload.
  return body.data;  // "json" → object/array · "text" → { text }
}
```

---

## Error-handling matrix

Every error is HTTP status + `{ success: false, data: null, error, code, hint? }`.
Drive retries off `code`:

| Status | `code` | Retry? | What to do |
| --- | --- | --- | --- |
| 400 | `invalid_arguments` | No | Fix the body — `details` lists each schema violation; re-check `GET /v1/tools/{name}` `input_schema`. |
| 401 | `unauthorized` | No | Missing/invalid/expired credential — re-authenticate (see the `WWW-Authenticate` header) or rotate the key (`../lumenloop-api-keys/SKILL.md`). |
| 402 | `payment_required` | No | No billing account or budget exhausted — check `GET /v1/me`, then top up or request budget (`../lumenloop-api-keys/SKILL.md`). |
| 403 | `insufficient_scope` | No | Tier below the tool's `required_tier` — request an upgrade or use a lower-tier alternative (`../lumenloop-api-query/SKILL.md`). |
| 404 | `unknown_tool` | No | No such tool **for your tier** — list `GET /v1/tools` with your credential; do not guess names. |
| 429 | `rate_limited` | Yes | Sleep exactly `Retry-After` seconds, then resume; start pacing off `X-RateLimit-Remaining`. |
| 5xx | `tool_failed` | Yes | Upstream/internal failure — exponential backoff with jitter, cap retries (4 attempts is plenty). |

Plus the success-envelope edge case from Pattern 3: prose results — `format:
"text"` (or a legacy `"blocks"` response with no JSON payload block) — can be a
count, a not-found notice ("No document found with ID 4321 in articles"), or an
upstream failure. Surface them as messages, never as payload.

## Rate pacing

Every authenticated response — success or error — carries `X-RateLimit-Limit`,
`X-RateLimit-Remaining`, and `X-RateLimit-Reset` (unix seconds). Budgets:

| Tier | Per minute | Per day |
| --- | --- | --- |
| guest | 30 | 2,000 |
| partner | 240 | 30,000 |

- **Pace off `Remaining`, never retry-loop.** Simplest robust rule: when
  `X-RateLimit-Remaining` drops below a small floor, sleep until
  `X-RateLimit-Reset`. A token bucket sized at the per-minute limit works too.
- **Limits are per credential and shared across REST and MCP.** If one key serves
  both a REST worker and an MCP session, share a single limiter. Per-agent keys
  (`../lumenloop-api-keys/SKILL.md`) are for isolation and audit — pace each one the
  same way; the per-minute budget is a fair-use ceiling, not capacity to farm by
  minting extra keys.
- **Mind the daily cap in batch jobs.** A guest key doing 3 calls per item exhausts
  2,000/day after ~650 items. Count calls per item, budget the run up front, and
  checkpoint progress so a paused job resumes instead of restarting.
- **Never hot-loop polls.** Async polling belongs on the server's
  `poll_after_s` hint — or better, long-polled via `wait_s` (below).

## Async research runs (partner tier)

`request_research` is async: it returns `{ run_id, poll_after_s, message }`
immediately — `run_id` is a UUID string, e.g.
`"5fde21e9-2034-4e90-b132-b05d059bb36e"` — and the run executes server-side.
Production handling:

1. **Persist `run_id` durably** (DB row, queue message) *before* you start polling.
   This is your crash-recovery handle.
2. **Long-poll with `wait_s`, sleep `poll_after_s` between calls.** Pass
   `wait_s: 30` (integer 0–45) to `research_result`: the call holds until the
   run completes, the phase changes, or the window expires, then returns the
   current state — expiry returns the normal running object, so the pattern
   degrades gracefully to plain polling. Between calls, sleep
   `progress.poll_after_s` (fallback 30s) — the server's check-back hint.
   While running you get `{ status: "running", progress: { phase, steps,
   searches_run, sources_read, detail, elapsed_s, last_activity_s, stalled,
   eta_s, pct, poll_after_s, message } }`. `progress.message` is partner-safe —
   relay it to your user verbatim. `stalled: true` (~3 min without a heartbeat)
   resolves itself — the platform auto-fails stalled runs after 30 minutes
   total — so keep polling rather than re-commissioning. Terminal statuses are
   `"completed"` (with the report/pack/data payload) and `"failed"`. Stop
   polling the moment `status` is anything other than `"running"` — a poller
   that waits for a status that never occurs loops forever.
3. **Resume, never re-commission.** A restarted worker re-polls its stored
   `run_id`s — `research_result` re-fetches completed runs your account owns, at
   any later time. Check `list_my_research` before commissioning to avoid paying
   twice for the same question. Commissioning while a run is already in flight
   on the account returns **409 with `conflicting_run_id`** — switch to polling
   that run instead of retry-looping the commission.
4. **Expect 402 at submit time** if the billing budget is exhausted — handle it as
   a pause-and-alert, not a retry. Details: `../lumenloop-api-research/SKILL.md`.
5. **Server-to-server? Skip polling — webhooks.** Register an HTTPS endpoint via
   `PUT /v1/me/webhook` (partner tier + billing account; the signing secret is
   returned exactly once). Events `research.run.started` / `.completed` /
   `.failed` deliver identifiers only — `{ type, run_id, status, occurred_at }`
   — so fetch the result via `research_result` with your credential. Verify the
   Standard Webhooks signature (`webhook-signature`: HMAC-SHA256 over
   `"{id}.{timestamp}.{body}"`) with any Standard-Webhooks library; a
   zero-dependency receiver lives in `reference/client-snippets.md`. Delivery is
   attempted 3 times with backoff; `GET /v1/me/webhook` shows
   `last_delivery_at` / `last_status`. Keep the poller as your fallback —
   polling always works.

## REST or MCP?

Both interfaces expose the **same tools, credentials, and rate limits** — this is a
client-shape decision, not a capability one.

| Your client | Use |
| --- | --- |
| Claude.ai, Claude Code, or any MCP-native client/framework | **MCP** at `https://mcp.lumenloop.com/` — tools appear natively; see the public `lumenloop-skills` repo (github.com/lumenloop/lumenloop-skills). |
| Cron jobs, backend services, non-MCP agent frameworks, curl, anything else | **REST** — this repo. |

Mixing is fine (the credential and its budgets are shared) — just remember the
shared rate limit when one key serves both.

## Operational checklist

- **Key in an env var** (`LUMENLOOP_KEY`), injected by your secret manager — never
  in code, config files, or the repo.
- **One labelled key per agent/service** (`POST /v1/me/keys`), all drawing on the
  shared account budget — isolates blast radius and makes rate-limit attribution
  obvious. See `../lumenloop-api-keys/SKILL.md`.
- **Log the key prefix only** (`llmcp_…` first characters / the credential's
  `key_prefix`), never the full key.
- **Watch spend**: `GET /v1/me` shows tier, rate limits, and billing (monthly
  quota, allocated credits, month-to-date spend). Alert before the budget runs dry.
- **Handle 402 gracefully** — pause metered work and notify; a crash-looping worker
  that retries 402s helps no one.
- **Cache discovery responses for ~5 minutes per credential** (`/v1`, `/v1/docs`,
  `/v1/tools`, `/v1/openapi.json` — the origin marks them `private, max-age=300`,
  but don't key logic off the exact header).
- **One rate limiter per credential**, spanning every process and interface (REST
  and MCP) that shares the key.
- **Surface prose results as messages** — `text` results (and JSON-less legacy
  `blocks` results) can be counts, not-found notices, or upstream failures;
  don't let them masquerade as payload in monitoring.

## Pointers

- Live agent guide: `GET https://api.lumenloop.com/v1/docs`
- Catalog / schemas: `GET /v1/tools`, `GET /v1/tools/{name}`
- OpenAPI 3.1 for codegen: `GET /v1/openapi.json`
- Self-introspection: `GET /v1/me`
- Full client code: `reference/client-snippets.md`
