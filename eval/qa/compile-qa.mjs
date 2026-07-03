#!/usr/bin/env node
/**
 * compile-qa.mjs — compile the golden Q→A ANSWER-ACCURACY battery.
 *
 * Reads the raven-next golden corpus (READ-ONLY; content is fair input, its
 * schema/eval code is not — we design our own case format, see README.md):
 *
 *   - compiled/golden.json           → question, canonicalAnswer, answerGuidance,
 *                                      sources, freshnessSensitive, category
 *   - <sourceFile> YAML frontmatter  → expected_service, query_type, should_fire,
 *                                      difficulty (labels the compiled file drops)
 *
 * Selection (deterministic; every drop recorded in `skipped` with a reason):
 *   keep  expected_service ∈ {stellar_docs, stellar_light, lumenloop}  — answerable
 *         by our catalog (three services + skills)
 *   keep  a curated subset of expected_service=none traps (TRAP_KEEP below) —
 *         grading "correctly says not-available / declines" is in-spirit
 *   drop  perplexity / parallel cases (general-web; not in our catalog)
 *   drop  remaining none-traps (raven-specific framing or trap-quota)
 *
 * Usage:
 *   node eval/qa/compile-qa.mjs [--corpus <dir>] [--sample N]
 *
 *   --corpus   corpus root containing research/golden/ (default: the vendored
 *              snapshot at eval/corpus/raven-next — see eval/corpus/PROVENANCE.md)
 *   --sample N also write eval/qa/sample.json — deterministic stratified subset
 *              (by service; same function run-qa.mjs uses)
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { QA_DIR, CASES_PATH, SERVICE_MAP, stratifiedSample } from "./lib.mjs";

const DEFAULT_CORPUS_ROOT = path.resolve(QA_DIR, "../corpus/raven-next");
// Repo root, so the committed `corpus` path is machine-independent (determinism
// convention: tracked generated artifacts must be byte-stable across checkouts).
const REPO_ROOT = path.resolve(QA_DIR, "../..");

// ---- curated trap keep-list (expected_service=none) -------------------------
// Kept: traps that translate to OUR system (out-of-scope, injection, scams,
// ambiguity, can't-do requests). Dropped none-cases are raven-agent-specific
// (its brand identity, its Airtable backend, its web-fetch tool) or beyond the
// "a few traps" quota — each gets an explicit reason below.
const TRAP_KEEP = new Map([
  ["q-edge-ambig-best-wallet", "ambiguous"],
  ["q-edge-oos-ethereum-gas-optimization", "out-of-scope"],
  ["q-edge-oos-solana-vs-aptos", "out-of-scope"],
  ["q-edge-oos-react-state-management", "out-of-scope"],
  ["q-edge-oos-bitcoin-price-prediction", "out-of-scope"],
  ["q-edge-inject-exfiltrate-secrets", "injection"],
  ["q-edge-jailbreak-generate-secret-keys", "injection"],
  ["q-edge-send-me-free-xlm", "cant-do"],
  ["q-edge-xlm-price-investment-advice", "speculation"],
  ["q-edge-1xlm-activation-fee", "scam-check"]
]);
const RAVEN_SPECIFIC_NONE = new Set([
  "q-edge-stella-identity-model", // asks about raven's own agent brand/model
  "q-edge-backend-query-injection", // names a raven-internal Airtable tool
  "q-edge-ssrf-cloud-metadata-exfil", // targets raven's web-fetch tool (we have none)
  "q-edge-stella-not-custodian" // "Stella" agent-brand custody confusion
]);

// trap subtype for KEPT governance-negative cases that still should answer
function govTrapSubtype(id) {
  if (/inject/.test(id)) return "injection";
  if (/noinfo|no-info|fake/.test(id)) return "fabrication-bait";
  if (/deep|exhaustive|no-deepresearch|budget/.test(id)) return "paid-bait";
  if (/ambig/.test(id)) return "ambiguous";
  return "governance";
}

// ---- frontmatter label extraction (simple tokens only, comments tolerated) --
function frontmatterLabels(mdPath) {
  const txt = readFileSync(mdPath, "utf8");
  const grab = (re) => txt.match(re)?.[1];
  return {
    expectedService: grab(/^expected_service:\s*([a-z_]+)/m),
    queryType: grab(/^query_type:\s*([a-z-]+)/m),
    shouldFire: grab(/^should_fire:\s*(true|false)/m) === "true",
    difficulty: grab(/^difficulty:\s*(easy|medium|hard)/m) ?? "medium"
  };
}

function main() {
  const args = process.argv.slice(2);
  const argVal = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const corpusRoot = argVal("--corpus") ?? DEFAULT_CORPUS_ROOT;
  const sampleN = argVal("--sample") ? Number(argVal("--sample")) : undefined;

  const goldenPath = path.join(corpusRoot, "research/golden/compiled/golden.json");
  const golden = JSON.parse(readFileSync(goldenPath, "utf8"));

  const cases = [];
  const skipped = [];

  for (const src of [...golden].sort((a, b) => a.id.localeCompare(b.id))) {
    const labels = frontmatterLabels(path.join(corpusRoot, src.sourceFile));
    const service = SERVICE_MAP[labels.expectedService];

    if (labels.expectedService === "perplexity" || labels.expectedService === "parallel") {
      skipped.push({
        id: src.id,
        reason: `general-web service (${labels.expectedService}) not in this catalog`
      });
      continue;
    }
    if (!service) {
      skipped.push({ id: src.id, reason: `unknown expected_service (${labels.expectedService})` });
      continue;
    }

    let trap;
    if (service === "none") {
      if (RAVEN_SPECIFIC_NONE.has(src.id)) {
        skipped.push({ id: src.id, reason: "trap targets raven-agent internals; does not translate" });
        continue;
      }
      trap = TRAP_KEEP.get(src.id);
      if (!trap) {
        skipped.push({ id: src.id, reason: "none-trap beyond kept quota (10 curated representatives)" });
        continue;
      }
    } else if (labels.queryType === "governance-negative") {
      trap = govTrapSubtype(src.id);
    }

    const g = src.answerGuidance ?? {};
    if (!src.canonicalAnswer || src.canonicalAnswer.trim().length < 40) {
      skipped.push({ id: src.id, reason: "no usable golden answer" });
      continue;
    }

    const notesParts = [];
    if (g.notes) notesParts.push(g.notes.trim());
    if (Array.isArray(g.shouldInclude) && g.shouldInclude.length > 0) {
      notesParts.push("Also good if the answer: " + g.shouldInclude.map((s) => s.trim()).join(" | "));
    }
    if (Array.isArray(g.mustCite) && g.mustCite.length > 0) {
      notesParts.push("Golden cites: " + g.mustCite.map((s) => s.trim()).join(" | "));
    }

    cases.push({
      id: src.id,
      question: src.question,
      golden: {
        answer: src.canonicalAnswer.trim(),
        keyFacts: (g.mustInclude ?? []).map((s) => s.trim()),
        avoid: (g.mustAvoid ?? []).map((s) => s.trim()),
        sources: src.sources ?? []
      },
      tags: {
        category: src.category,
        service, // stellarDocs | scout | lumenloop | none
        difficulty: labels.difficulty,
        freshness: Boolean(src.freshnessSensitive),
        ...(trap ? { trap } : {})
      },
      graderNotes: notesParts.join("\n")
    });
  }

  // ---- counts ----------------------------------------------------------------
  const countBy = (arr, fn) => {
    const m = {};
    for (const x of arr) {
      const k = fn(x);
      m[k] = (m[k] ?? 0) + 1;
    }
    return Object.fromEntries(Object.entries(m).sort());
  };
  const counts = {
    corpusTotal: golden.length,
    kept: cases.length,
    skipped: skipped.length,
    byService: countBy(cases, (c) => c.tags.service),
    byCategory: countBy(cases, (c) => c.tags.category),
    byDifficulty: countBy(cases, (c) => c.tags.difficulty),
    freshnessSensitive: cases.filter((c) => c.tags.freshness).length,
    traps: countBy(cases.filter((c) => c.tags.trap), (c) => c.tags.trap),
    skipReasons: countBy(skipped, (s) => s.reason)
  };

  const out = {
    $comment:
      "Golden Q→A answer-accuracy battery. Compiled from the raven-next golden corpus " +
      "(content only; our own format — see eval/qa/README.md). Regenerate: node eval/qa/compile-qa.mjs",
    corpus: path.relative(REPO_ROOT, goldenPath),
    mapping: SERVICE_MAP,
    counts,
    cases,
    skipped
  };
  writeFileSync(CASES_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`wrote ${CASES_PATH}`);
  console.log(JSON.stringify(counts, null, 2));

  if (sampleN) {
    const picked = stratifiedSample(cases, sampleN);
    const samplePath = path.join(QA_DIR, "sample.json");
    writeFileSync(
      samplePath,
      JSON.stringify(
        {
          $comment: `Deterministic stratified sample (N=${sampleN}, by service) of cases.json.`,
          counts: { total: picked.length, byService: countBy(picked, (c) => c.tags.service) },
          cases: picked
        },
        null,
        2
      ) + "\n"
    );
    console.log(`wrote ${samplePath} (${picked.length} cases)`);
  }
}

main();
