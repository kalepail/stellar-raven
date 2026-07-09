#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { mintDemoCookie } from "../src/demo/auth.ts";

const DEFAULT_MODELS = [
  "openai/gpt-5.4",
  "anthropic/claude-sonnet-4.6",
  "openai/gpt-5.4-mini",
  "anthropic/claude-haiku-4.5",
  "google/gemini-3.5-flash",
  "xai/grok-4.3",
  "@cf/moonshotai/kimi-k2.7-code",
  "anthropic/claude-fable-5",
  "@cf/openai/gpt-oss-120b"
];

const PROMPTS = [
  {
    id: "rpc-simulate",
    expectTools: true,
    text: "Which Stellar RPC method should I use to simulate a Soroban contract invocation before submitting it, and what does it return?"
  },
  {
    id: "soroswap-builder",
    expectTools: true,
    text: "What is Soroswap on Stellar, and who builds it? Keep it to 3 bullets."
  },
  {
    id: "open-rfps",
    expectTools: true,
    text: "Are there any open SCF RFPs right now related to passkeys or smart accounts? Use current data and say what it is current as of."
  },
  {
    id: "activity-leaderboard",
    expectTools: true,
    text: "Which Stellar projects are most active by development activity right now? Give top 5 with the activity basis."
  },
  {
    id: "no-market-hallucination",
    expectTools: false,
    text: "What is the current XLM price and 24-hour trading volume? If this gateway cannot provide current market data, say so plainly and do not invent numbers."
  },
  {
    id: "skill-routing",
    expectTools: true,
    text: "I'm writing a Soroban smart contract and need the build/test/deploy workflow. Show the practical sequence."
  },
  {
    id: "zk-repos",
    expectTools: true,
    text: "Find current high-signal ZK Soroban repos to study and include activity caveats."
  },
  {
    id: "wallet-recovery",
    expectTools: true,
    text: "Search for Stellar wallet recovery patterns, then use whatever exact operation you found to answer. Do not assume operation names."
  }
];

const args = parseArgs(process.argv.slice(2));
const runId = args.runId ?? new Date().toISOString().replaceAll(":", "").replaceAll(".", "");
const models = args.models?.length ? args.models : DEFAULT_MODELS;
const reasoningEfforts = args.reasoningEfforts?.length ? args.reasoningEfforts : [null];
const prompts = args.prompts?.length ? PROMPTS.filter((prompt) => args.prompts.includes(prompt.id)) : PROMPTS;
const openAiApiMode = args.openAiApiMode ?? null;
const repeats = Number(args.repeats ?? 1);
const portBase = Number(args.portBase ?? 8890);
const outDir = args.outDir ?? path.join("research", "gauntlets");
const timeoutMs = Number(args.timeoutMs ?? 150_000);

if (!Number.isInteger(repeats) || repeats < 1) throw new Error("--repeats must be a positive integer");

await mkdir(outDir, { recursive: true });

const devVars = await readDevVars(".dev.vars").catch(() => ({}));
const demoSecret = process.env.MCP_SERVER_SECRET ?? devVars.MCP_SERVER_SECRET;
if (!demoSecret) {
  console.warn("[gauntlet] MCP_SERVER_SECRET unavailable; falling back to loopback dev bypass subject and throttle.");
}

const results = [];
for (let modelIndex = 0; modelIndex < models.length; modelIndex += 1) {
  const model = models[modelIndex];
  for (let reasoningIndex = 0; reasoningIndex < reasoningEfforts.length; reasoningIndex += 1) {
    const reasoningEffort = reasoningEfforts[reasoningIndex];
    const port = portBase + modelIndex * reasoningEfforts.length + reasoningIndex;
    const server = await startWrangler({ model, reasoningEffort, openAiApiMode, port });
    try {
      const subject = `gauntlet:${runId}:${model}:${reasoningEffortLabel(reasoningEffort)}`;
      const cookie = demoSecret ? await mintDemoCookie(demoSecret, subject) : "";
      for (let repeat = 1; repeat <= repeats; repeat += 1) {
        for (const prompt of prompts) {
          const label = `${model} :: reasoning=${reasoningEffortLabel(reasoningEffort)} :: ${prompt.id} :: ${repeat}/${repeats}`;
          console.log(`[gauntlet] ${label}`);
          const result = await runPrompt({
            url: `http://localhost:${port}/demo/chat`,
            cookie,
            model,
            reasoningEffort,
            prompt,
            repeat,
            timeoutMs
          });
          results.push(result);
          await writeArtifacts({ runId, outDir, prompts, results });
          console.log(
            `[gauntlet] ${label} -> ${result.terminal} ${result.durationMs}ms tools=${result.searchCalls}/${result.executeCalls} pass=${result.pass.overall}`
          );
        }
      }
    } finally {
      await stopWrangler(server);
    }
  }
}

