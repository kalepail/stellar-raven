/**
 * Contract tests for `run-qa.mjs --judge-stored` (Solo todo 1261): phase 2 of
 * the two-phase collect → checkpoint → judge flow. Judges a --no-judge
 * collection IN PLACE with an injected judge stub — no claude CLI spawn, no
 * spend. Pins: write-back shape (verdicts, summary, judge-cost meta stamps,
 * judgeStored provenance block), the judge-all-unjudged default, the empty-
 * answer error verdict, and every refusal guard (drifted case snapshot,
 * mixed judge tuple, pack-hash drift, already-fully-judged).
 */
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { judgeStoredResults } from "../eval/qa/run-qa.mjs";
import { JUDGE_RUBRIC } from "../eval/qa/judge.mjs";
import { PACK_VERSION } from "../eval/qa/evidence-pack.mjs";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const CASES = [
  {
    id: "q-fixture-answered",
    question: "What command builds a Soroban contract?",
    golden: {
      answer: "`stellar contract build` compiles the contract to Wasm.",
      keyFacts: ["Uses `stellar contract build`."],
      avoid: ["Do NOT name the retired `soroban` CLI."],
      sources: ["https://developers.stellar.org"],
      notes: ""
    },
    tags: { category: "soroban", service: "stellarDocs", freshness: "stable" }
  },
  {
    id: "q-fixture-empty",
    question: "What is SEP-10?",
    golden: {
      answer: "SEP-10 is the web authentication SEP.",
      keyFacts: ["SEP-10 is web authentication."],
      avoid: [],
      sources: [],
      notes: ""
    },
    tags: { category: "seps", service: "stellarDocs", freshness: "stable" }
  }
];

/** Build a temp dir holding a battery file + a --no-judge results file whose
 *  snapshot hashes genuinely reproduce, mirroring run-qa's collection output. */
function writeFixture(root, { rows: rowOverrides } = {}) {
  const casesPath = join(root, "cases.json");
  writeFileSync(casesPath, JSON.stringify({ cases: CASES }, null, 2));
  const rows = rowOverrides ?? [
    {
      id: "q-fixture-answered",
      question: CASES[0].question,
      tags: CASES[0].tags,
      truth: { status: "verified" },
      answer: "Run `stellar contract build` to compile the contract to Wasm.",
      transcript: [
        {
          toolUseId: "t1",
          tool: "mcp__raven__execute",
          input: '{"code":"async () => 1"}',
          resultChars: 21,
          isError: false
        }
      ],
      agent: { model: "claude-sonnet-5", turns: 3, costUsd: 0.5, usage: null, promptChars: 100, error: null },
      verdict: null,
      // stable-freshness case → collection-time evidence pack was empty
      evidencePack: { packVersion: PACK_VERSION, chars: 0, sha256: null },
      durationMs: 1000
    },
    {
      id: "q-fixture-empty",
      question: CASES[1].question,
      tags: CASES[1].tags,
      truth: { status: "verified" },
      answer: "",
      transcript: [],
      agent: { model: "claude-sonnet-5", turns: 1, costUsd: 0.1, usage: null, promptChars: 90, error: "agent timed out" },
      verdict: null,
      evidencePack: { packVersion: PACK_VERSION, chars: 0, sha256: null },
      durationMs: 500
    }
  ];
  const selectedCases = rows.map((row) => CASES.find((c) => c.id === row.id));
  const results = {
    meta: {
      variant: "A",
      surface: "search-execute",
      searchTool: "search",
      model: "claude-sonnet-5",
      judgeModel: null,
      judgeRubric: null,
      packVersion: PACK_VERSION,
      casesPath,
      caseCount: rows.length,
      inputSnapshot: {
        casesSha256: sha256(JSON.stringify(selectedCases)),
        caseIdsSha256: sha256(JSON.stringify(rows.map((row) => row.id)))
      },
      totalAgentCostUsd: rows.reduce((s, r) => s + (r.agent?.costUsd ?? 0), 0),
      totalJudgeCostUsd: 0,
      totalCostUsd: rows.reduce((s, r) => s + (r.agent?.costUsd ?? 0), 0)
    },
    summary: null,
    rows
  };
  const resultsPath = join(root, "results.json");
  writeFileSync(resultsPath, JSON.stringify(results, null, 2) + "\n");
  return { casesPath, resultsPath };
}

