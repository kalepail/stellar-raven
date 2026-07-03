/**
 * grade.mjs — pure grading logic for the search-routing eval.
 * No I/O, no imports from src/ — unit-testable standalone (see eval/self-test.mjs).
 */

/** Known card/id prefixes → catalog namespace. Longest-prefix-first matching. */
const CARD_PREFIXES = [
  ["stellar_docs_", "stellarDocs"],
  ["stellar_light_", "scout"],
  ["stellardocs_", "stellarDocs"],
  ["lumenloop_", "lumenloop"],
  ["scout_", "scout"],
  ["skills_", "skills"],
];

/** Canonicalize a card/entry id: lowercase, unify [-. ] separators to "_". */
export function canonToken(s) {
  return String(s).toLowerCase().replace(/[-.\s]+/g, "_");
}

/**
 * Split a canonical token into { service, op }. E.g.:
 *   "lumenloop_search_directory"  -> { service: "lumenloop",   op: "search_directory" }
 *   "stellar_docs_mcp"            -> { service: "stellarDocs", op: "mcp" }
 *   "scout.projects" (canon'd)    -> { service: "scout",       op: "projects" }
 * Unknown prefix -> { service: null, op: token }.
 */
export function splitCard(token) {
  const t = canonToken(token);
  for (const [prefix, service] of CARD_PREFIXES) {
    if (t.startsWith(prefix)) return { service, op: t.slice(prefix.length) };
  }
  return { service: null, op: t };
}

/**
 * Skill-twin entity identity (todo 816). `lumenloop.skill.<name>` (metadata-only)
 * and `skills.<source>.<name>` (readable) are the SAME resource — src/skills/store.ts
 * aliases reads across them by terminal-name equality. The grader mirrors that:
 * a hit on either twin form matches BOTH the `lumenloop` and `skills` service labels
 * (and its terminal name matches skills_/lumenloop-side card labels). The twin
 * terminal-name set is data injected by the caller (run-routing derives it from the
 * manifest: terminal names of `lumenloop.skill.*` entries) — nothing is hardcoded.
 */

/** Terminal name of a catalog id: strip any #fragment, take the last dot segment. */
export function terminalName(id) {
  return String(id).split("#")[0].split(".").pop();
}

/**
 * The service labels a hit satisfies. Without a twin set (or for non-twin hits)
 * this is just [hit.service]; twin hits additionally satisfy the sibling service.
 */
export function hitServices(hit, twinTerminals) {
  const services = [hit.service];
  if (twinTerminals && twinTerminals.has(terminalName(hit.id))) {
    if (hit.service === "lumenloop") services.push("skills");
    else if (hit.service === "skills") services.push("lumenloop");
  }
  return services;
}

/**
 * Tolerant card match between an expected card label (raven-next naming, e.g.
 * "lumenloop_search_directory") and a catalog hit (id "lumenloop.search_directory",
 * service "lumenloop"). Rules, documented:
 *   1. Full canonical equality (separators unified, case-insensitive).
 *   2. Same service (expected card's prefix vs. hit.service) AND op names equal.
 *   3. Same service AND one op name contains the other, when the shorter op is
 *      >= 4 chars (tolerates "projects" vs "list_projects"; guards against
 *      trivial substrings like "get").
 * With `twinTerminals`, a skill-twin hit is matched under BOTH of its identities
 * (e.g. `lumenloop.skill.scf-submission-radar` also matches the card
 * `skills_scf_submission_radar` as (service skills, op scf_submission_radar)).
 */
