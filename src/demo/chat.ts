/**
 * POST /demo/chat — the stateless SSE chat turn (design Decisions 1, 4, 5).
 *
 * Gauntlet order: method → CSRF/origin (Origin must equal the request
 * origin; Sec-Fetch-Site, when present, must be "same-origin" — "same-site"
 * is rejected on purpose, the worker serves two same-site custom domains) →
 * auth (signed demo cookie, or the loopback-only dev bypass shared with
 * /mcp) → body validation (size-capped BEFORE parse; a malformed body must
 * not burn a throttle slot) → best-effort KV throttle. Only then does a
 * model turn start: streamText over the AI binding — routed through the AI
 * Gateway whose spend-limit rule is the mandatory account-level cost
 * backstop (design Decisions 3/5) — with the two demo tools, the production
 * SERVER_INSTRUCTIONS + playground preamble as system prompt, and
 * fullStream translated to DemoFrame SSE events. The whole turn is bounded
 * by one abort signal: client disconnect (stream cancel) or the turn
 * timeout stops model + tool spend, not just frame delivery.
 * tool-start/tool-result frames are emitted by the tools themselves
 * (src/demo/tools.ts); here only token/step/done/error mapping remains
 * (part names verified against ai v6: text-delta, start-step, finish,
 * abort, error, tool-error).
 *
 * WORKER-ONLY MODULE: imports src/demo/tools.ts (→ src/executor/run.ts →
 * cloudflare:workers). Route coverage lives in test/smoke/server.test.ts.
 */
import { stepCountIs, streamText, type ToolSet } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { allowDevUnauthenticated } from "../auth/gate.ts";
import { logEvent } from "../observability.ts";
import { verifyDemoCookie } from "./auth.ts";
import { DEMO_CAPS, clampHistory, demoThrottle } from "./budget.ts";
import { encodeFrame, type DemoFrame } from "./frames.ts";
import { DEMO_SYSTEM_PROMPT } from "./prompt.ts";
import { buildDemoTools } from "./tools.ts";

// Fourth pick after live testing (2026-07-06, wrangler dev,
// workers-ai-provider 3.3.1) eliminated every cheaper candidate on a
// different streaming-tool-call failure each:
//  - @cf/zai-org/glm-4.7-flash: args parsed fine, but tool-enabled calls
//    frequently sat silent until the 120s whole-turn abort (steps:0) while
//    no-tools calls answered in ~130ms — unusable latency variance.
//  - @cf/mistralai/mistral-small-3.1-24b-instruct: fast, but streamed tool
//    args arrived token-DUPLICATED ({"{"queryquery":":...) — SDK rejected
//    every call.
//  - @cf/meta/llama-3.3-70b-instruct-fp8-fast: emitted its llama-format
//    function JSON as plain TEXT content; never surfaced as a tool call.
// kimi-k2.6 is what cloudflare/agents-starter itself ships on this exact
// stack (provider + streamText + tools). Pricier ($0.95/$4.00 per M) but a
// demo turn is still <1¢, and a live demo needs reliable tool turns more
// than cheap ones.
const DEMO_MODEL = "@cf/moonshotai/kimi-k2.6";
/** Throttle-bucket subject for loopback dev requests (no cookie, no WorkOS). */
const DEV_SUBJECT = "dev-loopback";
/**
 * Whole-turn ceiling (design Decision 5: "abort/timeout on the whole turn").
 * Worst legitimate turn: 5 model steps + 2 sandbox executes; generous so it
 * only trips hung provider streams, not slow-but-live turns.
 */
const TURN_TIMEOUT_MS = 120_000;
/**
 * Pre-parse request-body cap: well above the worst legitimate replay
 * (maxHistoryMessages × a full 800-token assistant answer + JSON overhead),
 * so JSON.parse and the per-entry validation walk are both bounded before
 * clampHistory ever runs.
 */
