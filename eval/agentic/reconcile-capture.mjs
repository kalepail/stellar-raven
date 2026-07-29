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
 * Any mismatch REJECTS the row for mechanism-forensics purposes (grading is
 * unaffected — it uses primaryService, not searchCalls). The exit code is
 * non-zero when any row is rejected so the runbook cannot read a tainted
 * transcript as authoritative by accident.
 *
 * Marker honesty: the marker header is part of the exact curl recipe the
 * prompt dictates. An agent that strips or alters it produces zero captured
 * exchanges under its marker and is rejected wholesale — deviation is
 * detected, not silently trusted.
 *
 * Usage:
 *   node eval/agentic/reconcile-capture.mjs \
 *     --capture eval/agentic/results/capture-<stamp>.jsonl \
 *     --results eval/agentic/results/agentic-<stamp>.json
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** Parse one captured SSE (or plain JSON) tools/call response into the page
 *  shape agents are told to transcribe. Returns null for non-search traffic. */
export function wireSearchCall(entry) {
  let request;
  try {
    request = JSON.parse(entry.request);
  } catch {
    return null;
  }
  if (request?.method !== "tools/call" || request?.params?.name !== "search") return null;
  const { query, limit } = request.params.arguments ?? {};
  const dataLine = String(entry.response ?? "")
    .split("\n")
    .find((line) => line.startsWith("data: "));
  let page;
  try {
    const envelope = JSON.parse(dataLine ? dataLine.slice("data: ".length) : entry.response);
    page = JSON.parse(envelope.result.content[0].text);
  } catch {
    return { query, limit, unparseable: true };
  }
  const hits = (page.hits ?? []).map((hit) => ({ id: hit.id, tier: hit.tier, score: hit.score }));
  return {
    query,
    limit,
    hits,
    total: page.total,
    truncated: page.truncated,
    zeroGated: !hits.some((hit) => hit.tier === "gated"),
    widerCandidateIds: (page.widerCandidates ?? []).map((candidate) => candidate.id)
  };
}

/** Canonical comparison key for one search call (reported or wire). */
export function callKey(call) {
  return JSON.stringify({
    query: call.query,
    limit: call.limit,
    hits: call.hits,
    total: call.total,
    truncated: call.truncated,
    zeroGated: call.zeroGated,
    widerCandidateIds: call.widerCandidateIds
  });
}

/** Reconcile workflow rows against captured wire exchanges. */
export function reconcile(rows, captureEntries) {
  const wireByMarker = new Map();
  for (const entry of captureEntries) {
    const call = wireSearchCall(entry);
    if (!call || !entry.marker) continue;
    if (!wireByMarker.has(entry.marker)) wireByMarker.set(entry.marker, []);
    wireByMarker.get(entry.marker).push(call);
  }

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
    const rejected = missingFromWire.length > 0 || unreportedOnWire.length > 0;
    return {
      caseId: row.caseId,
      effort: row.effort,
      status: rejected ? "rejected" : "ok",
      reportedCalls: reported.length,
      wireCalls: wire.length,
      ...(missingFromWire.length ? { missingFromWire } : {}),
      ...(unreportedOnWire.length ? { unreportedOnWire } : {})
    };
  });

  const unmatchedMarkers = [...wireByMarker.keys()].filter((marker) => !seenMarkers.has(marker));
  return {
    summary: {
      rows: reportRows.length,
      ok: reportRows.filter((row) => row.status === "ok").length,
      rejected: reportRows.filter((row) => row.status === "rejected").length,
      unmatchedMarkers
    },
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
  process.exitCode = report.summary.rejected > 0 ? 1 : 0;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();
