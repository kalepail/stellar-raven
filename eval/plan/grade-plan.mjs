#!/usr/bin/env node
/**
 * grade-plan.mjs — multi-tool PLAN grader over golden Q→A results (Solo todo 799).
 *
 * The answer eval (eval/qa/) judges WHAT the agent said; this grades HOW it
 * got there, from the stored tool transcript:
 *   1. which SET of services the plan touched, graded against an
 *      acceptable-set from eval/plan/coverage-rules.json (rules derived from
 *      documented service coverage, never from past agent behavior)
 *   2. whether a broad→detail progression appeared where the question class
 *      demands specifics (op classes from generated eval/plan/op-classes.json)
 *   3. how both correlate with the judge verdicts already in the file
 *
 * Usage:
 *   node eval/plan/grade-plan.mjs <results-file.json> [--rules eval/plan/coverage-rules.json]
 *
 * Writes <results-file>.plan.json next to the input + prints a summary table
 * (same formatting style as eval/qa/lib.mjs formatSummaryTable).
 *
 * Op extraction is regex over each execute input's {code}:
 *   /\b(lumenloop|scout|stellarDocs)\.(\w+)\s*\(/  → service op
 *   codemode.skill.read / codemode.skill_read      → service "skills"
 *   codemode.search|catalog|spec|describe          → service "meta-discovery"
 * meta-discovery (and the top-level MCP search tool) is always on-plan and
 * excluded from the touched-service set. Rows whose execute inputs look
 * legacy-truncated (exactly 600 chars, or unparseable JSON) are flagged —
 * pre-patch run-qa.mjs sliced ALL inputs to 600 chars, so old runs undercount.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const PLAN_DIR = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_RULES_PATH = path.join(PLAN_DIR, "coverage-rules.json");
export const OP_CLASSES_PATH = path.join(PLAN_DIR, "op-classes.json");

/** Services that count toward the plan set; meta-discovery is bookkeeping. */
const PLAN_SERVICES = new Set(["lumenloop", "scout", "stellarDocs", "skills"]);

