#!/usr/bin/env node
/**
 * check-pin-review.mjs — a pin cannot move without a recorded human review.
 *
 * Skill bodies are prompt input and are no longer vendored, so a re-pin commit
 * shows hash changes only: the text a model will start reading never reaches
 * `git diff`. `ecosystem-skills/update.sh` prints the body diff at re-pin time;
 * this makes the review durable by requiring `ecosystem-skills/PIN-REVIEW.md` to
 * name every newly pinned commit SHA.
 *
 * Usage: node scripts/check-pin-review.mjs [--base <ref>]   (default origin/main)
 * Exit 1 if a pin moved without a ledger entry. A repo with no reachable base
 * ref exits 0 with a notice — fail-open there is deliberate: this guards a diff,
 * and with no diff there is nothing to guard.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseIdx = process.argv.indexOf("--base");
const BASE = baseIdx >= 0 ? process.argv[baseIdx + 1] : "origin/main";

const pinsOf = (json) =>
  new Map(JSON.parse(json).sources.map((s) => [s.id, s.commit]));

let basePins;
try {
  basePins = pinsOf(
    execFileSync("git", ["show", `${BASE}:ecosystem-skills/MANIFEST.json`], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    })
  );
} catch {
  console.log(`pin-review: base ref ${BASE} unavailable — nothing to compare, skipping.`);
  process.exit(0);
}

const nowPins = pinsOf(readFileSync(join(ROOT, "ecosystem-skills/MANIFEST.json"), "utf8"));
const ledger = readFileSync(join(ROOT, "ecosystem-skills/PIN-REVIEW.md"), "utf8");

const moved = [...nowPins].filter(([id, commit]) => basePins.get(id) !== commit);
if (moved.length === 0) {
  console.log("pin-review: no skill pin moved.");
  process.exit(0);
}

const unrecorded = moved.filter(([, commit]) => !ledger.includes(commit));
for (const [id, commit] of moved) {
  const from = basePins.get(id) ?? "(new source)";
  console.log(
    `pin-review: ${id} ${String(from).slice(0, 12)} -> ${commit.slice(0, 12)}` +
      (ledger.includes(commit) ? "  [recorded]" : "  [MISSING FROM LEDGER]")
  );
}
if (unrecorded.length > 0) {
  console.error(
    `\npin-review FAILED: ${unrecorded.length} pin(s) moved with no entry in ` +
      `ecosystem-skills/PIN-REVIEW.md naming the new commit.\n` +
      `Skill bodies are prompt input: run ./ecosystem-skills/update.sh, READ the body diff it ` +
      `prints (or re-print it with scripts/diff-pins.mjs), then add a ledger entry in the same commit.`
  );
  process.exit(1);
}
console.log(`pin-review: ${moved.length} pin change(s), all recorded.`);
