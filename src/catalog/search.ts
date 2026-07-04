/**
 * Host-side catalog search — the FROZEN contract (scratchpad 514):
 *
 *   loadManifest(json: unknown): Catalog
 *   searchCatalog(catalog, { query, kind?, service?, limit? }): SearchHit[]
 *   type SearchHit = { id, service, kind, score, description, signature? }
 *
 * Pure functions, no I/O — importable from the Worker, vitest, and the eval
 * CLI alike. Everything in the manifest is exposed by construction (ADR-0003:
 * exclusions are filtered at build time). Default limit 10.
 *
 * Scoring is the vendored @cloudflare/codemode ranked-token scorer
 * (src/catalog/vendor/search-scoring.ts); signatures for operation hits are
 * rendered from JSON Schema via the vendored type generator.
 */
// NOTE: relative imports in src/catalog/** carry explicit .ts extensions so
// the module graph loads under plain `node` (type stripping) — the eval CLI
// and vitest both import this file directly (frozen contract, scratchpad 514).
import { z } from "zod";
import { catalogSchema, type Catalog, type CatalogEntry, type CatalogKind } from "./types.ts";
import { lastIdSegment, VALID_IDENT } from "./id.ts";
import {
  scoreEntryWeighted,
  scoreEntryWeightedUngated,
  diversifyByService
} from "./scoring.ts";
import {
  jsonSchemaToType,
  sanitizeToolName,
  toPascalCase,
  type JsonSchema
} from "./vendor/json-schema-types.ts";

export type { Catalog, CatalogEntry } from "./types.ts";

export type SearchHit = {
  id: string;
  service: string;
  kind: string;
  score: number;
  description: string;
  /** Rendered TypeScript signature — operation entries only. */
  signature?: string;
  /**
   * Skill hits only: section keys readable via `codemode.skill.read(id,
   * { sections })` — `##`-heading slugs first, then `file:<relpath>` keys.
   * Omitted when the skill has no section entries (sectionless bodies).
   */
  availableSections?: string[];
};

export type SearchOptions = {
  query: string;
  kind?: CatalogKind;
  service?: string;
  limit?: number;
};

export const DEFAULT_SEARCH_LIMIT = 10;
export const MAX_SEARCH_LIMIT = 50;

/**
 * Structural invariants over the whole entry set — enforced at load so a bad
 * manifest fails loudly at first use, not silently at call time:
 *  (a) globally unique entry ids (the exact-match id is the whole addressing
 *      scheme; a dup would make resolution order-dependent);
 *  (b) unique terminal name segments among kind:"operation" entries WITHIN a
 *      service — those segments become sandbox function names in providers.ts,
 *      so a collision would silently shadow one operation with another;
 *  (c) every kind:"operation" entry's `service` and terminal name segment is a
 *      legal JS identifier (VALID_IDENT) — providers.ts turns them into sandbox
 *      namespace/function names and would otherwise SILENTLY skip an op with a
 *      bad ident, yielding a searchable-but-uncallable operation. Throwing here
 *      makes a builder regression fail loudly at load, not silently at call.
 */
const refinedCatalogSchema = catalogSchema.superRefine((catalog, ctx) => {
  const seenIds = new Set<string>();
  const opNamesByService = new Map<string, Map<string, string>>();
  for (const entry of catalog.entries) {
    if (seenIds.has(entry.id)) {
      ctx.addIssue({ code: "custom", message: `duplicate catalog id: ${entry.id}` });
    }
    seenIds.add(entry.id);

    if (entry.kind !== "operation") continue;
    const name = lastIdSegment(entry.id);

    if (!VALID_IDENT.test(entry.service)) {
      ctx.addIssue({
        code: "custom",
        message: `operation ${entry.id} has service "${entry.service}" which is not a legal JS identifier (sandbox namespace name)`
      });
    }
    if (!VALID_IDENT.test(name)) {
      ctx.addIssue({
        code: "custom",
        message: `operation ${entry.id} has terminal name "${name}" which is not a legal JS identifier (sandbox fn name)`
      });
    }
    let names = opNamesByService.get(entry.service);
    if (!names) {
      names = new Map();
      opNamesByService.set(entry.service, names);
    }
    const prior = names.get(name);
    if (prior !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: `operation name collision in service "${entry.service}": ${prior} and ${entry.id} both map to sandbox fn "${name}"`
      });
    } else {
      names.set(name, entry.id);
    }
  }
});

/**
 * Parse + validate a raw manifest (e.g. the imported catalog/manifest.json).
 * Throws (ZodError) on malformed input OR a structural invariant violation
 * (see refinedCatalogSchema) — the catalog is generated, so any validation
 * failure is a build bug, not a runtime condition to soften.
 */
export function loadManifest(json: unknown): Catalog {
  return refinedCatalogSchema.parse(json);
}

/** Last id segment (after the final "."), used as the high-weight name field. */
function entryName(entry: CatalogEntry): string {
  return lastIdSegment(entry.id);
}

/**
 * Render a compact TypeScript signature for an operation entry:
 * input/output type declarations plus the callable line the model can use
 * inside `execute` (e.g. `lumenloop.search_directory(input): Promise<...>`).
 *
 * The callable line spells out the full result envelope (adapters/types.ts)
 * rather than a bare Promise<Output>: the signature is what LLM code copies
 * from, and a bare Promise<Output> reads as "payload fields at the top
 * level" — exactly the wrong access (`r.projects` instead of
 * `r.data.projects`) the envelope exists to prevent.
 */
