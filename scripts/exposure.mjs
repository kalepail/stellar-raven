/**
 * exposure.mjs — the build-time exposure exclusions, as shared DATA
 * (ADR-0003, research/decisions/0003-build-time-exposure-filtering.md).
 *
 * The manifest IS the exposed surface: an excluded item is simply never
 * emitted, and consumers are never told what the gateway cannot do. That
 * property only holds if EVERY emitter draws from one exclusion dataset —
 * build-catalog.mjs (manifest entries + skill sections), build-super-spec.mjs
 * (in-sandbox spec), description-notes.mjs (callable-name rewrites must not
 * mint names for excluded ops), and bundle-skills.mjs (Worker-shipped skill
 * bodies). This module is that dataset; the fail-loud drift guards that pin
 * it to the live inventories stay in build-catalog.mjs, which is the one
 * script that always sees the inventory inputs.
 */

/** Lumenloop account-mutation surfaces — excluded if they ever appear in inventory. */
export const LUMENLOOP_ACCOUNT_OP_RE = /(^|_)(key|keys|webhook|webhooks|topup|top_?up)(_|$)/;

// request_research is the paid deep-research trigger — excluded until the
// budget-gate + dedup feature is deliberately built (PLAN §8: off by default).
// Named explicitly (not just via the metered flag) so an upstream re-pricing
// cannot silently expose it.
//
// research_result and list_my_research are the READ half of the same feature
// and are excluded with it: both are scoped to research the calling account
// commissioned, and the gateway account never commissions any (the trigger is
// not exposed) — so they are structurally dead ends, and their upstream
// descriptions document the paid commissioning flow (an ADR-0003 leak).
// Re-expose all three together with the budget gate + dedup.
// list_research is NOT excluded: it lists public published editorial research
// pieces (a keyless content collection), independent of request_research.
export const EXCLUDED_LUMENLOOP_OPS = new Set([
  "request_research",
  "research_result",
  "list_my_research"
]);

/** True when a lumenloop tool must not be emitted: paid/metered, account
 *  mutation, or explicitly excluded by name. */
export function lumenloopOpExcluded(tool) {
  return (
    tool.metered === true ||
    EXCLUDED_LUMENLOOP_OPS.has(tool.name) ||
    LUMENLOOP_ACCOUNT_OP_RE.test(tool.name)
  );
}

// Scout write/side-effecting endpoints — excluded (exact method+path):
//  POST /api/feedback                 submits feedback upstream
//  GET  /api/feedback                 feedback-schema discovery; read-only but
//                                     a dead end once POST is excluded — its
//                                     only purpose is to shape a submission the
//                                     gateway cannot make, and its upstream
//                                     description names scout.submitFeedback
//                                     (a non-exposed op, ADR-0003 leak)
//  POST /api/partners/submit-listing  creates a DRAFT partner account / claim
//                                     request reviewed by the Stellar Light team
//  POST /api/partners/assistant       surfaced partners are logged as leads for
//                                     the weekly partner digest (per upstream
//                                     OpenAPI); scout.matchPartners is the
//                                     side-effect-free ranking alternative
// POST /api/partners/match and /api/partners/onboard stay exposed: their
// OpenAPI descriptions declare pure AI ranking/extraction over published
// partners ("nothing is invented", persistence happens only via the separate
// submit-listing endpoint) — no write or logging is documented.
export const EXCLUDED_SCOUT_OPS = new Set([
  "POST /api/feedback",
  "GET /api/feedback",
  "POST /api/partners/submit-listing",
  "POST /api/partners/assistant"
]);

// Retired skills — exclusion as DATA (ADR-0003; decision 2026-07-03).
// The Lumenloop onboarding skills teach RAW HTTP/REST or MCP-connector access
// (Bearer llmcp_ auth, key minting, rate limits, the REST response envelope).
// They are redundant AND misleading here: a model calling `execute` reaches
// Lumenloop only through the wrapped `lumenloop.*` sandbox globals — no
// network, secrets stay host-side, and the envelope is {ok,data}, not the
// REST shape those skills describe.
//
// Only lumenloop-mcp-connect (from the PUBLIC lumenloop source) still exists
// in the mirror. The six lumenloop-api-* partner skills were retired here
// 2026-07-03 (Solo todo 825) and then REMOVED from the mirror entirely
// 2026-07-06 (go-public cleanup): their description harvest was complete and
// partner-tier content must not live in this public repo. Their names live on
// only in RETIRED_SKILL_REF_RE below, which scrubs the public skills'
// cross-references to them from emitted text.
export const RETIRED_ONBOARDING_SKILLS = new Set(["lumenloop-mcp-connect"]);

// Matches any reference to a retired onboarding skill in prose or a relative
// markdown link (`../lumenloop-mcp-connect/SKILL.md`, "lumenloop-api-query").
const RETIRED_SKILL_REF_RE = /lumenloop-api-[a-z]+|lumenloop-mcp-connect/;

/**
 * Remove retired-skill cross-references from EMITTED skill text (bodies served
 * via codemode.skill.read and the section descriptions derived from them).
 *
 * The exposed lumenloop playbooks were authored for the upstream MCP-connector
 * context and cross-link the retired onboarding skills ("Connect first →
 * ../lumenloop-mcp-connect/SKILL.md", "reconnect the connector"). Through this
 * gateway those links are dead pointers to skills that are never emitted, and
 * the connector-setup advice contradicts the sandbox model (no network; the
 * caller is already connected). Every such reference sits inside a markdown
 * list item, so the scrub drops the WHOLE item (bullet line + indented
 * continuation lines) — never a partial sentence.
 *
 * Fail-loud drift guard: if an upstream re-sync ever introduces a retired-skill
 * reference OUTSIDE a list item, the scrub cannot remove it cleanly and throws
 * instead of emitting the leak.
 */
export function scrubRetiredSkillRefs(text, context) {
  if (!RETIRED_SKILL_REF_RE.test(text)) return text;
  const lines = text.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*[-*] /.test(lines[i])) {
      out.push(lines[i]);
      continue;
    }
    // Collect the full list item: the bullet line plus indented, non-bullet,
    // non-blank continuation lines.
    const item = [lines[i]];
    let j = i + 1;
    while (j < lines.length && /^\s+\S/.test(lines[j]) && !/^\s*[-*] /.test(lines[j])) {
      item.push(lines[j]);
      j++;
    }
    if (!RETIRED_SKILL_REF_RE.test(item.join("\n"))) out.push(...item);
    i = j - 1;
  }
  const scrubbed = out.join("\n");
  if (RETIRED_SKILL_REF_RE.test(scrubbed)) {
    throw new Error(
      `Retired-skill reference survives outside a markdown list item in ${context} — ` +
        `an upstream re-sync changed the reference shape; extend scrubRetiredSkillRefs ` +
        `in scripts/exposure.mjs so the leak cannot be emitted.`
    );
  }
  return scrubbed;
}
