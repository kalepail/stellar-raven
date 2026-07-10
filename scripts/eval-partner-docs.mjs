#!/usr/bin/env node
/**
 * Read-only retrieval comparison for allowlisted public partner documentation.
 *
 * Candidate URLs are fixed in eval/partner-docs/cases.json and must pass the
 * code-owned allowlist below. The harness never calls partner MCP servers and
 * never invokes partner APIs described by the documents.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CASES_PATH = resolve(ROOT, "eval/partner-docs/cases.json");
const MAX_DOC_BYTES = 256 * 1024;
const DEFAULT_TIMEOUT_MS = 8_000;

const OPERATION_CALLS = new Map([
  ["stellarDocs.search_docs", "stellarDocs.search_docs"],
  ["stellarDocs.search_rpc_horizon_data_docs", "stellarDocs.search_rpc_horizon_data_docs"],
  ["stellarDocs.search_sdk_cli_tools_docs", "stellarDocs.search_sdk_cli_tools_docs"]
]);
const SKILL_IDS = new Set([
  "skills.openzeppelin-stellar.setup-stellar-contracts",
  "skills.openzeppelin-stellar.develop-secure-contracts"
]);

const PROMPT_SIGNAL_PATTERNS = [
  /ignore\s+(?:all\s+)?previous\s+instructions/iu,
  /(?:system|developer)\s+prompt/iu,
  /reveal\s+(?:your\s+)?(?:secrets?|credentials?|api\s*keys?)/iu,
  /(?:call|invoke|execute)\s+(?:this\s+)?tool/iu,
  /you\s+are\s+(?:chatgpt|an?\s+assistant)/iu
];

function parseArgs(argv) {
  const args = { json: false, selfTest: false, ravenUrl: undefined, timeoutMs: DEFAULT_TIMEOUT_MS };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--json") args.json = true;
    else if (argv[i] === "--self-test") args.selfTest = true;
    else if (argv[i] === "--raven-url") args.ravenUrl = argv[++i];
    else if (argv[i] === "--timeout-ms") args.timeoutMs = Number(argv[++i]);
    else throw new Error(`unknown argument: ${argv[i]}`);
  }
  if (!Number.isInteger(args.timeoutMs) || args.timeoutMs < 250 || args.timeoutMs > 30_000) {
    throw new Error("--timeout-ms must be an integer from 250 to 30000");
  }
  return args;
}

export function normalizeText(value) {
  return String(value)
    .normalize("NFKC")
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_#>|[\](){}:,.;'\"/\\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("en-US");
}

export function matchFacts(text, facts) {
  const normalized = normalizeText(text);
  const matched = facts.map((alternatives) => alternatives.some((term) => containsBoundedTerm(normalized, term)));
  return {
    matched: matched.filter(Boolean).length,
    total: facts.length,
    recall: facts.length ? matched.filter(Boolean).length / facts.length : 0,
    detail: facts.map((alternatives, index) => ({ alternatives, matched: matched[index] }))
  };
}

function containsBoundedTerm(normalizedText, term) {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) return false;
  const phrase = normalizedTerm
    .split(" ")
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
  return new RegExp(`(?:^|[^\\p{L}\\p{N}_])(?:${phrase})(?=$|[^\\p{L}\\p{N}_])`, "iu").test(normalizedText);
}

export function allowedCandidateUrl(rawUrl, partner) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash) return false;
  try {
    if (decodeURIComponent(url.pathname) !== url.pathname) return false;
  } catch {
    return false;
  }
  if (partner === "alchemy") {
    return url.origin === "https://www.alchemy.com"
      && url.pathname.startsWith("/docs/")
      && (url.pathname.endsWith(".md") || url.pathname.endsWith("/llms.txt"));
  }
  if (partner === "openzeppelin") {
    return url.origin === "https://raw.githubusercontent.com"
      && /^\/OpenZeppelin\/docs\/(?:refs\/heads\/main|[0-9a-f]{40})\/content\/(?:stellar-contracts|relayer)\/.+\.mdx$/u.test(url.pathname);
  }
  return false;
}

export function resolvedCommitForUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.origin !== "https://raw.githubusercontent.com") return null;
    return url.pathname.match(/^\/OpenZeppelin\/docs\/([0-9a-f]{40})\//u)?.[1] ?? null;
  } catch {
    return null;
  }
}

function promptSignals(text) {
  const lines = String(text).split(/\r?\n/);
  const signals = [];
  for (let line = 0; line < lines.length; line++) {
    for (const pattern of PROMPT_SIGNAL_PATTERNS) {
      if (pattern.test(lines[line])) {
        signals.push({ line: line + 1, pattern: String(pattern), preview: lines[line].trim().slice(0, 180) });
      }
    }
  }
  return signals;
}

async function fetchAllowlistedDocument(rawUrl, partner, timeoutMs, redirectDepth = 0) {
  if (!allowedCandidateUrl(rawUrl, partner)) throw new Error(`allowlist rejected ${rawUrl}`);
  if (redirectDepth > 2) throw new Error(`too many redirects for ${rawUrl}`);
  const started = performance.now();
  const response = await fetch(rawUrl, {
    redirect: "manual",
    headers: { Accept: "text/markdown, text/plain;q=0.9", "User-Agent": "stellar-raven-partner-docs-eval/1" },
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) throw new Error(`redirect without location from ${rawUrl}`);
    return fetchAllowlistedDocument(new URL(location, rawUrl).toString(), partner, timeoutMs, redirectDepth + 1);
  }
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${rawUrl}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!/^(?:text\/markdown|text\/plain)(?:;|$)/iu.test(contentType)) {
    throw new Error(`unexpected content-type ${contentType || "(missing)"} from ${rawUrl}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_DOC_BYTES) throw new Error(`document exceeds ${MAX_DOC_BYTES} bytes: ${rawUrl}`);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (!text.trim()) throw new Error(`empty document from ${rawUrl}`);
  return {
    url: rawUrl,
    finalUrl: response.url || rawUrl,
    text,
    status: response.status,
    bytes: bytes.byteLength,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    elapsedMs: Math.round((performance.now() - started) * 10) / 10,
    contentType,
    cacheControl: response.headers.get("cache-control"),
    etag: response.headers.get("etag"),
    lastModified: response.headers.get("last-modified"),
    resolvedCommit: resolvedCommitForUrl(response.url || rawUrl),
    promptSignals: promptSignals(text)
  };
}

export function parseSseJson(text) {
  const data = String(text)
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .join("\n");
  if (!data) return JSON.parse(text);
  return JSON.parse(data);
}

function baselineCode(testCase) {
  const query = JSON.stringify(testCase.question);
  if (testCase.baseline.type === "operation") {
    const call = OPERATION_CALLS.get(testCase.baseline.id);
    if (!call) throw new Error(`unsupported baseline operation ${testCase.baseline.id}`);
    return `async () => { const r = await ${call}({ query: ${query}, hitsPerPage: 10, includeContent: true }); return r; }`;
  }
  if (testCase.baseline.type === "skill" && SKILL_IDS.has(testCase.baseline.id)) {
    return `async () => { const r = await codemode.skill.read(${JSON.stringify(testCase.baseline.id)}, {}); return r; }`;
  }
  throw new Error(`unsupported baseline source ${JSON.stringify(testCase.baseline)}`);
}

async function ravenExecute(ravenUrl, code, timeoutMs) {
  const response = await fetch(ravenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: crypto.randomUUID(), method: "tools/call", params: { name: "execute", arguments: { code } } }),
    signal: AbortSignal.timeout(timeoutMs)
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Raven HTTP ${response.status}: ${text.slice(0, 300)}`);
  const rpc = parseSseJson(text);
  if (rpc.error) throw new Error(`Raven JSON-RPC ${rpc.error.code}: ${rpc.error.message}`);
  if (rpc.result?.isError) throw new Error(`Raven execute error: ${rpc.result.content?.[0]?.text ?? "unknown"}`);
  return (rpc.result?.content ?? []).map((item) => item.text ?? "").join("\n");
}

function percentile(values, percentileValue) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil((percentileValue / 100) * sorted.length) - 1)];
}

export function validateSuite(suite) {
  if (suite?.contract !== "partner-docs-retrieval-v1" || !Array.isArray(suite.cases) || suite.cases.length === 0) {
    throw new Error("invalid partner-docs suite header");
  }
  const ids = new Set();
  for (const testCase of suite.cases) {
    if (typeof testCase.id !== "string" || ids.has(testCase.id)) throw new Error(`invalid or duplicate case id: ${testCase.id}`);
    ids.add(testCase.id);
    if (typeof testCase.question !== "string" || !testCase.question.trim()) throw new Error(`missing question: ${testCase.id}`);
    if (!Array.isArray(testCase.facts) || testCase.facts.length === 0 || testCase.facts.some((group) => !Array.isArray(group) || group.length === 0)) {
      throw new Error(`invalid facts: ${testCase.id}`);
    }
    if (!Array.isArray(testCase.candidateUrls) || testCase.candidateUrls.length === 0
      || testCase.candidateUrls.some((url) => !allowedCandidateUrl(url, testCase.partner))) {
      throw new Error(`candidate URL outside allowlist: ${testCase.id}`);
    }
    baselineCode(testCase);
  }
  return suite;
}

export function summarize(rows) {
  const available = rows.filter((row) => row.baseline.score);
  const baselineErrors = rows.filter((row) => row.baseline.error !== null).length;
  const baselineMatched = available.reduce((sum, row) => sum + row.baseline.score.matched, 0);
  const candidateMatched = rows.reduce((sum, row) => sum + row.candidate.score.matched, 0);
  const totalFacts = rows.reduce((sum, row) => sum + row.candidate.score.total, 0);
  const baselineFacts = available.reduce((sum, row) => sum + row.baseline.score.total, 0);
  const wins = available.filter((row) => row.candidate.score.recall > row.baseline.score.recall).length;
  const regressions = available.filter((row) => row.candidate.score.recall < row.baseline.score.recall).length;
  const fetchErrors = rows.reduce((sum, row) => sum + row.candidate.errors.length, 0);
  const allowlistViolations = rows.reduce((sum, row) => sum + row.candidate.allowlistViolations, 0);
  const promptSignalCount = rows.reduce((sum, row) => sum + row.candidate.documents.reduce((n, doc) => n + doc.promptSignals.length, 0), 0);
  const baselineRecall = baselineFacts ? baselineMatched / baselineFacts : null;
  const candidateRecall = totalFacts ? candidateMatched / totalFacts : 0;
  const retrievalGate = baselineErrors > 0 || available.length !== rows.length
    ? "inconclusive"
    : candidateRecall >= baselineRecall + 0.20
      && wins >= 3
      && regressions === 0
      && fetchErrors === 0
      && allowlistViolations === 0
        ? "pass"
        : "fail";
  return {
    cases: rows.length,
    baselineCases: available.length,
    baselineErrors,
    totalFacts,
    baselineRecall,
    candidateRecall,
    delta: baselineRecall === null ? null : candidateRecall - baselineRecall,
    wins,
    regressions,
    fetchErrors,
    allowlistViolations,
    promptSignalCount,
    candidateLatencyMs: {
      median: percentile(rows.flatMap((row) => row.candidate.documents.map((doc) => doc.elapsedMs)), 50),
      p95: percentile(rows.flatMap((row) => row.candidate.documents.map((doc) => doc.elapsedMs)), 95)
    },
    retrievalAdmissionGate: retrievalGate,
    headlineQaGate: "not-run",
    shipDecision: "do-not-ship-runtime-adapter"
  };
}

async function run(args) {
  const suite = validateSuite(JSON.parse(await readFile(CASES_PATH, "utf8")));
  const rows = [];
  for (const testCase of suite.cases) {
    const documents = [];
    const errors = [];
    let allowlistViolations = 0;
    for (const url of testCase.candidateUrls) {
      if (!allowedCandidateUrl(url, testCase.partner)) allowlistViolations++;
      try {
        documents.push(await fetchAllowlistedDocument(url, testCase.partner, args.timeoutMs));
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
    let baselineText = null;
    let baselineError = null;
    if (args.ravenUrl) {
      try {
        baselineText = await ravenExecute(args.ravenUrl, baselineCode(testCase), args.timeoutMs);
      } catch (error) {
        baselineError = error instanceof Error ? error.message : String(error);
      }
    }
    rows.push({
      id: testCase.id,
      partner: testCase.partner,
      question: testCase.question,
      baseline: {
        source: testCase.baseline,
        score: baselineText === null ? null : matchFacts(baselineText, testCase.facts),
        error: baselineError
      },
      candidate: {
        urls: testCase.candidateUrls,
        score: matchFacts(documents.map((doc) => doc.text).join("\n"), testCase.facts),
        documents: documents.map(({ text: _text, ...metadata }) => metadata),
        errors,
        allowlistViolations
      }
    });
  }
  return { contract: suite.contract, generatedAt: new Date().toISOString(), ravenUrl: args.ravenUrl ?? null, rows, summary: summarize(rows) };
}

function printHuman(result) {
  console.log(`partner docs retrieval ${result.contract}`);
  for (const row of result.rows) {
    const baseline = row.baseline.score ? `${row.baseline.score.matched}/${row.baseline.score.total}` : "n/a";
    const candidate = `${row.candidate.score.matched}/${row.candidate.score.total}`;
    console.log(`- ${row.id}: Raven ${baseline}; candidate ${candidate}; errors=${row.candidate.errors.length}`);
  }
  const s = result.summary;
  console.log(`baseline recall: ${s.baselineRecall === null ? "n/a" : (100 * s.baselineRecall).toFixed(1) + "%"}`);
  console.log(`candidate recall: ${(100 * s.candidateRecall).toFixed(1)}%`);
  console.log(`retrieval admission: ${s.retrievalAdmissionGate}; headline QA: ${s.headlineQaGate}; ${s.shipDecision}`);
}

function selfTest() {
  assert.equal(allowedCandidateUrl("https://www.alchemy.com/docs/data/llms.txt", "alchemy"), true);
  assert.equal(allowedCandidateUrl("https://www.alchemy.com/docs/reference/x.md", "alchemy"), true);
  assert.equal(allowedCandidateUrl("https://www.alchemy.com/docs/reference/x.md?raw=1", "alchemy"), false);
  assert.equal(allowedCandidateUrl("https://www.alchemy.com/docs/%2e%2e/x.md", "alchemy"), false);
  assert.equal(allowedCandidateUrl("https://www.alchemy.com/api/delete", "alchemy"), false);
  assert.equal(allowedCandidateUrl("https://evil.example/docs/x.md", "alchemy"), false);
  assert.equal(allowedCandidateUrl("https://raw.githubusercontent.com/OpenZeppelin/docs/refs/heads/main/content/stellar-contracts/index.mdx", "openzeppelin"), true);
  assert.equal(allowedCandidateUrl("https://raw.githubusercontent.com/Other/docs/refs/heads/main/content/stellar-contracts/index.mdx", "openzeppelin"), false);
  assert.deepEqual(matchFacts("Native XLM and opaque pageKey cursor", [["native"], ["pageKey"], ["missing"]]), {
    matched: 2,
    total: 3,
    recall: 2 / 3,
    detail: [
      { alternatives: ["native"], matched: true },
      { alternatives: ["pageKey"], matched: true },
      { alternatives: ["missing"], matched: false }
    ]
  });
  assert.deepEqual(parseSseJson("event: message\ndata: {\"result\":{\"ok\":true}}\n\n"), { result: { ok: true } });
  assert.equal(matchFacts("posted data", [["POST"]]).matched, 0);
  console.log("partner-docs eval self-test ok");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) return selfTest();
  const result = await run(args);
  if (args.json) console.log(JSON.stringify(result, null, 2));
  else printHuman(result);
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
