#!/usr/bin/env node
/**
 * run-qa.mjs — agentic golden Q→A runner (the A/B referee's driver).
 *
 * Contract (scratchpad 516): run(question, {searchVariant}) → {answer, transcript};
 * then judge(question, goldenAnswer, answer) → verdict. This script does both
 * per case and writes eval/qa/results/<stamp>.json + a console summary.
 *
 * For each case:
 *   1. drive an answering agent — headless `claude -p --model claude-sonnet-5`
 *      with a generated temp .mcp.json pointing at the live server
 *      (http://localhost:PORT/mcp), allowed tools = the variant's search tool
 *      + execute (verified working 2026-07-02)
 *   2. collect { answer, toolTranscript } from --output-format stream-json
 *   3. grade with judge.mjs (judgeCase)
 *
 * After a run: file service-level findings in improvements/ per eval/EVALS.md.
 *
 * Usage:
 *   npx wrangler dev --port 8788 --host localhost   # in another terminal
 *   (--host localhost is required: with custom-domain routes configured,
 *   wrangler dev rewrites request.url to the production host and the
 *   DEV_ALLOW_UNAUTHENTICATED loopback gate 401s every request)
 *   node eval/qa/run-qa.mjs --variant A --sample 30 [--port 8788]
 *
 * Flags:
 *   --variant A|B      A = host ranked-string search tool `search` — the
 *                      SHIPPED shape per ADR-0001
 *                      (research/decisions/0001-search-tool-shape.md); default A.
 *                      B = code-shaped spec search — no longer live by
 *                      default; running B requires a build that exposes a
 *                      code-shaped tool plus an explicit --search-tool.
 *   --search-tool name explicit search tool name override
 *   --sample N         deterministic stratified subset (same sampler used by
 *                      compile-qa.mjs for the committed sample.json)
 *   --ids a,b,c        run only these case ids (smoke tests)
 *   --port N           wrangler dev port (default 8788)
 *   --cases path       battery file (default eval/qa/cases.json). Named
 *                      hand-authored contracts include live-data-canonical-v2
 *                      (corpus/live/live-cases.json) and live-digest-supplement-v2
 *                      (corpus/live/live-digest-supplement-cases.json); run separately.
 *   --model name       answering-agent model (default claude-sonnet-5)
 *   --judge-model name judge model (default judge.mjs JUDGE_MODEL)
 *   --surface name     search-execute (default) | per-operation. The latter
 *                      starts the isolated stdio proxy harness for the
 *                      manifest's 50 operations and still uses the existing
 *                      local Wrangler server for adapter/executor traffic.
 *   --server-revision  git revision of the checkout running the already-bound
 *                      Wrangler process (recorded for reproducibility)
 *   --no-judge         collect answers only (judge later)
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { QA_DIR, loadCases, stratifiedSample, summarize, formatSummaryTable } from "./lib.mjs";
import { buildTranscriptEvidence, judgeCase, JUDGE_MODEL, JUDGE_RUBRIC } from "./judge.mjs";
import { PACK_VERSION } from "./evidence-pack.mjs";
import {
  PLAIN_SERVER_INSTRUCTIONS,
  loadPlainOperationSurface,
  operationIdFromPlainTool
} from "./plain-operation-harness.mjs";

// Variant→tool mapping post-ADR-0001: A (host-side ranked query) shipped as
// `search` (the `search_ranked` A/B alias retired with the decision). B
// (code-shaped {code} spec search) has NO default tool anymore — it is not
// registered top-level; re-testing it requires a build exposing a code-shaped
// tool via a --search-tool override.
const VARIANT_TOOL = { A: "search", B: null };
const AGENT_MODEL = "claude-sonnet-5";
const MAX_TURNS = 24;
const AGENT_TIMEOUT_MS = 10 * 60_000;
const SURFACES = new Set(["search-execute", "per-operation"]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function gitValue(args) {
  const result = spawnSync("git", args, { cwd: path.resolve(QA_DIR, "..", ".."), encoding: "utf8" });
  return result.status === 0 ? String(result.stdout).trim() : null;
}

function sourceIdentity(serverRevision) {
  const status = gitValue(["status", "--porcelain=v1", "--untracked-files=all"]);
  return {
    runnerRevision: gitValue(["rev-parse", "HEAD"]),
    runnerDirty: status === null ? null : status.length > 0,
    runnerStatusSha256: status === null ? null : sha256(status),
    serverRevision: serverRevision ?? null,
    manifestFileSha256: sha256(readFileSync(path.join(path.resolve(QA_DIR, "..", ".."), "catalog", "manifest.json"), "utf8")),
    runnerFileSha256: sha256(readFileSync(path.join(QA_DIR, "run-qa.mjs"), "utf8")),
    plainHarnessFileSha256: sha256(readFileSync(path.join(QA_DIR, "plain-operation-harness.mjs"), "utf8"))
  };
}

function agentPrompt(question, { surface, searchTool }) {
  const promptAppend = process.env.QA_AGENT_PROMPT_APPEND?.trim();
  if (surface === "per-operation") {
    return `You answer questions about the Stellar ecosystem using ONLY this session's manifest-derived MCP operation tools.

The tools are named mcp__raven__<service>_<operation> for the lumenloop, scout, and stellarDocs source families. Choose operations directly from their descriptions and input schemas. Fan out independent broad calls when useful, then make targeted detail calls using ids or slugs returned by broad calls.

Rules:
- Ground every specific claim (names, numbers, SEP/CAP ids, commands, URLs) in tool results. Never invent them.
- Tool results use { ok: true, data } | { ok: false, error }; read payload under data, and treat soft-empty as inconclusive.
- If the tools cannot support an answer — the question is out of scope, the thing does not exist, or the request itself is something you should not do — say that plainly and briefly instead of guessing or playing along.
- Do not use any tool outside the raven MCP operation set.
- Your FINAL message must be the answer itself: concise, fact-dense, with source URLs from tool results where available. No preamble, no meta-commentary about tools.
${promptAppend ? `\nAdditional run instructions:\n${promptAppend}\n` : ""}

QUESTION:
${question}`;
  }
  return `You answer questions about the Stellar ecosystem using ONLY this session's MCP tools:

- mcp__raven__${searchTool} — discover what the catalog can do (service operations, skills)
- mcp__raven__execute — run JavaScript that calls the discovered operations and returns data

Workflow: call ${searchTool} first with a short intent phrase, read the hits, then write execute scripts that gather real evidence (compose several operations; follow up with detail calls). Search again with different terms if the first pass misses.

Rules:
- Ground every specific claim (names, numbers, SEP/CAP ids, commands, URLs) in tool results. Never invent them.
- If the tools cannot support an answer — the question is out of scope, the thing does not exist, or the request itself is something you should not do — say that plainly and briefly instead of guessing or playing along.
- Do not use any tool other than the two named above.
- Your FINAL message must be the answer itself: concise, fact-dense, with source URLs from tool results where available. No preamble, no meta-commentary about tools.
${promptAppend ? `\nAdditional run instructions:\n${promptAppend}\n` : ""}

QUESTION:
${question}`;
}

/** Run one answering agent; returns { answer, transcript, costUsd, turns, error? } */
function runAgent(question, { surface, searchTool, allowedTools, mcpConfigPath, model }) {
  const prompt = agentPrompt(question, { surface, searchTool });
  const res = spawnSync(
    "claude",
    [
      "-p",
      "--model",
      model,
      "--output-format",
      "stream-json",
      "--verbose",
      "--mcp-config",
      mcpConfigPath,
      "--strict-mcp-config",
      "--allowedTools",
      allowedTools.join(","),
      "--max-turns",
      String(MAX_TURNS)
    ],
    {
      input: prompt,
      encoding: "utf8",
      timeout: AGENT_TIMEOUT_MS,
      maxBuffer: 64 * 1024 * 1024
    }
  );
  if (res.error) {
    return { answer: "", transcript: [], promptChars: prompt.length, error: `agent spawn failed: ${res.error.message}` };
  }
  const transcript = [];
  let answer = "";
  let costUsd;
  let turns;
  let usage;
  let resultError;
  for (const line of String(res.stdout).split("\n")) {
    if (!line.trim().startsWith("{")) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }
    if (msg.type === "assistant" && Array.isArray(msg.message?.content)) {
      for (const block of msg.message.content) {
        if (block.type === "tool_use") {
          const rawInput = JSON.stringify(block.input ?? {});
          const isPlainOperation = operationIdFromPlainTool(String(block.name).replace(/^mcp__[^_]+__/, "")) !== null;
          transcript.push({
            toolUseId: block.id,
            tool: block.name,
            // execute inputs are kept whole — eval/plan/grade-plan.mjs parses
            // the {code} for service-op extraction; other tools stay sliced.
            input: block.name.endsWith("execute") || isPlainOperation ? rawInput : rawInput.slice(0, 600)
          });
        }
      }
    } else if (msg.type === "user" && Array.isArray(msg.message?.content)) {
      for (const block of msg.message.content) {
        if (block.type === "tool_result") {
          const entry = transcript.find((t) => t.toolUseId === block.tool_use_id);
          if (entry) {
            const text = Array.isArray(block.content)
              ? block.content.map((c) => c.text ?? "").join("")
              : String(block.content ?? "");
            entry.resultChars = text.length;
            entry.isError = Boolean(block.is_error);
            // execute RESULTS are kept whole (mirror of the execute-inputs-whole
            // precedent above) — eval/qa/analyze-composition.mjs reads them for
            // truncation footers and skill.run `calls` tallies. Bounded: the server
            // already caps execute results at ~6k tokens via truncateForModel
            // (src/policy/truncate.ts), so whole capture cannot balloon the file.
            const bareToolName = String(entry.tool).replace(/^mcp__[^_]+__/, "");
            if (entry.tool.endsWith("execute") || operationIdFromPlainTool(bareToolName)) entry.result = text;
          }
        }
      }
    } else if (msg.type === "result") {
      answer = msg.result ?? "";
      costUsd = msg.total_cost_usd;
      turns = msg.num_turns;
      usage = msg.usage;
      if (msg.is_error) resultError = msg.subtype ?? "agent result is_error";
    }
  }
  if (!answer && !resultError) {
    resultError = `no result message (exit ${res.status}); stderr: ${String(res.stderr).slice(0, 400)}`;
  }
  return { answer, transcript, costUsd, turns, usage, promptChars: prompt.length, error: resultError };
}

