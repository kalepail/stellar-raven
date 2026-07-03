/**
 * searchCatalog tests — the FROZEN contract (scratchpad 514): ranked hits,
 * deny filtering, kind/service filters, default limit 10, TS signatures on
 * operation hits. Runs against the real generated manifest.
 */
import { describe, expect, it, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadManifest,
  searchCatalog,
  DEFAULT_SEARCH_LIMIT,
  type Catalog,
  type SearchHit
} from "../src/catalog/search.ts";
import { readSkill, type SkillBundle } from "../src/skills/store.ts";
import { scoreEntryWeighted } from "../src/catalog/scoring.ts";
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

describe("searchCatalog — deny filtering", () => {
  it("never returns denied entries, even on exact id queries", () => {
    for (const query of [
      "request research",
      "lumenloop.request_research",
      "submit feedback",
      "scout.submitFeedback",
      "feedback"
    ]) {
      const ids = searchCatalog(catalog, { query, limit: 50 }).map((h) => h.id);
      expect(ids, `query: ${query}`).not.toContain("lumenloop.request_research");
      expect(ids, `query: ${query}`).not.toContain("scout.submitFeedback");
    }
  });

  it("never returns the round-2 denied partner writes (todo 793)", () => {
    // submitPartnerListing creates draft partner accounts; partnerAssistant
    // logs surfaced partners as leads — both allow:false in the manifest.
    for (const query of [
      "submit partner listing",
      "scout.submitPartnerListing",
      "partner assistant chat",
      "scout.partnerAssistant",
      "get listed as a partner"
    ]) {
      const ids = searchCatalog(catalog, { query, limit: 50 }).map((h) => h.id);
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
    for (const hit of hits) expect(gatedScore(hit.id, query)).toBeNull();
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
    // Monotone partition: once a tier-2 hit appears, no tier-1 hit follows.
    const seam = tiers.indexOf(false);
    expect(tiers.slice(seam).every((t) => !t)).toBe(true);
    // Tier-1 prefix carries unchanged tier-1 scores.
    for (let i = 0; i < seam; i++) {
      expect(gatedScore(hits[i]!.id, query)).toBe(hits[i]!.score);
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

  it("metadata twins (lumenloop.skill.*) never surface — only the readable skills.* form", () => {
    // The 14 inventory lumenloop.skill.* twins are deny-listed for de-dup
    // (2026-07-03): search returns only the canonical readable skills.* form
    // (which carries availableSections). The store.ts alias still RESOLVES
    // lumenloop.skill.<survivor> for reads (back-compat), it just isn't a hit.
    const hits = searchCatalog(catalog, {
      query: "lumenloop.skill.stellar-project-dossier",
      kind: "skill",
      limit: 20
    });
    expect(hits.find((h) => h.id === "lumenloop.skill.stellar-project-dossier")).toBeUndefined();
    const readable = hits.find((h) => h.id.startsWith("skills.") && h.id.endsWith("stellar-project-dossier"));
    expect(readable).toBeDefined();
  });

  it("metadata twins are NOT discoverable under a service:lumenloop filter (de-dup)", () => {
    // De-dup deny removed the inventory twin, so a service:lumenloop filter no
    // longer surfaces the playbook — it is a `skills` service resource and is
    // found via no filter or service:skills. This is the intended de-dup
    // contract (canonical skills.*); the store.ts alias still resolves reads.
    const hits = searchCatalog(catalog, {
      query: "lumenloop.skill.stellar-project-dossier",
      kind: "skill",
      service: "lumenloop"
    });
    expect(hits.find((h) => h.id === "lumenloop.skill.stellar-project-dossier")).toBeUndefined();
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
  it("renders TS signatures for operation hits only", () => {
    const opHit = searchCatalog(catalog, { query: "search directory" })[0] as SearchHit;
    expect(opHit.kind).toBe("operation");
    expect(opHit.signature).toContain("type SearchDirectoryInput");
    // The callable line spells out the full result envelope — the signature
    // is the model's primary teaching surface for `r.data.*` access.
    expect(opHit.signature).toContain(
      "lumenloop.search_directory(input: SearchDirectoryInput): Promise<{ ok: true, data: SearchDirectoryOutput } | { ok: false, error: { kind: \"error\" | \"soft-empty\" | \"denied\", message: string, hint?: string } }>"
    );

    const skillHits = searchCatalog(catalog, { query: "soroban storage" }).filter(
      (h) => h.kind !== "operation"
    );
    expect(skillHits.length).toBeGreaterThan(0);
    expect(skillHits.every((h) => h.signature === undefined)).toBe(true);
  });

  it("renders GET-operation signatures from OpenAPI parameters", () => {
    const hits = searchCatalog(catalog, { query: "scout.searchProjects" });
    const hit = hits.find((h) => h.id === "scout.searchProjects");
    expect(hit?.signature).toContain("type SearchProjectsInput");
    expect(hit?.signature).toMatch(/q\?: string/);
  });
});
