/**
 * Routing-aware scoring layer on top of the vendored lexical scorer
 * (src/catalog/vendor/search-scoring.ts — untouched upstream math).
 *
 * This module is OURS (round 2, todo 793) and is deliberately structural —
 * every lever below is query-independent and applies uniformly to the whole
 * catalog. No per-question special cases, no query→service maps.
 *
 * Three levers, each fixing a measured, structural imbalance
 * (eval/README.md baseline: 203 skill-sections lexically crowding 57
 * operations; 40/338 questions gated to zero hits; single services flooding
 * all top-5 slots):
 *
 *  1. Stopword GATE-RESCUE — when an entry fails the vendor scorer's
 *     token-coverage gate on the full query, it is rescored with general
 *     English stopwords (a standard Snowball-style closed-class set, NOT
 *     derived from any eval question) removed from the query. Coverage
 *     becomes a statement about content words; entries that already passed
 *     keep their exact vendor score. (Filtering stopwords for ALL scoring
 *     was tried and measurably regressed routing — matched closed-class
 *     words in prose descriptions carry real signal in the vendor math.)
 *
 *  2. Kind weighting — skill-section entries (fragments of a SKILL.md whose
 *     whole-skill entry also ranks) are scaled by 0.75. The search tool
 *     exists to route a model to something it can CALL or open whole; 203
 *     near-duplicate fragments should not blanket-outrank 57 operations on
 *     shared topical vocabulary. Sections still rank — and still win on
 *     strong lexical matches. Whole-skill entries keep full weight.
 *
 *  3. Service-diversity selection — the top-`limit` SET is chosen with a
 *     per-service quota (score order otherwise preserved). A routing search
 *     that shows one service five times tells the caller strictly less than
 *     one that shows the two runner-up services too. The quota only changes
 *     set membership below the flood point: the top-scoring entry is never
 *     displaced, and a service's FIRST in-page hit always survives (quotas
 *     only trim a service's third-and-later appearances).
 *
 *  4. Low-weight keyword field (round 3, todo 810) — skill-section entries
 *     carry build-time `keywords` distilled from the section BODY
 *     (src/catalog/extract-keywords.ts); descriptions are heading + first
 *     paragraph truncated to 200 chars, so mid-section content (error codes,
 *     flags, function names) was lexically invisible. The vendor file stays
 *     byte-identical: the entry is scored twice — once as-is, once with the
 *     keywords appended to the description — and the keyword-attributable
 *     DELTA is blended in at KEYWORD_BLEND (0.4 × description weight ≈ the
 *     vendor's own low-weight `kind` field). The rescue path re-admits
 *     gate-failed entries at KEYWORD_BLEND damping with NO structural cap:
 *     a rescued section CAN outrank a weak genuine name/description match
 *     (measured pair: rescued 35 vs genuine 17). The routing eval (legacy
 *     gates + skills lane, eval/run-routing.mjs) is the guard against that
 *     trade going bad; changing the blend requires re-running it.
 *
 *  5. Ungated scoring path (round 4, M1 tiered gate-rescue backfill) — the
 *     vendor coverage gate (search-scoring.ts:130, <60% token coverage and
 *     no exact phrase → null) is structurally unreachable for long
 *     multi-clause questions: at 20+ query tokens NO single entry covers 60%
 *     of the vocabulary, so the whole catalog gates to zero. The stopword
 *     rescue (lever 1) does not help — the surplus tokens are content words.
 *     `scoreEntryWeightedUngated` is the same pipeline (keyword blend,
 *     stopword rescue, kind weight) over a gate-free replica of the vendor
 *     math, kept beside it the same way lever 4 double-scores rather than
 *     editing the vendor file. searchCatalogPage() (searchCatalog's engine)
 *     uses it ONLY to backfill a result page the gated tier left short —
 *     gated hits always rank first (hits carry tier: "gated" | "backfill"),
 *     so every ranking that worked before is byte-identical (see search.ts).
 */