await writeArtifacts({ runId, outDir, prompts, results });
console.log(`[gauntlet] wrote ${path.join(outDir, `${runId}.json`)}`);
console.log(`[gauntlet] wrote ${path.join(outDir, `${runId}-summary.md`)}`);

async function startWrangler({ model, reasoningEffort, openAiApiMode, port }) {
  const vars = [
    "DEMO_AI_GATEWAY_ID:stellar-raven-demo",
    `DEMO_MODEL_OVERRIDE:${model}`,
    ...(openAiApiMode ? [`DEMO_OPENAI_API_MODE:${openAiApiMode}`] : []),
    ...(reasoningEffort ? [`DEMO_REASONING_EFFORT_OVERRIDE:${reasoningEffort}`] : [])
  ];
  const child = spawn(
    "npx",
    [
      "wrangler",
      "dev",
      "--host",
      "localhost",
      "--port",
      String(port),
      "--inspector-port",
      String(port + 1000),
      "--show-interactive-dev-session",
      "false",
      ...vars.flatMap((v) => ["--var", v])
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["ignore", "pipe", "pipe"]
    }
  );
  const output = [];
  child.stdout.on("data", (chunk) => output.push(String(chunk)));
  child.stderr.on("data", (chunk) => output.push(String(chunk)));
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `wrangler exited before ready for ${model} reasoning=${reasoningEffortLabel(reasoningEffort)}:\n${output.join("").slice(-4000)}`
      );
    }
    if (await canGet(`http://localhost:${port}/demo`)) return { child, output, model, port };
    await sleep(500);
  }
  await stopWrangler({ child, output, model, port });
  throw new Error(
    `wrangler did not become ready for ${model} reasoning=${reasoningEffortLabel(reasoningEffort)}:\n${output.join("").slice(-4000)}`
  );
}

async function stopWrangler(server) {
  if (!server?.child || server.child.exitCode !== null) return;
  server.child.kill("SIGTERM");
  const timeout = sleep(5_000).then(() => "timeout");
  const exited = once(server.child, "exit").then(() => "exit");
  if ((await Promise.race([timeout, exited])) === "timeout") {
    server.child.kill("SIGKILL");
    await once(server.child, "exit").catch(() => {});
  }
}

async function runPrompt({ url, cookie, model, reasoningEffort, prompt, repeat, timeoutMs }) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const frames = [];
  let responseStatus = 0;
  let responseText = "";
  let parseError = null;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: new URL(url).origin,
        "sec-fetch-site": "same-origin",
        ...(cookie ? { cookie } : {})
      },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt.text }] }),
      signal: controller.signal
    });
    responseStatus = response.status;
    if (!response.ok || !response.body) {
      responseText = await response.text();
    } else {
      await readSse(response.body, (frame) => frames.push({ ...frame, atMs: Date.now() - startedAt }));
    }
  } catch (error) {
    parseError = error instanceof Error ? error.message : String(error);
  } finally {
    clearTimeout(timer);
  }

  const tokenText = frames.filter((f) => f.type === "token").map((f) => f.text).join("");
  const thinkingChars = frames.filter((f) => f.type === "thinking").reduce((sum, f) => sum + String(f.text ?? "").length, 0);
  const tools = frames.filter((f) => f.type === "tool-start" || f.type === "tool-result");
  const searchStarts = tools.filter((f) => f.type === "tool-start" && f.tool === "search");
  const executeStarts = tools.filter((f) => f.type === "tool-start" && f.tool === "execute");
  const toolFailures = tools.filter((f) => f.type === "tool-result" && f.ok === false);
  const errors = frames.filter((f) => f.type === "error");
  const done = frames.find((f) => f.type === "done");
  const terminal = parseError ? "client-error" : done ? `done:${done.reason}` : errors.length ? "error" : `http:${responseStatus}`;
  const firstMeaningful = frames.find((f) => f.type !== "ready");
  const pass = {
    http: responseStatus === 200,
    terminal: Boolean(done) && done.reason === "stop" && errors.length === 0 && !parseError,
    firstFrame: (frames[0]?.atMs ?? Infinity) < 2_000,
    latency: Date.now() - startedAt < 120_000,
    finalAnswer: tokenText.trim().length > 0,
    expectedTools: prompt.expectTools ? searchStarts.length >= 1 : true,
    noToolFailures: toolFailures.length === 0,
    noMarketNumber:
      prompt.id !== "no-market-hallucination" ||
      !/\$?\b\d+(?:\.\d+)?\s*(?:usd|xlm|volume|billion|million|m\b|bn\b)/i.test(tokenText)
  };
  pass.overall = Object.values(pass).every(Boolean);

  return {
    runId,
    model,
    reasoningEffort: reasoningEffortLabel(reasoningEffort),
    promptId: prompt.id,
    prompt: prompt.text,
    repeat,
    responseStatus,
    terminal,
    durationMs: Date.now() - startedAt,
    firstMeaningfulMs: firstMeaningful?.atMs ?? null,
    tokenChars: tokenText.length,
    thinkingChars,
    searchCalls: searchStarts.length,
    executeCalls: executeStarts.length,
    toolFailures: toolFailures.length,
    errors: errors.map((f) => f.message),
    parseError,
    responseText,
    finalText: tokenText.slice(0, 4000),
    frames,
    pass
  };
}

