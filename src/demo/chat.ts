/**
 * POST /demo/chat — the stateless SSE chat turn (design Decisions 1, 4, 5).
 *
 * Gauntlet order: method → CSRF/origin (Origin must equal the request
 * origin; Sec-Fetch-Site, when present, must be "same-origin" — "same-site"
 * is rejected on purpose, the worker serves two same-site custom domains) →
 * auth (signed demo cookie, or the loopback-only dev bypass shared with
 * /mcp) → best-effort KV throttle → body validation. Only then does a model
 * turn start: streamText over the AI binding with the two demo tools, the
 * production SERVER_INSTRUCTIONS + playground preamble as system prompt, and
 * fullStream translated to DemoFrame SSE events. tool-start/tool-result
 * frames are emitted by the tools themselves (src/demo/tools.ts); here only
 * token/step/done/error mapping remains (part names verified against ai v6:
 * text-delta, start-step, finish, abort, error, tool-error).
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

const DEMO_MODEL = "@cf/zai-org/glm-4.7-flash";
/** Throttle-bucket subject for loopback dev requests (no cookie, no WorkOS). */
const DEV_SUBJECT = "dev-loopback";

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

  const throttle = await demoThrottle(env.OAUTH_KV, subject);
  if (!throttle.allowed) {
    return reject(
      429,
      "rate_limited",
      `Hourly demo limit (${DEMO_CAPS.chatsPerHour} chats) reached — try again next hour.`,
      { "retry-after": "3600" }
    );
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

  // Response streams while the turn runs; ctx.waitUntil keeps the pump alive
  // independent of body-consumption timing.
  const encoder = new TextEncoder();
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    }
  });
  let open = true;
  const emit = (frame: DemoFrame): void => {
    if (!open) return;
    try {
      controller.enqueue(encoder.encode(encodeFrame(frame)));
    } catch {
      open = false; // client went away — keep the turn's tool caps honest, drop frames
    }
  };

  ctx.waitUntil(runTurn(env, emit, history, subject).finally(() => {
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
  subject: string
): Promise<void> {
  const t0 = Date.now();
  const { tools, countersReport } = buildDemoTools({ env, emit });
  let steps = 0;
  let finishReason = "none";
  try {
    const workersai = createWorkersAI({ binding: env.AI });
    const result = streamText({
      model: workersai(DEMO_MODEL),
      system: DEMO_SYSTEM_PROMPT,
      messages,
      tools: tools as ToolSet,
      stopWhen: stepCountIs(DEMO_CAPS.maxSteps),
      maxOutputTokens: DEMO_CAPS.maxOutputTokens
    });
    for await (const part of result.fullStream) {
      switch (part.type) {
        case "text-delta":
          emit({ type: "token", text: part.text });
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

/** null = malformed (caller answers 400). Oversized contents are truncated, not rejected. */
async function parseChatBody(request: Request): Promise<ChatMessage[] | null> {
  let body: unknown;
  try {
    body = await request.json();
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
    out.push({ role, content: content.slice(0, DEMO_CAPS.maxUserMessageChars) });
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