import {
  normalizeSearchText,
  scoreEntry,
  tokenize,
  type ScorableEntry
} from "./vendor/search-scoring.ts";

export type { ScorableEntry } from "./vendor/search-scoring.ts";

/** ScorableEntry plus the optional build-time keyword field (lever 4). */
export type WeightedScorableEntry = ScorableEntry & { keywords?: readonly string[] };

/**
 * General English stopwords (standard closed-class set — articles, copulas,
 * auxiliaries, prepositions, pronouns, wh-words). Domain terms never appear
 * here; the list was not derived from reading eval questions.
 */
export const STOPWORDS: ReadonlySet<string> = new Set([
  "a", "about", "an", "and", "any", "are", "as", "at", "be", "been", "but",
  "by", "can", "could", "did", "do", "does", "doing", "for", "from", "get",
  "had", "has", "have", "how", "i", "if", "in", "into", "is", "it", "its",
  "just", "me", "my", "no", "not", "of", "on", "or", "our", "s", "should",
  "so", "some", "such", "t", "than", "that", "the", "their", "them", "then",
  "there", "these", "they", "this", "those", "to", "up", "was", "we", "were",
  "what", "when", "where", "which", "who", "whose", "why", "will", "with",
  "would", "you", "your"
]);

/**
 * Drop general stopwords from the query; if everything was a stopword, keep
 * the original query (never search on an empty string).
 */
export function effectiveQuery(query: string): string {
  const kept = tokenize(query).filter((t) => !STOPWORDS.has(t));
  return kept.length > 0 ? kept.join(" ") : query;
}

/**
 * Keyword blend factor (lever 4). Keyword matches ride the description slot
 * (vendor weight 5) in the augmented pass; damping their delta by 0.4 puts
 * them at effective weight 2 — the same tier as the vendor's own low-weight
 * `kind` field.
 */
const KEYWORD_BLEND = 0.4;

/**
 * Joined-keywords cache for the augmented scoring pass. Keyed on the
 * `keywords` ARRAY, not the scorable wrapper: searchCatalog() builds a fresh
 * wrapper object per entry per query, but passes `entry.keywords` by
 * reference from the parsed module-singleton manifest — the array's identity
 * is stable across queries, so the join is computed once per entry ever.
 * WeakMap so a reloaded manifest never pins the old arrays.
 */
const joinedKeywordsCache = new WeakMap<readonly string[], string>();

function joinedKeywords(keywords: readonly string[]): string {
  let joined = joinedKeywordsCache.get(keywords);
  if (joined === undefined) {
    joined = keywords.join(" ");
    joinedKeywordsCache.set(keywords, joined);
  }
  return joined;
}

/** The base lexical scorer a pipeline pass runs on: vendor (gated) or the lever-5 replica. */
type EntryScorer = (entry: ScorableEntry, query: string) => number | null;

/**
 * Base score with the low-weight keyword field blended in (lever 4).
 * Entries without keywords take the base scorer untouched.
 */
function scoreWithKeywords(
  entry: WeightedScorableEntry,
  query: string,
  score: EntryScorer
): number | null {
  const base = score(entry, query);
  if (!entry.keywords || entry.keywords.length === 0) return base;
  const augmented = score(
    { ...entry, description: `${entry.description} ${joinedKeywords(entry.keywords)}` },
    query
  );
  if (augmented === null) return base;
  if (base === null) return Math.round(augmented * KEYWORD_BLEND); // keyword rescue, damped
  return base + Math.max(0, Math.round((augmented - base) * KEYWORD_BLEND));
}

/**
 * Full weighting pipeline (keyword blend → stopword rescue → kind weight)
 * over a given base scorer: score the FULL query first, and only when the
 * base scorer returns null retry with the stopword-filtered query.
 */