const MAX_BODY_CHARS = 128 * 1024;

const SSE_HEADERS: Record<string, string> = {
  "content-type": "text/event-stream",
  "cache-control": "no-store",
  // Defeats intermediary buffering/compression — SSE must flush per event.
  "content-encoding": "identity"
};

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function handleDemoChat(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== "POST") {
    return reject(405, "method_not_allowed", "POST only", { allow: "POST" });
  }

  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (origin !== url.origin || (secFetchSite !== null && secFetchSite !== "same-origin")) {
    return reject(403, "cross_origin", "This endpoint only accepts same-origin browser requests.");
  }

  const subject =
    (await verifyDemoCookie(env.MCP_SERVER_SECRET, request.headers.get("cookie"))) ??
    (allowDevUnauthenticated(env, url.hostname) ? DEV_SUBJECT : null);
  if (!subject) {
    return reject(401, "unauthenticated", "No valid demo session — reload /demo and sign in.");
  }

  // Body before throttle: a malformed request must not burn one of the
  // subject's hourly chats. Size-capped before JSON.parse touches it.
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_CHARS) {
    return reject(413, "payload_too_large", `Request body exceeds ${MAX_BODY_CHARS} bytes.`);
  }
  const messages = await parseChatBody(request);
  if (!messages) {
    return reject(
      400,
      "bad_request",
      'Body must be JSON { messages: [{ role: "user" | "assistant", content: string }, ...] } with at least one message.'
    );
  }
  const history = clampHistory(messages) as ChatMessage[];

  const throttle = await demoThrottle(env.OAUTH_KV, subject);
  if (!throttle.allowed) {
    return reject(
      429,
      "rate_limited",
      `Hourly demo limit (${DEMO_CAPS.chatsPerHour} chats) reached — try again next hour.`,
      { "retry-after": "3600" }
    );
  }

  // Response streams while the turn runs; ctx.waitUntil keeps the pump alive
  // independent of body-consumption timing. One signal bounds the turn's
  // spend: client disconnect (cancel) or the whole-turn timeout aborts the
  // model stream — and with it further tool calls — not just frame delivery.
  const clientGone = new AbortController();
  const turnSignal = AbortSignal.any([clientGone.signal, AbortSignal.timeout(TURN_TIMEOUT_MS)]);
  const encoder = new TextEncoder();
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  let open = true;
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
    cancel() {
      open = false;
      clientGone.abort();
    }
  });
  const emit = (frame: DemoFrame): void => {
    if (!open) return;
    try {
      controller.enqueue(encoder.encode(encodeFrame(frame)));
    } catch {
      open = false; // client went away — keep the turn's tool caps honest, drop frames
      clientGone.abort();
    }
  };

  // First byte out immediately: a reasoning model can sit silent for tens of
  // seconds before fullStream yields anything — the ready frame proves the
  // turn is live (and defeats any intermediary that buffers empty responses).
  emit({ type: "ready" });

  ctx.waitUntil(runTurn(env, emit, history, subject, turnSignal).finally(() => {
    open = false;
    try {
      controller.close();
    } catch {
      // already closed/errored
    }
  }));

  return new Response(stream, { headers: SSE_HEADERS });
}

