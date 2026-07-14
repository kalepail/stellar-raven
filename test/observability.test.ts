/**
 * Direct unit tests for the observability helpers (src/observability.ts).
 * `logEvent` and `preview` are the whole surface — no span helpers live here
 * (the sandbox-boundary span is in src/executor/run.ts via tracing.enterSpan).
 * Covers: event naming/shape, telemetry-never-throws (error swallowing), and
 * preview truncation/pass-through.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { hashPrefix, logEvent, preview, PREVIEW_LOG_MAX } from "../src/observability.ts";
import {
  SEARCH_QUERY_PREVIEW_CHARS,
  searchEventFields
} from "../src/observability-search.ts";
import {
  authSubjectFromProps,
  buildMcpRequestObservability,
  normalizeRayId,
  telemetryClientHash
} from "../src/observability-request.ts";

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

describe("searchEventFields", () => {
  it("replaces the raw query with bounded join fields and honest page-shape counts", async () => {
    const query = "sensitive search ".repeat(30);
    const queryHash = await hashPrefix(query);
    const fields = searchEventFields({
      query,
      queryHash,
      requestedLimit: 5,
      page: {
        hits: [
          { id: "a", service: "scout", kind: "operation", score: 10, tier: "gated", description: "a" },
          { id: "b", service: "skills", kind: "skill", score: 5, tier: "backfill", description: "b" }
        ],
        total: 7,
        truncated: true,
        effectiveLimit: 5,
        widerCandidates: []
      }
    });

    expect(fields).toEqual({
      queryPreview: preview(query, SEARCH_QUERY_PREVIEW_CHARS),
      queryHash,
      queryChars: query.length,
      requestedLimit: 5,
      effectiveLimit: 5,
      omittedCount: 5,
      gatedHits: 1,
      backfillHits: 1
    });
    expect(JSON.stringify(fields)).not.toContain(query);
    expect(fields).not.toHaveProperty("query");
  });

  it("represents a validation/refusal path without pretending a clamp or page ran", async () => {
    const query = "docs search";
    expect(searchEventFields({
      query,
      queryHash: await hashPrefix(query),
      requestedLimit: null,
      page: null
    })).toMatchObject({
      requestedLimit: null,
      effectiveLimit: null,
      omittedCount: 0,
      gatedHits: 0,
      backfillHits: 0
    });
  });
});

describe("MCP request observability", () => {
  it("normalizes Cloudflare Ray ids without guessing when absent", () => {
    expect(normalizeRayId("abc123-ATL")).toBe("abc123");
    expect(normalizeRayId("abc123")).toBe("abc123");
    expect(normalizeRayId(null)).toBeNull();
    expect(normalizeRayId("  ")).toBeNull();
  });

  it("reads only a non-empty string subject from auth props", () => {
    expect(authSubjectFromProps({ subject: "subject-a" })).toBe("subject-a");
    expect(authSubjectFromProps({ subject: "" })).toBeUndefined();
    expect(authSubjectFromProps({ subject: 7 })).toBeUndefined();
    expect(authSubjectFromProps(null)).toBeUndefined();
  });

  it("keeps subject hashes join-compatible with artifacts/playground and keys client hashes", async () => {
    const subject = "a".repeat(64);
    const serverSecret = "unit-test-secret";
    const request = await buildMcpRequestObservability({
      accessMode: "oauth",
      props: { subject, clientId: "https://client.example/metadata.json" },
      rayId: "abc123-ATL",
      serverSecret
    });

    expect(request).toEqual({
      accessMode: "oauth",
      subjectHash: await hashPrefix(subject),
      clientHash: await telemetryClientHash("https://client.example/metadata.json", serverSecret),
      rayId: "abc123"
    });
    expect(request.subjectHash).toMatch(/^[a-f0-9]{16}$/);
    expect(request.clientHash).toMatch(/^[a-f0-9]{16}$/);
    expect(JSON.stringify(request)).not.toContain(subject);
    expect(JSON.stringify(request)).not.toContain(serverSecret);
  });

  it("domain-separates client hashes and represents old grants honestly", async () => {
    const secret = "unit-test-secret";
    expect(await telemetryClientHash("client-a", secret)).not.toBe(
      await telemetryClientHash("client-b", secret)
    );
    expect(await telemetryClientHash("client-a", secret)).not.toBe(
      await telemetryClientHash("raven:mcp-client:v1:client-a", secret)
    );
    await expect(
      buildMcpRequestObservability({
        accessMode: "oauth",
        props: { subject: "old-grant-subject", scopes: ["mcp"] },
        serverSecret: secret
      })
    ).resolves.toMatchObject({ subjectHash: expect.any(String), clientHash: null });
  });
});