function weightedScore(
  entry: WeightedScorableEntry,
  query: string,
  score: EntryScorer
): number | null {
  const kindWeight = entry.kind === "skill-section" ? 0.75 : 1;
  const base = scoreWithKeywords(entry, query, score);
  if (base !== null) return Math.round(base * kindWeight);
  const filtered = effectiveQuery(query);
  if (filtered === query) return null;
  const rescued = scoreWithKeywords(entry, filtered, score);
  return rescued === null ? null : Math.round(rescued * kindWeight);
}

/**
 * Lever 6 (todo 844): domain alias canonicalization, query side. Real users
 * abbreviate ("tx history", "acct balance"); the catalog spells vocabulary
 * out, and the vendor's prefix match cannot bridge "tx"→"transaction"
 * ("transaction" does not start with "tx"). The table maps abbreviation →
 * canonical token, single-token to single-token only, and is curated from
 * DOMAIN knowledge — never from eval questions (STOPWORDS legitimacy rule).
 * Each entry was vetted against catalog vocabulary: the alias must not be a
 * load-bearing catalog token of its own (amm/dex/defi/nft/xlm/repo/sep/kyc/
 * dapp/wasm/cli/sdk all ARE catalog vocabulary and are deliberately absent;
 * the catalog's own 21 tx/txs tokens all MEAN transaction, so no shadowing).
 *
 * Measurement history: byte-identical on the offline routing corpus (round
 * 5e — only 10/483 questions contain any alias token; eval/README.md), so it
 * ships on the REAL-USER lane (eval/local-lanes/jutsu-real-user, todo 844):
 * 213 alias-register questions mined from genuine pre-round-5 user traffic,
 * dual-pass consensus labels. Numbers recorded in eval/README.md round 844.
 */
export const QUERY_TOKEN_ALIASES: ReadonlyMap<string, string> = new Map([
  ["tx", "transaction"],
  ["txn", "transaction"],
  ["txs", "transactions"],
  ["acct", "account"],
  ["addr", "address"]
]);

/**
 * Replace alias tokens with their canonical forms; null when the query
 * contains no alias token (the common case — zero extra scoring work).
 * Memoized on the raw query string: searchCatalogPage scores every catalog
 * entry with the same query, so the canonicalization must not re-tokenize
 * once per catalog entry.
 */
const canonicalizeCache = new Map<string, string | null>();

export function canonicalizeQuery(query: string): string | null {
  let cached = canonicalizeCache.get(query);
  if (cached !== undefined) return cached;
  if (canonicalizeCache.size > 500) canonicalizeCache.clear(); // bound memory
  const tokens = tokenize(query);
  cached = tokens.some((t) => QUERY_TOKEN_ALIASES.has(t))
    ? tokens.map((t) => QUERY_TOKEN_ALIASES.get(t) ?? t).join(" ")
    : null;
  canonicalizeCache.set(query, cached);
  return cached;
}

/**
 * Max of the full pipeline over the original and the alias-canonicalized
 * query (lever 6). The max is taken ABOVE weightedScore so both variants
 * share the whole pipeline (keyword blend → stopword rescue → kind weight)
 * under the same base scorer; kind weight is a constant per-entry multiplier
 * so it commutes with the max, and each variant runs its own stopword rescue
 * (substitution changes which tokens gate). Original-query scores are never
 * reduced — queries without alias tokens are byte-identical to pre-lever
 * behavior by construction.
 */
function aliasMaxScore(
  entry: WeightedScorableEntry,
  query: string,
  score: EntryScorer
): number | null {
  const base = weightedScore(entry, query, score);
  const canonical = canonicalizeQuery(query);
  if (canonical === null) return base;
  const alt = weightedScore(entry, canonical, score);
  if (alt === null) return base;
  return base === null ? alt : Math.max(base, alt);
}

