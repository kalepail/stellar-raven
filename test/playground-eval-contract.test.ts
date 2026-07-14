import { describe, expect, it } from "vitest";
// Plain Node evaluator module; exercised directly by Vitest without a build step.
// @ts-expect-error no declaration file is emitted for the local .mjs contract.
import * as artifactContract from "../eval/playground/artifact-contract.mjs";

const {
  PLAYGROUND_ARTIFACT_CONTRACT,
  PLAYGROUND_INPUT_SNAPSHOT_CONTRACT,
  PLAYGROUND_ROUND_CAP_CONTRACT,
  assertModelBackedRunInputs,
  assertPlaygroundArtifactMeta,
  buildPlaygroundArtifactMeta,
  treeGenerationSha256
} = artifactContract;

const sha = (character: string) => character.repeat(64);

function reviewedRound(overrides: Record<string, unknown> = {}) {
  return {
    contract: PLAYGROUND_ROUND_CAP_CONTRACT,
    experimentId: "todo-1001-contract-test",
    kind: "reviewed-round",
    runAllocation: "planned",
    plannedAnswerCalls: 6,
    absoluteAnswerCallCap: 8,
    answerCallsConsumedBeforeRun: 2,
    plannedJudgeCalls: 6,
    absoluteJudgeCallCap: 8,
    judgeCallsConsumedBeforeRun: 2,
    infraRetryReserve: 2,
    infraRetryConsumedBeforeRun: 1,
    savedAnswerRejudgeReserve: 3,
    savedAnswerRejudgesConsumedBeforeRun: 1,
    ...overrides
  };
}

function fixtureMeta(roundAuthorization: any = reviewedRound()) {
  const treeBase = {
    headRevision: "8e891fa6f9b913b723af897d1bf55bb2b5251c34",
    dirty: false,
    statusSha256: sha("a"),
    trackedDiffSha256: sha("b"),
    untrackedFilesSha256: sha("c")
  };
  const tree = { ...treeBase, generationSha256: treeGenerationSha256(treeBase) };
  return buildPlaygroundArtifactMeta({
    run: {
      runId: "fixture-run",
      endpoint: "http://localhost:8787/playground/chat",
      casesPath: "eval/qa/cases.json",
      caseContract: null,
      caseCount: 2,
      selection: { ids: "a,b" },
      startedAt: "2026-07-14T00:00:00.000Z",
      finishedAt: "2026-07-14T00:01:00.000Z"
    },
    answering: {
      primaryModel: "openai/gpt-5.4",
      fallbackModels: ["openai/gpt-5.4-mini"],
      models: [
        { model: "openai/gpt-5.4", role: "primary" },
        { model: "openai/gpt-5.4-mini", role: "fallback" }
      ],
      fallbackPolicy: "fixture",
      apiMode: { requested: "responses", effective: "responses", source: "default", default: "responses" },
      reasoningEffort: { value: "none", source: "default", default: "none", invalidOverrideIgnored: false },
      temperature: 0.1,
      modelSource: "default",
      defaultModels: [],
      configurationBasis: "fixture config",
      runtimeIntrospection: "not-available",
      observedAttemptedModels: null,
      proofLimit: "fixture cannot introspect attempts"
    },
    judge: {
      enabled: true,
      model: "claude-sonnet-5",
      rubric: "v2.4",
      packVersion: "p3",
      temperature: { value: null, semantics: "provider-default-unpinned" }
    },
    capContext: {
      demo: {
        maxSteps: 7,
        maxOutputTokens: 4096,
        maxHistoryMessages: 20,
        maxHistoryChars: 24000,
        maxSearchLimit: 6,
        maxSearchCallsPerTurn: 3,
        maxExecuteCallsPerTurn: 3,
        maxExecuteCodeChars: 8000,
        maxUserMessageChars: 4000,
        chatsPerHour: 30
      },
      evaluator: {
        timeoutMs: 150000,
        maxCasesPerRunSubject: 30,
        selectedCases: 2,
        answerCallsThisRun: 2,
        judgeCallsThisRun: 2,
        answerCallUnit: "one turn"
      },
      roundAuthorization: {
        ...roundAuthorization,
        sourceFile: { path: "/tmp/round-cap.json", sha256: sha("5") }
      }
    },
    inputFiles: {
      corpusFileSha256: sha("d"),
      manifestFileSha256: sha("e"),
      superSpecFileSha256: sha("f"),
      runnerFileSha256: sha("1"),
      modelConfigFileSha256: sha("2"),
      judgeFileSha256: sha("3"),
      evidencePackFileSha256: sha("4")
    },
    selectedCases: [{ id: "a" }, { id: "b" }],
    tree,
    server: {
      endpoint: "http://localhost:8787/playground/chat",
      generationBasis: "operator-asserted-local-working-tree",
      generationSha256: tree.generationSha256,
      operatorAssertionSha256: tree.generationSha256,
      runtimeIntrospection: "not-available",
      proofLimit: "operator assertion matched locally; Worker bytes were not introspected"
    }
  });
}

