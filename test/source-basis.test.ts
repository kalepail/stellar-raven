import { describe, expect, it } from "vitest";
import { assertNoNonExposedRefsInText } from "../scripts/emitted-text-guard.mjs";
import {
  SOURCE_BASIS_MANIFEST_MAX_CHARS,
  buildSourceBasisManifest,
  sanitizeCanonicalUrls,
  sourceBasisShapeFromValue,
  type BuildSourceBasisManifestInput,
  type SourceBasisCall
} from "../src/policy/source-basis.ts";

function calls(count: number): SourceBasisCall[] {
  const outcomes = ["ok", "error", "soft-empty"] as const;
  return Array.from({ length: count }, (_, i) => ({
    op: `service.synthetic_operation_${String(i).padStart(3, "0")}_${"x".repeat(80)}`,
    outcome: outcomes[i % outcomes.length]!,
    ms: 10 + i
  }));
}

describe("source-basis manifest", () => {
  it("is deterministic for identical input bytes", () => {
    const input: BuildSourceBasisManifestInput = {
      shape: sourceBasisShapeFromValue({
        meta: { count: 2 },
        rows: Array.from({ length: 2_000 }, (_, i) => ({ id: i, value: "x".repeat(20) })),
        extra: "z".repeat(10_000)
      }),
      calls: calls(6),
      canonicalUrls: [
        "https://user:pass@example.test/path?a=1#frag",
        "http://ignored.test/path",
        "https://example.test/path?a=2"
      ],
      artifact: {
        state: "available",
        id: "artifact-123",
        sha256: "abcdef1234567890",
        bytes: 123456,
        expiresAt: "2026-07-14T00:00:00.000Z"
      }
    };

    const first = buildSourceBasisManifest(input);
    const second = buildSourceBasisManifest(input);
    expect(Buffer.from(first, "utf8")).toEqual(Buffer.from(second, "utf8"));
    expect(first).toContain("--- SOURCE BASIS ---");
    expect(first).toContain("codemode.artifact.read(id)");
  });

  it("enforces the hard budget on worst-case lists after serialization", () => {
    const wideObject = Object.fromEntries(
      Array.from({ length: 300 }, (_, i) => [`field_${String(i).padStart(3, "0")}`, "x".repeat(500)])
    );
    const text = buildSourceBasisManifest({
      shape: sourceBasisShapeFromValue(wideObject),
      calls: calls(250),
      canonicalUrls: Array.from(
        { length: 80 },
        (_, i) => `https://user:secret@example${i}.test/a/very/long/path/${"b".repeat(80)}?token=secret#frag`
      ),
      artifact: { state: "skipped", reason: `size-cap-${"x".repeat(500)}` }
    });

    expect(text.length).toBeLessThanOrEqual(SOURCE_BASIS_MANIFEST_MAX_CHARS);
    expect(text).toContain("calls:");
    expect(text).toContain("calls omitted");
    expect(text).toContain("canonicalUrls: data-derived/untrusted");
    expect(text).toContain("guidance:");
  });

  it("sanitizes canonical URLs as data-derived and untrusted", () => {
    const sanitized = sanitizeCanonicalUrls([
      "https://user:pass@example.test/path?secret=1#frag",
      "http://example.test/insecure",
      "not a url",
      "https://example.test/path?other=2",
      "https://example.test/path?dedupe=3",
      "https://second.test/a#frag"
    ]);

    expect(sanitized).toEqual(["https://example.test/path", "https://second.test/a"]);

    const text = buildSourceBasisManifest({
      shape: { kind: "array", serializedChars: 100, approxTokens: 25, totalItems: 3 },
      calls: [],
      canonicalUrls: [
        "https://user:pass@example.test/path?secret=1#frag",
        "http://example.test/insecure",
        "https://second.test/a?secret=1#frag"
      ],
      artifact: { state: "absent", reason: "oauth-only-or-not-truncated" }
    });
    expect(text).toContain("data-derived/untrusted");
    expect(text).toContain("https://example.test/path");
    expect(text).toContain("https://second.test/a");
    expect(text).not.toContain("user");
    expect(text).not.toContain("pass");
    expect(text).not.toContain("secret=");
    expect(text).not.toContain("#frag");
    expect(text).not.toContain("http://");
  });

  it("uses truncate.ts loss detail for generic shape summaries", () => {
    const shape = sourceBasisShapeFromValue({
      small: { ok: true },
      rows: Array.from({ length: 5_000 }, (_, i) => ({ i, pad: "x".repeat(25) })),
      tail: "y".repeat(20_000)
    });
    const text = buildSourceBasisManifest({ shape, calls: [], artifact: { state: "skipped", reason: "not-oauth" } });

    expect(text).toContain("shape: object");
    expect(text).toContain("top-level keys");
    expect(text).toContain("Bulk lost from top-level keys:");
    expect(text).toMatch(/\"rows\" ~\d+(\.\d+)?k chars \(cut\)/);
  });

  it("keeps template prose clear of non-exposed operation and retired-skill references", () => {
    const text = buildSourceBasisManifest({
      shape: { kind: "string", serializedChars: 10, approxTokens: 3, stringChars: 10 },
      calls: [],
      artifact: { state: "absent" }
    });

    expect(() => assertNoNonExposedRefsInText(text, "source-basis manifest template")).not.toThrow();
  });
});
