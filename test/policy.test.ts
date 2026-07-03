/**
 * Policy tests — deny-list refusals, metered gate, arg validation, secret
 * redaction, and model-boundary truncation. Everything host-side, pure Node.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, type Catalog, type CatalogEntry } from "../src/catalog/search.ts";
import { guard } from "../src/policy/guard.ts";
import { validateArgs } from "../src/policy/validate.ts";
import { redactSecrets, secretsFromEnv } from "../src/policy/redact.ts";
import { truncateForModel, truncateLogsForModel } from "../src/policy/truncate.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog: Catalog = loadManifest(
  JSON.parse(readFileSync(join(ROOT, "catalog", "manifest.json"), "utf8"))
);

function entry(id: string): CatalogEntry {
  const e = catalog.entries.find((x) => x.id === id);
  if (!e) throw new Error(`missing catalog entry ${id}`);
  return e;
}

describe("guard — deny-list as data", () => {
  it("refuses scout.submitPartnerListing with its manifest denyReason", () => {
    const r = guard(entry("scout.submitPartnerListing"), {
      orgName: "Acme",
      contactEmail: "a@b.co"
    });
    expect(r).not.toBeNull();
    if (!r || r.ok) throw new Error("expected refusal");
    expect(r.error.kind).toBe("denied");
    expect(r.error.message).toContain("DRAFT partner account");
  });

  it("refuses every denied entry in the manifest, regardless of args", () => {
    const denied = catalog.entries.filter((e) => !e.policy.allow);
    expect(denied.length).toBeGreaterThanOrEqual(4); // round-2 deny-list
    for (const e of denied) {
      const r = guard(e, {});
      if (!r || r.ok) throw new Error(`expected denial for ${e.id}`);
      expect(r.error.kind).toBe("denied");
    }
  });

  it("refuses metered entries with a no-charge message (synthetic allow:true case)", () => {
    // lumenloop.request_research is both denied AND metered; the metered gate
    // must hold even if the deny flag were ever lifted alone.
    const metered = { ...entry("lumenloop.request_research"), policy: { allow: true, denyReason: null } };
    const r = guard(metered as CatalogEntry, { question: "what is soroban and how does it work" });
    if (!r || r.ok) throw new Error("expected metered refusal");
    expect(r.error.kind).toBe("denied");
    expect(r.error.message).toContain("No charge was made");
  });

  it("rejects invalid args before any call, with actionable issues", () => {
    const r = guard(entry("lumenloop.search_directory"), { limit: 3 }); // missing query
    if (!r || r.ok) throw new Error("expected validation refusal");
    expect(r.error.kind).toBe("error");
    expect(r.error.message).toContain("no call was made");
    expect(JSON.stringify(r.error.details)).toContain("query");
  });

  it("passes valid args (returns null = proceed)", () => {
    expect(guard(entry("lumenloop.search_directory"), { query: "soroswap" })).toBeNull();
    expect(guard(entry("scout.getStatus"), undefined)).toBeNull();
  });
});

describe("validateArgs — the manifest schema dialect", () => {
  const schema = entry("lumenloop.search_directory").inputSchema;

  it("accepts conforming args", () => {
    expect(validateArgs(schema, { query: "x", limit: 5 })).toEqual([]);
  });

  it("rejects wrong types, out-of-range numbers, unknown keys", () => {
    const issues = validateArgs(schema, { query: 42, limit: 500, bogus: true });
    const text = JSON.stringify(issues);
    expect(text).toContain("expected string");
    expect(text).toContain("<= 100");
    expect(text).toContain("unknown argument");
  });

  it("rejects enum violations (stellarDocs category)", () => {
    const issues = validateArgs(entry("stellarDocs.search_docs_in_category").inputSchema, {
      query: "fees",
      category: "blog"
    });
    expect(JSON.stringify(issues)).toContain("must be one of");
  });

  it("rejects non-object args outright", () => {
    expect(validateArgs(schema, "query")).toHaveLength(1);
  });

  it("validates every allowed operation's own example-free happy path shape", () => {
    // sanity: no operation schema crashes the validator
    for (const e of catalog.entries) {
      if (e.kind !== "operation") continue;
      expect(() => validateArgs(e.inputSchema, {})).not.toThrow();
    }
  });
});

describe("redaction", () => {
  const secrets = secretsFromEnv({ LUMENLOOP_API_KEY: "llmcp_secret_value_123", ALGOLIA_API_KEY: "short" });

  it("collects only plausible secrets (min length)", () => {
    expect(secrets).toEqual(["llmcp_secret_value_123"]);
  });

  it("collects every current secret env name, and NOT the retired MCP_BEARER_TOKEN", () => {
    const collected = secretsFromEnv({
      LUMENLOOP_API_KEY: "lumen_key_abcdefgh",
      ALGOLIA_API_KEY: "algolia_key_abcdefgh",
      MCP_ADMIN_TOKEN: "admin_token_abcdefgh",
      MCP_SERVER_SECRET: "server_secret_abcdefgh",
      WORKOS_API_KEY: "workos_key_abcdefgh",
      MCP_BEARER_TOKEN: "bearer_should_be_ignored"
    });
    expect(collected).toEqual([
      "lumen_key_abcdefgh",
      "algolia_key_abcdefgh",
      "admin_token_abcdefgh",
      "server_secret_abcdefgh",
      "workos_key_abcdefgh"
    ]);
    expect(collected).not.toContain("bearer_should_be_ignored");
  });

  it("scrubs accidental key echoes anywhere in a structure", () => {
    const dirty = {
      note: "sent Authorization: Bearer llmcp_secret_value_123 upstream",
      nested: ["ok", { echo: "llmcp_secret_value_123" }]
    };
    const clean = redactSecrets(dirty, secrets) as typeof dirty;
    expect(JSON.stringify(clean)).not.toContain("llmcp_secret_value_123");
    expect(clean.note).toContain("[REDACTED]");
  });

  it("returns the same reference when nothing matches", () => {
    const value = { fine: true };
    expect(redactSecrets(value, secrets)).toBe(value);
  });
});

describe("truncation at the model boundary", () => {
  it("passes small results through as compact JSON", () => {
    const { text, truncated } = truncateForModel({ a: 1 });
    expect(text).toBe('{"a":1}');
    expect(truncated).toBe(false);
  });

  it("clips oversized results with an actionable footer", () => {
    const big = { rows: Array.from({ length: 5000 }, (_, i) => `row-${i}-${"x".repeat(20)}`) };
    const { text, truncated } = truncateForModel(big);
    expect(truncated).toBe(true);
    expect(text.length).toBeLessThan(26_000);
    expect(text).toContain("--- TRUNCATED ---");
    expect(text).toContain("select only the fields you need");
  });

  it("skill-read advice flag changes footer TEXT only — never which bytes are kept", () => {
    const big = { rows: Array.from({ length: 5000 }, (_, i) => `row-${i}-${"x".repeat(20)}`) };
    const off = truncateForModel(big);
    const on = truncateForModel(big, undefined, { skillSectionAdvice: true });
    expect(off.truncated).toBe(true);
    expect(on.truncated).toBe(true);
    // SECURITY: the cap is a boundary — an advice flag may never widen it or
    // move the cut. Identical kept bytes with the flag on and off.
    const maxChars = 6000 * 4;
    expect(on.text.slice(0, maxChars)).toBe(off.text.slice(0, maxChars));
    expect(on.text).toContain("codemode.skill.read");
    expect(off.text).not.toContain("codemode.skill.read");
  });

  it("the advice flag adds nothing to results under the cap", () => {
    const { text, truncated } = truncateForModel({ a: 1 }, undefined, {
      skillSectionAdvice: true
    });
    expect(text).toBe('{"a":1}');
    expect(truncated).toBe(false);
  });

  it("object footer names the cut and dropped top-level keys with approximate sizes", () => {
    // ~24k-char budget: "meta" fits whole, "rows" straddles the cut, "extra"
    // starts entirely past it.
    const value = {
      meta: { query: "soroswap", total: 5000 },
      rows: Array.from({ length: 5000 }, (_, i) => `row-${i}-${"x".repeat(20)}`),
      extra: "y".repeat(10_000)
    };
    const { text, truncated } = truncateForModel(value);
    expect(truncated).toBe(true);
    const footer = text.slice(24_000);
    expect(footer).toContain("Bulk lost from top-level keys:");
    expect(footer).toMatch(/"rows" ~\d+(\.\d+)?k chars \(cut\)/);
    expect(footer).toMatch(/"extra" ~\d+(\.\d+)?k chars \(dropped\)/);
    expect(footer).toContain('kept intact: "meta"');
    // Actionable advice is repeated alongside the where-the-bulk-is detail.
    expect(footer).toContain("select only the fields you need");
  });

  it("array results report items kept vs total", () => {
    const value = Array.from({ length: 5_000 }, (_, i) => ({ i, pad: "x".repeat(20) }));
    const { text, truncated } = truncateForModel(value);
    expect(truncated).toBe(true);
    expect(text).toMatch(/Array result: kept the first ~\d+ of 5000 items\./);
    // The kept count must be plausible: each item serializes to ~30+ chars,
    // so well under the 24k-char budget's naive item count.
    const kept = Number(/kept the first ~(\d+) of/.exec(text)?.[1]);
    expect(kept).toBeGreaterThan(0);
    expect(kept).toBeLessThan(1_000);
  });

  it("string results report chars kept vs total", () => {
    const value = "z".repeat(100_000);
    const { text, truncated } = truncateForModel(value);
    expect(truncated).toBe(true);
    expect(text).toContain("String result: kept the first 24000 of 100000 chars.");
  });

  it("degrades to the generic footer when the object serializes via toJSON", () => {
    const value = {
      big: "x".repeat(50_000),
      toJSON() {
        return { renamed: this.big };
      }
    };
    const { text, truncated } = truncateForModel(value);
    expect(truncated).toBe(true);
    // Span reconstruction can't see through toJSON — no wrong key spans.
    expect(text).not.toContain("Bulk lost from top-level keys:");
    expect(text).toContain("select only the fields you need");
  });

  it("the loss detail never moves the cut: kept bytes are identical to a plain clip", () => {
    const value = { rows: Array.from({ length: 5000 }, (_, i) => `row-${i}-${"x".repeat(20)}`) };
    const { text } = truncateForModel(value);
    const maxChars = 6000 * 4;
    expect(text.slice(0, maxChars)).toBe(JSON.stringify(value).slice(0, maxChars));
  });

  it("redact-then-clip: a secret straddling the result clip boundary leaks NO prefix", () => {
    // Mirrors run.ts's ordering (redactSecrets THEN truncateForModel): the
    // secret starts just before the 24k-char cut and ends after it. Clip-then-
    // redact would keep an un-scrubbable secret prefix; redact-first collapses
    // it to [REDACTED] before the cut lands.
    const secret = "llmcp_secret_value_1234567890"; // secret-scan:allow — synthetic fixture
    const maxChars = 6000 * 4;
    // Serialization overhead before the leak value: {"pad":" (8) + pad + ",
    // (2) + "leak":" (8) — pad sized so the 29-char secret starts ~12 chars
    // before the cut and ends ~17 past it (straddles), while the shorter
    // [REDACTED] marker lands fully inside the kept prefix.
    const value = {
      pad: "x".repeat(maxChars - 30),
      leak: `${secret} plus trailing context`,
      tail: "y".repeat(1_000)
    };
    const { text, truncated } = truncateForModel(redactSecrets(value, [secret]));
    expect(truncated).toBe(true);
    expect(text).not.toContain(secret);
    expect(text).not.toContain(secret.slice(0, 12)); // no straddled prefix either
    expect(text).toContain("[REDACTED]"); // redaction ran before the clip
  });

  it("passes normal-sized console logs through untouched", () => {
    const logs = Array.from({ length: 100 }, (_, i) => `[step ${i}] fetched page, 42 hits`).join("\n");
    const { text, truncated } = truncateLogsForModel(logs);
    expect(text).toBe(logs);
    expect(truncated).toBe(false);
  });

  it("clips oversized console logs with a logs-specific footer", () => {
    // Payload smuggled via console.log: 100 max-length lines ≈ 200k chars,
    // far past the ~6k-token budget.
    const logs = Array.from({ length: 100 }, () => "x".repeat(2_000)).join("\n");
    const { text, truncated } = truncateLogsForModel(logs);
    expect(truncated).toBe(true);
    expect(text.length).toBeLessThan(26_000);
    expect(text).toContain("--- TRUNCATED ---");
    expect(text).toContain("log counts and previews");
  });
});
