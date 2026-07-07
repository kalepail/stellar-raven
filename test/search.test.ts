/**
 * searchCatalog tests — the FROZEN contract (scratchpad 514): ranked hits,
 * excluded-op absence, kind/service filters, default limit 10, TS signatures on
 * operation hits. Runs against the real generated manifest.
 */
import { describe, expect, it, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadManifest,
  searchCatalog,
  searchCatalogPage,
  renderSignature,
  COMPACT_OUTPUT_THRESHOLD,
  DEFAULT_SEARCH_LIMIT,
  type Catalog,
  type CatalogEntry,
  type SearchHit
} from "../src/catalog/search.ts";
import {
  jsonSchemaToType,
  toPascalCase,
  sanitizeToolName,
  type JsonSchema
} from "../src/catalog/vendor/json-schema-types.ts";
import { readSkill, type SkillBundle } from "../src/skills/store.ts";
import { RUNNERS } from "../src/skills/runners/index.ts";
import { scoreEntryWeighted, canonicalizeQuery } from "../src/catalog/scoring.ts";
import { lastIdSegment } from "../src/catalog/id.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let catalog: Catalog;
let bundle: SkillBundle;

beforeAll(() => {
  catalog = loadManifest(JSON.parse(readFileSync(join(ROOT, "catalog", "manifest.json"), "utf8")));
  bundle = JSON.parse(readFileSync(join(ROOT, "src", "skills", "bundle.json"), "utf8"));
});

describe("searchCatalog — contract shape", () => {
  it("returns SearchHit-shaped hits, ranked by score desc then id asc", () => {
    const hits = searchCatalog(catalog, { query: "search directory" });
    expect(hits.length).toBeGreaterThan(0);
    for (const hit of hits) {
      expect(typeof hit.id).toBe("string");
      expect(typeof hit.service).toBe("string");
      expect(["operation", "skill", "skill-section"]).toContain(hit.kind);
      expect(typeof hit.score).toBe("number");
      expect(typeof hit.description).toBe("string");
      if (hit.signature !== undefined) expect(typeof hit.signature).toBe("string");
    }
    for (let i = 1; i < hits.length; i++) {
      const prev = hits[i - 1] as SearchHit;
      const cur = hits[i] as SearchHit;
      expect(prev.score >= cur.score).toBe(true);
      if (prev.score === cur.score) expect(prev.id < cur.id).toBe(true);
    }
  });

  it("boosts an exact id match to the top", () => {
    const hits = searchCatalog(catalog, { query: "lumenloop.search_directory" });
    expect(hits[0]?.id).toBe("lumenloop.search_directory");
  });

  it("defaults to limit 10 and honors an explicit limit", () => {
    // A broad query that matches far more than 10 entries.
    const defaulted = searchCatalog(catalog, { query: "stellar" });
    expect(defaulted).toHaveLength(DEFAULT_SEARCH_LIMIT);
    expect(searchCatalog(catalog, { query: "stellar", limit: 3 })).toHaveLength(3);
    expect(searchCatalog(catalog, { query: "stellar", limit: 25 })).toHaveLength(25);
  });

  it("applies kind and service filters", () => {
    const opsOnly = searchCatalog(catalog, { query: "stellar projects", kind: "operation" });
    expect(opsOnly.length).toBeGreaterThan(0);
    expect(opsOnly.every((h) => h.kind === "operation")).toBe(true);

    const scoutOnly = searchCatalog(catalog, { query: "stellar projects", service: "scout" });
    expect(scoutOnly.length).toBeGreaterThan(0);
    expect(scoutOnly.every((h) => h.service === "scout")).toBe(true);
  });

  it("returns [] for queries with no lexical overlap", () => {
    // Both tokens must be true non-matches (no vendor token/prefix/substring
    // hit anywhere in the catalog): since the M1 tiered backfill, a single
    // matched token — even a prefix overlap like "nonexistent" ~ "no" or a
    // single-letter catalog token like "x"/"q" — legitimately surfaces weak
    // hits on an otherwise-empty page.
    expect(searchCatalog(catalog, { query: "zzzzqqqq zzqqzzqq" })).toEqual([]);
    expect(searchCatalog(catalog, { query: "   " })).toEqual([]);
  });

  it("is pure — does not mutate the catalog", () => {
    const before = JSON.stringify(catalog);
    searchCatalog(catalog, { query: "soroban storage" });
    expect(JSON.stringify(catalog)).toBe(before);
  });
});

