/**
 * Catalog-level guidance appended to specific op descriptions (data, like the
 * deny-list; exact-match on the tool/operation name). Sharpens boundaries and
 * flags result-shape traps the upstream descriptions miss.
 *
 * Shared by build-catalog.mjs (manifest descriptions) and
 * build-super-spec.mjs (in-sandbox spec descriptions) so the two model-facing
 * surfaces cannot drift. Wording constraint for every note: keep tokens out
 * of the lexical scorer's blast radius — no `r.` (a bare "r" token
 * prefix-covers rule/role/rewrite/… queries) and no apostrophes (possessives
 * tokenize to a bare "s" with the same effect).
 */

// Lumenloop notes — the residue of the 2026-07-03 skills harvest (Solo todo
// 825): everything the retired lumenloop-api onboarding skills and the
// playbook gotchas teach was checked against the inventory descriptions, and
// almost all of it is already carried there (search_directory semantic
// fallback, compact=true, summaries vs verbatim text, videos/av alias,
// per-collection sort fields) or normalized by the adapter (get_document
// not-found prose → soft-empty). What remains is the one trap the
// descriptions miss, live-verified 2026-07-03: find_content_by_entity with
// entity_type "person" answers success:true + all-empty groups even for the
// most heavily covered people (control: organization returns full groups) —
// an envelope-ok empty that reads as evidence of absence but is lane behavior.
export const LUMENLOOP_DESCRIPTION_NOTES = {
  find_content_by_entity:
    'Catalog note: entity_type "person" yields all-empty groups on this lane even for heavily covered people (live-verified 2026-07-03) — an empty person result is lane behavior, NOT evidence of absence. Use entity types project, organization, or token; for a person, use search_content_semantic with the person name instead.'
};

// ---------------------------------------------------------------------------
// Callable-name rewrite for scout descriptions (shared, deterministic).
//
// The scout entries carry their descriptions verbatim from the upstream Stellar
// Light OpenAPI, which cross-references sibling operations by RAW REST endpoint
// (e.g. "POST /api/feedback", "use /api/partners with ?type/?sector") and by
// snake_case MCP-tool name (e.g. "use get_leaderboard"). Model code can NEVER
// issue raw HTTP and the sandbox surface is camelCase — it invokes each
// operation as scout.<opId>(args) — so both spellings are dead pointers.
// Rewrite them using a map derived mechanically from the SAME spec
// (path+method -> operationId), so it stays correct across inventory
// refreshes. Only exact spec-declared API paths and exact snake forms of
// spec-declared operationIds are touched — never generic slash-prose like
// "on/off-ramp" or "upcoming/active/completed", never substrings of longer
// identifiers. Shared by build-catalog.mjs (manifest) and
// build-super-spec.mjs (in-sandbox spec) so the two surfaces cannot drift.
// ---------------------------------------------------------------------------

const SCOUT_HTTP_METHODS = ["get", "post", "put", "patch", "delete"];

// Standalone shorthands the upstream prose uses that are not full spec paths
// but still name a callable operation (e.g. partnerOnboard says "/assistant").
const SCOUT_REF_ALIASES = [["/assistant", "scout.partnerAssistant"]];