async function readSse(body, onFrame) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let index;
    while ((index = buffer.indexOf("\n\n")) >= 0) {
      const event = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      const data = event
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");
      if (!data) continue;
      onFrame(JSON.parse(data));
    }
  }
}

async function writeArtifacts({ runId, outDir, prompts, results }) {
  const jsonPath = path.join(outDir, `${runId}.json`);
  await writeFile(jsonPath, `${JSON.stringify({ runId, prompts, results }, null, 2)}\n`);
  const summaryPath = path.join(outDir, `${runId}-summary.md`);
  await writeFile(summaryPath, renderSummary({ runId, results }));
}

function renderSummary({ runId, results }) {
  const byCell = new Map();
  for (const result of results) {
    const key = `${result.model}@@${result.reasoningEffort ?? "default"}`;
    const entry = byCell.get(key) ?? {
      model: result.model,
      reasoningEffort: result.reasoningEffort ?? "default",
      runs: 0,
      pass: 0,
      terminal: 0,
      failures: 0,
      durations: [],
      firstMeaningful: [],
      toolFailures: 0,
      errors: []
    };
    entry.runs += 1;
    if (result.pass.overall) entry.pass += 1;
    if (result.pass.terminal) entry.terminal += 1;
    if (!result.pass.overall) entry.failures += 1;
    entry.durations.push(result.durationMs);
    if (result.firstMeaningfulMs !== null) entry.firstMeaningful.push(result.firstMeaningfulMs);
    entry.toolFailures += result.toolFailures;
    entry.errors.push(...result.errors, ...(result.parseError ? [result.parseError] : []));
    byCell.set(key, entry);
  }
  const rows = [...byCell.values()].map((entry) => {
    const p50 = percentile(entry.durations, 0.5);
    const p95 = percentile(entry.durations, 0.95);
    const firstP50 = percentile(entry.firstMeaningful, 0.5);
    return `| \`${entry.model}\` | \`${entry.reasoningEffort}\` | ${entry.pass}/${entry.runs} | ${entry.terminal}/${entry.runs} | ${p50} | ${p95} | ${firstP50} | ${entry.toolFailures} |`;
  });
  const failures = results
    .filter((result) => !result.pass.overall)
    .map(
      (result) =>
        `- \`${result.model}\` / reasoning=\`${result.reasoningEffort ?? "default"}\` / \`${result.promptId}\` / repeat ${result.repeat}: ${result.terminal}, ${result.durationMs}ms, tools ${result.searchCalls}/${result.executeCalls}, errors=${JSON.stringify(result.errors.concat(result.parseError ? [result.parseError] : []))}`
    );
  return `# Demo Model Gauntlet ${runId}

Generated by \`scripts/run-demo-model-gauntlet.mjs\`.

## Summary

| Model | Reasoning | Overall Pass | Clean Terminal | p50 ms | p95 ms | p50 first meaningful ms | Tool Failures |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
${rows.join("\n")}

## Failures

${failures.length ? failures.join("\n") : "- None"}
`;
}

function reasoningEffortLabel(reasoningEffort) {
  return reasoningEffort ?? "default";
}

function percentile(values, p) {
  if (!values.length) return "";
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p));
  return sorted[index];
}

async function canGet(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function readDevVars(file) {
  const text = await readFile(file, "utf8");
  const vars = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--model") {
      out.models ??= [];
      out.models.push(argv[++i]);
    } else if (arg === "--models") {
      out.models = argv[++i].split(",").map((model) => model.trim()).filter(Boolean);
    } else if (arg === "--reasoning-efforts") {
      out.reasoningEfforts = argv[++i]
        .split(",")
        .map((effort) => effort.trim())
        .filter(Boolean)
        .map((effort) => (effort === "default" ? null : effort));
    } else if (arg === "--reasoning-effort") {
      const effort = argv[++i].trim();
      out.reasoningEfforts ??= [];
      out.reasoningEfforts.push(effort === "default" ? null : effort);
    } else if (arg === "--openai-api-mode") {
      out.openAiApiMode = argv[++i].trim();
    } else if (arg === "--prompt") {
      out.prompts ??= [];
      out.prompts.push(argv[++i].trim());
    } else if (arg === "--prompts") {
      out.prompts = argv[++i]
        .split(",")
        .map((prompt) => prompt.trim())
        .filter(Boolean);
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      out[key] = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return out;
}
