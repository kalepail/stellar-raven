/**
 * Tests for the agentic-eval harness-owned capture pair (Solo todo 1257,
 * audit finding R24-SOL-01): capture-proxy.mjs is exercised as a real child
 * process against an in-process stub upstream (passthrough + JSONL capture +
 * marker recording), and reconcile-capture.mjs's wire-vs-transcript logic is
 * pinned on the four outcomes that matter — faithful transcript, mistranscribed
 * page, fabricated call, omitted call — plus the stripped-marker rejection.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import http from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { callKey, reconcile, wireSearchCall } from "../eval/agentic/reconcile-capture.mjs";

const PROXY = join(dirname(fileURLToPath(import.meta.url)), "..", "eval", "agentic", "capture-proxy.mjs");

const PAGE = {
  hits: [
    { id: "stellarDocs.search_docs", service: "stellarDocs", kind: "operation", tier: "gated", score: 42 },
    { id: "scout.searchProjects", service: "scout", kind: "operation", tier: "backfill", score: 12 }
  ],
  total: 7,
  truncated: true,
  widerCandidates: [{ id: "lumenloop.search_content_semantic" }]
};
const SSE_RESPONSE = `event: message\ndata: ${JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  result: { content: [{ type: "text", text: JSON.stringify(PAGE) }] }
})}\n\n`;

function searchRequestBody(query) {
  return JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: { name: "search", arguments: { query, limit: 8 } }
  });
}

/** The call shape the workflow harness stores after deriving zeroGated. */
function transcribedCall(query) {
  return {
    query,
    limit: 8,
    hits: PAGE.hits.map(({ id, tier, score }) => ({ id, tier, score })),
    total: PAGE.total,
    truncated: PAGE.truncated,
    zeroGated: false,
    widerCandidateIds: ["lumenloop.search_content_semantic"]
  };
}

function captureEntry(marker, query) {
  return { ts: "2026-07-29T00:00:00Z", marker, method: "POST", path: "/mcp", request: searchRequestBody(query), status: 200, response: SSE_RESPONSE };
}

describe("capture-proxy", () => {
  it("passes traffic through and logs marker-keyed JSONL the agent never touches", async () => {
    const root = mkdtempSync(join(tmpdir(), "agentic-capture-"));
    const upstream = http.createServer((req, res) => {
      res.writeHead(200, { "content-type": "text/event-stream" });
      res.end(SSE_RESPONSE);
    });
    await new Promise((resolve) => upstream.listen(0, "127.0.0.1", resolve));
    const upstreamPort = upstream.address().port;
    const capturePath = join(root, "capture.jsonl");
    const proxy = spawn(process.execPath, [
      PROXY, "--upstream", `http://127.0.0.1:${upstreamPort}`, "--port", "0", "--out", capturePath
    ]);
    try {
      const proxyPort = await new Promise((resolve, reject) => {
        proxy.stdout.on("data", (chunk) => {
          const match = String(chunk).match(/listening on (\d+)/);
          if (match) resolve(Number(match[1]));
        });
        proxy.on("exit", (code) => reject(new Error(`proxy exited early (${code})`)));
        setTimeout(() => reject(new Error("proxy did not report a port")), 10_000);
      });

      const response = await fetch(`http://127.0.0.1:${proxyPort}/mcp`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
          "x-eval-agent": "q-fixture:low"
        },
        body: searchRequestBody("soroban storage")
      });
      expect(response.status).toBe(200);
      expect(await response.text()).toBe(SSE_RESPONSE);

      const lines = readFileSync(capturePath, "utf8").trim().split("\n").map((line) => JSON.parse(line));
      expect(lines).toHaveLength(1);
      expect(lines[0]).toMatchObject({ marker: "q-fixture:low", method: "POST", path: "/mcp", status: 200 });
      expect(lines[0].request).toBe(searchRequestBody("soroban storage"));
      expect(lines[0].response).toBe(SSE_RESPONSE);

      // The captured exchange parses into exactly the shape agents transcribe.
      expect(wireSearchCall(lines[0])).toEqual(transcribedCall("soroban storage"));
    } finally {
      proxy.kill();
      upstream.close();
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("reconcile-capture", () => {
  const row = (searchCalls) => ({ caseId: "q-fixture", effort: "low", searchCalls });

  it("accepts a faithful transcript", () => {
    const report = reconcile([row([transcribedCall("soroban storage")])], [captureEntry("q-fixture:low", "soroban storage")]);
    expect(report.summary).toMatchObject({ rows: 1, ok: 1, rejected: 0, unmatchedMarkers: [] });
  });

  it("rejects a mistranscribed page (wrong score) as missing-from-wire + unreported", () => {
    const doctored = transcribedCall("soroban storage");
    doctored.hits[0] = { ...doctored.hits[0], score: 999 };
    const report = reconcile([row([doctored])], [captureEntry("q-fixture:low", "soroban storage")]);
    expect(report.rows[0].status).toBe("rejected");
    expect(report.rows[0].missingFromWire).toHaveLength(1);
    expect(report.rows[0].unreportedOnWire).toHaveLength(1);
  });

  it("rejects a fabricated call and an omitted call", () => {
    const fabricated = reconcile([row([transcribedCall("never sent")])], []);
    expect(fabricated.rows[0]).toMatchObject({ status: "rejected", reportedCalls: 1, wireCalls: 0 });

    const omitted = reconcile(
      [row([transcribedCall("soroban storage")])],
      [captureEntry("q-fixture:low", "soroban storage"), captureEntry("q-fixture:low", "second query the row hid")]
    );
    expect(omitted.rows[0].status).toBe("rejected");
    expect(omitted.rows[0].unreportedOnWire).toHaveLength(1);
  });

  it("rejects wholesale when the marker was stripped, and surfaces stray markers", () => {
    const report = reconcile(
      [row([transcribedCall("soroban storage")])],
      [captureEntry(null, "soroban storage"), captureEntry("q-other:medium", "soroban storage")]
    );
    expect(report.rows[0].status).toBe("rejected");
    expect(report.summary.unmatchedMarkers).toEqual(["q-other:medium"]);
  });

  it("counts repeated identical queries as distinct exchanges", () => {
    const twice = [transcribedCall("soroban storage"), transcribedCall("soroban storage")];
    const ok = reconcile([row(twice)], [captureEntry("q-fixture:low", "soroban storage"), captureEntry("q-fixture:low", "soroban storage")]);
    expect(ok.rows[0].status).toBe("ok");
    const short = reconcile([row(twice)], [captureEntry("q-fixture:low", "soroban storage")]);
    expect(short.rows[0].status).toBe("rejected");
  });

  it("callKey ignores field order but binds every transcribed field", () => {
    const a = transcribedCall("q");
    const reordered = { widerCandidateIds: a.widerCandidateIds, zeroGated: a.zeroGated, truncated: a.truncated, total: a.total, hits: a.hits, limit: a.limit, query: a.query };
    expect(callKey(reordered)).toBe(callKey(a));
  });
});