describe("playground semantic artifact contract", () => {
  it("requires both paid-run provenance inputs before model execution", () => {
    expect(() => assertModelBackedRunInputs({})).toThrow(/server-generation/);
    expect(() => assertModelBackedRunInputs({ serverGeneration: sha("a") })).toThrow(/round-cap-context/);
    expect(() =>
      assertModelBackedRunInputs({ serverGeneration: sha("a"), roundCapContext: "/tmp/caps.json" })
    ).not.toThrow();
  });

  it("builds a complete, versioned, internally pinned artifact metadata block", () => {
    const meta = fixtureMeta();
    expect(meta.artifactContract).toBe(PLAYGROUND_ARTIFACT_CONTRACT);
    expect(meta.inputSnapshot.contract).toBe(PLAYGROUND_INPUT_SNAPSHOT_CONTRACT);
    expect(meta.answering.fallbackModels).toEqual(["openai/gpt-5.4-mini"]);
    expect(meta.server.runtimeIntrospection).toBe("not-available");
    expect(() => assertPlaygroundArtifactMeta(meta)).not.toThrow();
  });

  it("fails on omitted answering fields or a configuration/hash mismatch", () => {
    const missingFallback = structuredClone(fixtureMeta());
    delete missingFallback.answering.fallbackModels;
    expect(() => assertPlaygroundArtifactMeta(missingFallback)).toThrow(/fallbackModels/);

    const changedTemperature = structuredClone(fixtureMeta());
    changedTemperature.answering.temperature = 0.2;
    expect(() => assertPlaygroundArtifactMeta(changedTemperature)).toThrow(/answeringConfigSha256/);
  });

  it("fails when the operator server assertion, local tree, or snapshot generation disagree", () => {
    const assertionMismatch = structuredClone(fixtureMeta());
    assertionMismatch.server.operatorAssertionSha256 = sha("9");
    expect(() => assertPlaygroundArtifactMeta(assertionMismatch)).toThrow(/operator assertion/);

    const snapshotMismatch = structuredClone(fixtureMeta());
    snapshotMismatch.inputSnapshot.serverGenerationSha256 = sha("8");
    expect(() => assertPlaygroundArtifactMeta(snapshotMismatch)).toThrow(/serverGenerationSha256/);
  });

  it("fails before spend when a reviewed round would exceed its absolute cap", () => {
    expect(() => fixtureMeta(reviewedRound({ answerCallsConsumedBeforeRun: 7 }))).toThrow(
      /absoluteAnswerCallCap/
    );
    expect(() => fixtureMeta(reviewedRound({ infraRetryConsumedBeforeRun: 3 }))).toThrow(
      /infraRetryReserve/
    );
    expect(() => fixtureMeta(reviewedRound({ plannedAnswerCalls: 3 }))).toThrow(/plannedAnswerCalls/);
  });

  it("accepts unreviewed diagnostics only with explicit null cap semantics", () => {
    const nullCaps = {
      contract: PLAYGROUND_ROUND_CAP_CONTRACT,
      experimentId: "one-off-transport-diagnostic",
      kind: "not-applicable",
      runAllocation: null,
      reason: "unreviewed diagnostic; not an eval-round result",
      plannedAnswerCalls: null,
      absoluteAnswerCallCap: null,
      answerCallsConsumedBeforeRun: null,
      plannedJudgeCalls: null,
      absoluteJudgeCallCap: null,
      judgeCallsConsumedBeforeRun: null,
      infraRetryReserve: null,
      infraRetryConsumedBeforeRun: null,
      savedAnswerRejudgeReserve: null,
      savedAnswerRejudgesConsumedBeforeRun: null
    };
    expect(() => fixtureMeta(nullCaps)).not.toThrow();

    const omitted = structuredClone(nullCaps) as Record<string, unknown>;
    delete omitted.absoluteAnswerCallCap;
    expect(() => fixtureMeta(omitted)).toThrow(/absoluteAnswerCallCap/);
  });
});