/**
 * Lexical score with a stopword-rescue fallback: score the FULL query first
 * (vendor semantics unchanged for every entry that passes the coverage
 * gate), and only when the gate fails retry with the stopword-filtered
 * query. Natural-language questions otherwise return ZERO hits whenever the
 * closed-class words ("how", "what", "the", …) push token coverage under
 * the vendor's 60% threshold — the rescue makes coverage a statement about
 * content words without disturbing rankings that already worked.
 * Alias-bearing queries additionally score under their canonicalized form
 * and take the max (lever 6 above).
 */
export function scoreEntryWeighted(entry: WeightedScorableEntry, query: string): number | null {
  return aliasMaxScore(entry, query, scoreEntry);
}

/**
 * Lever 5: the same pipeline over the gate-free vendor replica. ONLY for
 * backfilling a short result page (search.ts tier 2) — never lets an
 * ungated score compete with gated hits.
 */
export function scoreEntryWeightedUngated(
  entry: WeightedScorableEntry,
  query: string
): number | null {
  return aliasMaxScore(entry, query, scoreEntryUngated);
}

/**
 * Gate-free replica of the vendored scorer (lever 5). Mirrors
 * vendor/search-scoring.ts `scoreField`/`scoreEntry` line for line EXCEPT
 * the coverage gate (vendor line 130) is dropped — entries still need at
 * least one matched token. Kept here so the vendor file stays byte-identical
 * (same reasoning as lever 4's double-scoring); if the vendor scorer is ever
 * re-vendored, update this replica to match.
 *
 * DRIFT GUARD: because the ONLY difference is the gate, the replica must
 * score identically to the vendor wherever the vendor passes —
 * test/scoring.test.ts sweeps the real manifest against a query battery and
 * asserts `scoreEntry(e,q) !== null ⇒ scoreEntryUngated(e,q) === scoreEntry(e,q)`.
 * A re-vendor that changes upstream math fails that suite loudly instead of
 * silently desyncing tier 2.
 *
 * RE-VENDOR CHECKLIST (todo 845; run when bumping @cloudflare/codemode):
 *  1. Field weights + tokenization/normalization (vendor FIELD_WEIGHTS,
 *     normalizeSearchText, tokenize) — mirror any change into this replica,
 *     then make the drift suite green again.
 *  2. Coverage-gate semantics (thresholds, exactPhrase escape) — the gate is
 *     the one line deliberately absent here; if its meaning changes, re-check
 *     search.ts's tier-2 rationale, not just this file.
 *  3. Returned search shape upstream ({ results, total, truncated }) — ours
 *     mirrors it in searchCatalogPage; keep parity.
 *  4. Newly exported search helpers — prefer composing with upstream over
 *     maintaining this copy if searchConnectors becomes importable.
 *  5. Type-gen changes (vendor/json-schema-types.ts) affecting
 *     renderSignature and the 5d compaction wrapper.
 *  6. Any native docs/snippet/section weighting upstream grows — may
 *     supersede our kind-weight lever 2.
 */
const UNGATED_FIELD_WEIGHTS = { id: 12, name: 10, service: 8, description: 5, kind: 2 } as const;

type UngatedFieldScore = { score: number; matchedTokens: Set<string>; exactPhrase: boolean };

function scoreFieldUngated(
  query: string,
  queryTokens: string[],
  value: string | undefined,
  weight: number
): UngatedFieldScore {
  const raw = normalizeSearchText(value ?? "");
  const fieldTokens = tokenize(value ?? "");
  if (raw.length === 0) {
    return { score: 0, matchedTokens: new Set(), exactPhrase: false };
  }
  let score = 0;
  const matchedTokens = new Set<string>();
  const exactPhrase = query.length > 0 && raw.includes(query);
  if (query.length > 0) {
    if (raw === query) score += weight * 14;
    else if (raw.startsWith(query)) score += weight * 9;
    else if (exactPhrase) score += weight * 6;
  }
  for (const token of queryTokens) {
    if (fieldTokens.includes(token)) {
      score += weight * 4;
      matchedTokens.add(token);
    } else if (fieldTokens.some((c) => c.startsWith(token) || token.startsWith(c))) {
      score += weight * 2;
      matchedTokens.add(token);
    } else if (raw.includes(token)) {
      score += weight;
      matchedTokens.add(token);
    }
  }
  return { score, matchedTokens, exactPhrase };
}