// One combined regex so op order inside a script is preserved (match.index).
const OP_RE =
  /\b(lumenloop|scout|stellarDocs)\.(\w+)\s*\(|\bcodemode\.skill(?:\.read|_read)\s*\(|\bcodemode\.(search|catalog|spec|describe)\s*\(/g;

/**
 * Extract service ops (in source order) from one execute tool input string
 * (the JSON-stringified {code} input as stored in the transcript).
 * Returns { ops: [{service, op}], truncated } — truncated flags the legacy
 * 600-char slice (length exactly 600, or JSON no longer parseable).
 */
export function extractExecuteOps(inputStr) {
  const raw = String(inputStr ?? "");
  let code = raw;
  let truncated = raw.length === 600; // pre-patch slice width; endsWith mid-token implied
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.code === "string") code = parsed.code;
  } catch {
    truncated = true; // slice cut the JSON mid-token; regex the raw string instead
  }
  const ops = [];
  for (const m of code.matchAll(OP_RE)) {
    if (m[1]) ops.push({ service: m[1], op: m[2] });
    else if (m[3]) ops.push({ service: "meta-discovery", op: m[3] });
    else ops.push({ service: "skills", op: "skill.read" });
  }
  return { ops, truncated };
}

/** Class for one extracted op; falls back for the virtual services. */
export function classOf(service, op, opClasses) {
  const cls = opClasses[`${service}.${op}`];
  if (cls) return cls;
  if (service === "skills") return "detail"; // skill.read = read one skill by name
  if (service === "meta-discovery") return op === "search" || op === "catalog" ? "broad" : "meta";
  return "unknown"; // dynamic dispatch / drift — informational, never on a progression
}

/** Normalize a rule/override plan: acceptable always ⊇ required ∪ anyOf. */
function normalizePlan(plan) {
  const required = plan.required ?? [];
  const anyOf = plan.anyOf ?? [];
  const acceptable = [...new Set([...required, ...anyOf, ...(plan.acceptable ?? [])])];
  return { required, anyOf, acceptable, progressionExpected: Boolean(plan.progressionExpected) };
}

const asArray = (v) => (Array.isArray(v) ? v : [v]);

/**
 * Match one result row (id, tags, question) to its plan: overrides first,
 * then ordered rules top-to-bottom, first match wins. Throws if nothing
 * matches — coverage-rules.json must end in a catch-all.
 */
export function matchPlanRule(row, rulesDoc) {
  const override = rulesDoc.overrides?.[row.id];
  if (override) return { ruleId: `override:${row.id}`, plan: normalizePlan(override) };
  for (const rule of rulesDoc.rules) {
    const m = rule.match ?? {};
    if (m.category !== undefined && !asArray(m.category).includes(row.tags?.category)) continue;
    if (m.service !== undefined && !asArray(m.service).includes(row.tags?.service)) continue;
    if (m.question !== undefined && !new RegExp(m.question, "i").test(row.question ?? "")) continue;
    return { ruleId: rule.id, plan: normalizePlan(rule.plan) };
  }
  throw new Error(`no coverage rule matched case ${row.id} — rules file is missing its catch-all`);
}

/**
 * Progression per touched service over the ordered op stream: did a broad op
 * of that service precede a detail op of that service? For "skills" (which
 * has no broad op of its own) the broad half may be satisfied by any earlier
 * discovery search (MCP search tool call or codemode.search/catalog).
 * Returns { perService: {svc: {broadCalls, detailCalls, broadBeforeDetail}}, progressionUsed }.
 */
export function detectProgression(orderedOps, opClasses) {
  const perService = {};
  const firstBroadAt = {}; // service → earliest broad index
  let firstDiscoveryAt = Infinity;
  let progressionUsed = false;
  orderedOps.forEach(({ service, op }, i) => {
    const cls = classOf(service, op, opClasses);
    if (service === "meta-discovery") {
      if (cls === "broad") firstDiscoveryAt = Math.min(firstDiscoveryAt, i);
      return;
    }
    const s = (perService[service] ??= { broadCalls: 0, detailCalls: 0, broadBeforeDetail: false });
    if (cls === "broad") {
      s.broadCalls++;
      firstBroadAt[service] = Math.min(firstBroadAt[service] ?? Infinity, i);
    } else if (cls === "detail") {
      s.detailCalls++;
      const broadAt = service === "skills" ? Math.min(firstBroadAt[service] ?? Infinity, firstDiscoveryAt) : (firstBroadAt[service] ?? Infinity);
      if (broadAt < i) {
        s.broadBeforeDetail = true;
        progressionUsed = true;
      }
    }
  });
  return { perService, progressionUsed };
}

/** True for transcript entries that are catalog-search MCP tool calls. */
const isSearchToolCall = (t) => /^mcp__.+__search/.test(t.tool ?? "");
const isExecuteToolCall = (t) => (t.tool ?? "").endsWith("execute");

/** Grade one result row against the rules + op classes. */
export function gradeRow(row, rulesDoc, opClasses) {
  const { ruleId, plan } = matchPlanRule(row, rulesDoc);

  // Ordered op stream: MCP search calls count as meta-discovery broad steps;
  // execute inputs contribute their extracted ops in source order.
  const orderedOps = [];
  let searchQueries = 0;
  let executeCalls = 0;
  let truncatedInputs = 0;
  for (const entry of row.transcript ?? []) {
    if (isSearchToolCall(entry)) {
      searchQueries++;
      orderedOps.push({ service: "meta-discovery", op: "search" });
    } else if (isExecuteToolCall(entry)) {
      executeCalls++;
      const { ops, truncated } = extractExecuteOps(entry.input);
      if (truncated) truncatedInputs++;
      for (const op of ops) {
        if (op.service === "meta-discovery" && op.op === "search") searchQueries++;
        orderedOps.push(op);
      }
    }
  }

  const touchedServices = [...new Set(orderedOps.map((o) => o.service))]
    .filter((s) => PLAN_SERVICES.has(s))
    .sort();
  const onPlanSet = new Set(plan.acceptable);
  const requiredCovered =
    plan.required.every((s) => touchedServices.includes(s)) &&
    (plan.anyOf.length === 0 || plan.anyOf.some((s) => touchedServices.includes(s)));
  const onPlanRatio =
    touchedServices.length === 0
      ? null
      : touchedServices.filter((s) => onPlanSet.has(s)).length / touchedServices.length;
  const offPlanServices = touchedServices.filter((s) => !onPlanSet.has(s));
  const progression = detectProgression(orderedOps, opClasses);

  return {
    id: row.id,
    category: row.tags?.category ?? "unknown",
    service: row.tags?.service ?? "unknown",
    ruleId,
    progressionExpected: plan.progressionExpected,
    searchQueries,
    executeCalls,
    truncatedInputs,
    ops: orderedOps,
    touchedServices,
    requiredCovered,
    onPlanRatio,
    offPlanServices,
    progression: progression.perService,
    progressionUsed: progression.progressionUsed,
    verdictScore: row.verdict?.score ?? null
  };
}

/** Tally plan rows into the correlation summary (verdict × plan grades). */
export function summarizePlan(planRows) {
  const bucket = () => ({ correct: 0, partial: 0, wrong: 0, error: 0, total: 0 });
  const add = (b, score) => {
    b.total++;
    b[score in b ? score : "error"]++;
  };
  const byRequired = { covered: bucket(), missed: bucket() };
  const byProgression = { used: bucket(), skipped: bucket() };
  let progressionGraded = 0;
  const offPlanCounts = {};
  let onPlanSum = 0;
  let onPlanN = 0;
  let truncatedRows = 0;
  for (const r of planRows) {
    const score = r.verdictScore ?? "error";
    add(r.requiredCovered ? byRequired.covered : byRequired.missed, score);
    if (r.progressionExpected) {
      progressionGraded++;
      add(r.progressionUsed ? byProgression.used : byProgression.skipped, score);
    }
    for (const s of r.offPlanServices) offPlanCounts[s] = (offPlanCounts[s] ?? 0) + 1;
    if (r.onPlanRatio !== null) {
      onPlanSum += r.onPlanRatio;
      onPlanN++;
    }
    if (r.truncatedInputs > 0) truncatedRows++;
  }
  return {
    cases: planRows.length,
    requiredCoveredCount: byRequired.covered.total,
    meanOnPlanRatio: onPlanN ? onPlanSum / onPlanN : null,
    progressionGraded,
    progressionUsedCount: byProgression.used.total,
    byRequired,
    byProgression,
    offPlanCounts,
    truncatedRows
  };
}

/** Console table in the eval/qa/lib.mjs formatSummaryTable style. */
export function formatPlanSummaryTable(summary) {
  const line = (label, b) =>
    `${label.padEnd(26)} ${String(b.correct).padStart(3)} correct  ${String(b.partial).padStart(3)} partial  ${String(b.wrong).padStart(3)} wrong  ${String(b.error).padStart(2)} error  / ${b.total}`;
  const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : "n/a");
  const out = [
    `PLAN                       ${summary.requiredCoveredCount}/${summary.cases} requiredCovered (${pct(summary.requiredCoveredCount, summary.cases)})  mean onPlanRatio ${summary.meanOnPlanRatio === null ? "n/a" : summary.meanOnPlanRatio.toFixed(2)}`
  ];
  out.push("-- verdict × requiredCovered --");
  out.push(line("required covered", summary.byRequired.covered));
  out.push(line("required missed", summary.byRequired.missed));
  if (summary.progressionGraded > 0) {
    out.push(`-- verdict × progression (${summary.progressionGraded} cases where expected) --`);
    out.push(line("broad→detail used", summary.byProgression.used));
    out.push(line("broad→detail skipped", summary.byProgression.skipped));
  }
  const offPlan = Object.entries(summary.offPlanCounts).sort();
  if (offPlan.length) {
    out.push("-- off-plan touches (informational) --");
    for (const [svc, n] of offPlan) out.push(`${svc.padEnd(26)} ${n} case(s)`);
  }
  if (summary.truncatedRows > 0) {
    out.push(
      `NOTE: ${summary.truncatedRows} row(s) have legacy-truncated execute inputs (600-char slice) — op extraction undercounts; re-run eval/qa/run-qa.mjs (post-patch) for full-fidelity plans.`
    );
  }
  return out.join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const argVal = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const resultsPath = args.find((a) => !a.startsWith("--") && a !== argVal("--rules"));
  if (!resultsPath) {
    console.error("usage: node eval/plan/grade-plan.mjs <results-file.json> [--rules eval/plan/coverage-rules.json]");
    process.exit(1);
  }
  const rulesPath = argVal("--rules") ?? DEFAULT_RULES_PATH;
  const rulesDoc = JSON.parse(readFileSync(rulesPath, "utf8"));
  const opClasses = JSON.parse(readFileSync(OP_CLASSES_PATH, "utf8")).classes;
  const results = JSON.parse(readFileSync(resultsPath, "utf8"));
  if (!Array.isArray(results.rows)) throw new Error(`${resultsPath}: missing rows[]`);

  const planRows = results.rows.map((row) => gradeRow(row, rulesDoc, opClasses));
  const summary = summarizePlan(planRows);

  const outPath = resultsPath.replace(/\.json$/, "") + ".plan.json";
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        meta: {
          resultsPath,
          rulesPath,
          rulesVersion: rulesDoc.version,
          opClassesPath: OP_CLASSES_PATH,
          gradedAt: new Date().toISOString()
        },
        summary,
        rows: planRows
      },
      null,
      2
    ) + "\n"
  );
  console.log(`wrote ${outPath}\n`);
  console.log(formatPlanSummaryTable(summary));
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) await main();
