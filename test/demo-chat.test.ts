import { APICallError } from "ai";
import { afterEach, describe, expect, it, vi } from "vitest";

const streamTextMock = vi.hoisted(() => vi.fn());

vi.mock("ai", async (importOriginal) => ({
  ...(await importOriginal<typeof import("ai")>()),
  streamText: streamTextMock
}));
vi.mock("../src/demo/tools.ts", () => ({
  buildDemoTools: () => ({ tools: {} })
}));

import { handleDemoChat } from "../src/demo/chat";

function fullStream(parts: unknown[]): AsyncIterable<unknown> {
  return {
    async *[Symbol.asyncIterator]() {
      yield* parts;
    }
  };
}

afterEach(() => {
  streamTextMock.mockReset();
  vi.restoreAllMocks();
});

describe("demo chat provider failures", () => {
  it("keeps provider telemetry when a fallback finishes stop without text", async () => {
    const providerError = new APICallError({
      message: "provider unavailable",
      url: "https://api.openai.com/v1/responses",
      requestBodyValues: {},
      statusCode: 503
    });
    streamTextMock
      .mockReturnValueOnce({ fullStream: fullStream([{ type: "error", error: providerError }]) })
      .mockReturnValueOnce({
        fullStream: fullStream([
          {
            type: "finish",
            finishReason: "stop",
            totalUsage: {
              inputTokens: 1,
              inputTokenDetails: { cacheReadTokens: 0, cacheWriteTokens: 0 },
              outputTokens: 0,
              outputTokenDetails: { reasoningTokens: 0 },
              totalTokens: 1
            }
          }
        ])
      });
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const pending: Promise<unknown>[] = [];
    const ctx = {
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise);
      }
    } as unknown as ExecutionContext;
    const env = {
      AI: {},
      DEV_ALLOW_UNAUTHENTICATED: "true",
      MCP_SERVER_SECRET: "test-only",
      OAUTH_KV: {
        get: vi.fn(async () => null),
        put: vi.fn(async () => undefined)
      }
    } as unknown as Env;

    const response = await handleDemoChat(
      new Request("http://localhost/demo/chat", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost" },
        body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] })
      }),
      env,
      ctx
    );
    await response.text();
    await Promise.all(pending);

    const finalEvent = log.mock.calls
      .map(([line]) => JSON.parse(String(line)) as Record<string, unknown>)
      .find((event) => event.evt === "demo-chat");
    expect(finalEvent).toMatchObject({
      attemptedModels: ["openai/gpt-5.4", "openai/gpt-5.4-mini"],
      finishReason: "stop",
      stopReasonClass: "missing-final-text",
      hadFinalText: false,
      providerErrorStatus: 503,
      providerErrorAttempt: 1,
      providerErrorTerminal: true
    });
  });
});
