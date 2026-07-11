#!/usr/bin/env node
/**
 * Compare the search+execute and manifest-derived per-operation QA arms using
 * the metrics pre-registered for Solo todo 903. Full result/transcript files
 * stay local and gitignored; this writes a local comparison sidecar whose
 * stamped aggregates are copied into the committed eval record after review.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { extractPlainOperationTool } from "../plan/grade-plan.mjs";

const TRUNCATION_MARKERS = ["--- TRUNCATED ---", "--- SOURCE BASIS ---"];

function scoreOf(row) {
  return row.verdict?.score ?? "error";
}

function isRavenTool(entry) {
  return /^mcp__raven__/.test(String(entry?.tool ?? ""));
}

function isSearchTool(entry) {
  return /^mcp__raven__search$/.test(String(entry?.tool ?? ""));
}

function isExecuteTool(entry) {
  return String(entry?.tool ?? "").endsWith("execute");
}

function resultIsTruncated(result) {
  return TRUNCATION_MARKERS.some((marker) => String(result ?? "").includes(marker));
}

function resultIsError(entry) {
  const result = String(entry?.result ?? "");
  return Boolean(
    entry?.isError ||
      result.startsWith("Execution failed:") ||
      result.startsWith("Plain operation proxy failed:")
  );
}

function visibleEnvelopeOutcome(result) {
  if (typeof result !== "string" || resultIsTruncated(result)) return null;
  const consoleAt = result.indexOf("\n\n--- console (");
  const body = consoleAt >= 0 ? result.slice(0, consoleAt) : result;
  try {
    const parsed = JSON.parse(body);
    if (parsed?.ok === true && Object.hasOwn(parsed, "data")) return "ok";
    if (parsed?.ok === false && parsed?.error?.kind === "soft-empty") return "soft-empty";
    if (parsed?.ok === false && parsed?.error) return "error";
  } catch {
    // Execute scripts may return arbitrary projections; not an envelope.
  }
  return null;
}

function addNumericUsage(target, source) {
  if (!source || typeof source !== "object") return target;
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "number") target[key] = (target[key] ?? 0) + value;
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] = addNumericUsage(target[key] ?? {}, value);
    }
  }
  return target;
}

export function analyzeArchitectureRow(row) {
  const transcript = row.transcript ?? [];
  let searchCalls = 0;
  let executeCalls = 0;
  let operationToolCalls = 0;
  let toolResultChars = 0;
  let truncatedToolResults = 0;
  let toolErrors = 0;
  const visibleEnvelopes = { ok: 0, error: 0, "soft-empty": 0 };
  for (const entry of transcript) {
    if (isSearchTool(entry)) searchCalls++;
    if (isExecuteTool(entry)) executeCalls++;
    if (extractPlainOperationTool(entry.tool)) operationToolCalls++;
    if (typeof entry.result === "string") {
      toolResultChars += entry.result.length;
      if (resultIsTruncated(entry.result)) truncatedToolResults++;
      if (resultIsError(entry)) toolErrors++;
      const outcome = visibleEnvelopeOutcome(entry.result);
      if (outcome) visibleEnvelopes[outcome]++;
    } else if (entry.isError) {
      toolErrors++;
    }
  }
  const ravenToolCalls = transcript.filter(isRavenTool).length;
  return {
    id: row.id,
    truth: row.truth ?? null,
    verdict: scoreOf(row),
    turns: row.agent?.turns ?? null,
    agentCostUsd: row.agent?.costUsd ?? 0,
    judgeCostUsd: row.verdict?.costUsd ?? 0,
    totalCostUsd: (row.agent?.costUsd ?? 0) + (row.verdict?.costUsd ?? 0),
    promptChars: row.agent?.promptChars ?? null,
    usage: row.agent?.usage ?? null,
    transcriptToolCalls: transcript.length,
    ravenToolCalls,
    harnessToolCalls: transcript.length - ravenToolCalls,
    searchCalls,
    executeCalls,
    operationToolCalls,
    toolResultChars,
    truncatedToolResults,
    toolErrors,
    agentError: Boolean(row.agent?.error),
    judgeError: scoreOf(row) === "error",
    visibleEnvelopes
  };
}

export function summarizeArchitecture(rows) {
  const analyzed = rows.map(analyzeArchitectureRow);
  const sum = (field) => analyzed.reduce((total, row) => total + (row[field] ?? 0), 0);
  const verdicts = { correct: 0, partial: 0, wrong: 0, error: 0 };
  const visibleEnvelopes = { ok: 0, error: 0, "soft-empty": 0 };
  const agentUsage = {};
  for (const row of analyzed) {
    verdicts[row.verdict in verdicts ? row.verdict : "error"]++;
    for (const key of Object.keys(visibleEnvelopes)) visibleEnvelopes[key] += row.visibleEnvelopes[key];
    addNumericUsage(agentUsage, row.usage);
  }
  return {
    cases: analyzed.length,
    verdicts,
    meanTurns: analyzed.length ? sum("turns") / analyzed.length : null,
    agentCostUsd: sum("agentCostUsd"),
    judgeCostUsd: sum("judgeCostUsd"),
    totalCostUsd: sum("totalCostUsd"),
    agentUsage,
    meanPromptChars: analyzed.length ? sum("promptChars") / analyzed.length : null,
    transcriptToolCalls: sum("transcriptToolCalls"),
    ravenToolCalls: sum("ravenToolCalls"),
    harnessToolCalls: sum("harnessToolCalls"),
    searchCalls: sum("searchCalls"),
    executeCalls: sum("executeCalls"),
    operationToolCalls: sum("operationToolCalls"),
    capturedToolResultChars: sum("toolResultChars"),
    capturedToolResultScope:
      "execute and direct-operation bodies only; search result bodies are not captured, so this value is not comparable across arms",
    truncatedToolResults: sum("truncatedToolResults"),
    truncatedCases: analyzed.filter((row) => row.truncatedToolResults > 0).length,
    toolErrors: sum("toolErrors"),
    agentErrors: analyzed.filter((row) => row.agentError).length,
    judgeErrors: analyzed.filter((row) => row.judgeError).length,
    visibleEnvelopes
  };
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function planPathFor(resultsPath) {
  return resultsPath.replace(/\.json$/, ".plan.json");
}

function assertComparable(search, perOperation) {
  const fail = (message) => {
    throw new Error(`incomparable A/B inputs: ${message}`);
  };
  if (search.meta?.surface !== "search-execute") fail(`first surface is ${search.meta?.surface}`);
  if (perOperation.meta?.surface !== "per-operation") fail(`second surface is ${perOperation.meta?.surface}`);
  for (const key of ["model", "judgeModel", "judgeRubric", "packVersion", "casesPath", "caseContract", "sampleN"]) {
    if (search.meta?.[key] !== perOperation.meta?.[key]) {
      fail(`${key} differs (${JSON.stringify(search.meta?.[key])} vs ${JSON.stringify(perOperation.meta?.[key])})`);
    }
  }
  const searchIds = search.rows.map((row) => row.id);
  const perOperationIds = perOperation.rows.map((row) => row.id);
  if (JSON.stringify(searchIds) !== JSON.stringify(perOperationIds)) fail("case ids/order differ");
  if (JSON.stringify(search.meta?.inputSnapshot) !== JSON.stringify(perOperation.meta?.inputSnapshot)) {
    fail("input snapshots differ");
  }
}

export function compareArchitectureResults({ search, perOperation, searchPlan, perOperationPlan }) {
  assertComparable(search, perOperation);
  const searchById = new Map(search.rows.map((row) => [row.id, row]));
  const searchPlanById = new Map(searchPlan.rows.map((row) => [row.id, row]));
  const perOperationPlanById = new Map(perOperationPlan.rows.map((row) => [row.id, row]));
  const transitions = {};
  const rows = perOperation.rows.map((row) => {
    const left = searchById.get(row.id);
    const transition = `${scoreOf(left)}→${scoreOf(row)}`;
    transitions[transition] = (transitions[transition] ?? 0) + 1;
    return {
      id: row.id,
      searchExecute: {
        ...analyzeArchitectureRow(left),
        planRequiredCovered: searchPlanById.get(row.id)?.requiredCovered ?? null,
        planOnPlanRatio: searchPlanById.get(row.id)?.onPlanRatio ?? null
      },
      perOperation: {
        ...analyzeArchitectureRow(row),
        planRequiredCovered: perOperationPlanById.get(row.id)?.requiredCovered ?? null,
        planOnPlanRatio: perOperationPlanById.get(row.id)?.onPlanRatio ?? null
      }
    };
  });
  return {
    meta: {
      comparedAt: new Date().toISOString(),
      model: search.meta.model,
      judgeModel: search.meta.judgeModel,
      judgeRubric: search.meta.judgeRubric,
      packVersion: search.meta.packVersion,
      casesPath: search.meta.casesPath,
      caseContract: search.meta.caseContract,
      sampleN: search.meta.sampleN,
      caseCount: rows.length,
      metricLimitations: {
        advertisedWireSurface:
          "tool-surface character counts describe serialized MCP wire definitions, not model-consumed context; use agent usage/cache tokens for consumption",
        capturedToolResultChars:
          "search result bodies are absent from search+execute transcripts, so captured result characters are excluded from cross-arm interpretation"
      }
    },
    searchExecute: {
      toolSurface: search.meta.toolSurface,
      metrics: summarizeArchitecture(search.rows),
      plan: searchPlan.summary
    },
    perOperation: {
      toolSurface: perOperation.meta.toolSurface,
      metrics: summarizeArchitecture(perOperation.rows),
      plan: perOperationPlan.summary
    },
    verdictTransitions: transitions,
    rows
  };
}

function tableRow(label, arm) {
  const m = arm.metrics;
  const v = m.verdicts;
  const p = arm.plan;
  return {
    arm: label,
    verdicts: `${v.correct}C/${v.partial}P/${v.wrong}W/${v.error}E`,
    turns: m.meanTurns?.toFixed(2) ?? "n/a",
    totalCostUsd: m.totalCostUsd.toFixed(3),
    toolCount: arm.toolSurface?.toolCount ?? "n/a",
    advertisedWireChars: arm.toolSurface?.advertisedWireChars ?? arm.toolSurface?.contextChars ?? "n/a",
    toolCalls: m.ravenToolCalls,
    truncations: `${m.truncatedToolResults} (${m.truncatedCases} cases)`,
    errors: `${m.toolErrors} tool/${m.agentErrors} agent/${m.judgeErrors} judge`,
    plan: `${p.requiredCoveredCount}/${p.cases}`
  };
}

async function main() {
  const [searchPath, perOperationPath] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  if (!searchPath || !perOperationPath) {
    throw new Error("usage: compare-architecture-ab.mjs <search-execute-results.json> <per-operation-results.json>");
  }
  const searchPlanPath = planPathFor(searchPath);
  const perOperationPlanPath = planPathFor(perOperationPath);
  for (const file of [searchPlanPath, perOperationPlanPath]) {
    if (!existsSync(file)) throw new Error(`missing plan sidecar: ${file}`);
  }
  const comparison = compareArchitectureResults({
    search: readJson(searchPath),
    perOperation: readJson(perOperationPath),
    searchPlan: readJson(searchPlanPath),
    perOperationPlan: readJson(perOperationPlanPath)
  });
  comparison.meta.searchResultsPath = searchPath;
  comparison.meta.perOperationResultsPath = perOperationPath;
  comparison.meta.searchPlanPath = searchPlanPath;
  comparison.meta.perOperationPlanPath = perOperationPlanPath;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outPath = searchPath.replace(/[^/]+$/, `${stamp}-architecture-ab.json`);
  writeFileSync(outPath, `${JSON.stringify(comparison, null, 2)}\n`);
  console.table([
    tableRow("search+execute", comparison.searchExecute),
    tableRow("per-operation", comparison.perOperation)
  ]);
  console.log(`verdict transitions: ${JSON.stringify(comparison.verdictTransitions)}`);
  console.log(`wrote ${outPath}`);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) await main();
