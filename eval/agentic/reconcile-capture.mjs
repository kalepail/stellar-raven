#!/usr/bin/env node
/**
 * reconcile-capture.mjs — verify agent-transcribed `searchCalls` against the
 * capture-proxy wire log (Solo todo 1257, audit finding R24-SOL-01).
 *
 * For every workflow row (caseId × effort) it compares the row's reported
 * searchCalls with the exchanges the proxy captured under that row's
 * `X-Eval-Agent: <caseId>:<effort>` marker:
 *
 *   - a reported call with no matching wire exchange  → fabricated/mistranscribed
 *   - a wire exchange the row never reported          → omitted page
 *
 * FAIL CLOSED (2026-07-30, five-model review): during a proxied run every
 * captured /mcp POST must be attributable to a row. Anything unattributable —
 * a missing or unknown marker, a JSON-RPC batch array, a `tools/call` for a
 * tool other than `search` (an agent can route discovery through `execute`),
 * an unparseable body, a non-200 status — is recorded as an ANOMALY and fails
 * the run. Before this, five bypasses reconciled clean: strip-the-marker plus
 * report nothing, omit `searchCalls` entirely, a stray marker (reported but
 * never in the exit code), a batched search, and execute-routed discovery.
 *
 * What this does NOT do: isolate an adversarial agent. The evaluated agent
 * runs as the same user with shell access, so it could write the capture file
 * or reach the upstream port directly. The guarantee is wire-vs-transcript
 * reconciliation with fail-closed anomaly detection, not tamper-proofing.
 *
 * Grading (`primaryService` vs label) never consults any of this.
 *
 * Usage:
 *   node eval/agentic/reconcile-capture.mjs \
 *     --capture eval/agentic/results/capture-<stamp>.jsonl \
 *     --results eval/agentic/results/agentic-<stamp>.json
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/**
 * Classify one capture entry.
 *
 * Returns `{ kind: "search", call }` for an attributable search exchange, or
 * `{ kind: <anomaly>, ... }` for anything a reconciler must not silently drop.
 * `marker` is carried through so anomalies can name the row they came from.
 */
export function classifyEntry(entry) {
  const marker = entry.marker ?? null;
  const base = { marker, path: entry.path ?? null, status: entry.status ?? null };
  if (entry.status !== 200) {
    return { ...base, kind: "non-200", detail: entry.error ?? `status ${entry.status}` };
  }
  let request;
  try {
    request = JSON.parse(entry.request);
  } catch {
    return { ...base, kind: "unparseable-request" };
  }
  // A JSON-RPC batch is legal on both wire eras; agents are told to send one
  // call per request, so a batch is real search traffic the comparison cannot
  // express — an anomaly, never an invisible pass.
  if (Array.isArray(request)) return { ...base, kind: "batch", detail: `${request.length} messages` };
  if (request?.method !== "tools/call") {
    return { ...base, kind: "non-tool-call", detail: String(request?.method ?? "unknown") };
  }
  const toolName = request.params?.name;
  if (toolName !== "search") {
    // `execute` can run codemode.search inside a script — real discovery the
    // transcript contract does not cover.
    return { ...base, kind: "non-search-tool", detail: String(toolName ?? "unknown") };
  }
  if (!marker) return { ...base, kind: "unmarked-search" };

  const { query, limit } = request.params.arguments ?? {};
  const dataLine = String(entry.response ?? "")
    .split("\n")
    .find((line) => line.startsWith("data: "));
  let page;
  try {
    const envelope = JSON.parse(dataLine ? dataLine.slice("data: ".length) : entry.response);
    page = JSON.parse(envelope.result.content[0].text);
  } catch {
    return { ...base, kind: "unparseable-response", detail: String(query ?? "") };
  }
  const hits = (page.hits ?? []).map((hit) => ({ id: hit.id, tier: hit.tier, score: hit.score }));
  return {
    ...base,
    kind: "search",
    call: {
      query,
      limit,
      hits,
      total: page.total,
      truncated: page.truncated,
      zeroGated: !hits.some((hit) => hit.tier === "gated"),
      widerCandidateIds: (page.widerCandidates ?? []).map((candidate) => candidate.id)
    }
  };
}

/** Parse one captured exchange into the page shape agents transcribe, or null. */
export function wireSearchCall(entry) {
  const classified = classifyEntry(entry);
  return classified.kind === "search" ? classified.call : null;
}