describe("loadManifest — structural invariants (F6)", () => {
  function rawManifest(): { entries: Record<string, unknown>[] } {
    return JSON.parse(readFileSync(join(ROOT, "catalog", "manifest.json"), "utf8"));
  }

  it("loads the real generated manifest without complaint", () => {
    expect(() => loadManifest(rawManifest())).not.toThrow();
  });

  it("rejects a duplicate entry id", () => {
    const raw = rawManifest();
    const dup = { ...raw, entries: [...raw.entries, raw.entries[0]] };
    expect(() => loadManifest(dup)).toThrow(/duplicate catalog id/);
  });

  it("rejects two operations in a service colliding on their terminal name (would shadow a sandbox fn)", () => {
    const raw = rawManifest();
    const op = raw.entries.find((e) => (e as { kind: string }).kind === "operation") as {
      id: string;
      service: string;
    };
    const terminal = op.id.split(".").pop();
    // Same service + same terminal segment, but a distinct id → the two map to
    // the same sandbox function name in providers.ts.
    const collide = { ...op, id: `${op.service}.extra.${terminal}` };
    expect(() => loadManifest({ ...raw, entries: [...raw.entries, collide] })).toThrow(/collision/);
  });
});

describe("searchCatalog — excluded ops are absent by construction (ADR-0003)", () => {
  it("never surfaces build-excluded ops, even on exact id queries", () => {
    // These are excluded at build time (paid, write, side-effecting) and have
    // no manifest entry — search cannot surface what does not exist.
    for (const query of [
      "request research",
      "lumenloop.request_research",
      "submit feedback",
      "scout.submitFeedback",
      "submit partner listing",
      "scout.submitPartnerListing",
      "partner assistant chat",
      "scout.partnerAssistant",
      "get listed as a partner"
    ]) {
      const ids = searchCatalog(catalog, { query, limit: 50 }).map((h) => h.id);
      expect(ids, `query: ${query}`).not.toContain("lumenloop.request_research");
      expect(ids, `query: ${query}`).not.toContain("scout.submitFeedback");
      expect(ids, `query: ${query}`).not.toContain("scout.submitPartnerListing");
      expect(ids, `query: ${query}`).not.toContain("scout.partnerAssistant");
    }
    // The side-effect-free partner ops remain reachable.
    const match = searchCatalog(catalog, { query: "scout.matchPartners", limit: 50 });
    expect(match.map((h) => h.id)).toContain("scout.matchPartners");
  });
});

describe("searchCatalog — routing quality", () => {
  it("surfaces skill-section hits for \"soroban storage\"", () => {
    const hits = searchCatalog(catalog, { query: "soroban storage" });
    expect(hits.some((h) => h.kind === "skill-section")).toBe(true);
  });

  it("routes \"soroban defi projects\" to project-search operations", () => {
    const hits = searchCatalog(catalog, { query: "soroban defi projects", limit: 15 });
    expect(hits[0]?.id).toBe("scout.searchProjects");
    // Purely lexical scorer: search_directory has no "defi"/"soroban" text,
    // so it ranks on "projects" alone — present, but further down.
    expect(hits.map((h) => h.id)).toContain("lumenloop.search_directory");
  });

  it("finds the docs search operation", () => {
    const hits = searchCatalog(catalog, { query: "stellar docs search" });
    expect(hits.map((h) => h.id)).toContain("stellarDocs.search_docs");
  });

  it("routes a topical docs question to a stellarDocs op in the top 3 (structural)", () => {
    // Mechanism check (not a golden-corpus case): the 12 authored docs ops
    // carry topical vocabulary, so a docs-shaped natural-language question
    // must surface stellarDocs near the top despite 300+ competing entries.
    const hits = searchCatalog(catalog, { query: "how do I extend TTL state archival", limit: 5 });
    expect(hits.slice(0, 3).some((h) => h.service === "stellarDocs")).toBe(true);
  });

  it("diversifies services in the returned set (per-service quota)", () => {
    // Broad query matching many entries: the top-5 page must not be a single
    // service five times over (quota = 2 per service at limit 5), and the
    // top-scoring hit is never displaced by the quota.
    const all = searchCatalog(catalog, { query: "stellar soroban contract", limit: 5 });
    const perService = new Map<string, number>();
    for (const h of all) perService.set(h.service, (perService.get(h.service) ?? 0) + 1);
    for (const [service, n] of perService) {
      expect(n, `service ${service} exceeds quota`).toBeLessThanOrEqual(2);
    }
  });
});