export function cardMatches(expectedCard, hit, twinTerminals) {
  const exp = canonToken(expectedCard);
  const hitCanon = canonToken(hit.id);
  if (exp === hitCanon) return true;
  const e = splitCard(expectedCard);
  const eService = e.service ? canonToken(e.service) : null;
  if (!eService) return false;
  // Candidate (service, op) identities for the hit: its own, plus (for skill twins)
  // the sibling-service identity keyed on the terminal name.
  const hitService = canonToken(hit.service);
  const hitOp = hitCanon.startsWith(hitService + "_")
    ? hitCanon.slice(hitService.length + 1)
    : splitCard(hit.id).op;
  const candidates = [[hitService, hitOp]];
  if (twinTerminals && twinTerminals.has(terminalName(hit.id))) {
    const twinOp = canonToken(terminalName(hit.id));
    if (hit.service === "lumenloop") candidates.push(["skills", twinOp]);
    else if (hit.service === "skills") candidates.push(["lumenloop", twinOp]);
  }
  for (const [svc, op] of candidates) {
    if (eService !== svc) continue;
    if (e.op === op) return true;
    const [shorter, longer] = e.op.length <= op.length ? [e.op, op] : [op, e.op];
    if (shorter.length >= 4 && longer.includes(shorter)) return true;
  }
  return false;
}

/**
 * Grade one case given its search hits (already limited to 5).
 * Returns { top1, top3, top5, cardHit5 } — cardHit5 is null when the case has
 * no expected_cards (card metric not applicable).
 *
 * Accept-either (todo 809): when `expectedAny` is a non-empty array of services,
 * the result ADDITIONALLY carries { any1, any3, any5 } — a hit from ANY listed
 * service counts. The strict top1/top3/top5 fields are always computed against
 * `expectedService` alone and are unaffected, so legacy strict aggregates stay
 * byte-identical whether or not an overlay is applied.
 *
 * Twin-aware grading (todo 816): when `twinTerminals` is provided, service
 * matching goes through hitServices() — skill-twin hits satisfy both the
 * lumenloop and skills labels (grading-rule v2). Omit it for rule-v1 grading.
 */
export function gradeCase(hits, expectedService, expectedCards, expectedAny, twinTerminals) {
  const svc = (h) => hitServices(h, twinTerminals).includes(expectedService);
  const top1 = hits.length > 0 && svc(hits[0]);
  const top3 = hits.slice(0, 3).some(svc);
  const top5 = hits.slice(0, 5).some(svc);
  let cardHit5 = null;
  if (Array.isArray(expectedCards) && expectedCards.length > 0) {
    cardHit5 = hits.slice(0, 5).some((h) => expectedCards.some((c) => cardMatches(c, h, twinTerminals)));
  }
  const result = { top1, top3, top5, cardHit5 };
  if (Array.isArray(expectedAny) && expectedAny.length > 0) {
    const anySvc = (h) => hitServices(h, twinTerminals).some((s) => expectedAny.includes(s));
    result.any1 = hits.length > 0 && anySvc(hits[0]);
    result.any3 = hits.slice(0, 3).some(anySvc);
    result.any5 = hits.slice(0, 5).some(anySvc);
  }
  return result;
}

/**
 * Aggregate per-case results into overall + per-service rates.
 * results: [{ expected_service, top1, top3, top5, cardHit5 }]
 */
export function aggregate(results) {
  const mk = () => ({ n: 0, top1: 0, top3: 0, top5: 0, cardN: 0, cardHit5: 0 });
  const overall = mk();
  const perService = {};
  for (const r of results) {
    const buckets = [overall, (perService[r.expected_service] ??= mk())];
    for (const b of buckets) {
      b.n += 1;
      if (r.top1) b.top1 += 1;
      if (r.top3) b.top3 += 1;
      if (r.top5) b.top5 += 1;
      if (r.cardHit5 !== null && r.cardHit5 !== undefined) {
        b.cardN += 1;
        if (r.cardHit5) b.cardHit5 += 1;
      }
    }
  }
  return { overall, perService };
}

const pct = (num, den) => (den === 0 ? "n/a" : `${((100 * num) / den).toFixed(1)}%`);

/** Rows suitable for console.table: one per service + Overall. */
export function tableRows({ overall, perService }) {
  const row = (name, b) => ({
    scope: name,
    cases: b.n,
    "top-1": pct(b.top1, b.n),
    "top-3": pct(b.top3, b.n),
    "top-5": pct(b.top5, b.n),
    "card@5": `${pct(b.cardHit5, b.cardN)} (${b.cardN})`,
  });
  const rows = Object.keys(perService).sort().map((s) => row(s, perService[s]));
  rows.push(row("OVERALL", overall));
  return rows;
}
