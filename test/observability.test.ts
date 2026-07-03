/**
 * Direct unit tests for the observability helpers (src/observability.ts).
 * `logEvent` and `preview` are the whole surface — no span helpers live here
 * (the sandbox-boundary span is in src/executor/run.ts via tracing.enterSpan).
 * Covers: event naming/shape, telemetry-never-throws (error swallowing), and
 * preview truncation/pass-through.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { logEvent, preview, PREVIEW_LOG_MAX } from "../src/observability.ts";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("logEvent", () => {
  it("emits ONE JSON line with evt first, then flat fields", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logEvent("op", { id: "lumenloop.search_directory", ms: 12, outcome: "ok" });
    expect(spy).toHaveBeenCalledTimes(1);
    const line = spy.mock.calls[0]![0] as string;
    expect(typeof line).toBe("string");
    const parsed = JSON.parse(line);
    expect(parsed).toEqual({
      evt: "op",
      id: "lumenloop.search_directory",
      ms: 12,
      outcome: "ok"
    });
  });

  it("never throws when a field is non-serializable (telemetry must not break the request path)", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    const circular: Record<string, unknown> = {};
    circular.self = circular; // JSON.stringify throws on this
    expect(() => logEvent("weird", circular)).not.toThrow();
    // The stringify failure is swallowed — nothing is logged.
    expect(spy).not.toHaveBeenCalled();
  });

  it("swallows a console.log that itself throws", () => {
    vi.spyOn(console, "log").mockImplementation(() => {
      throw new Error("sink is down");
    });
    expect(() => logEvent("op", { id: "x" })).not.toThrow();
  });
});

describe("preview", () => {
  it("returns the string unchanged when at or under the cap", () => {
    const short = "hello world";
    expect(preview(short)).toBe(short);
    const exactly = "a".repeat(PREVIEW_LOG_MAX);
    expect(preview(exactly)).toBe(exactly);
  });

  it("truncates over-cap text and appends the elided-count marker", () => {
    const long = "x".repeat(PREVIEW_LOG_MAX + 25);
    const out = preview(long);
    expect(out.startsWith("x".repeat(PREVIEW_LOG_MAX))).toBe(true);
    expect(out).toBe(`${"x".repeat(PREVIEW_LOG_MAX)}…[+25 chars]`);
  });

  it("honors a custom max", () => {
    expect(preview("abcdef", 3)).toBe("abc…[+3 chars]");
    expect(preview("abc", 3)).toBe("abc");
  });
});