describe("searchCatalog — tiered gate-rescue backfill (round 4, M1)", () => {
  /**
   * Gated (tier-1) score of a returned hit, recomputed through the same
   * public scorer searchCatalog uses for tier 1. null ⇒ the hit could only
   * have arrived via the tier-2 (ungated) backfill.
   */
  function gatedScore(hitId: string, query: string): number | null {
    const entry = catalog.entries.find((e) => e.id === hitId)!;
    expect(entry).toBeDefined();
    return scoreEntryWeighted(
      {
        id: entry.id,
        name: lastIdSegment(entry.id),
        service: entry.service,
        kind: entry.kind,
        description: entry.description,
        keywords: entry.keywords
      },
      query
    );
  }

  it("a full tier-1 page is untouched — every hit passes the gated scorer with its tier-1 score", () => {
    // Tier 2 only fires when fewer than `limit` gate-passing candidates
    // exist; a page of all-gate-passers therefore proves the backfill never
    // ran and the results are identical to the pre-tiering pipeline.
    for (const query of ["stellar soroban contract", "search directory", "soroban storage"]) {
      const hits = searchCatalog(catalog, { query, limit: 5 });
      expect(hits, `query: ${query}`).toHaveLength(5);
      for (const hit of hits) {
        expect(gatedScore(hit.id, query), `query: ${query}, hit: ${hit.id}`).toBe(hit.score);
        expect(hit.tier, `query: ${query}, hit: ${hit.id}`).toBe("gated");
      }
      for (let i = 1; i < hits.length; i++) {
        expect(hits[i - 1]!.score >= hits[i]!.score).toBe(true);
      }
    }
  });

  it("backfills a long multi-clause query that the coverage gate zeroed out", () => {
    // >20 tokens of content words spanning services: no entry covers 60% of
    // the vocabulary, so the vendor gate nulls the ENTIRE catalog (measured:
    // 58/122 extended-lane questions). Tier 2 must fill the page.
    const query =
      "design a cross chain remittance corridor that quotes fees checks anchor deposit " +
      "limits verifies trustline flags and streams payment status webhooks to a dashboard";
    const hits = searchCatalog(catalog, { query, limit: 5 });
    expect(hits).toHaveLength(5);
    // Pure tier-2 page: nothing passes the gated scorer (this is exactly the
    // query shape that returned [] before the backfill existed).
    for (const hit of hits) {
      expect(gatedScore(hit.id, query)).toBeNull();
      expect(hit.tier).toBe("backfill");
    }
    // Within the tier, ranking stays score desc.
    for (let i = 1; i < hits.length; i++) {
      expect(hits[i - 1]!.score >= hits[i]!.score).toBe(true);
    }
  });

  it("tier-2 hits never outrank a tier-1 hit on a mixed page", () => {
    // Extended-corpus mechanism check: this question passes the gate for
    // only a handful of entries, so the page mixes tiers. Every gate-passing
    // hit must precede every backfilled one, regardless of raw scores.
    const query =
      "What does it take to become a Stellar anchor, including SEP and Anchor Platform " +
      "setup, licensing, liquidity or float, and on-ramp/off-ramp operating requirements?";
    const hits = searchCatalog(catalog, { query, limit: 5 });
    expect(hits).toHaveLength(5);
    const tiers = hits.map((h) => gatedScore(h.id, query) !== null);
    expect(tiers[0], "top hit must be tier-1").toBe(true);
    expect(tiers).toContain(false); // page actually mixes tiers
    // The tier marker (todo 838) must agree with the recomputed ground truth.
    for (let i = 0; i < hits.length; i++) {
      expect(hits[i]!.tier).toBe(tiers[i] ? "gated" : "backfill");
    }
    // Monotone partition: once a tier-2 hit appears, no tier-1 hit follows.
    const seam = tiers.indexOf(false);
    expect(tiers.slice(seam).every((t) => !t)).toBe(true);
    // Tier-1 prefix carries unchanged tier-1 scores.
    for (let i = 0; i < seam; i++) {
      expect(gatedScore(hits[i]!.id, query)).toBe(hits[i]!.score);
    }
  });
});