async function runTurn(
  env: Env,
  emit: (frame: DemoFrame) => void,
  messages: ChatMessage[],
  subject: string,
  abortSignal: AbortSignal
): Promise<void> {
  const t0 = Date.now();
  const { tools, countersReport } = buildDemoTools({ env, emit });
  let steps = 0;
  let finishReason = "none";
  try {
    const workersai = createWorkersAI({
      binding: env.AI,
      // Mandatory cost backstop (design Decisions 3/5): the gateway's
      // spend-limit rule is the only cross-request dollar cap. Fail-closed —
      // the gateway must exist account-side (created, with its spend-limit
      // rule, before deploy) or model calls error out.
      gateway: { id: env.DEMO_AI_GATEWAY_ID }
    });
    const result = streamText({
      model: workersai(DEMO_MODEL),
      system: DEMO_SYSTEM_PROMPT,
      messages,
      tools: tools as ToolSet,
      stopWhen: stepCountIs(DEMO_CAPS.maxSteps),
      maxOutputTokens: DEMO_CAPS.maxOutputTokens,
      abortSignal
    });
    for await (const part of result.fullStream) {
      switch (part.type) {
        case "text-delta":
          emit({ type: "token", text: part.text });
          break;
        case "reasoning-delta":
          // kimi thinks at length before answering; stream the reasoning so
          // the wait is visibly alive (client shows a rolling tail, not a
          // transcript — reasoning is not part of the answer).
          emit({ type: "thinking", text: part.text });
          break;
        case "start-step":
          steps += 1;
          emit({ type: "step", index: steps });
          break;
        case "tool-error":
          // A call that never reached our execute (e.g. invalid input) — the
          // tools' own emit didn't fire, so trace it here instead of hiding it.
          if (part.toolName === "search" || part.toolName === "execute") {
            emit({ type: "tool-start", id: part.toolCallId, tool: part.toolName, input: part.input });
            emit({
              type: "tool-result",
              id: part.toolCallId,
              tool: part.toolName,
              ok: false,
              output: errorText(part.error)
            });
          }
          break;
        case "abort":
          finishReason = "abort";
          emit({ type: "error", message: "The turn was aborted before finishing." });
          break;
        case "error":
          finishReason = "error";
          emit({ type: "error", message: errorText(part.error) });
          break;
        case "finish":
          finishReason = part.finishReason;
          emit({ type: "done", reason: part.finishReason });
          break;
        default:
          break; // reasoning/source/raw/tool-call etc. — no frame mapping
      }
    }
  } catch (e) {
    // fullStream only throws for stream-stopping failures (network, provider).
    finishReason = "exception";
    emit({ type: "error", message: errorText(e) });
  } finally {
    const counters = countersReport();
    logEvent("demo-chat", {
      auth: subject === DEV_SUBJECT ? "dev-bypass" : "cookie",
      messages: messages.length,
      steps,
      finishReason,
      searchCalls: counters.searchCalls,
      executeCalls: counters.executeCalls,
      ms: Date.now() - t0
    });
  }
}

/**
 * null = malformed (caller answers 400). Oversized contents are truncated,
 * not rejected. Reads text first and re-checks the char cap (Content-Length
 * can lie or be absent on chunked bodies) so JSON.parse and the entry walk
 * are bounded — within MAX_BODY_CHARS the walk is a few thousand entries at
 * worst, so no separate messages.length rejection is needed pre-clamp.
 */
async function parseChatBody(request: Request): Promise<ChatMessage[] | null> {
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return null;
    body = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof body !== "object" || body === null) return null;
  const { messages } = body as { messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const out: ChatMessage[] = [];
  for (const entry of messages) {
    if (typeof entry !== "object" || entry === null) return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    // The per-message cap is a USER-input cap (mirrors the textarea
    // maxlength); replayed assistant answers can legitimately exceed it
    // (maxOutputTokens 4096 ≈ >4000 visible chars), and truncating them
    // feeds the model corrupted versions of its own prior replies
    // (PR #5 review). Aggregate prefill stays bounded by MAX_BODY_CHARS
    // here and clampHistory's total-char budget.
    out.push({ role, content: role === "user" ? content.slice(0, DEMO_CAPS.maxUserMessageChars) : content });
  }
  return out;
}

/** Message text only — never a stack, never a serialized error object. */
function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function reject(
  status: number,
  error: string,
  hint: string,
  headers: Record<string, string> = {}
): Response {
  logEvent("demo-chat-rejected", { status, error });
  return Response.json(
    { error, hint },
    { status, headers: { "cache-control": "no-store", ...headers } }
  );
}
