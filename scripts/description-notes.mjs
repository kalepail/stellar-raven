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