describe("searchCatalogPage — tier marker + total/truncated (todos 838/840)", () => {
  /** Hand-built operation entry (passes loadManifest's structural invariants). */
  function op(name: string, description: string) {
    return {
      id: `lumenloop.${name}`,
      service: "lumenloop" as const,
      kind: "operation" as const,
      description,
      inputSchema: null,
      outputSchema: null,
      transport: null,
      provenance: { source: "test://hand-built", fetchedAt: "2026-01-01T00:00:00Z" }
    };
  }

  /**
   * A catalog engineered so a long query gates MOST entries out: on the
   * 10-content-token query below only alpha_handler covers ≥60% of the
   * vocabulary (7/10); every other entry matches 1–2 tokens, failing the
   * vendor coverage gate but scoring non-null ungated. Exact candidate
   * counts are therefore known, so total/truncated are checkable as math,
   * not just invariants.
   */
  const tiny = loadManifest({
    version: 1,
    generatedAt: "2026-01-01T00:00:00Z",
    entries: [
      op("alpha_handler", "alpha beta gamma delta epsilon zeta omega handler"),
      op("kappa_export", "kappa metrics exporter"),
      op("iota_relay", "iota queue relay"),
      op("theta_warm", "theta cache warmer"),
      op("alpha_lookup", "alpha beta lookup"),
      op("alpha_feed", "alpha beta history feed"),
      op("alpha_store", "alpha beta config store")
    ]
  });
  const LONG_QUERY = "alpha beta gamma delta epsilon zeta omega theta iota kappa";

  it("marks tiers on a mixed page and counts gated + novel ungated candidates", () => {
    const page = searchCatalogPage(tiny, { query: LONG_QUERY, limit: 5 });
    expect(page.hits).toHaveLength(5);
    // Exactly one entry passes the coverage gate; it leads the page.
    expect(page.hits[0]!.id).toBe("lumenloop.alpha_handler");
    expect(page.hits[0]!.tier).toBe("gated");
    for (const hit of page.hits.slice(1)) expect(hit.tier).toBe("backfill");
    // total = 1 gated + 6 novel ungated (every entry matches ≥1 token).
    expect(page.total).toBe(7);
    expect(page.truncated).toBe(true);
  });

  it("searchCatalog is the thin .hits wrapper — identical page", () => {
    for (const [query, limit] of [
      [LONG_QUERY, 5],
      ["alpha beta", 2],
      ["alpha beta", 10]
    ] as const) {
      expect(searchCatalog(tiny, { query, limit })).toEqual(
        searchCatalogPage(tiny, { query, limit }).hits
      );
    }
  });

  it("tier-1-only full page: total counts gated candidates only, truncated flags the cut", () => {
    // 2-token query, 100%-coverage gate: exactly the four alpha+beta entries
    // pass. Page of 2 fills from tier 1 alone, so tier 2 is never consulted
    // and total is the gated candidate count.
    const page = searchCatalogPage(tiny, { query: "alpha beta", limit: 2 });
    expect(page.hits).toHaveLength(2);
    for (const hit of page.hits) expect(hit.tier).toBe("gated");
    expect(page.total).toBe(4);
    expect(page.truncated).toBe(true);
  });

  it("total <= limit: tier 2 consulted but novel-empty, truncated false", () => {
    // Same four gated candidates, page of 10: tier 1 leaves the page short,
    // tier 2 re-runs ungated — but every ungated candidate is already a
    // gated one (no other entry matches any token), so total stays 4.
    const page = searchCatalogPage(tiny, { query: "alpha beta", limit: 10 });
    expect(page.hits).toHaveLength(4);
    for (const hit of page.hits) expect(hit.tier).toBe("gated");
    expect(page.total).toBe(4);
    expect(page.truncated).toBe(false);
  });

  it("real-manifest invariants: wrapper equality and truncated ⇔ total > hits.length", () => {
    for (const query of [
      "stellar soroban contract",
      "search directory",
      "wallet balance lookup",
      "zzzzqqqq zzqqzzqq"
    ]) {
      const page = searchCatalogPage(catalog, { query, limit: 5 });
      expect(searchCatalog(catalog, { query, limit: 5 })).toEqual(page.hits);
      expect(page.total).toBeGreaterThanOrEqual(page.hits.length);
      expect(page.truncated).toBe(page.total > page.hits.length);
    }
  });
});

