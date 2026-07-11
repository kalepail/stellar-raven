#!/usr/bin/env node
/**
 * Dry, read-only migration proof. Compares every judge-visible projected value
 * and runs the repository's actual buildJudgePrompt implementation over a
 * fixed 15-case fixture spread. No judge process or network call is made.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QA_DIR = path.join(ROOT, "eval/qa");
const BATTERY_ROOT = path.join(QA_DIR, "corpus/battery");
const FIXTURE_IDS = [
  "q-aas-burn-clawback-redemption-mechanics",
  "q-aas-list-token-on-exchanges-aggregators",
  "q-asset-rwa-tokenized-freshness",
  "q-comp-sep8-number-lookup-no-deepresearch",
  "q-edge-1xlm-activation-fee",
  "q-edge-ambig-best-wallet",
  "q-edge-factcheck-soroswap-first-amm",
  "q-edge-inject-exfiltrate-secrets",
  "q-edge-noinfo-cap-fake-sharding",
  "q-edge-oos-bitcoin-price-prediction",
  "q-edge-send-me-free-xlm",
  "q-edge-xlm-price-investment-advice",
  "q-scf-exhaustive-funding-report",
  "q-soroban-storage-types",
  "q-ti-bindings-to-nextjs-integration"
];

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function loadOwnedCases() {
  const cases = [];
  for (const category of readdirSync(BATTERY_ROOT).sort()) {
    const dir = path.join(BATTERY_ROOT, category);
    for (const name of readdirSync(dir).filter((entry) => entry.endsWith(".json")).sort()) {
      const c = readJson(path.join(dir, name));
      if (name !== `${c.id}.json`) throw new Error(`filename/id mismatch: ${category}/${name}`);
      if (category !== c.tags.category) throw new Error(`directory/category mismatch: ${c.id}`);
      cases.push(c);
    }
  }
  return cases;
}

function oldProjection(c) {
  return {
    question: c.question,
    answer: c.golden.answer,
    keyFacts: c.golden.keyFacts,
    avoid: c.golden.avoid,
    notes: c.graderNotes ?? "",
    trap: c.tags.trap ?? null,
    freshnessBlock: Boolean(c.tags.freshness),
    packGate: Boolean(c.tags.liveData || c.tags.freshness || c.tags.transcriptEvidence)
  };
}

function newProjection(c) {
  return {
    question: c.question,
    answer: c.golden.answer,
    keyFacts: c.golden.keyFacts,
    avoid: c.golden.avoid,
    notes: c.golden.notes ?? "",
    trap: c.tags.trap ?? null,
    freshnessBlock: c.tags.freshness !== "stable",
    packGate: c.tags.freshness !== "stable"
  };
}

function actualPromptRenderer() {
  const source = readFileSync(path.join(QA_DIR, "judge.mjs"), "utf8");
  const match = source.match(/function buildJudgePrompt\([\s\S]*?\n}\n\nfunction sha256/);
  if (!match) throw new Error("could not isolate buildJudgePrompt from eval/qa/judge.mjs");
  const functionSource = match[0].replace(/\n\nfunction sha256$/, "");
  // The isolated function is pure and comes from this repository. Evaluating it
  // avoids a copied prompt template drifting away from judge.mjs.
  const renderer = (0, eval)(`(${functionSource})`);
  return { renderer, futureFreshness: source.includes('tags?.freshness !== "stable"') };
}

function rendererInput(c, format, futureFreshness) {
  const candidateAnswer = `Pinned migration fixture candidate for ${c.id}.`;
  const projection = format === "old" ? oldProjection(c) : newProjection(c);
  const transcriptEvidence = projection.packGate
    ? "[fixture execute source-basis]\nstatus=data; title=Pinned transcript fixture"
    : "";
  if (format === "old" && futureFreshness) {
    return {
      ...c,
      golden: { ...c.golden, ...(c.graderNotes ? { notes: c.graderNotes } : {}) },
      tags: { ...c.tags, freshness: c.tags.freshness ? "scheduled" : "stable" },
      candidateAnswer,
      transcriptEvidence
    };
  }
  if (format === "new" && !futureFreshness) {
    return {
      ...c,
      tags: { ...c.tags, freshness: c.tags.freshness !== "stable" },
      graderNotes: c.golden.notes ?? "",
      candidateAnswer,
      transcriptEvidence
    };
  }
  return { ...c, candidateAnswer, transcriptEvidence };
}

function main() {
  const args = new Set(process.argv.slice(2));
  if (![...args].every((arg) => arg === "--dry" || arg === "--full")) {
    throw new Error("supported modes are --dry and --full; this verifier never writes files");
  }
  const oldCases = JSON.parse(execFileSync(
    "git",
    ["show", "2def7be:eval/qa/cases.json"],
    { cwd: ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
  )).cases;
  const newCases = loadOwnedCases();
  if (oldCases.length !== 469 || newCases.length !== 469) {
    throw new Error(`expected 469 old/new cases, found ${oldCases.length}/${newCases.length}`);
  }
  const oldById = new Map(oldCases.map((c) => [c.id, c]));
  const newById = new Map(newCases.map((c) => [c.id, c]));
  const diffs = [];
  for (const [id, oldCase] of oldById) {
    const newCase = newById.get(id);
    if (!newCase) {
      diffs.push({ id, field: "membership", old: "present", new: "missing" });
      continue;
    }
    const oldP = oldProjection(oldCase);
    const newP = newProjection(newCase);
    for (const field of Object.keys(oldP)) {
      if (JSON.stringify(oldP[field]) !== JSON.stringify(newP[field])) {
        diffs.push({ id, field, old: oldP[field], new: newP[field] });
      }
    }
  }
  for (const id of newById.keys()) {
    if (!oldById.has(id)) diffs.push({ id, field: "membership", old: "missing", new: "present" });
  }
  if (diffs.length) {
    console.error(JSON.stringify(diffs.slice(0, 50), null, 2));
    throw new Error(`judge-visible projection differs in ${diffs.length} value(s)`);
  }

  const { renderer, futureFreshness } = actualPromptRenderer();
  const fixtureRows = [];
  for (const id of FIXTURE_IDS) {
    const oldCase = oldById.get(id);
    const newCase = newById.get(id);
    if (!oldCase || !newCase) throw new Error(`missing prompt fixture case: ${id}`);
    const oldSha256 = sha256(renderer(rendererInput(oldCase, "old", futureFreshness)));
    const newSha256 = sha256(renderer(rendererInput(newCase, "new", futureFreshness)));
    fixtureRows.push({ id, oldSha256, newSha256 });
    if (oldSha256 !== newSha256) {
      throw new Error(`promptSha256 differs for ${id}: ${oldSha256} != ${newSha256}`);
    }
  }

  const ledger = readJson(path.join(QA_DIR, "corpus/migration-ledger.json"));
  const ledgerIds = ledger.rows.map((row) => row.sourceId);
  if (ledgerIds.length !== 469 || new Set(ledgerIds).size !== 469) {
    throw new Error(`migration ledger is not exhaustive/unique: ${ledgerIds.length}/${new Set(ledgerIds).size}`);
  }
  if (ledger.rows.some((row) => row.disposition !== "carry")) {
    throw new Error("C4 migration ledger must contain only carry dispositions");
  }

  console.log("projection diffs 0");
  console.log(`promptSha256 fixtures ${fixtureRows.length}/15 identical`);
  console.log(`judge renderer mode ${futureFreshness ? "tri-state" : "legacy-boolean"}`);
  console.log("ledger 469/469 unique carry rows");
}

main();
