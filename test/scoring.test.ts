/**
 * Replica drift guard (todo 845): scoring.ts's `scoreEntryUngated` is a
 * line-for-line copy of the vendored scorer with EXACTLY ONE difference —
 * the coverage gate is absent. That gives a total-equality invariant this
 * suite pins:
 *
 *   ∀ (entry, query): scoreEntry(e, q) !== null
 *                     ⇒ scoreEntryUngated(e, q) === scoreEntry(e, q)
 *
 * If @cloudflare/codemode is ever re-vendored with changed field weights,
 * tokenization, phrase/prefix multipliers, or bonuses, every gate-passing
 * comparison here fails loudly instead of tier 2 silently desyncing from
 * tier 1. The full re-vendor checklist lives beside the replica in
 * src/catalog/scoring.ts.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreEntry, type ScorableEntry } from "../src/catalog/vendor/search-scoring.ts";
import { scoreEntryUngated } from "../src/catalog/scoring.ts";
import { loadManifest } from "../src/catalog/search.ts";
import { lastIdSegment } from "../src/catalog/id.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = loadManifest(
  JSON.parse(readFileSync(join(ROOT, "catalog", "manifest.json"), "utf8"))
);

/** The same scorable projection searchCatalogPage feeds the scorers (sans keywords — both raw scorers ignore them). */
const scorables: ScorableEntry[] = catalog.entries.map((e) => ({
  id: e.id,
  name: lastIdSegment(e.id),
  service: e.service,
  kind: e.kind,
  description: e.description
}));

/**
 * Deliberately diverse battery: short/long, phrases, exact ids, abbreviation
 * register, filler-heavy natural language — chosen to exercise every scoring
 * branch (exact/prefix/phrase/token/prefix-overlap/substring matches, all
 * coverage-bonus tiers, first-token and exact-id bonuses) across the real
 * manifest, not to encode any routing expectation.
 */
const QUERY_BATTERY = [
  "wallet",
  "soroban contract storage",
  "list validators",
  "search projects",
  "lumenloop.get_project",
  "get_project",
  "stellar docs search",
  "transaction history for an address",
  "account trustlines",
  "how do I deploy a soroban smart contract to testnet with the CLI",
  "is there a live funded project doing cross border remittances on stellar",
  "skill sections for agentic payments",
  "scout",
  "anchor deposit SEP-24 interactive flow stuck pending trust",
  "x"
];

describe("ungated replica ⇔ vendored scorer drift guard (todo 845)", () => {
  it("scores identically to the vendor on every gate-passing (entry, query) pair", () => {
    let gatePassing = 0;
    let gateRescued = 0; // vendor null, replica non-null — the replica's raison d'être
    for (const query of QUERY_BATTERY) {
      for (const entry of scorables) {
        const vendor = scoreEntry(entry, query);
        const replica = scoreEntryUngated(entry, query);
        if (vendor !== null) {
          gatePassing++;
          expect(replica, `${entry.id} × "${query}"`).toBe(vendor);
        } else if (replica !== null) {
          gateRescued++;
        }
      }
    }
    // Anti-vacuity: the sweep must actually exercise both regimes, or a
    // battery/manifest drift could turn this suite into a no-op.
    expect(gatePassing).toBeGreaterThan(100);
    expect(gateRescued).toBeGreaterThan(100);
  });

  it("differs from the vendor ONLY where the coverage gate fires (fixture per branch)", () => {
    const entry: ScorableEntry = {
      id: "svc.fetch_thing",
      name: "fetch_thing",
      service: "svc",
      kind: "operation",
      description: "Fetch a thing by identifier from the widget registry"
    };
    // Exact-name query: passes the gate → identical scores (exact/prefix/
    // first-token/exact-name bonuses all in play).
    expect(scoreEntry(entry, "fetch_thing")).not.toBeNull();
    expect(scoreEntryUngated(entry, "fetch_thing")).toBe(scoreEntry(entry, "fetch_thing"));
    // Exact-phrase escape: multi-token phrase present verbatim passes the
    // gate even at partial coverage → identical.
    const phrase = "widget registry";
    expect(scoreEntry(entry, phrase)).not.toBeNull();
    expect(scoreEntryUngated(entry, phrase)).toBe(scoreEntry(entry, phrase));
    // Gate-failing: 2-token query with one unmatched token (≤2 tokens needs
    // 100% coverage) → vendor null, replica scores the partial match.
    const partial = "fetch zzzunmatchedzzz";
    expect(scoreEntry(entry, partial)).toBeNull();
    expect(scoreEntryUngated(entry, partial)).not.toBeNull();
    // Long query under 60% coverage, no phrase → vendor null, replica scores.
    const dilute = "fetch one of those things please with extra unrelated vocabulary everywhere";
    expect(scoreEntry(entry, dilute)).toBeNull();
    expect(scoreEntryUngated(entry, dilute)).not.toBeNull();
    // Zero matched tokens → BOTH null (the replica keeps that vendor rule).
    expect(scoreEntry(entry, "qqq www eee")).toBeNull();
    expect(scoreEntryUngated(entry, "qqq www eee")).toBeNull();
  });
});
