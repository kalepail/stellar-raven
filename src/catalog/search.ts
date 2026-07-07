/**
 * Host-side catalog search — the FROZEN contract (scratchpad 514):
 *
 *   loadManifest(json: unknown): Catalog
 *   searchCatalog(catalog, { query, kind?, service?, limit? }): SearchHit[]
 *   type SearchHit = { id, service, kind, score, tier, description, signature? }
 *
 * (`tier` — todo 838 — is an additive metadata field on the hit, not a
 * contract change: ranking, membership, and every pre-existing field are
 * byte-identical. `searchCatalogPage` — todo 840 — is a NEW export beside the
 * frozen surface; `searchCatalog` is its thin `.hits` wrapper.)
 *
 * Pure functions, no I/O — importable from the Worker, vitest, and the eval
 * CLI alike. Everything in the manifest is exposed by construction (ADR-0003:
 * exclusions are filtered at build time). Default limit 10.
 *
 * Filters stay SILENT here by design: an unknown `kind`/`service` simply
 * matches nothing (the eval runner scores raw routing behavior through this
 * exact contract). Filter VALIDATION — "did you mean stellarDocs?" — is the
 * callers' job (src/mcp/tools.ts, src/executor/providers.ts), fed by
 * `catalogServices` below.
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
  /**
   * Which scorer produced this hit (todo 838): "gated" = tier 1, the vendor
   * scorer with its coverage gate; "backfill" = tier 2, the gate-free replica
   * used only to fill a page tier 1 left short. The two scorers use different
   * math, so `score` is comparable ONLY among hits of the same tier within
   * one response — a backfill hit can carry a numerically larger score than
   * the gated hits ranked above it (measured page: 37, 28, 15, 8, then a
   * backfill 111 ranked last). Without this marker that page reads as a
   * broken sort under a "higher is better" schema.
   */
  tier: "gated" | "backfill";
  description: string;
  /**
   * Rendered TypeScript signature — operation entries and runnable-skill
   * entries (research/skill-run-design.md §5: a runnable skill's hit carries
   * the `codemode.skill.run("<id>", …)` callable line, the adoption surface
   * of that design). Input type and callable envelope line are always full;
   * an output type block over COMPACT_OUTPUT_THRESHOLD chars is stubbed down
   * to its top-level field names (todo 841) — the full shape is
   * `codemode.describe(id)`'s job.
   */
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

/**
 * One result page plus honest pagination facts (todo 840, mirroring upstream
 * @cloudflare/codemode's { results, total, truncated } search shape):
 *  - `total`     — distinct catalog entries scoring non-null under the scorer
 *    tiers actually consulted (after kind/service filters, BEFORE paging and
 *    diversity). Tier 1 only when it fills the page; gated candidates plus
 *    novel ungated candidates when tier 2 ran.
 *  - `truncated` — total > hits.length: more matching entries exist than the
 *    page shows, so a caller that found nothing fitting should retry with a
 *    higher limit or narrower query/filters rather than conclude absence.
 */
export type SearchPage = {
  hits: SearchHit[];
  total: number;
  truncated: boolean;
};

export const DEFAULT_SEARCH_LIMIT = 10;
export const MAX_SEARCH_LIMIT = 50;

/**
 * The valid `service` filter values, derived from the catalog itself (unique
 * `entry.service` values, sorted) — the source of truth for the filter-
 * validation layers in src/mcp/tools.ts and src/executor/providers.ts, so a
 * near-miss like "stellardocs" can be rejected with the real names instead of
 * silently matching nothing. Cached per catalog object (a module-singleton
 * JSON import in the Worker); WeakMap so a reloaded manifest never pins the
 * old array.
 */
const servicesCache = new WeakMap<Catalog, readonly string[]>();

