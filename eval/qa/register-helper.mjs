#!/usr/bin/env node
/**
 * Stamp consistency-register cluster members with their owned case-file
 * hashes. A changed known hash reopens the cluster; a missing historical hash
 * is seeded without blocking or reopening it.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { writeFileAtomic } from "../../scripts/lib/shared.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DEFAULT_REGISTER = path.join(ROOT, "eval/qa/consistency-register.json");
const DEFAULT_CORPUS = path.join(ROOT, "eval/qa/corpus/battery");

function walkJsonFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

export function caseFileHashes(corpusDir) {
  const hashes = new Map();
  for (const file of walkJsonFiles(corpusDir)) {
    const bytes = readFileSync(file);
    const parsed = JSON.parse(bytes.toString("utf8"));
    if (typeof parsed.id !== "string" || !parsed.id) throw new Error(`case file has no id: ${file}`);
    if (hashes.has(parsed.id)) throw new Error(`duplicate case id while hashing: ${parsed.id}`);
    hashes.set(parsed.id, createHash("sha256").update(bytes).digest("hex"));
  }
  return hashes;
}

function clusterMembers(cluster) {
  return cluster.members ?? cluster.memberIds ?? cluster.cases ?? [];
}

function clusterList(register) {
  const clusters = Array.isArray(register.clusters)
    ? [...register.clusters]
    : register.clusters && Array.isArray(register.clusters.entries)
      ? [...register.clusters.entries]
      : [];
  for (const sweep of register.sweeps ?? []) {
    clusters.push(...(sweep.contradictions ?? []), ...(sweep.tensions ?? []), ...(sweep.verifiedConsistent ?? []));
  }
  return clusters;
}

export function updateRegister(register, hashes, { seed = false, date = new Date().toISOString().slice(0, 10) } = {}) {
  let changed = false;
  const reopened = [];
  const missingCases = [];
  for (const cluster of clusterList(register)) {
    const previous = cluster.memberContentSha256 && typeof cluster.memberContentSha256 === "object"
      ? cluster.memberContentSha256
      : {};
    const next = {};
    let knownHashChanged = false;
    for (const id of [...clusterMembers(cluster)].sort()) {
      const hash = hashes.get(id);
      if (!hash) {
        missingCases.push({ cluster: cluster.id ?? cluster.name ?? cluster.cluster ?? cluster.cases?.join(",") ?? "unnamed", id });
        continue;
      }
      next[id] = hash;
      if (typeof previous[id] === "string" && previous[id] !== hash) knownHashChanged = true;
    }
    if (JSON.stringify(previous) !== JSON.stringify(next)) {
      cluster.memberContentSha256 = next;
      changed = true;
    }
    // Seed mode and absent historical member hashes establish the baseline;
    // only a changed hash that was actually recorded can reopen a cluster.
    if (!seed && knownHashChanged) {
      const label = cluster.id ?? cluster.name ?? cluster.cluster ?? cluster.cases?.join(",") ?? "unnamed";
      if (cluster.verdict !== "reopen") { cluster.verdict = "reopen"; changed = true; }
      const marker = { date, reason: "member-content-changed" };
      if (JSON.stringify(cluster.reopened) !== JSON.stringify(marker)) { cluster.reopened = marker; changed = true; }
      reopened.push(label);
    }
  }
  // The grafted collections are always present after the helper writes, even
  // when migration has not populated them yet.
  if (register.numericInvariants === undefined) { register.numericInvariants = { entries: [] }; changed = true; }
  if (register.dateContingentTraps === undefined) { register.dateContingentTraps = { entries: [] }; changed = true; }
  return { register, changed, reopened: reopened.sort(), missingCases: missingCases.sort((a, b) => a.cluster.localeCompare(b.cluster) || a.id.localeCompare(b.id)) };
}

function parseArgs(argv) {
  const options = { seed: false, check: false };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--seed") options.seed = true;
    else if (arg === "--check") options.check = true;
    else if (["--register", "--corpus", "--date"].includes(arg)) {
      if (!argv[index + 1]) throw new Error(`${arg} requires a value`);
      options[arg.slice(2)] = argv[++index];
    } else throw new Error(`unknown argument: ${arg}`);
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const registerPath = path.resolve(options.register ?? DEFAULT_REGISTER);
  const corpusDir = path.resolve(options.corpus ?? DEFAULT_CORPUS);
  const register = JSON.parse(readFileSync(registerPath, "utf8"));
  const result = updateRegister(register, caseFileHashes(corpusDir), { seed: options.seed, date: options.date });
  for (const item of result.missingCases) {
    console.warn(`[register-helper] WARN ${item.cluster}: missing case ${item.id}; historical missing hashes never block`);
  }
  for (const id of result.reopened) console.log(`[register-helper] REOPEN ${id}: member content changed`);
  if (options.check) {
    console.log(`[register-helper] ${result.changed ? "changes required" : "up to date"}`);
    if (result.changed) process.exitCode = 1;
    return;
  }
  if (result.changed) writeFileAtomic(registerPath, `${JSON.stringify(result.register, null, 2)}\n`);
  console.log(`[register-helper] ${result.changed ? "updated" : "up to date"}; ${result.reopened.length} reopened`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  try { main(); }
  catch (error) { console.error(`[register-helper] ERROR: ${error.message}`); process.exitCode = 1; }
}