export function renderSignature(entry: CatalogEntry): string | undefined {
  if (entry.kind !== "operation" || !entry.inputSchema) return undefined;
  const typeBase = toPascalCase(sanitizeToolName(entryName(entry)));
  const parts: string[] = [];
  parts.push(jsonSchemaToType(entry.inputSchema as JsonSchema, `${typeBase}Input`));
  if (entry.outputSchema) {
    parts.push(jsonSchemaToType(entry.outputSchema as JsonSchema, `${typeBase}Output`));
  }
  const outputType = entry.outputSchema ? `${typeBase}Output` : "unknown";
  // Callable line as the model uses it inside `execute` (namespaced global).
  parts.push(
    `${entry.id}(input: ${typeBase}Input): Promise<{ ok: true, data: ${outputType} } | { ok: false, error: { kind: "error" | "soft-empty", message: string, hint?: string } }>`
  );
  return parts.join("\n");
}

/**
 * Section keys of a skill, from its `skill-section` catalog entries
 * (`skillId#<key>`): the same key set src/skills/store.ts advertises as
 * `availableSections` (`##` slugs, then `file:<relpath>` keys — catalog
 * entries are id-sorted, store.ts is document-ordered, so ORDER may differ).
 */
function sectionKeysOf(catalog: Catalog, skillId: string): string[] {
  const prefix = `${skillId}#`;
  const slugs: string[] = [];
  const fileKeys: string[] = [];
  for (const e of catalog.entries) {
    if (e.kind !== "skill-section" || !e.id.startsWith(prefix)) continue;
    const key = e.id.slice(prefix.length);
    (key.startsWith("file:") ? fileKeys : slugs).push(key);
  }
  return [...slugs, ...fileKeys];
}

/**
 * One scoring pass over the catalog: filter (kind/service), score with
 * `scoreFn`, sort score desc then id asc, and pick a diversified page of
 * `pageLimit`. Shared by both tiers of searchCatalog() so tier 2 is the SAME
 * pipeline under a different scorer. The catalog needs no exposure filter:
 * everything in the manifest is exposed by construction (ADR-0003).
 */
function selectPage(
  catalog: Catalog,
  opts: SearchOptions,
  scoreFn: typeof scoreEntryWeighted,
  pageLimit: number
): { entry: CatalogEntry; score: number }[] {
  const scored: { entry: CatalogEntry; score: number }[] = [];
  for (const entry of catalog.entries) {
    if (opts.kind && entry.kind !== opts.kind) continue;
    if (opts.service && entry.service !== opts.service) continue;
    const score = scoreFn(
      {
        id: entry.id,
        name: entryName(entry),
        service: entry.service,
        kind: entry.kind,
        description: entry.description,
        keywords: entry.keywords
      },
      opts.query
    );
    if (score === null) continue;
    scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score || (a.entry.id < b.entry.id ? -1 : 1));

  return diversifyByService(scored, pageLimit, (s) => s.entry.service);
}

/**
 * Ranked search over the catalog. Pure; results sorted by score desc, then
 * id asc for determinism (within a tier — see below).
 *
 * Internal scoring (round 2, todo 793 — contract unchanged): the vendored
 * lexical score is wrapped by src/catalog/scoring.ts (query stopword
 * filtering, kind weighting, per-service diversity in the returned set);
 * rationale documented there.
 *
 * Tiered gate-rescue backfill (round 4, M1): tier 1 is the pipeline above,
 * unchanged — when it fills the page, the result is byte-identical to the
 * pre-tiering behavior. Only when tier 1 leaves the page short (fewer than
 * `limit` gate-passing candidates exist — measured: 58/122 extended-lane
 * questions, all >20 tokens, gated to ZERO) is the same pipeline re-run with
 * the coverage gate bypassed (scoring.ts lever 5) and its novel hits
 * appended strictly BELOW every tier-1 hit. Tier-2 hits never outrank or
 * displace a tier-1 hit, so a page mixing tiers is score-sorted within each
 * tier but not necessarily across the seam. The tier-2 page is drawn at
 * `limit + 10` so diversity quotas are computed over a wider slate before
 * the tier-1 duplicates are removed.
 */
export function searchCatalog(catalog: Catalog, opts: SearchOptions): SearchHit[] {
  const limit = Math.max(1, Math.min(opts.limit ?? DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT));

  let selected = selectPage(catalog, opts, scoreEntryWeighted, limit);
  if (selected.length < limit) {
    // Tier 2: every gate-passing candidate is already on the short page
    // (selectPage only leaves slots empty when candidates ran out), so after
    // dropping those ids the ungated re-run contributes gate-failed entries only.
    const tier1Ids = new Set(selected.map((s) => s.entry.id));
    const rescue = selectPage(catalog, opts, scoreEntryWeightedUngated, limit + 10).filter(
      (s) => !tier1Ids.has(s.entry.id)
    );
    selected = [...selected, ...rescue].slice(0, limit);
  }

  return selected.map(({ entry, score }) => {
    const hit: SearchHit = {
      id: entry.id,
      service: entry.service,
      kind: entry.kind,
      score,
      description: entry.description
    };
    const signature = renderSignature(entry);
    if (signature) hit.signature = signature;
    if (entry.kind === "skill") {
      const sections = sectionKeysOf(catalog, entry.id);
      if (sections.length > 0) hit.availableSections = sections;
    }
    return hit;
  });
}