export function catalogServices(catalog: Catalog): readonly string[] {
  let services = servicesCache.get(catalog);
  if (!services) {
    services = [...new Set(catalog.entries.map((e) => e.service))].sort();
    servicesCache.set(catalog, services);
  }
  return services;
}

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
 *      makes a builder regression fail loudly at load, not silently at call;
 *  (d) a `runnable` entry is kind:"skill" and carries BOTH schemas
 *      (research/skill-run-design.md §5) — the flag advertises a callable
 *      contract, so a runnable entry without schemas (or on a non-skill kind)
 *      is a builder bug that would render a broken signature and validate
 *      nothing at dispatch.
 */
const refinedCatalogSchema = catalogSchema.superRefine((catalog, ctx) => {
  const seenIds = new Set<string>();
  const opNamesByService = new Map<string, Map<string, string>>();
  for (const entry of catalog.entries) {
    if (seenIds.has(entry.id)) {
      ctx.addIssue({ code: "custom", message: `duplicate catalog id: ${entry.id}` });
    }
    seenIds.add(entry.id);

    if (entry.runnable === true) {
      if (entry.kind !== "skill") {
        ctx.addIssue({
          code: "custom",
          message: `runnable entry ${entry.id} has kind "${entry.kind}" — runnable is a skill-entry affordance (one skill, one id, read + run)`
        });
      }
      if (!entry.inputSchema || !entry.outputSchema) {
        ctx.addIssue({
          code: "custom",
          message: `runnable skill ${entry.id} is missing ${!entry.inputSchema ? "inputSchema" : "outputSchema"} — a runnable entry must carry both schemas (the callable contract)`
        });
      }
    }

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
 * SEARCH-HIT output-type compaction threshold (todo 841): in a search hit, an
 * operation whose rendered OUTPUT type block exceeds this many chars is
 * replaced by a stub declaration (see renderSignature). Why 2000: measured
 * over the whole manifest (2026-07-06), every operation's output block is
 * ≤1,350 chars except three Scout monsters — scout.searchProjects (12,681),
 * scout.searchRepos (4,122), scout.explainRepo (2,099) — so 2000 sits in the
 * dead zone between the ordinary population and the outliers: it trims ONLY
 * the monsters (a limit-10 page carrying searchProjects was ~26KB, ~6.5k
 * tokens, with the bloat usually attached to an OFF-TARGET hit, making the
 * wrong call the easiest one to copy) while leaving every other operation's
 * search signature byte-identical. Applies to output blocks only — the input
 * type and the callable envelope line are what the model needs to MAKE the
 * call and are never compacted anywhere; the full output type stays one
 * `codemode.describe(id)` away inside `execute`.
 */
export const COMPACT_OUTPUT_THRESHOLD = 2000;

/**
 * Stub declaration standing in for an oversized output type block in a
 * search hit. Keeps (a) the type NAME the callable line references, so the
 * signature still reads as one coherent declaration set, and (b) the output
 * schema's TOP-LEVEL property names — field names teach the model payload
 * shape (`r.data.projects[].slug` starts from knowing `projects` exists), so
 * field selection stays possible without a describe round-trip. Non-object
 * output schemas (no top-level properties to list) degrade to a bare
 * `unknown` stub with the same describe pointer. The interpolated text
 * (property names, entry id) rides inside a block comment, so a literal
 * comment-terminator sequence in it would end the comment early and corrupt
 * the stub — a
 * build-generated schema shouldn't contain one, but the stub must not be
 * corruptible by upstream data, hence the escape.
 */
function inBlockComment(text: string): string {
  return text.replace(/\*\//g, "*\\/");
}

function compactOutputStub(entry: CatalogEntry, typeName: string): string {
  const schema = entry.outputSchema as JsonSchema;
  const pointer = `full shape via codemode.describe(${JSON.stringify(entry.id)})`;
  const props =
    typeof schema === "object" && schema !== null && schema.properties
      ? Object.keys(schema.properties)
      : [];
  if (props.length === 0) {
    return `type ${typeName} = unknown /* ${inBlockComment(`output type elided in search hits — ${pointer}`)} */`;
  }
  return `type ${typeName} = { /* ${inBlockComment(`${props.length} top-level field${props.length === 1 ? "" : "s"}: ${props.join(", ")} — ${pointer}`)} */ }`;
}

/**
 * Render a TypeScript signature for an operation or runnable-skill entry:
 * input/output type declarations plus the callable line the model can use
 * inside `execute` (e.g. `lumenloop.search_directory(input): Promise<...>`;
 * for a runnable skill, `codemode.skill.run("<id>", input): Promise<...>` —
 * research/skill-run-design.md §5: skill.run is a CALL, so its rendered line
 * spells the same service-call envelope union operations do; there is no
 * third shape to teach). Non-runnable skills and sections still render no
 * signature — their affordance is skill.read, not a call.
 *
 * The callable line spells out the full result envelope (adapters/types.ts)
 * rather than a bare Promise<Output>: the signature is what LLM code copies
 * from, and a bare Promise<Output> reads as "payload fields at the top
 * level" — exactly the wrong access (`r.projects` instead of
 * `r.data.projects`) the envelope exists to prevent.
 *
 * `compactOversizedOutput` (todo 841) is the SEARCH-HIT rendering mode: the
 * input type block and the callable line are always full (they are what the
 * model needs to make the call), but an output type block over
 * COMPACT_OUTPUT_THRESHOLD chars is replaced by a stub that keeps the type
 * name and the top-level field names (compactOutputStub above). Compaction
 * wraps AROUND the vendored renderer — src/catalog/vendor/json-schema-types.ts
 * stays byte-untouched. `codemode.describe` always renders full (default
 * mode): describe is the canonical detail-on-demand step, so it must carry
 * exactly what the search hit elided.
 */
export function renderSignature(
  entry: CatalogEntry,
  opts?: { compactOversizedOutput?: boolean }
): string | undefined {
  const callableEntry = entry.kind === "operation" || entry.runnable === true;
  if (!callableEntry || !entry.inputSchema) return undefined;
  const typeBase = toPascalCase(sanitizeToolName(entryName(entry)));
  const parts: string[] = [];
  parts.push(jsonSchemaToType(entry.inputSchema as JsonSchema, `${typeBase}Input`));
  if (entry.outputSchema) {
    const outputBlock = jsonSchemaToType(entry.outputSchema as JsonSchema, `${typeBase}Output`);
    parts.push(
      opts?.compactOversizedOutput && outputBlock.length > COMPACT_OUTPUT_THRESHOLD
        ? compactOutputStub(entry, `${typeBase}Output`)
        : outputBlock
    );
  }
  const outputType = entry.outputSchema ? `${typeBase}Output` : "unknown";
  // Callable line as the model uses it inside `execute`: the namespaced
  // global for operations; the codemode.skill.run dispatch for runnable
  // skills (exact-id first argument — ids are exact-match, never fuzzy).
  const callable = entry.runnable
    ? `codemode.skill.run(${JSON.stringify(entry.id)}, input: ${typeBase}Input)`
    : `${entry.id}(input: ${typeBase}Input)`;
  parts.push(
    `${callable}: Promise<{ ok: true, data: ${outputType} } | { ok: false, error: { kind: "error" | "soft-empty", message: string, hint?: string } }>`
  );
  return parts.join("\n");
}

/**
 * Section keys of a skill, from its `skill-section` catalog entries
 * (`skillId#<key>`): the same key set src/skills/store.ts advertises as
 * `availableSections` (`##` slugs, then `file:<relpath>` keys — catalog
 * entries are id-sorted, store.ts is document-ordered, so ORDER may differ).
 * Exported (todo 841) so `codemode.describe` (src/executor/providers.ts)
 * advertises the SAME key set search hits carry — one derivation, no drift.
 */
export function sectionKeysOf(catalog: Catalog, skillId: string): string[] {
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
 * `scoreFn`, and sort score desc then id asc. Shared by both tiers of
 * searchCatalogPage() so tier 2 is the SAME pipeline under a different
 * scorer; the caller diversifies + pages the result (split out of the old
 * selectPage so the pre-paging candidate COUNT is observable for `total`,
 * todo 840 — diversifyByService(scoreCandidates(...), pageLimit) is the old
 * selectPage, term for term). The catalog needs no exposure filter:
 * everything in the manifest is exposed by construction (ADR-0003).
 */
function scoreCandidates(
  catalog: Catalog,
  opts: SearchOptions,
  scoreFn: typeof scoreEntryWeighted
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

  return scored;
}

/**
 * Ranked search over the catalog, with pagination facts. Pure; results
 * sorted by score desc, then id asc for determinism (within a tier — see
 * below).
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
 * tier but not necessarily across the seam — every hit carries `tier` (todo
 * 838) so the seam is data, not a guessing game. The tier-2 page is drawn at
 * `limit + 10` so diversity quotas are computed over a wider slate before
 * the tier-1 duplicates are removed.
 *
 * `total`/`truncated` (todo 840): total counts distinct candidates the
 * consulted scorer tiers accepted (post-filter, pre-diversity/paging) —
 * tier-1 candidates alone when tier 1 filled the page; plus the NOVEL tier-2
 * candidates (ungated minus gated ids) when the backfill ran. Counting only
 * consulted tiers keeps the number honest: it is exactly the pool this
 * response's ranking drew from, not a hypothetical deeper search.
 */
export function searchCatalogPage(catalog: Catalog, opts: SearchOptions): SearchPage {
  const limit = Math.max(1, Math.min(opts.limit ?? DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT));

  const gated = scoreCandidates(catalog, opts, scoreEntryWeighted);
  let selected = diversifyByService(gated, limit, (s) => s.entry.service);
  let total = gated.length;
  const gatedCount = selected.length; // page seam: hits below this index are tier 2
  if (selected.length < limit) {
    // Tier 2: every gate-passing candidate is already on the short page
    // (diversifyByService only leaves slots empty when candidates ran out —
    // so the page's ids ARE the full gated id set here), and after dropping
    // those ids the ungated re-run contributes gate-failed entries only.
    const tier1Ids = new Set(selected.map((s) => s.entry.id));
    const ungated = scoreCandidates(catalog, opts, scoreEntryWeightedUngated);
    total = gated.length + ungated.filter((s) => !tier1Ids.has(s.entry.id)).length;
    const rescue = diversifyByService(ungated, limit + 10, (s) => s.entry.service).filter(
      (s) => !tier1Ids.has(s.entry.id)
    );
    selected = [...selected, ...rescue].slice(0, limit);
  }

  const hits = selected.map(({ entry, score }, index) => {
    const hit: SearchHit = {
      id: entry.id,
      service: entry.service,
      kind: entry.kind,
      score,
      tier: index < gatedCount ? "gated" : "backfill",
      description: entry.description
    };
    // Search-hit rendering mode: oversized output type blocks become stubs
    // (COMPACT_OUTPUT_THRESHOLD above) — the full signature is describe's job.
    // Runnable-skill hits render one too (the skill.run callable line, the
    // §10 adoption surface) AND keep availableSections below — one skill, one
    // id, two affordances (read + run).
    const signature = renderSignature(entry, { compactOversizedOutput: true });
    if (signature) hit.signature = signature;
    if (entry.kind === "skill") {
      const sections = sectionKeysOf(catalog, entry.id);
      if (sections.length > 0) hit.availableSections = sections;
    }
    return hit;
  });

  return { hits, total, truncated: total > hits.length };
}

/**
 * The frozen-contract entry point (scratchpad 514; eval/run-routing.mjs and
 * the vitest suites import this): the same page as searchCatalogPage, hits
 * only. Thin wrapper by construction so the two can never disagree.
 */
export function searchCatalog(catalog: Catalog, opts: SearchOptions): SearchHit[] {
  return searchCatalogPage(catalog, opts).hits;
}
