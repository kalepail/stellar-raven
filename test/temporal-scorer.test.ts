import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
// Plain Node evaluator module; exercised directly by Vitest without a build step.
// @ts-expect-error no declaration file is emitted for the local .mjs scorer.
import * as temporalScorer from "../eval/temporal/score-temporal.mjs";

const {
  DEFAULT_EXPECTATIONS_PATH,
  DEFAULT_FIXTURES_PATH,
  loadExpectations,
  readJsonFile,
  runSelfTest,
  scoreAnswer,
  scoreArtifacts,
  validateExpectations
} = temporalScorer;

function transcript(surface: "mcp" | "playground", observationContext: boolean) {
  return [
    {
      tool: surface === "mcp" ? "mcp__raven__execute" : "mcp__playground__execute",
      result: observationContext
        ? '{"ok":true}\n\n--- OBSERVATION CONTEXT ---\n{"observedAt":"2026-07-14T15:30:00.000Z"}'
        : '{"ok":true}'
    }
  ];
}

function artifact(expectations: any, surface: "mcp" | "playground", arm: "baseline" | "candidate") {
  const rows = expectations.cases.flatMap((entry: any) =>
    Array.from({ length: expectations.expectedReplicatesPerSurfaceArm[entry.class] }, () => ({
      id: entry.id,
      answer: "Fixture answer.",
      transcript: transcript(surface, arm === "candidate")
    }))
  );
  const meta =
    surface === "mcp"
      ? { surface: "search-execute", variant: "A" }
      : { lane: "playground-semantic-v2", transport: "POST /playground/chat SSE" };
  return { surface, arm, source: `${surface}-${arm}.json`, data: { meta, rows } };
}

describe("temporal scorer", () => {
  it("passes the fixture-driven detector self-test", () => {
    const result = runSelfTest();
    expect(result.names).toEqual(
      expect.arrayContaining([
        "missing-as-of-detection",
        "justin-rice-stale-as-current",
        "observation-anchor-as-publication-fact",
        "spurious-hedge-on-stable-mechanism",
        "publication-date-control-zero-fires",
        "event-date-control-zero-fires"
      ])
    );
  });

  it("detects every pinned fixture and produces zero fires on publication/event controls", () => {
    const expectations = loadExpectations();
    const fixtureFile = readJsonFile(DEFAULT_FIXTURES_PATH, "detector fixtures");
    for (const fixture of fixtureFile.fixtures) {
      const actual = scoreAnswer(expectations.byId.get(fixture.id), fixture.answer);
      expect(actual, fixture.name).toMatchObject(fixture.expected);
    }
    for (const name of ["publication-date-control-zero-fires", "event-date-control-zero-fires"]) {
      const fixture = fixtureFile.fixtures.find((entry: any) => entry.name === name);
      const actual = scoreAnswer(expectations.byId.get(fixture.id), fixture.answer);
      expect(actual.anchorAsFact, name).toBe(false);
      expect(actual.spuriousHedge, name).toBe(false);
    }
  });

  it("accepts saved MCP/playground shapes and reports all metrics per surface/arm", () => {
    const expectations = loadExpectations();
    const inputs = (["mcp", "playground"] as const).flatMap((surface) =>
      (["baseline", "candidate"] as const).map((arm) => artifact(expectations, surface, arm))
    );
    const report = scoreArtifacts(expectations, inputs);
    for (const surface of ["mcp", "playground"] as const) {
      for (const arm of ["baseline", "candidate"] as const) {
        expect(report.surfaces[surface][arm]).toMatchObject({
          rowCount: 18,
          asOfDatingRate: { denominator: 12 },
          staleAsCurrent: { eligible: 2 },
          anchorAsFact: { eligible: 2 },
          spuriousHedge: { eligible: 5 }
        });
      }
      expect(report.surfaces[surface].baseline.attribution.observationContextPresent).toBe(0);
      expect(report.surfaces[surface].candidate.attribution.observationContextPresent).toBe(18);
    }
  });

  it("fails closed on attribution, selection, class, and replicate mismatches", () => {
    const expectations = loadExpectations();
    const inputs = (["mcp", "playground"] as const).flatMap((surface) =>
      (["baseline", "candidate"] as const).map((arm) => artifact(expectations, surface, arm))
    );

    const noCandidateMarker = structuredClone(inputs);
    noCandidateMarker[1]!.data.rows[0]!.transcript = transcript("mcp", false);
    expect(() => scoreArtifacts(expectations, noCandidateMarker)).toThrow(/lacks the candidate observation block/);

    const wrongId = structuredClone(inputs);
    wrongId[0]!.data.rows[0]!.id = "q-not-selected";
    expect(() => scoreArtifacts(expectations, wrongId)).toThrow(/non-selected id/);

    const wrongClass = structuredClone(inputs);
    wrongClass[0]!.data.rows[0]!.class = "control";
    expect(() => scoreArtifacts(expectations, wrongClass)).toThrow(/class.*must be positive/);

    const missingReplicate = structuredClone(inputs);
    missingReplicate[0]!.data.rows.shift();
    expect(() => scoreArtifacts(expectations, missingReplicate)).toThrow(/must contain 2 positive row/);
  });

  it("fails clearly on missing, malformed, and incomplete expectations", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "temporal-scorer-"));
    const malformed = path.join(directory, "malformed.json");
    fs.writeFileSync(malformed, "{");
    expect(() => loadExpectations(path.join(directory, "missing.json"))).toThrow(/expectations file not found/);
    expect(() => loadExpectations(malformed)).toThrow(/malformed expectations JSON/);
    expect(() => validateExpectations({ contract: "wrong" })).toThrow(/contract must equal/);

    const incomplete = structuredClone(readJsonFile(DEFAULT_EXPECTATIONS_PATH, "expectations"));
    incomplete.cases.pop();
    expect(() => validateExpectations(incomplete)).toThrow(/missing preregistered case ids/);
  });
});