function surfaceMetrics(tools, instructions) {
  const serializedTools = JSON.stringify({ tools });
  const instructionsChars = String(instructions ?? "").length;
  const advertisedWireChars = serializedTools.length + instructionsChars;
  return {
    toolCount: tools.length,
    descriptionsChars: tools.reduce((sum, tool) => sum + String(tool.description ?? "").length, 0),
    inputSchemaChars: tools.reduce((sum, tool) => sum + JSON.stringify(tool.inputSchema ?? {}).length, 0),
    serializedToolsChars: serializedTools.length,
    instructionsChars,
    advertisedWireChars,
    estimatedAdvertisedWireTokens: Math.ceil(advertisedWireChars / 4),
    metricMeaning: "serialized MCP tool definitions plus server instructions; not consumed model context",
    surfaceSha256: sha256(`${instructions ?? ""}\n${serializedTools}`)
  };
}

async function preflight(port, { surface, searchTool, plainSurface }) {
  const url = `http://localhost:${port}/mcp`;
  const post = async (body) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify(body)
    });
    const text = await r.text();
    if (!r.ok) throw new Error(`${url} → HTTP ${r.status}: ${text.slice(0, 200)}`);
    const data = text.startsWith("event:") ? text.split("data: ")[1] : text;
    return JSON.parse(data.trim().split("\n")[0]);
  };
  const initialized = await post({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "run-qa", version: "0" } }
  });
  const list = await post({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  const upstreamTools = list.result?.tools ?? [];
  const names = upstreamTools.map((t) => t.name);
  const required = surface === "per-operation" ? ["execute"] : [searchTool, "execute"];
  for (const need of required) {
    if (!names.includes(need)) {
      throw new Error(
        `live server at :${port} exposes [${names.join(", ")}] — required tool "${need}" is missing. ` +
          `Wrong --variant for this build? (A→search per ADR-0001; B needs --search-tool against a code-shaped build)`
      );
    }
  }
  if (surface === "per-operation") {
    return {
      upstreamNames: names,
      exposedNames: plainSurface.tools.map((tool) => tool.name),
      metrics: { ...plainSurface.metrics, instructionsSha256: sha256(PLAIN_SERVER_INSTRUCTIONS) }
    };
  }
  return {
    upstreamNames: names,
    exposedNames: names,
    metrics: surfaceMetrics(upstreamTools, initialized.result?.instructions)
  };
}

async function main() {
  const args = process.argv.slice(2);
  const argVal = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const variant = (argVal("--variant") ?? "A").toUpperCase();
  if (!(variant in VARIANT_TOOL)) throw new Error(`--variant must be A or B, got ${variant}`);
  const searchTool = argVal("--search-tool") ?? VARIANT_TOOL[variant];
  const surface = argVal("--surface") ?? "search-execute";
  if (!SURFACES.has(surface)) throw new Error(`--surface must be search-execute or per-operation, got ${surface}`);
  if (surface === "search-execute" && !searchTool) {
    throw new Error(
      `variant ${variant} has no default tool since ADR-0001 (the code-shaped search is not registered top-level) — pass --search-tool <name> against a build that exposes one`
    );
  }
  const port = Number(argVal("--port") ?? 8788);
  const model = argVal("--model") ?? AGENT_MODEL;
  const judgeModel = argVal("--judge-model") ?? JUDGE_MODEL;
  const noJudge = args.includes("--no-judge");
  const serverRevision = argVal("--server-revision");
  const casesPath = argVal("--cases") ?? path.join(QA_DIR, "cases.json");
  const plainSurface = loadPlainOperationSurface();

  const battery = loadCases(casesPath);
  let cases = battery.cases;
  const ids = argVal("--ids");
  if (ids) {
    const want = new Set(ids.split(",").map((s) => s.trim()));
    cases = cases.filter((c) => want.has(c.id));
    const missing = [...want].filter((id) => !cases.some((c) => c.id === id));
    if (missing.length) throw new Error(`--ids not found in battery: ${missing.join(", ")}`);
  }
  const sampleN = argVal("--sample") ? Number(argVal("--sample")) : undefined;
  if (sampleN) cases = stratifiedSample(cases, sampleN);

  const preflightResult = await preflight(port, { surface, searchTool, plainSurface });
  console.log(
    `run-qa: surface ${surface} · variant ${variant}${surface === "search-execute" ? ` (search tool "${searchTool}")` : ""} · ${battery.contract ? `contract ${battery.contract} · ` : ""}${cases.length} cases · server :${port} · ${preflightResult.exposedNames.length} exposed tool(s) · agent ${model} · judge ${noJudge ? "OFF" : judgeModel}`
  );

  const tmpDir = mkdtempSync(path.join(os.tmpdir(), "qa-mcp-"));
  const mcpConfigPath = path.join(tmpDir, "mcp.json");
  const upstreamUrl = `http://localhost:${port}/mcp`;
  const mcpServerConfig =
    surface === "per-operation"
      ? {
          command: process.execPath,
          args: [path.join(QA_DIR, "plain-operation-harness.mjs"), "--upstream", upstreamUrl]
        }
      : { type: "http", url: upstreamUrl };
  writeFileSync(mcpConfigPath, JSON.stringify({ mcpServers: { raven: mcpServerConfig } }));
  const allowedTools =
    surface === "per-operation"
      ? plainSurface.tools.map((tool) => `mcp__raven__${tool.name}`)
      : [`mcp__raven__${searchTool}`, "mcp__raven__execute"];

  const rows = [];
  const startedAt = new Date().toISOString();
  try {
    for (const [i, c] of cases.entries()) {
      const t0 = Date.now();
      process.stdout.write(`[${i + 1}/${cases.length}] ${c.id} … `);
      const run = runAgent(c.question, { surface, searchTool, allowedTools, mcpConfigPath, model });
      const transcriptEvidence = run.answer
        ? buildTranscriptEvidence({ ...c, candidateAnswer: run.answer, transcript: run.transcript })
        : "";
      let verdict = null;
      if (!noJudge) {
        verdict = run.answer
          ? await judgeCase(
              { ...c, candidateAnswer: run.answer, transcript: run.transcript, transcriptEvidence },
              { model: judgeModel }
            )
          : {
              score: "error",
              missingFacts: [],
              wrongClaims: [],
              rationale: run.error ?? "empty answer",
              rubric: JUDGE_RUBRIC,
              packVersion: PACK_VERSION,
              promptSha256: null
            };
      }
      const durationMs = Date.now() - t0;
      rows.push({
        id: c.id,
        question: c.question,
        tags: c.tags,
        truth: {
          status: c.truth.status,
          ...(c.truth.asOf ? { asOf: c.truth.asOf } : {})
        },
        answer: run.answer,
        transcript: run.transcript,
        agent: {
          model,
          turns: run.turns,
          costUsd: run.costUsd,
          usage: run.usage ?? null,
          promptChars: run.promptChars,
          error: run.error ?? null
        },
        verdict,
        evidencePack: {
          packVersion: PACK_VERSION,
          chars: transcriptEvidence.length,
          sha256: transcriptEvidence ? sha256(transcriptEvidence) : null
        },
        durationMs
      });
      console.log(
        `${verdict ? verdict.score : "answered"} (${run.transcript.length} tool calls, ${Math.round(durationMs / 1000)}s)`
      );
    }
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }

  const summary = noJudge ? null : summarize(rows);
  const stampSuffix = surface === "per-operation" ? "perOperation" : `variant${variant}`;
  const stamp = `${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}-${stampSuffix}`;
  const resultsDir = path.join(QA_DIR, "results");
  mkdirSync(resultsDir, { recursive: true });
  const outPath = path.join(resultsDir, `${stamp}.json`);
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        meta: {
          variant: surface === "search-execute" ? variant : null,
          surface,
          searchTool: surface === "search-execute" ? searchTool : null,
          port,
          model,
          judgeModel: noJudge ? null : judgeModel,
          judgeRubric: noJudge ? null : JUDGE_RUBRIC,
          packVersion: PACK_VERSION,
          casesPath,
          caseContract: battery.contract ?? null,
          sampleN: sampleN ?? null,
          ids: ids ?? null,
          startedAt,
          finishedAt: new Date().toISOString(),
          caseCount: rows.length,
          inputSnapshot: {
            casesSha256: sha256(JSON.stringify(cases)),
            caseIdsSha256: sha256(JSON.stringify(cases.map((c) => c.id))),
            manifestGeneratedAt: plainSurface.metrics.manifestGeneratedAt,
            operationIdsSha256: plainSurface.metrics.operationIdsSha256,
            operationEntriesSha256: plainSurface.metrics.operationEntriesSha256
          },
          sourceIdentity: sourceIdentity(serverRevision),
          toolSurface: preflightResult.metrics,
          totalAgentCostUsd: rows.reduce((s, r) => s + (r.agent.costUsd ?? 0), 0),
          totalJudgeCostUsd: rows.reduce((s, r) => s + (r.verdict?.costUsd ?? 0), 0),
          totalCostUsd: rows.reduce((s, r) => s + (r.agent.costUsd ?? 0) + (r.verdict?.costUsd ?? 0), 0)
        },
        summary,
        rows
      },
      null,
      2
    ) + "\n"
  );
  console.log(`\nwrote ${outPath}`);
  if (summary) {
    console.log("\n" + formatSummaryTable(summary));
  }
}

await main();
