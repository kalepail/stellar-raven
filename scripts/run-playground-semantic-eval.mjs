#!/usr/bin/env node
/**
 * Drive QA golden cases through the public playground's real SSE turn, then
 * grade the completed assistant answer with the existing QA judge contract.
 *
 * This deliberately complements (not replaces) run-demo-model-gauntlet.mjs:
 * the gauntlet is a fast transport/tool-loop smoke, while this lane measures
 * end-to-end answer quality over the same golden, evidence-pack, and judge
 * semantics as eval/qa/run-qa.mjs.
 *
 * Results are local-only under eval/local-lanes/ (gitignored). A live request
 * invokes the playground model, so --confirm-paid is required. --full is an
 * additional explicit acknowledgement before selecting the complete battery.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { mintDemoCookie } from "../src/demo/auth.ts";
import { DEMO_CAPS } from "../src/demo/budget.ts";
import { buildTranscriptEvidence, judgeCase, JUDGE_MODEL, JUDGE_RUBRIC } from "../eval/qa/judge.mjs";
import { PACK_VERSION } from "../eval/qa/evidence-pack.mjs";
import { QA_DIR, formatSummaryTable, loadCases, summarize } from "../eval/qa/lib.mjs";

const DEFAULT_SAMPLE = 5;
const DEFAULT_SEED = "playground-semantic-v1";
const DEFAULT_TIMEOUT_MS = 150_000;
const DEFAULT_OUT_DIR = path.join("eval", "local-lanes", "playground-semantic");
const MAX_CASES_PER_RUN_SUBJECT = DEMO_CAPS.chatsPerHour;

function usage() {
  return `Usage: npm run eval:playground -- [options]

Runs QA cases through the actual POST /playground/chat SSE route, captures the
assistant final text and tool trace, then grades it through eval/qa/judge.mjs.
The default selection is a seeded, stratified 5-case sample. Live requests use
the playground model, so --confirm-paid is required; --full also requires it.

Options:
  --url URL             Local playground base URL (default http://localhost:8787)
  --cases PATH          QA case file (default eval/qa/cases.json)
  --ids A,B,C           Exact case ids to run (cannot combine with --sample/--full)
  --sample N            Seeded stratified sample size (default ${DEFAULT_SAMPLE})
  --seed VALUE          Deterministic selection seed (default ${DEFAULT_SEED})
  --full                Select every case only when the selected contract has <=${MAX_CASES_PER_RUN_SUBJECT} cases
  --confirm-paid        Allow model-backed HTTP turns (required unless --dry-run)
  --no-judge            Capture turns but skip the paid QA judge call
  --judge-model NAME    Existing QA judge model (default ${JUDGE_MODEL})
  --timeout-ms N        Per-turn client timeout in milliseconds (default ${DEFAULT_TIMEOUT_MS})
  --out-dir PATH        Local-only results directory (default ${DEFAULT_OUT_DIR})
  --dry-run             Validate case selection only; sends no HTTP/model request
  --preflight           Verify signed-cookie route access with an invalid body; no model request
  --help                Show this help

Examples:
  npm run eval:playground -- --dry-run
  npm run eval:playground -- --confirm-paid --sample 5 --seed baseline-a
  npm run eval:playground -- --confirm-paid --ids q-aas-burn-clawback-redemption-mechanics
  npm run eval:playground -- --confirm-paid --cases eval/qa/corpus/live/live-cases.json --full
`;
}

function parseArgs(argv) {
  const out = {
    sample: DEFAULT_SAMPLE,
    sampleExplicit: false,
    seed: DEFAULT_SEED,
    timeoutMs: DEFAULT_TIMEOUT_MS
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help") out.help = true;
    else if (arg === "--full" || arg === "--confirm-paid" || arg === "--no-judge" || arg === "--dry-run" || arg === "--preflight") {
      out[arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = true;
    } else if (["--url", "--cases", "--ids", "--sample", "--seed", "--judge-model", "--timeout-ms", "--out-dir"].includes(arg)) {
      const value = argv[++index];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      out[arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
      if (arg === "--sample") out.sampleExplicit = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  out.sample = Number(out.sample);
  out.timeoutMs = Number(out.timeoutMs);
  if (!Number.isInteger(out.sample) || out.sample <= 0) throw new Error(`--sample must be a positive integer, got ${out.sample}`);
  if (!Number.isInteger(out.timeoutMs) || out.timeoutMs <= 0) throw new Error(`--timeout-ms must be a positive integer, got ${out.timeoutMs}`);
  return out;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function seededStratifiedSample(cases, count, seed) {
  if (count >= cases.length) return [...cases].sort((a, b) => a.id.localeCompare(b.id));
  const strata = new Map();
  for (const item of cases) {
    const key = item.tags?.service ?? "unknown";
    const list = strata.get(key) ?? [];
    list.push(item);
    strata.set(key, list);
  }
  const keys = [...strata.keys()].sort();
  for (const key of keys) {
    strata.get(key).sort((a, b) => sha256(`${seed}\0${a.id}`).localeCompare(sha256(`${seed}\0${b.id}`)) || a.id.localeCompare(b.id));
  }

  const allocation = new Map();
  const remainders = [];
  let assigned = 0;
  for (const key of keys) {
    const exact = (strata.get(key).length / cases.length) * count;
    const base = Math.floor(exact);
    allocation.set(key, base);
    assigned += base;
    remainders.push({ key, remainder: exact - base });
  }
  remainders.sort((a, b) => b.remainder - a.remainder || a.key.localeCompare(b.key));
  for (let index = 0; assigned < count && index < remainders.length; index += 1, assigned += 1) {
    allocation.set(remainders[index].key, allocation.get(remainders[index].key) + 1);
  }
  for (const key of keys) {
    if (allocation.get(key) > 0) continue;
    const donor = keys.reduce((best, candidate) => (allocation.get(candidate) > allocation.get(best) ? candidate : best), keys[0]);
    if (allocation.get(donor) > 1) {
      allocation.set(donor, allocation.get(donor) - 1);
      allocation.set(key, 1);
    }
  }
  return keys.flatMap((key) => strata.get(key).slice(0, allocation.get(key))).sort((a, b) => a.id.localeCompare(b.id));
}

function selectCases(battery, args) {
  if (args.ids && (args.full || args.sampleExplicit)) {
    throw new Error("--ids cannot be combined with --sample or --full");
  }
  if (args.full && args.sampleExplicit) throw new Error("--full cannot be combined with --sample");
  if (args.ids) {
    const wanted = new Set(args.ids.split(",").map((value) => value.trim()).filter(Boolean));
    const cases = battery.cases.filter((item) => wanted.has(item.id));
    const missing = [...wanted].filter((id) => !cases.some((item) => item.id === id));
    if (missing.length) throw new Error(`--ids not found in battery: ${missing.join(", ")}`);
    return cases;
  }
  return args.full ? [...battery.cases].sort((a, b) => a.id.localeCompare(b.id)) : seededStratifiedSample(battery.cases, args.sample, args.seed);
}

function ensureLoopbackUrl(rawUrl) {
  const url = new URL(rawUrl);
  if (!new Set(["localhost", "127.0.0.1", "[::1]", "::1"]).has(url.hostname)) {
    throw new Error(`--url must be a loopback URL; refusing to run a paid playground evaluation against ${url.hostname}`);
  }
  url.pathname = url.pathname.replace(/\/$/, "") || "/";
  return url;
}

function frameText(frame) {
  return typeof frame.output === "string" ? frame.output : JSON.stringify(frame.output ?? null);
}

async function readSse(body, onFrame, onParseError) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const consume = () => {
    const match = /\r?\n\r?\n/.exec(buffer);
    if (!match || match.index === undefined) return false;
    const event = buffer.slice(0, match.index);
    buffer = buffer.slice(match.index + match[0].length);
    const data = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data) return true;
    try {
      onFrame(JSON.parse(data));
    } catch (error) {
      onParseError(`invalid SSE JSON: ${error instanceof Error ? error.message : String(error)}; payload=${data.slice(0, 300)}`);
    }
    return true;
  };
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    while (consume()) {
      // Drain every complete event in this chunk before awaiting another read.
    }
  }
  buffer += decoder.decode();
  while (consume()) {
    // Drain a final complete event after the stream closes.
  }
  if (buffer.trim()) onParseError(`unterminated SSE event: ${buffer.slice(0, 300)}`);
}

async function runCase(item, { endpoint, timeoutMs, cookie }) {
  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const frames = [];
  const transcript = [];
  const sseErrors = [];
  let responseStatus = null;
  let httpError = null;
  let clientError = null;
  let firstFrameMs = null;
  let firstMeaningfulMs = null;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: new URL(endpoint).origin,
        "sec-fetch-site": "same-origin",
        cookie
      },
      body: JSON.stringify({ messages: [{ role: "user", content: item.question }] }),
      signal: controller.signal
    });
    responseStatus = response.status;
    if (!response.ok || !response.body) {
      httpError = (await response.text()).slice(0, 2_000) || `HTTP ${response.status} with no response body`;
    } else {
      await readSse(
        response.body,
        (frame) => {
          const atMs = Date.now() - started;
          const captured = { ...frame, atMs };
          frames.push(captured);
          if (firstFrameMs === null) firstFrameMs = atMs;
          if (firstMeaningfulMs === null && frame.type !== "ready") firstMeaningfulMs = atMs;
          if (frame.type === "tool-start") {
            // Match the QA harness's MCP transcript convention. The plan grader
            // recognizes mcp__*__search and any *execute alias; the evidence
            // pack consumes the full execute result without a playground fork.
            transcript.push({ toolUseId: frame.id, tool: `mcp__playground__${frame.tool}`, input: JSON.stringify(frame.input ?? {}) });
          } else if (frame.type === "tool-result") {
            const entry = transcript.find((candidate) => candidate.toolUseId === frame.id);
            if (!entry) {
              sseErrors.push(`tool result ${frame.id} arrived without a matching tool-start`);
              return;
            }
            const result = frameText(frame);
            entry.resultChars = result.length;
            entry.isError = !frame.ok;
            // Keep full result text for every tool. Execute text remains in its
            // original JSON/string form so evidence-pack.mjs can parse it just
            // as it parses the existing QA runner's execute transcript.
            entry.result = result;
          }
        },
        (message) => sseErrors.push(message)
      );
    }
  } catch (error) {
    clientError = error instanceof Error ? error.message : String(error);
  } finally {
    clearTimeout(timeout);
  }
  const finalText = frames.filter((frame) => frame.type === "token").map((frame) => frame.text ?? "").join("");
  const done = frames.find((frame) => frame.type === "done");
  const errorFrames = frames.filter((frame) => frame.type === "error").map((frame) => frame.message);
  const toolCalls = ["search", "execute"].reduce((summary, tool) => {
    const startedCount = transcript.filter((entry) => entry.tool === `mcp__playground__${tool}`).length;
    const completed = transcript.filter((entry) => entry.tool === `mcp__playground__${tool}` && "isError" in entry);
    summary[tool] = {
      started: startedCount,
      ok: completed.filter((entry) => !entry.isError).length,
      failed: completed.filter((entry) => entry.isError).length,
      unfinished: startedCount - completed.length
    };
    return summary;
  }, {});
  return {
    answer: finalText,
    transcript,
    frames,
    toolCalls,
    finishReason: done?.reason ?? null,
    responseStatus,
    latencyMs: Date.now() - started,
    firstFrameMs,
    firstMeaningfulMs,
    httpError,
    sseErrors: [...errorFrames, ...sseErrors],
    clientError
  };
}

async function readDevVars(file) {
  const text = await readFile(file, "utf8");
  const vars = {};
  for (const line of text.split(/\r?\n/)) {
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line.trim());
    if (!match || line.trimStart().startsWith("#")) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[match[1]] = value;
  }
  return vars;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage());
    return;
  }
  const battery = loadCases(args.cases ?? path.join(QA_DIR, "cases.json"));
  const cases = selectCases(battery, args);
  const casesPath = args.cases ?? path.join(QA_DIR, "cases.json");
  if (cases.length > MAX_CASES_PER_RUN_SUBJECT) {
    throw new Error(
      `Selected ${cases.length} cases, exceeding the one-subject playground cap of ${MAX_CASES_PER_RUN_SUBJECT} chats/hour. ` +
        `Use --sample ${MAX_CASES_PER_RUN_SUBJECT}, a <=${MAX_CASES_PER_RUN_SUBJECT}-case named contract, or an explicit --ids shard; this harness never rotates subjects to bypass the real rate limit.`
    );
  }
  console.log(
    `playground semantic eval: ${battery.contract ? `contract ${battery.contract} · ` : ""}${cases.length} case(s) · ${args.full ? "full" : args.ids ? "ids" : `sample ${args.sample}, seed ${args.seed}`} · judge ${args.noJudge ? "OFF" : args.judgeModel ?? JUDGE_MODEL}`
  );
  console.log(`case ids: ${cases.map((item) => item.id).join(", ")}`);
  if (args.dryRun) {
    console.log("dry-run complete: no HTTP request, playground model call, or judge call was made.");
    return;
  }
  const baseUrl = ensureLoopbackUrl(args.url ?? "http://localhost:8787");
  const endpoint = new URL("playground/chat", `${baseUrl.href.endsWith("/") ? baseUrl.href : `${baseUrl.href}/`}`).href;
  // Do not consume the shared dev-loopback throttle bucket. This is still the
  // real cookie-authenticated route and its ordinary per-subject rate limit;
  // the cookie is only minted for a loopback run and never logged or saved.
  const devVars = await readDevVars(".dev.vars").catch(() => ({}));
  const demoSecret = process.env.MCP_SERVER_SECRET ?? devVars.MCP_SERVER_SECRET;
  if (!demoSecret) {
    throw new Error("MCP_SERVER_SECRET is required to mint the run-scoped local evaluation cookie; refusing to fall back to the shared dev-loopback throttle bucket.");
  }
  const runId = `${new Date().toISOString().replace(/[:.]/g, "-")}-${crypto.randomUUID()}`;
  const cookie = await mintDemoCookie(demoSecret, `playground-semantic:${runId}`);
  if (args.preflight) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: new URL(endpoint).origin,
        "sec-fetch-site": "same-origin",
        cookie
      },
      // Deliberately invalid before the route's throttle/model stage.
      body: "{}"
    });
    const text = await response.text();
    if (response.status !== 400) {
      throw new Error(`playground preflight expected HTTP 400 before model execution, got ${response.status}: ${text.slice(0, 300)}`);
    }
    console.log("preflight complete: signed cookie reached body validation (HTTP 400); no throttle or model request was made.");
    return;
  }
  if (!args.confirmPaid) {
    throw new Error("Refusing a model-backed playground evaluation without --confirm-paid. Use --dry-run or --preflight to validate for free.");
  }
  const judgeModel = args.judgeModel ?? JUDGE_MODEL;
  const rows = [];
  const startedAt = new Date().toISOString();
  for (const [index, item] of cases.entries()) {
    process.stdout.write(`[${index + 1}/${cases.length}] ${item.id} … `);
    const run = await runCase(item, { endpoint, timeoutMs: args.timeoutMs, cookie });
    const transcriptEvidence = run.answer
      ? buildTranscriptEvidence({ ...item, candidateAnswer: run.answer, transcript: run.transcript })
      : "";
    const verdict = args.noJudge
      ? null
      : run.answer
        ? await judgeCase({ ...item, candidateAnswer: run.answer, transcript: run.transcript, transcriptEvidence }, { model: judgeModel })
        : {
            score: "error",
            missingFacts: [],
            wrongClaims: [],
            rationale:
              run.clientError ||
              run.httpError ||
              run.sseErrors.join("; ") ||
              "stream ended without an assistant final text or terminal error frame",
            rubric: JUDGE_RUBRIC,
            packVersion: PACK_VERSION,
            promptSha256: null
          };
    rows.push({
      id: item.id,
      question: item.question,
      tags: item.tags,
      truth: {
        status: item.truth.status,
        ...(item.truth.asOf ? { asOf: item.truth.asOf } : {})
      },
      answer: run.answer,
      transcript: run.transcript,
      frames: run.frames,
      toolCalls: run.toolCalls,
      finishReason: run.finishReason,
      responseStatus: run.responseStatus,
      latencyMs: run.latencyMs,
      firstFrameMs: run.firstFrameMs,
      firstMeaningfulMs: run.firstMeaningfulMs,
      httpError: run.httpError,
      sseErrors: run.sseErrors,
      clientError: run.clientError,
      verdict,
      evidencePack: {
        packVersion: PACK_VERSION,
        chars: transcriptEvidence.length,
        sha256: transcriptEvidence ? sha256(transcriptEvidence) : null
      }
    });
    console.log(`${verdict?.score ?? "captured"} (${run.toolCalls.search.started} search, ${run.toolCalls.execute.started} execute, ${Math.round(run.latencyMs / 1000)}s)`);
  }
  const summary = args.noJudge ? null : summarize(rows);
  const outDir = args.outDir ?? DEFAULT_OUT_DIR;
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${runId}-playground-semantic.json`);
  await writeFile(
    outPath,
    `${JSON.stringify(
      {
        meta: {
          lane: "playground-semantic-v1",
          transport: "POST /playground/chat SSE",
          authentication: "run-scoped signed demo cookie (loopback only)",
          runId,
          endpoint,
          casesPath,
          caseContract: battery.contract ?? null,
          caseCount: rows.length,
          selection: args.ids ? { ids: args.ids } : args.full ? { full: true } : { sample: args.sample, seed: args.seed },
          judgeModel: args.noJudge ? null : judgeModel,
          judgeRubric: args.noJudge ? null : JUDGE_RUBRIC,
          packVersion: PACK_VERSION,
          startedAt,
          finishedAt: new Date().toISOString()
        },
        summary,
        rows
      },
      null,
      2
    )}\n`
  );
  console.log(`\nwrote ${outPath}`);
  if (summary) console.log(`\n${formatSummaryTable(summary)}`);
}

await main();