// Exported for the drift-guard suite (test/scoring.test.ts) ONLY — product
// code must go through scoreEntryWeightedUngated, which layers the levers.
export function scoreEntryUngated(entry: ScorableEntry, query: string): number | null {
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = tokenize(query);
  if (normalizedQuery.length === 0 || queryTokens.length === 0) return null;

  const fields: UngatedFieldScore[] = [
    scoreFieldUngated(normalizedQuery, queryTokens, entry.id, UNGATED_FIELD_WEIGHTS.id),
    scoreFieldUngated(normalizedQuery, queryTokens, entry.name, UNGATED_FIELD_WEIGHTS.name),
    scoreFieldUngated(normalizedQuery, queryTokens, entry.service, UNGATED_FIELD_WEIGHTS.service),
    scoreFieldUngated(
      normalizedQuery,
      queryTokens,
      entry.description,
      UNGATED_FIELD_WEIGHTS.description
    ),
    scoreFieldUngated(normalizedQuery, queryTokens, entry.kind, UNGATED_FIELD_WEIGHTS.kind)
  ];

  const matchedTokens = new Set<string>();
  let score = 0;
  for (const field of fields) {
    score += field.score;
    for (const t of field.matchedTokens) matchedTokens.add(t);
  }
  if (matchedTokens.size === 0) return null;

  // Vendor coverage GATE deliberately absent here; the coverage BONUS stays.
  const coverage = matchedTokens.size / queryTokens.length;
  if (coverage === 1) score += 25;
  else score += Math.round(coverage * 10);

  const idTokens = tokenize(entry.id);
  const nameTokens = tokenize(entry.name);
  if (idTokens[0] === queryTokens[0] || nameTokens[0] === queryTokens[0]) score += 8;
  // Boost exact id / name match (upstream: exact path/method match).
  if (
    normalizeSearchText(entry.id) === normalizedQuery ||
    normalizeSearchText(entry.name) === normalizedQuery
  ) {
    score += 20;
  }
  return score;
}

/**
 * Per-service quota for a result page of `limit` slots: 40% of the page,
 * floor 2 (a service may always show a runner-up), so 5 → 2, 10 → 4, 50 → 20.
 */
export function serviceQuota(limit: number): number {
  return Math.max(2, Math.ceil(limit * 0.4));
}

/**
 * Select `limit` items from score-sorted `candidates` with a per-service
 * quota, backfilling from the overflow when fewer than `limit` distinct-
 * service candidates exist. Returns items in the original (score-desc) order.
 */
export function diversifyByService<T>(
  candidates: T[],
  limit: number,
  serviceOf: (item: T) => string
): T[] {
  if (candidates.length <= limit) return candidates.slice(0, limit);
  const quota = serviceQuota(limit);
  const perService = new Map<string, number>();
  const picked: T[] = [];
  const overflow: T[] = [];
  for (const item of candidates) {
    if (picked.length >= limit) break;
    const service = serviceOf(item);
    const used = perService.get(service) ?? 0;
    if (used < quota) {
      picked.push(item);
      perService.set(service, used + 1);
    } else {
      overflow.push(item);
    }
  }
  // Backfill (highest-score overflow first) when quotas left slots empty.
  for (const item of overflow) {
    if (picked.length >= limit) break;
    picked.push(item);
  }
  // Preserve score order for presentation: picked came from a sorted stream,
  // but backfilled overflow items may out-score later quota picks.
  const rank = new Map<T, number>(candidates.map((c, i) => [c, i]));
  return picked.sort((a, b) => (rank.get(a) ?? 0) - (rank.get(b) ?? 0));
}