const stubVerdict = {
  score: "correct",
  missingFacts: [],
  wrongClaims: [],
  rationale: "stub",
  costUsd: 0.25,
  rubric: JUDGE_RUBRIC,
  packVersion: PACK_VERSION,
  promptSha256: "0".repeat(64)
};

function stubJudge(calls = []) {
  return async (input, opts) => {
    calls.push({ id: input.id, model: opts?.model, hasEvidence: typeof input.transcriptEvidence === "string" });
    return { ...stubVerdict };
  };
}

describe("run-qa --judge-stored", () => {
  it("judges every unjudged row in place and stamps summary + judge costs", async () => {
    const root = mkdtempSync(join(tmpdir(), "qa-judge-stored-"));
    try {
      const { resultsPath } = writeFixture(root);
      const calls = [];
      const out = await judgeStoredResults(resultsPath, {
        judgeModel: "stub-judge",
        judge: stubJudge(calls),
        log: () => {}
      });

      // Only the answered row hits the judge; the empty answer gets the
      // inline-path error verdict without spending.
      expect(calls).toEqual([{ id: "q-fixture-answered", model: "stub-judge", hasEvidence: true }]);
      expect(out.judgedCount).toBe(2);

      const written = JSON.parse(readFileSync(resultsPath, "utf8"));
      expect(written.rows[0].verdict.score).toBe("correct");
      expect(written.rows[1].verdict).toMatchObject({
        score: "error",
        rationale: "agent timed out",
        rubric: JUDGE_RUBRIC
      });
      expect(written.summary.overall).toMatchObject({ correct: 1, error: 1, total: 2 });
      expect(written.meta.judgeModel).toBe("stub-judge");
      expect(written.meta.judgeRubric).toBe(JUDGE_RUBRIC);
      expect(written.meta.totalJudgeCostUsd).toBeCloseTo(0.25);
      expect(written.meta.totalCostUsd).toBeCloseTo(0.6 + 0.25);
      expect(written.meta.judgeStored).toMatchObject({
        judgedIds: ["q-fixture-answered", "q-fixture-empty"],
        toolVersion: "run-qa/judge-stored-v1"
      });
      expect(typeof written.meta.judgeStored.sourceResultsSha256).toBe("string");

      // Fully judged file → nothing to do, loudly.
      await expect(
        judgeStoredResults(resultsPath, { judgeModel: "stub-judge", judge: stubJudge(), log: () => {} })
      ).rejects.toThrow(/nothing to judge/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses a drifted case snapshot", async () => {
    const root = mkdtempSync(join(tmpdir(), "qa-judge-stored-"));
    try {
      const { casesPath, resultsPath } = writeFixture(root);
      const drifted = JSON.parse(readFileSync(casesPath, "utf8"));
      drifted.cases[0].golden.answer = "edited after collection";
      writeFileSync(casesPath, JSON.stringify(drifted, null, 2));
      await expect(
        judgeStoredResults(resultsPath, { judge: stubJudge(), log: () => {} })
      ).rejects.toThrow(/case input snapshot differs/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses to mix judge models and to cross rubric/pack versions", async () => {
    const root = mkdtempSync(join(tmpdir(), "qa-judge-stored-"));
    try {
      const { resultsPath } = writeFixture(root);
      const results = JSON.parse(readFileSync(resultsPath, "utf8"));
      results.meta.judgeModel = "some-other-judge";
      writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      await expect(
        judgeStoredResults(resultsPath, { judgeModel: "stub-judge", judge: stubJudge(), log: () => {} })
      ).rejects.toThrow(/refusing to mix/);

      results.meta.judgeModel = null;
      results.meta.packVersion = "pack-v0-ancient";
      writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      await expect(
        judgeStoredResults(resultsPath, { judge: stubJudge(), log: () => {} })
      ).rejects.toThrow(/evidence pack/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses when a row's evidence pack no longer reproduces its recorded hash", async () => {
    const root = mkdtempSync(join(tmpdir(), "qa-judge-stored-"));
    try {
      const { resultsPath } = writeFixture(root);
      const results = JSON.parse(readFileSync(resultsPath, "utf8"));
      results.rows[0].evidencePack.sha256 = "f".repeat(64);
      writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      await expect(
        judgeStoredResults(resultsPath, { judge: stubJudge(), log: () => {} })
      ).rejects.toThrow(/no longer reproduces/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
