#!/usr/bin/env node
/**
 * Discovery-only Phase 0 eval.
 *
 * Given a seed question, ask whether one catalog search page surfaces:
 *   1. the intended source family in the top 3, and
 *   2. a usable operation/skill in the top 5.
 *
 * This is intentionally offline/static. It does not drive an agent through the
 * <=3-search arm yet; cases whose one-call discovery passes but a prior answer
 * still missed can be deterministically classified from fixture evidence as
 * agent-behavior or downstream.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const EVAL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(EVAL_DIR, "..");
const SEARCH_TS = join(REPO, "src", "catalog", "search.ts");
const MANIFEST = join(REPO, "catalog", "manifest.json");
const DEFAULT_CASES = join(EVAL_DIR, "discovery", "seed-cases.json");
const DEFAULT_RESULTS_DIR = join(EVAL_DIR, "discovery", "results");

const args = process.argv.slice(2);
const flagValue = (name, fallback) => {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const v = args[i + 1];
  if (!v || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
};

const CASES = resolve(flagValue("--cases", DEFAULT_CASES));
const OUT = args.includes("--out") ? resolve(flagValue("--out", null)) : null;
const WRITE = !args.includes("--no-write");

async function loadSearchModule() {
  try {
    return await import(pathToFileURL(SEARCH_TS).href);
  } catch (directErr) {
    try {
      return await transpileFallback();
    } catch (fallbackErr) {
      throw new Error(
        `could not import search.ts.\n  direct import: ${directErr.message}\n  tsc fallback: ${fallbackErr.message}`,
      );
    }
  }
}

/** Transpile src/catalog/search.ts and its relative-import graph into eval/.build/*.mjs. */
async function transpileFallback() {
  const ts = (await import(pathToFileURL(join(REPO, "node_modules", "typescript", "lib", "typescript.js")).href)).default;
  const buildDir = join(EVAL_DIR, ".build");
  mkdirSync(buildDir, { recursive: true });
  const done = new Map();

  const resolveRel = (fromDir, spec) => {
    for (const cand of [spec, `${spec}.ts`, `${spec}/index.ts`, spec.replace(/\.js$/, ".ts")]) {
      const p = resolve(fromDir, cand);
      if (p.endsWith(".ts") && existsSync(p)) return p;
    }
    throw new Error(`cannot resolve relative import "${spec}" from ${fromDir}`);
  };

  const transpile = (tsPath) => {
    if (done.has(tsPath)) return done.get(tsPath);
    const outName = tsPath.slice(REPO.length + 1).replace(/[\\/]/g, "__").replace(/\.ts$/, ".mjs");
    const outPath = join(buildDir, outName);
    done.set(tsPath, outPath);
    let src = readFileSync(tsPath, "utf8");
    src = src.replace(
      /(from\s+|import\s*\(\s*)(["'])(\.{1,2}\/[^"']+)\2/g,
      (_m, lead, q, spec) => {
        const depTs = resolveRel(dirname(tsPath), spec);
        const depOut = transpile(depTs);
        return `${lead}${q}./${depOut.slice(buildDir.length + 1)}${q}`;
      },
    );
    const out = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      fileName: tsPath,
    });
    writeFileSync(outPath, out.outputText);
    return outPath;
  };

  return import(pathToFileURL(transpile(SEARCH_TS)).href);
}

function assertCaseShape(c) {
  for (const key of ["id", "question", "expectedSourceFamilies", "usable"]) {
    if (!(key in c)) throw new Error(`case ${c.id ?? "<missing id>"} missing required field ${key}`);
  }
  if (!Array.isArray(c.expectedSourceFamilies) || c.expectedSourceFamilies.length === 0) {
    throw new Error(`case ${c.id} expectedSourceFamilies must be a non-empty array`);
  }
  if (!c.usable || (!Array.isArray(c.usable.hitIds) && !Array.isArray(c.usable.services))) {
    throw new Error(`case ${c.id} usable must include hitIds and/or services`);
  }
  const prior = c.priorMiss?.cause;
  if (prior && !["agent-behavior", "downstream"].includes(prior)) {
    throw new Error(`case ${c.id} priorMiss.cause must be agent-behavior or downstream`);
  }
}

function hitIsUsable(hit, usable) {
  return (
    (Array.isArray(usable.hitIds) && usable.hitIds.includes(hit.id)) ||
    (Array.isArray(usable.services) && usable.services.includes(hit.service))
  );
}

function classify({ sourceFamilyTop3, usableTop5, priorMiss }) {
  if (!sourceFamilyTop3 || !usableTop5) return "retrieval";
  if (priorMiss?.cause === "agent-behavior") return "agent-behavior";
  if (priorMiss?.cause === "downstream") return "downstream";
  return "none";
}

function aggregate(rows) {
  const counts = {
    total: rows.length,
    sourceFamilyTop3: 0,
    usableTop5: 0,
    discoveryPass: 0,
    cause: { retrieval: 0, "agent-behavior": 0, downstream: 0, none: 0 },
    byCaseGroup: {},
  };
  for (const row of rows) {
    if (row.sourceFamilyTop3) counts.sourceFamilyTop3 += 1;
    if (row.usableTop5) counts.usableTop5 += 1;
    if (row.discoveryPass) counts.discoveryPass += 1;
    counts.cause[row.cause] += 1;
    const group = row.caseGroup ?? "uncategorized";
    counts.byCaseGroup[group] ??= { total: 0, discoveryPass: 0, retrieval: 0, "agent-behavior": 0, downstream: 0, none: 0 };
    counts.byCaseGroup[group].total += 1;
    if (row.discoveryPass) counts.byCaseGroup[group].discoveryPass += 1;
    counts.byCaseGroup[group][row.cause] += 1;
  }
  return counts;
}

async function main() {
  const { loadManifest, searchCatalogPage } = await loadSearchModule();
  if (typeof loadManifest !== "function" || typeof searchCatalogPage !== "function") {
    throw new Error("search.ts does not export loadManifest + searchCatalogPage");
  }

  const fixture = JSON.parse(readFileSync(CASES, "utf8"));
  if (!Array.isArray(fixture.cases)) throw new Error(`${CASES} must contain { cases: [...] }`);
  for (const c of fixture.cases) assertCaseShape(c);

  const catalog = loadManifest(JSON.parse(readFileSync(MANIFEST, "utf8")));
  const rows = fixture.cases.map((c) => {
    const page = searchCatalogPage(catalog, { query: c.question, limit: 5 });
    const sourceFamilyTop3 = page.hits.slice(0, 3).some((h) => c.expectedSourceFamilies.includes(h.service));
    const usableTop5 = page.hits.slice(0, 5).some((h) => hitIsUsable(h, c.usable));
    const cause = classify({ sourceFamilyTop3, usableTop5, priorMiss: c.priorMiss });
    return {
      id: c.id,
      caseGroup: c.caseGroup,
      question: c.question,
      expectedSourceFamilies: c.expectedSourceFamilies,
      alternateSourceFamilies: c.alternateSourceFamilies ?? [],
      usable: c.usable,
      sourceFamilyTop3,
      usableTop5,
      discoveryPass: sourceFamilyTop3 && usableTop5,
      cause,
      priorMiss: c.priorMiss ?? null,
      notes: c.notes ?? "",
      searchPage: {
        total: page.total,
        truncated: page.truncated,
        topHits: page.hits.map((h, i) => ({
          rank: i + 1,
          id: h.id,
          service: h.service,
          kind: h.kind,
          score: h.score,
          tier: h.tier,
          usable: hitIsUsable(h, c.usable),
        })),
      },
    };
  });

  const result = {
    ranAt: new Date().toISOString(),
    instrument: "discovery-phase0-static",
    casesFile: CASES,
    manifest: MANIFEST,
    agentArm: {
      status: "deferred",
      maxSearches: 3,
      gap: "This pass classifies deterministic one-call discovery only. It does not yet replay an agent constrained to <=3 search calls.",
    },
    summary: aggregate(rows),
    cases: rows,
  };

  let outPath = null;
  if (WRITE) {
    outPath = OUT ?? join(DEFAULT_RESULTS_DIR, `discovery-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
  }

  const s = result.summary;
  console.log(`discovery Phase 0 static eval — ${s.total} cases`);
  console.table([
    { metric: "source family top-3", count: s.sourceFamilyTop3, total: s.total, pct: `${((100 * s.sourceFamilyTop3) / s.total).toFixed(1)}%` },
    { metric: "usable op/skill top-5", count: s.usableTop5, total: s.total, pct: `${((100 * s.usableTop5) / s.total).toFixed(1)}%` },
    { metric: "discovery pass", count: s.discoveryPass, total: s.total, pct: `${((100 * s.discoveryPass) / s.total).toFixed(1)}%` },
  ]);
  console.table(Object.entries(s.cause).map(([cause, count]) => ({ cause, count })));
  console.table(Object.entries(s.byCaseGroup).map(([caseGroup, b]) => ({ caseGroup, ...b })));
  if (outPath) console.log(`results -> ${outPath}`);
}

main().catch((err) => {
  console.error(`discovery eval failed: ${err.message}`);
  process.exit(1);
});
