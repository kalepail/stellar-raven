#!/usr/bin/env node
/**
 * lint-goldens.mjs — golden hygiene lint for avoid lists (todo 826; warn-only).
 *
 * Flags must-avoid items phrased in support-relative terms ("beyond corpus
 * support", "without evidence", "not verified by the reviewer"). A corpus-blind
 * judge can only read such phrasing as "not in the golden's enumeration", which
 * routes legitimately-retrieved beyond-golden specifics into wrongClaims — the
 * q-scf-regional-india artifact (round scratchpad 521). Avoid items should name
 * concrete wrong content instead: a wrong entity, a retired command, a wrong
 * number/date/version, a specific false statement.
 *
 * Two tiers (mirrors the rubric-v2.1 judge rule):
 *   judge-blind    — conditioned on support the judge cannot see (corpus,
 *                    reviewer verification, cited records). The artifact class;
 *                    rewrite these to concrete traps.
 *   sourcing-guard — answer-visible conditions ("without a dated source") the
 *                    judge CAN check from the candidate answer. Informational;
 *                    fine when intended, review the phrasing stays checkable.
 *
 * Usage:
 *   node eval/qa/lint-goldens.mjs [files...]
 * Default files: eval/qa/cases.json + the frozen canonical live-data contract
 * + the opt-in live-digest supplement. Accepts either a top-level array of
 * cases or an object with a `cases` array.
 *
 * ALWAYS exits 0 — this is a warning pass, never a gate. New goldens that trip
 * the judge-blind tier should be rewritten to concrete traps before they ship.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

// Patterns are heuristic and match the SUPPORT-CONDITION SHAPE, not bare words:
// items are tested with the leading "Do NOT" prohibition stripped, so `not-verified`
// needs an embedded condition ("unless/until/not ... verified"), and `un-prefixed`
// needs the un-word to modify a claim noun ("unsourced names") — explanatory or
// proper-noun uses ("removed as unverified on the review", "Verified-Member tiers")
// should not fire. Residual false positives are acceptable: this is warn-only.
const PATTERNS = [
  { label: "beyond-support", re: /\bbeyond\b[^.;]*\b(corpus|golden|evidence|source|sources|support)\b/i },
  { label: "without-evidence", re: /\bwithout\b[^.;]*\b(evidence|support|source|sources|citation|verification)\b/i },
  { label: "not-verified", re: /\b(not|unless|until|if|never|without)\b[^.;]*\b(verified|substantiated|corroborated|evidenced|cited|vetted)\b/i },
  { label: "un-prefixed", re: /\bun(verified|substantiated|corroborated|sourced|evidenced)\s+(\w+\s+)?(names?|claims?|figures?|numbers?|counts?|values?|stats?|specifics?|details?|entities|projects?|amounts?|lists?|events?)\b/i },
  { label: "no-evidence", re: /\bno\b[^.;]*\b(evidence|corroboration|citation)\b/i },
  { label: "lacks-support", re: /\blacks?\b[^.;]*\b(evidence|support|source|corroboration)\b/i },
  { label: "corpus-support", re: /\b(corpus|evidence|reviewer)[- ]support(ed)?\b/i }
];

// Strip the standard "Do NOT ..." prohibition preamble so its "not" can't satisfy
// the not-verified condition shape by itself.
const stripProhibition = (item) => item.replace(/^\s*do\s+not\b/i, "");

// Support the judge cannot see → the finding is tier "judge-blind".
const JUDGE_BLIND_RE = /\b(corpus|reviewer|golden|source data|cited records?|catalog|directory|transcripts?)\b/i;

const DEFAULT_FILES = [
  "eval/qa/cases.json",
  "eval/qa/live-cases.json",
  "eval/qa/live-digest-supplement-cases.json"
];
const files = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_FILES;

const tally = { "judge-blind": 0, "sourcing-guard": 0 };
let scannedCases = 0;
let scannedItems = 0;

for (const file of files) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    console.warn(`[lint-goldens] SKIP ${file}: ${err.message}`);
    continue;
  }
  const cases = Array.isArray(parsed) ? parsed : parsed.cases;
  if (!Array.isArray(cases)) {
    console.warn(`[lint-goldens] SKIP ${file}: no cases array found`);
    continue;
  }
  const rel = path.relative(process.cwd(), file);
  for (const kase of cases) {
    scannedCases++;
    const avoid = kase?.golden?.avoid ?? [];
    for (const item of avoid) {
      scannedItems++;
      const body = stripProhibition(item);
      const hits = PATTERNS.filter((p) => p.re.test(body)).map((p) => p.label);
      if (hits.length) {
        const tier = JUDGE_BLIND_RE.test(item) ? "judge-blind" : "sourcing-guard";
        tally[tier]++;
        console.warn(`[lint-goldens] ${tier === "judge-blind" ? "WARN" : "info"} [${tier}] ${rel} :: ${kase.id} [${hits.join(",")}]\n  avoid: ${item}`);
      }
    }
  }
}

const flagged = tally["judge-blind"] + tally["sourcing-guard"];
console.log(
  `[lint-goldens] scanned ${scannedCases} cases / ${scannedItems} avoid items across ${files.length} file(s): ` +
    (flagged
      ? `${tally["judge-blind"]} judge-blind (rewrite to concrete traps) + ${tally["sourcing-guard"]} sourcing-guard (informational). Warn-only.`
      : "clean")
);
process.exit(0);