/** snake_case form of a camelCase operationId (searchProjects -> search_projects). */
function snakeCase(opId) {
  return opId.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

/**
 * Build the ordered [needle, replacement] rewrite pairs from a scout OpenAPI
 * doc. Two needle families, both derived mechanically from the spec — the
 * same uncallable-name defect in two spellings:
 *  - REST references → "scout.<opId>": method-qualified ("POST /api/feedback")
 *    and bare paths ("/api/partners"); longer needles sort first so
 *    "/api/partners/match" wins over "/api/partners" and a verb-qualified
 *    reference resolves before its bare path. Bare-path default prefers GET
 *    (the read/listing intent the prose means when it drops the verb).
 *  - snake_case tool names → the BARE camelCase opId ("use get_leaderboard" →
 *    "use getLeaderboard"): sibling context inside a scout entry's own
 *    description is unambiguous, and the model sees the exact method segment
 *    it calls. Needle only added when the snake form differs from the opId —
 *    an all-lowercase opId would yield a plain-word needle, far too
 *    match-happy for prose.
 *
 * DELIBERATELY NOT the scout.-prefixed form for the snake rewrites: that
 * variant was built and measured 2026-07-04 and REVERTED on a per-case gate
 * regression — every description gaining its first literal "scout" word gains
 * +5 for any query containing the token "out" ("runs out", "find out", …) via
 * scoreField's raw-substring fallback ("out" is a substring of "scout",
 * description weight 5), which flipped legacy case
 * q-soroban-ttl-expiry-behavior top-1 (scout.analyzeEcosystem 158→163 past
 * stellarDocs.search_soroban_contract_docs at 162). Bare camelCase is
 * score-neutral by construction: the scorer normalizes "get_leaderboard" and
 * "getLeaderboard" to the identical "get leaderboard". The path rewrites DO
 * carry the scout. prefix — measured zero per-case deltas there.
 */
export function scoutRefRewrites(openapi) {
  const pairs = [];
  const bareByPath = new Map();
  for (const [path, item] of Object.entries(openapi.paths)) {
    for (const method of SCOUT_HTTP_METHODS) {
      const op = item[method];
      if (!op?.operationId) continue;
      const callable = `scout.${op.operationId}`;
      pairs.push([`${method.toUpperCase()} ${path}`, callable]);
      if (!bareByPath.has(path) || method === "get") bareByPath.set(path, callable);
      const snake = snakeCase(op.operationId);
      if (snake !== op.operationId) pairs.push([snake, op.operationId]);
    }
  }
  for (const [path, callable] of bareByPath) pairs.push([path, callable]);
  pairs.push(...SCOUT_REF_ALIASES);
  pairs.sort((a, b) => b[0].length - a[0].length);
  return pairs;
}

const regexEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Rewrite raw REST references and snake_case tool names in `text` using the
 * pairs from scoutRefRewrites(openapi).
 *
 * Path-shaped needles (contain "/") use plain longest-first substring
 * replacement — the "/" delimiters make them unambiguous, and longest-first
 * ordering keeps "/api/partners" from eating "/api/partners/match".
 * Token-shaped needles (snake names) match only as standalone tokens: never
 * inside a longer identifier ([\w] boundaries on both sides) and never when
 * preceded by "." (the lookbehind), so a rerun over already-rewritten text
 * never rewrites twice — the camelCase replacement carries no underscore, so
 * no snake needle can match it again anyway.
 *
 * Also drops the query-string "?" from "?type/?sector"-style shorthand — in
 * sandbox vocabulary those are fields on the single args object, never URL
 * query params. The strip requires a token boundary before the "?" (start,
 * whitespace, "(" or "/") so a mid-word "?" in prose is never touched. Scope
 * note: this rewrite only ever processes op-level summary/description text;
 * "?slugs=…"/"?repo=" strings elsewhere in the spec (parameter and
 * response-schema descriptions) are untouched because those fields never
 * pass through here.
 */
export function rewriteScoutRefs(text, pairs) {
  let out = text;
  for (const [needle, replacement] of pairs) {
    if (needle.includes("/")) {
      out = out.split(needle).join(replacement);
    } else {
      out = out.replace(
        new RegExp(`(?<![\\w.])${regexEscape(needle)}(?![\\w])`, "g"),
        replacement
      );
    }
  }
  return out.replace(/(^|[\s(/])\?([a-z])/g, "$1$2");
}

export const SCOUT_DESCRIPTION_NOTES = {
  getHackathon:
    "Catalog note: winner order is only meaningful when hackathonPlacement is ordinal (1st Place, 2nd Place, ...) and placementRank is a number; many events label every winner just Winners with placementRank null — there the winners array order is NOT a ranking, so never assert finishing order from list position (live-verified 2026-07-03).",
  listSkills:
    "Catalog note: this is the live ecosystem DIRECTORY — skills plus MCP servers, SDKs, and CLIs — for discovering what exists and fetching install metadata; most entries are not mirrored skills.",
  getSkill:
    "Catalog note: returns the full upstream markdown of one directory entry, suited to install/metadata questions. For reading build/integration playbooks, prefer the bundled skills.* catalog entries via codemode.skill.read (sectioned, curated, pinned).",
  getStatus:
    "Catalog note: the upstream payload carries its own `ok` health/status flag at `data.ok` — distinct from the envelope call-status `ok`.",
  getChangelog:
    "Catalog note: the upstream payload carries its own `ok` flag at `data.ok` — distinct from the envelope call-status `ok`.",
  explainRepo:
    "Catalog note: the upstream payload carries its own `ok` flag at `data.ok` — distinct from the envelope call-status `ok`."
};
