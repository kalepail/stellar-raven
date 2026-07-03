#!/usr/bin/env node
/**
 * run-routing.mjs — grade searchCatalog() routing accuracy against the compiled cases.
 *
 * Consumes (frozen search contract, scratchpad 514):
 *   - src/catalog/search.ts  → loadManifest(json), searchCatalog(catalog, opts), SearchHit
 *   - catalog/manifest.json
 *   - eval/routing-cases.json (produced by eval/compile-routing.mjs)
 *
 * For each case: searchCatalog(catalog, { query: question, limit: 5 }) and record
 * whether any hit's service matches expected_service at top-1 / top-3 / top-5, plus
 * card-level hit@5 when expected_cards is present (tolerant normalizer in lib/grade.mjs).
 *
 * Skills lane + overlay (todo 809), applied HERE at load time so that re-running
 * compile-routing.mjs (which regenerates routing-cases.json) never wipes them:
 *   - eval/skills-cases.json          hand-authored supplement; expected_service=skills.
 *     Graded as its own lane ("skills lane"), NEVER mixed into the legacy aggregate.
 *   - eval/build-question-overlay.json hand-reviewed ids of legacy cases that get
 *     expected_any (accept-either) applied. Those cases are reported BOTH ways:
 *     strict (expected_service only — the legacy numbers, unchanged) and
 *     accept-either (any service in expected_any counts).
 *
 * Todo 817 additions (all strict-grading-neutral):
 *   - compiled cases may carry corpus-derived expected_any (from acceptable_cards);
 *     per case it is unioned with the overlay's, and a legacy accept-either overall
 *     is reported alongside the unchanged strict aggregate.
 *   - compiled.extendedCases (net-new 538-corpus ids) grade as their own
 *     "extended lane", never merged into the legacy aggregate.
 *
 * Outputs eval/results/routing-<timestamp>.json and console tables.
 *
 * Gate enforcement (eval/gates.json): every run prints a gate verdict — legacy 338
 * strict within ±bandPct of the baselined top-1/3/5 counts, skills lane top-1 at or
 * above its floor. Advisory by default; `--gate` (what CI passes) exits 1 on breach.
 * A changed denominator always breaches: lanes never merge, so a different n means
 * the gate must be re-baselined explicitly, not silently absorbed.
 *
 * Import strategy for search.ts (zero new deps):
 *   1. Direct `import("../src/catalog/search.ts")` — Node >= 23.6 strips types natively
 *      (works when the TS is erasable and relative imports carry explicit extensions).
 *   2. Fallback: transpile search.ts (+ its relative imports, recursively) to .mjs in
 *      eval/.build/ using the repo's own `typescript` package, then import that.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { aggregate, gradeCase, tableRows } from "./lib/grade.mjs";

const EVAL_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(EVAL_DIR, "..");
const SEARCH_TS = join(REPO, "src", "catalog", "search.ts");
const MANIFEST = join(REPO, "catalog", "manifest.json");
const CASES = join(EVAL_DIR, "routing-cases.json");
const SKILLS_CASES = join(EVAL_DIR, "skills-cases.json");
const OVERLAY = join(EVAL_DIR, "build-question-overlay.json");
const GATES = join(EVAL_DIR, "gates.json");
const RESULTS_DIR = join(EVAL_DIR, "results");
const ENFORCE_GATE = process.argv.includes("--gate");

async function loadSearchModule() {
  if (!existsSync(SEARCH_TS)) throw new Error(`missing ${SEARCH_TS} — Lane C not landed yet?`);
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
  const done = new Map(); // abs .ts path -> abs .mjs path

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
    // Rewrite relative import/export specifiers to the transpiled .mjs siblings.
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

  const entry = transpile(SEARCH_TS);
  return import(pathToFileURL(entry).href);
}

async function main() {
  const { loadManifest, searchCatalog } = await loadSearchModule();
  if (typeof loadManifest !== "function" || typeof searchCatalog !== "function") {
    throw new Error("search.ts does not export loadManifest + searchCatalog (contract violation)");
  }
  if (!existsSync(MANIFEST)) throw new Error(`missing ${MANIFEST} — Lane C not landed yet?`);
  if (!existsSync(CASES)) throw new Error(`missing ${CASES} — run: node eval/compile-routing.mjs`);

  const manifestJson = JSON.parse(readFileSync(MANIFEST, "utf8"));
  const catalog = loadManifest(manifestJson);
  const compiled = JSON.parse(readFileSync(CASES, "utf8"));

  // Twin-aware grading (todo 816, rule v2): lumenloop.skill.<name> and
  // skills.<source>.<name> are one aliased resource (src/skills/store.ts) — derive
  // the twin terminal-name set from the manifest and grade twin hits as satisfying
  // BOTH service labels.
  const twinTerminals = new Set(
    (manifestJson.entries ?? [])
      .filter((e) => typeof e.id === "string" && e.id.startsWith("lumenloop.skill."))
      .map((e) => e.id.split(".").pop()),
  );

  // --- overlay: attach expected_any to hand-reviewed legacy case ids (load-time, so
  // compile-routing.mjs regenerating routing-cases.json never wipes it) ---------------
  let overlay = null;
  const expectedAnyById = new Map();
  if (existsSync(OVERLAY)) {
    overlay = JSON.parse(readFileSync(OVERLAY, "utf8"));
    const known = new Set(compiled.cases.map((c) => c.id));
    for (const id of overlay.case_ids) {
      if (!known.has(id)) {
        console.warn(`overlay warning: case id "${id}" not present in routing-cases.json — ignored`);
        continue;
      }
      expectedAnyById.set(id, overlay.expected_any);
    }
  }

  const runCase = (c) => {
    // Union of corpus-derived tolerance (compiled expected_any, from acceptable_cards —
    // todo 817) and the hand-reviewed overlay (adds "skills" on build questions). Strict
    // top1/3/5 grading ignores expected_any entirely, so legacy numbers are unaffected.
    const overlayAny = expectedAnyById.get(c.id);
    const union = new Set([...(c.expected_any ?? []), ...(overlayAny ?? [])]);
    const expectedAny = union.size > 0 ? [c.expected_service, ...[...union].filter((s) => s !== c.expected_service).sort()] : undefined;
    const hits = searchCatalog(catalog, { query: c.question, limit: 5 });
    const grade = gradeCase(hits, c.expected_service, c.expected_cards, expectedAny, twinTerminals);
    return {
      id: c.id,
      expected_service: c.expected_service,
      ...(expectedAny ? { expected_any: expectedAny } : {}),
      ...grade,
      topHits: hits.map((h) => ({ id: h.id, service: h.service, score: h.score })),
    };
  };

  // card@5 has no accept-either variant; carry the strict value through so cardN stays comparable
  const asAny = (r) =>
    r.any1 === undefined ? r : { expected_service: r.expected_service, top1: r.any1, top3: r.any3, top5: r.any5, cardHit5: r.cardHit5 };

  // --- legacy compiled cases: strict v2 (twin-aware, the gate) ------------------------
  const perCase = compiled.cases.map(runCase);
  const agg = aggregate(perCase);

  // --- corpus accept-either: every legacy case graded with its expected_any union ------
  // (strict `agg` above is untouched; this is the corpus-authored-tolerance view)
  const acceptEitherAgg = aggregate(perCase.map(asAny));

  // --- overlay dual grading: strict vs accept-either, over the overlay subset only ----
  let overlayReport = null;
  if (overlay) {
    const overlayCases = perCase.filter((r) => expectedAnyById.has(r.id));
    overlayReport = {
      expected_any: overlay.expected_any,
      n: overlayCases.length,
      strict: aggregate(overlayCases).overall,
      acceptEither: aggregate(overlayCases.map(asAny)).overall,
      // legacy overall recomputed with overlay cases graded accept-either (context only;
      // `overall` above stays the strict legacy number)
      legacyOverallAcceptEither: aggregate(perCase.map((r) => (expectedAnyById.has(r.id) ? asAny(r) : r))).overall,
    };
  }

  // --- extended lane: net-new 538-corpus cases (own aggregate, never merged) ----------
  let extendedLane = null;
  let extendedPerCase = [];
  if (Array.isArray(compiled.extendedCases) && compiled.extendedCases.length > 0) {
    extendedPerCase = compiled.extendedCases.map(runCase);
    extendedLane = {
      strict: aggregate(extendedPerCase),
      acceptEither: aggregate(extendedPerCase.map(asAny)).overall,
    };
  }

  // --- skills lane (hand-authored supplement; own aggregate, never merged) ------------
  let skillsLane = null;
  let skillsPerCase = [];
  if (existsSync(SKILLS_CASES)) {
    const supplement = JSON.parse(readFileSync(SKILLS_CASES, "utf8"));
    skillsPerCase = supplement.cases.map(runCase);
    skillsLane = { authoredAt: supplement.authoredAt, ...aggregate(skillsPerCase).overall };
  }

  // --- gate check (eval/gates.json; EVALS.md: two gates, everything else diagnostic) --
  let gate = null;
  if (existsSync(GATES)) {
    const g = JSON.parse(readFileSync(GATES, "utf8"));
    const failures = [];
    if (g.gradingRule !== "v2-twin-aware") {
      failures.push(`gates.json gradingRule "${g.gradingRule}" is not what this runner grades (v2-twin-aware) — re-baseline`);
    }
    const o = agg.overall;
    if (o.n !== g.legacy.n) {
      failures.push(`legacy n=${o.n} ≠ baselined n=${g.legacy.n} — denominator changed; re-baseline gates.json explicitly`);
    } else {
      const band = Math.round((g.legacy.n * g.legacy.bandPct) / 100);
      for (const k of ["top1", "top3", "top5"]) {
        if (Math.abs(o[k] - g.legacy[k]) > band) failures.push(`legacy ${k}=${o[k]} outside ±${band} of baseline ${g.legacy[k]}`);
      }
    }
    if (!skillsLane) {
      failures.push("skills lane absent (eval/skills-cases.json missing) — the skills gate cannot be evaluated");
    } else if (skillsLane.n !== g.skills.n) {
      failures.push(`skills lane n=${skillsLane.n} ≠ baselined n=${g.skills.n} — re-baseline gates.json explicitly`);
    } else if (skillsLane.top1 < g.skills.minTop1) {
      failures.push(`skills lane top-1=${skillsLane.top1} below floor ${g.skills.minTop1}`);
    }
    gate = { pass: failures.length === 0, failures, baselinedAt: g.baselinedAt, baselineResults: g.baselineResults };
  } else if (ENFORCE_GATE) {
    throw new Error(`--gate passed but ${GATES} is missing`);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = join(RESULTS_DIR, `routing-${stamp}.json`);
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        ranAt: new Date().toISOString(),
        gradingRule: "v2-twin-aware",
        ...(gate ? { gate } : {}),
        casesFile: { generatedAt: compiled.generatedAt, source: compiled.source, counts: compiled.counts },
        overall: agg.overall,
        perService: agg.perService,
        acceptEitherOverall: acceptEitherAgg.overall,
        skipped: compiled.counts.skipReasonCounts,
        ...(extendedLane ? { extendedLane: { strict: extendedLane.strict.overall, perService: extendedLane.strict.perService, acceptEither: extendedLane.acceptEither } } : {}),
        ...(skillsLane ? { skillsLane } : {}),
        ...(overlayReport ? { overlay: overlayReport } : {}),
        cases: perCase,
        ...(extendedPerCase.length > 0 ? { extendedCases: extendedPerCase } : {}),
        ...(skillsPerCase.length > 0 ? { skillsCases: skillsPerCase } : {}),
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`\nsearch-routing eval — ${perCase.length} legacy cases (${compiled.counts.skipped} skipped at compile), strict grading (rule v2, twin-aware)\n`);
  console.table(tableRows(agg));
  {
    const a = acceptEitherAgg.overall;
    const p = (b, num) => `${((100 * num) / b.n).toFixed(1)}%`;
    console.log(
      `legacy accept-either (corpus acceptable_cards ∪ overlay): ` +
        `top-1 ${p(a, a.top1)}, top-3 ${p(a, a.top3)}, top-5 ${p(a, a.top5)}`,
    );
  }
  if (extendedLane) {
    console.log(`\nextended lane — ${extendedPerCase.length} net-new 538-corpus cases (frontmatter labels), strict grading\n`);
    console.table(tableRows(extendedLane.strict));
    const a = extendedLane.acceptEither;
    const p = (num) => `${((100 * num) / a.n).toFixed(1)}%`;
    console.log(`extended accept-either: top-1 ${p(a.top1)}, top-3 ${p(a.top3)}, top-5 ${p(a.top5)}`);
  }
  if (skillsLane) {
    console.log(`\nskills lane — ${skillsPerCase.length} hand-authored cases (eval/skills-cases.json), strict grading\n`);
    console.table(tableRows(aggregate(skillsPerCase)));
  }
  if (overlayReport) {
    const p = (num) => `${((100 * num) / overlayReport.n).toFixed(1)}%`;
    console.log(`\noverlay — ${overlayReport.n} build-shaped stellarDocs cases, dual grading (accept set: ${overlayReport.expected_any.join(", ")})\n`);
    console.table([
      { grading: "strict (legacy)", "top-1": p(overlayReport.strict.top1), "top-3": p(overlayReport.strict.top3), "top-5": p(overlayReport.strict.top5) },
      { grading: "accept-either", "top-1": p(overlayReport.acceptEither.top1), "top-3": p(overlayReport.acceptEither.top3), "top-5": p(overlayReport.acceptEither.top5) },
    ]);
    const lo = overlayReport.legacyOverallAcceptEither;
    console.log(
      `legacy overall if overlay cases were graded accept-either (context only): ` +
        `top-1 ${((100 * lo.top1) / lo.n).toFixed(1)}%, top-3 ${((100 * lo.top3) / lo.n).toFixed(1)}%, top-5 ${((100 * lo.top5) / lo.n).toFixed(1)}%`,
    );
  }
  console.log("\nskipped at compile:", compiled.counts.skipReasonCounts);
  if (gate) {
    if (gate.pass) {
      console.log(`\nGATE PASS — legacy 338 within band and skills lane at/above floor (baseline ${gate.baselineResults})`);
    } else {
      console.log(`\nGATE FAIL${ENFORCE_GATE ? "" : " (advisory — enforce with --gate)"}:`);
      for (const f of gate.failures) console.log(`  - ${f}`);
    }
  }
  console.log(`\nresults -> ${outPath}`);
  if (gate && !gate.pass && ENFORCE_GATE) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`run-routing failed: ${err.message}`);
  process.exit(1);
});