/**
 * Canonical comparison key for one search call (reported or wire).
 *
 * Hits collapse to positional tuples: the agent's structured output does not
 * guarantee `{id, tier, score}` key order, and object key order inside
 * JSON.stringify would otherwise make an honest transcript reject.
 */
export function callKey(call) {
  return JSON.stringify({
    query: call.query,
    limit: call.limit,
    hits: (call.hits ?? []).map((hit) => [hit.id, hit.tier, hit.score]),
    total: call.total,
    truncated: call.truncated,
    zeroGated: call.zeroGated,
    widerCandidateIds: call.widerCandidateIds
  });
}

/** Reconcile workflow rows against captured wire exchanges. */
export function reconcile(rows, captureEntries) {
  const wireByMarker = new Map();
  const anomalies = [];
  for (const entry of captureEntries) {
    const classified = classifyEntry(entry);
    if (classified.kind !== "search") {
      anomalies.push({
        kind: classified.kind,
        marker: classified.marker,
        ...(classified.detail !== undefined ? { detail: classified.detail } : {})
      });
      continue;
    }
    if (!wireByMarker.has(classified.marker)) wireByMarker.set(classified.marker, []);
    wireByMarker.get(classified.marker).push(classified.call);
  }

  const totalWireSearches = [...wireByMarker.values()].reduce((sum, calls) => sum + calls.length, 0);
  const anySearchTraffic =
    totalWireSearches > 0 || anomalies.some((a) => a.kind === "unmarked-search" || a.kind === "batch");

  const seenMarkers = new Set();
  const reportRows = rows.map((row) => {
    const marker = `${row.caseId}:${row.effort}`;
    seenMarkers.add(marker);
    const wire = wireByMarker.get(marker) ?? [];
    const reported = row.searchCalls ?? [];
    const wireKeys = wire.map(callKey);
    const reportedKeys = reported.map(callKey);

    // Multiset difference in both directions (a repeated identical query is
    // legitimately two exchanges, so count matters).
    const remaining = [...wireKeys];
    const missingFromWire = [];
    for (const key of reportedKeys) {
      const i = remaining.indexOf(key);
      if (i === -1) missingFromWire.push(JSON.parse(key));
      else remaining.splice(i, 1);
    }
    const unreportedOnWire = remaining.map((key) => JSON.parse(key));
    // A row claiming no searches while the run captured search traffic is the
    // cheapest evasion: nothing to compare means nothing to catch.
    const emptyReportWithTraffic = reported.length === 0 && anySearchTraffic;
    const rejected =
      missingFromWire.length > 0 || unreportedOnWire.length > 0 || emptyReportWithTraffic;
    return {
      caseId: row.caseId,
      effort: row.effort,
      status: rejected ? "rejected" : "ok",
      reportedCalls: reported.length,
      wireCalls: wire.length,
      ...(emptyReportWithTraffic ? { emptyReportWithTraffic: true } : {}),
      ...(missingFromWire.length ? { missingFromWire } : {}),
      ...(unreportedOnWire.length ? { unreportedOnWire } : {})
    };
  });

  const unmatchedMarkers = [...wireByMarker.keys()].filter((marker) => !seenMarkers.has(marker));
  const rejected = reportRows.filter((row) => row.status === "rejected").length;
  return {
    summary: {
      rows: reportRows.length,
      ok: reportRows.filter((row) => row.status === "ok").length,
      rejected,
      unmatchedMarkers,
      anomalies: anomalies.length,
      // Any of these means the run's transcript forensics are not trustworthy.
      tainted: rejected > 0 || anomalies.length > 0 || unmatchedMarkers.length > 0
    },
    anomalies,
    rows: reportRows
  };
}

function main() {
  const args = process.argv.slice(2);
  const argVal = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const capturePath = argVal("--capture");
  const resultsPath = argVal("--results");
  if (!capturePath || !resultsPath) {
    console.error("usage: reconcile-capture.mjs --capture <capture.jsonl> --results <results.json>");
    process.exit(1);
  }
  const captureEntries = readFileSync(capturePath, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
  const results = JSON.parse(readFileSync(resultsPath, "utf8"));
  const rows = results.rows ?? results;
  if (!Array.isArray(rows)) throw new Error("results file has no rows[]");

  const report = reconcile(rows, captureEntries);
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.summary.tainted ? 1 : 0;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();