describe("searchCatalog — availableSections on skill hits (todo 812)", () => {
  it("skill hits carry availableSections matching the skills store's key set, slugs before file: keys", () => {
    const hit = searchCatalog(catalog, {
      query: "skills.lumenloop-api.lumenloop-api-billing"
    })[0] as SearchHit;
    expect(hit.kind).toBe("skill");
    expect(hit.availableSections!.length).toBeGreaterThan(0);
    // Shape: every ## slug precedes every file:<relpath> key.
    const firstFile = hit.availableSections!.findIndex((k) => k.startsWith("file:"));
    expect(firstFile).toBeGreaterThan(0); // this skill has a file: reference
    expect(hit.availableSections!.slice(firstFile).every((k) => k.startsWith("file:"))).toBe(true);
    // Membership identical to readSkill's availableSections for the same
    // skill (order may differ: the catalog is id-sorted, the store follows
    // document order).
    const r = readSkill(catalog, bundle, hit.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect([...hit.availableSections!].sort()).toEqual([...r.availableSections].sort());
  });

  it("keeps the field OFF operation and skill-section hits", () => {
    const opHit = searchCatalog(catalog, { query: "lumenloop.search_directory" })[0] as SearchHit;
    expect(opHit.kind).toBe("operation");
    expect(opHit.availableSections).toBeUndefined();
    const sectionHits = searchCatalog(catalog, { query: "soroban storage", limit: 20 }).filter(
      (h) => h.kind === "skill-section"
    );
    expect(sectionHits.length).toBeGreaterThan(0);
    expect(sectionHits.every((h) => h.availableSections === undefined)).toBe(true);
  });

  it("skills exist only under the canonical skills.* id — one skill, one hit (ADR-0003)", () => {
    // The lumenloop.skill.* twin namespace was never emitted into the
    // manifest; the only discoverable form is the readable skills.* mirror
    // entry (which carries availableSections).
    const hits = searchCatalog(catalog, {
      query: "lumenloop.skill.stellar-project-dossier",
      kind: "skill",
      limit: 20
    });
    expect(hits.find((h) => h.id === "lumenloop.skill.stellar-project-dossier")).toBeUndefined();
    const readable = hits.find((h) => h.id.startsWith("skills.") && h.id.endsWith("stellar-project-dossier"));
    expect(readable).toBeDefined();
  });
});

describe("searchCatalog — keyword-indexed section bodies (todo 810)", () => {
  it("surfaces a section for a term that appears ONLY mid-body, not in its description", () => {
    // Real corpus example: "fuzz" lives in the body of the smart-contracts
    // testing companion but not in the section entry's 200-char description.
    const sectionId = "skills.stellar-dev.smart-contracts#file:testing.md";
    const entry = catalog.entries.find((e) => e.id === sectionId)!;
    expect(entry).toBeDefined();
    expect(entry.description.toLowerCase()).not.toContain("fuzz"); // precondition
    expect(entry.keywords).toContain("fuzz"); // build-time extraction carried it
    const hits = searchCatalog(catalog, { query: "fuzz testing smart contracts" });
    expect(hits.map((h) => h.id)).toContain(sectionId);
  });

  it("keeps keywords out of the SearchHit contract (internal scoring field only)", () => {
    const hits = searchCatalog(catalog, { query: "fuzz testing smart contracts" });
    expect(hits.length).toBeGreaterThan(0);
    for (const hit of hits) expect("keywords" in hit).toBe(false);
  });
});

describe("searchCatalog — signatures", () => {
  it("renders TS signatures for operation hits (and runnable skills — see the design §5 describe), never prose hits", () => {
    const opHit = searchCatalog(catalog, { query: "search directory" })[0] as SearchHit;
    expect(opHit.kind).toBe("operation");
    expect(opHit.signature).toContain("type SearchDirectoryInput");
    // The callable line spells out the full result envelope — the signature
    // is the model's primary teaching surface for `r.data.*` access.
    expect(opHit.signature).toContain(
      "lumenloop.search_directory(input: SearchDirectoryInput): Promise<{ ok: true, data: SearchDirectoryOutput } | { ok: false, error: { kind: \"error\" | \"soft-empty\", message: string, hint?: string } }>"
    );

    // Non-operation hits carry no signature UNLESS runnable (the two skills
    // carrying bundled runners are the only exception, asserted separately).
    const proseHits = searchCatalog(catalog, { query: "soroban storage" }).filter(
      (h) => h.kind !== "operation" && !(h.id in RUNNERS)
    );
    expect(proseHits.length).toBeGreaterThan(0);
    expect(proseHits.every((h) => h.signature === undefined)).toBe(true);
  });

  it("renders GET-operation signatures from OpenAPI parameters", () => {
    const hits = searchCatalog(catalog, { query: "scout.searchProjects" });
    const hit = hits.find((h) => h.id === "scout.searchProjects");
    expect(hit?.signature).toContain("type SearchProjectsInput");
    expect(hit?.signature).toMatch(/q\?: string/);
  });
});

describe("search-hit signature compaction (todo 841)", () => {
  /** Full-render output type block length for one operation entry. */
  function outputBlockLength(entry: CatalogEntry): number {
    if (!entry.outputSchema) return 0;
    const typeBase = toPascalCase(sanitizeToolName(lastIdSegment(entry.id)));
    return jsonSchemaToType(entry.outputSchema as JsonSchema, `${typeBase}Output`).length;
  }

  it("stubs scout.searchProjects' oversized output type in search hits — top-level names kept, full type gone", () => {
    const hit = searchCatalog(catalog, { query: "scout.searchProjects" }).find(
      (h) => h.id === "scout.searchProjects"
    ) as SearchHit;
    // The input type and callable envelope line are ALWAYS full — they are
    // what the model needs to make the call.
    expect(hit.signature).toContain("type SearchProjectsInput");
    expect(hit.signature).toContain(
      "scout.searchProjects(input: SearchProjectsInput): Promise<{ ok: true, data: SearchProjectsOutput }"
    );
    // The output type is the stub declaration: top-level field names stay
    // visible (payload field selection without a describe round-trip)…
    // (Asserting the load-bearing parts, not the prose — the stub's wording
    // may be tuned without breaking CI; the type name, field names, and the
    // exact describe pointer may not.)
    expect(hit.signature).toContain("type SearchProjectsOutput");
    expect(hit.signature).toContain("codeReferences, meta, projects");
    expect(hit.signature).toContain('codemode.describe("scout.searchProjects")');
    // …and the ~12.7KB rendered property tree is gone.
    expect(hit.signature).not.toContain("codeReferences?:");
    expect(hit.signature!.length).toBeLessThan(2000);
  });

  it("only output blocks over the threshold are compacted; every other op's search signature is byte-identical", () => {
    const ops = catalog.entries.filter((e) => e.kind === "operation" && e.inputSchema);
    let compacted = 0;
    for (const entry of ops) {
      const full = renderSignature(entry)!;
      const compact = renderSignature(entry, { compactOversizedOutput: true })!;
      if (outputBlockLength(entry) > COMPACT_OUTPUT_THRESHOLD) {
        compacted += 1;
        expect(compact, entry.id).not.toBe(full);
        // The describe pointer is the branch-independent stub invariant
        // (object schemas list field names; non-object ones degrade to an
        // `unknown` stub — both carry the pointer).
        expect(compact, entry.id).toContain(`codemode.describe(${JSON.stringify(entry.id)})`);
      } else {
        expect(compact, entry.id).toBe(full); // byte-identical below the line
      }
    }
    // The threshold trims ONLY the measured monsters (rationale on the
    // constant): a manifest refresh growing this set should be a conscious
    // re-measurement, not silent drift.
    expect(compacted).toBeGreaterThan(0);
    expect(compacted).toBeLessThanOrEqual(5);
  });

  it("search hits (both surfaces share searchCatalogPage) carry the compact rendering", () => {
    const { hits } = searchCatalogPage(catalog, { query: "scout.searchRepos" });
    const hit = hits.find((h) => h.id === "scout.searchRepos")!;
    expect(hit.signature).toContain("top-level field");
    const small = hits.find((h) => {
      if (h.kind !== "operation") return false;
      const entry = catalog.entries.find((e) => e.id === h.id)!;
      return outputBlockLength(entry) <= COMPACT_OUTPUT_THRESHOLD;
    });
    expect(small).toBeDefined(); // the page isn't all monsters
    const entry = catalog.entries.find((e) => e.id === small!.id)!;
    expect(small!.signature).toBe(renderSignature(entry)); // full === compact below threshold
  });

  it("exercises COMPACT_OUTPUT_THRESHOLD exactly at its boundary (hand-built schema)", () => {
    // One string property whose description pads the rendered JSDoc line —
    // the rendered block length is linear in the pad, so the entry can be
    // calibrated to land EXACTLY on the threshold.
    const makeEntry = (pad: string): CatalogEntry => ({
      id: "scout.boundaryProbe",
      service: "scout",
      kind: "operation",
      description: "hand-built boundary probe",
      inputSchema: { type: "object", properties: { q: { type: "string" } } },
      outputSchema: {
        type: "object",
        properties: {
          alpha: { type: "string", description: pad },
          beta: { type: "number" }
        }
      },
      transport: null,
      provenance: { source: "test://boundary", fetchedAt: "2026-07-06T00:00:00Z" }
    });
    const baseLen = outputBlockLength(makeEntry("x"));
    expect(baseLen).toBeLessThan(COMPACT_OUTPUT_THRESHOLD); // calibration sanity
    const atThreshold = makeEntry("x".repeat(COMPACT_OUTPUT_THRESHOLD - baseLen + 1));
    expect(outputBlockLength(atThreshold)).toBe(COMPACT_OUTPUT_THRESHOLD);
    const overThreshold = makeEntry("x".repeat(COMPACT_OUTPUT_THRESHOLD - baseLen + 2));
    expect(outputBlockLength(overThreshold)).toBe(COMPACT_OUTPUT_THRESHOLD + 1);

    // AT the threshold: not compacted (strictly-greater comparison).
    expect(renderSignature(atThreshold, { compactOversizedOutput: true })).toBe(
      renderSignature(atThreshold)
    );
    // ONE char over: compacted to the stub with both top-level names.
    const compacted = renderSignature(overThreshold, { compactOversizedOutput: true })!;
    expect(compacted).toContain("type BoundaryProbeOutput");
    expect(compacted).toContain("alpha, beta");
    expect(compacted).toContain('codemode.describe("scout.boundaryProbe")');
    expect(compacted).not.toContain("xxxx");
    // Full mode never compacts, no matter the size (describe's rendering).
    expect(renderSignature(overThreshold)).toContain("alpha?: string");
  });
});

describe("runnable skills — loadManifest refinements (design §5)", () => {
  const DOSSIER = "skills.lumenloop.stellar-project-dossier";
  const rawManifest = (): { entries: Record<string, unknown>[] } =>
    JSON.parse(readFileSync(join(ROOT, "catalog", "manifest.json"), "utf8"));

  it("accepts the real manifest and carries the runnable flag through the parse", () => {
    const parsed = loadManifest(rawManifest());
    const entry = parsed.entries.find((e) => e.id === DOSSIER)!;
    expect(entry.runnable).toBe(true);
    expect(entry.inputSchema).not.toBeNull();
    expect(entry.outputSchema).not.toBeNull();
  });

  it("rejects a runnable entry missing either schema", () => {
    for (const field of ["inputSchema", "outputSchema"] as const) {
      const raw = rawManifest();
      const entry = raw.entries.find((e) => e.id === DOSSIER)!;
      entry[field] = null;
      expect(() => loadManifest(raw), field).toThrow(/must carry both schemas/);
    }
  });

  it("rejects the runnable flag on a non-skill kind", () => {
    const raw = rawManifest();
    const op = raw.entries.find((e) => e.id === "lumenloop.search_directory")!;
    op.runnable = true;
    expect(() => loadManifest(raw)).toThrow(/skill-entry affordance/);
  });
});

describe("runnable-skill signatures (design §5)", () => {
  const dossier = () =>
    catalog.entries.find((e) => e.id === "skills.lumenloop.stellar-project-dossier")!;

  it("renders the exact codemode.skill.run callable line with the same envelope union operations use", () => {
    const sig = renderSignature(dossier())!;
    expect(sig).toContain("type StellarProjectDossierInput");
    expect(sig).toContain("type StellarProjectDossierOutput");
    expect(sig).toContain(
      'codemode.skill.run("skills.lumenloop.stellar-project-dossier", input: StellarProjectDossierInput): Promise<{ ok: true, data: StellarProjectDossierOutput } | { ok: false, error: { kind: "error" | "soft-empty", message: string, hint?: string } }>'
    );
  });

  it("non-runnable skills and sections still render no signature", () => {
    const prose = catalog.entries.find((e) => e.kind === "skill" && e.runnable !== true)!;
    expect(prose).toBeDefined();
    expect(renderSignature(prose)).toBeUndefined();
    const section = catalog.entries.find((e) => e.kind === "skill-section")!;
    expect(renderSignature(section)).toBeUndefined();
  });

  it("search hits for a runnable skill carry BOTH the signature and availableSections", () => {
    for (const id of Object.keys(RUNNERS)) {
      const hit = searchCatalog(catalog, { query: id }).find((h) => h.id === id)!;
      expect(hit, id).toBeDefined();
      expect(hit.kind).toBe("skill");
      const entry = catalog.entries.find((e) => e.id === id)!;
      expect(hit.signature).toBe(renderSignature(entry, { compactOversizedOutput: true }));
      expect(hit.signature).toContain(`codemode.skill.run(${JSON.stringify(id)}`);
      expect(hit.availableSections!.length).toBeGreaterThan(0);
    }
  });

  it("honors COMPACT_OUTPUT_THRESHOLD for runnable skills exactly as for operations", () => {
    // Hand-built runnable entry with an oversized output block: the search-
    // hit rendering mode must stub it down to top-level field names + the
    // describe pointer while keeping the callable line intact.
    const entry: CatalogEntry = {
      id: "skills.test.padded-runner",
      service: "skills",
      kind: "skill",
      runnable: true,
      description: "hand-built runnable compaction probe",
      inputSchema: { type: "object", properties: { q: { type: "string" } } },
      outputSchema: {
        type: "object",
        properties: {
          alpha: { type: "string", description: "x".repeat(COMPACT_OUTPUT_THRESHOLD + 10) },
          beta: { type: "number" }
        }
      },
      transport: null,
      provenance: { source: "test://runnable", fetchedAt: "2026-07-06T00:00:00Z" }
    };
    const compact = renderSignature(entry, { compactOversizedOutput: true })!;
    expect(compact).toContain("alpha, beta");
    expect(compact).toContain('codemode.describe("skills.test.padded-runner")');
    expect(compact).not.toContain("xxxx");
    expect(compact).toContain('codemode.skill.run("skills.test.padded-runner"');
    // Full mode (describe's rendering) never compacts, no matter the size.
    expect(renderSignature(entry)).toContain("alpha?: string");
  });
});

describe("runnable byte-stability — the §10.1 invariant, pinned offline (design §12)", () => {
  const RUNNABLE_IDS = new Set(Object.keys(RUNNERS));

  /** The same manifest with the runnable attachment undone — "current main". */
  function strippedCatalog(): Catalog {
    const raw = JSON.parse(readFileSync(join(ROOT, "catalog", "manifest.json"), "utf8")) as {
      entries: Record<string, unknown>[];
    };
    raw.entries = raw.entries.map((entry) => {
      if (entry.runnable !== true) return entry;
      const { runnable: _runnable, ...rest } = entry;
      return { ...rest, inputSchema: null, outputSchema: null };
    });
    return loadManifest(raw);
  }

  it("every pre-existing hit field is byte-identical to a non-runnable build; signature on the runnable entries is the only delta", () => {
    const stripped = strippedCatalog();
    const queries: { query: string; limit?: number }[] = [
      // Queries that surface the runnable entries (exact ids + topical)…
      { query: "skills.lumenloop.stellar-project-dossier" },
      { query: "skills.lumenloop.stellar-ecosystem-digest" },
      { query: "project dossier scf funding history", limit: 20 },
      { query: "recent ecosystem digest news roundup", limit: 20 },
      { query: "scf funding award project", limit: 25 },
      // …and a spread of ordinary pages (ops, sections, backfill, broad).
      { query: "stellar", limit: 50 },
      { query: "stellar soroban contract", limit: 15 },
      { query: "search directory" },
      { query: "soroban storage" },
      { query: "stellar docs search" },
      { query: "wallet balance lookup" },
      { query: "fuzz testing smart contracts" },
      {
        query:
          "design a cross chain remittance corridor that quotes fees checks anchor deposit " +
          "limits verifies trustline flags and streams payment status webhooks to a dashboard",
        limit: 5
      }
    ];
    let runnableHitsSeen = 0;
    for (const opts of queries) {
      const before = searchCatalog(stripped, opts);
      const after = searchCatalog(catalog, opts);
      // Rank/membership identity: same ids in the same order.
      expect(
        after.map((h) => h.id),
        opts.query
      ).toEqual(before.map((h) => h.id));
      for (let i = 0; i < after.length; i++) {
        const { signature: sigBefore, ...restBefore } = before[i]!;
        const { signature: sigAfter, ...restAfter } = after[i]!;
        // Every pre-existing field byte-identical (score, tier, description,
        // availableSections, …) — the scorer reads nothing this change touches.
        expect(JSON.stringify(restAfter), `${opts.query} #${i} (${after[i]!.id})`).toBe(
          JSON.stringify(restBefore)
        );
        if (RUNNABLE_IDS.has(after[i]!.id)) {
          // The one permitted delta: the runnable hit GAINS a signature.
          expect(sigBefore, `${opts.query} #${i}`).toBeUndefined();
          expect(typeof sigAfter, `${opts.query} #${i}`).toBe("string");
          runnableHitsSeen += 1;
        } else {
          expect(sigAfter, `${opts.query} #${i} (${after[i]!.id})`).toBe(sigBefore);
        }
      }
    }
    // The battery must actually exercise the delta, or it proves nothing.
    expect(runnableHitsSeen).toBeGreaterThan(0);
  });
});

describe("alias canonicalization — lever 6 (todo 844)", () => {
  it("canonicalizeQuery: null when no alias token (byte-identical no-op path)", () => {
    expect(canonicalizeQuery("wallet balance lookup")).toBeNull();
    expect(canonicalizeQuery("soroban contract storage")).toBeNull();
    // "transaction" spelled out is NOT an alias — no rewrite.
    expect(canonicalizeQuery("transaction history")).toBeNull();
  });

  it("canonicalizeQuery: substitutes abbreviation tokens, single-token only", () => {
    expect(canonicalizeQuery("tx history")).toBe("transaction history");
    expect(canonicalizeQuery("check acct addr")).toBe("check account address");
    // Alias must be its own token — "taxes"/"txhash" style substrings are untouched.
    expect(canonicalizeQuery("txhash lookup")).toBeNull();
  });

  it("bridges the register gap: an abbreviation query hits transaction-vocabulary entries", () => {
    // Vendor prefix matching cannot bridge tx->transaction ("transaction"
    // does not start with "tx"); the lever must. Real-manifest behavioral
    // pin from the live probes that motivated the lever: a transaction-
    // related entry ranks in the top 3 for the abbreviated phrasing.
    const hits = searchCatalog(catalog, { query: "txn submit failed", limit: 5 });
    expect(
      hits.slice(0, 3).some(
        (h) => h.id.includes("transaction") || h.description.toLowerCase().includes("transaction")
      )
    ).toBe(true);
  });

  it("never reduces original-query scores: alias variant only adds via max", () => {
    // An entry matching the ORIGINAL tokens keeps at least its original
    // score when the query also contains an alias token.
    const entry = {
      id: "svc.op",
      name: "op",
      service: "svc",
      kind: "operation",
      description: "spike analysis for fees"
    };
    const withAlias = scoreEntryWeighted(entry, "tx fee spike");
    const originalOnly = scoreEntryWeighted(entry, "fee spike");
    expect(withAlias).not.toBeNull();
    expect(originalOnly).not.toBeNull();
  });
});
