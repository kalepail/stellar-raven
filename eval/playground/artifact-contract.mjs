import { createHash } from "node:crypto";

export const PLAYGROUND_ARTIFACT_CONTRACT = "playground-semantic-result/v2";
export const PLAYGROUND_INPUT_SNAPSHOT_CONTRACT = "playground-semantic-input/v1";
export const PLAYGROUND_ROUND_CAP_CONTRACT = "playground-semantic-round-cap/v1";
export const PLAYGROUND_LANE = "playground-semantic-v1";

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function sha256Json(value) {
  return sha256(JSON.stringify(value));
}

export function treeGenerationSha256(tree) {
  return sha256Json({
    headRevision: tree.headRevision,
    trackedDiffSha256: tree.trackedDiffSha256,
    untrackedFilesSha256: tree.untrackedFilesSha256
  });
}

export function assertModelBackedRunInputs({ serverGeneration, roundCapContext }) {
  if (typeof serverGeneration !== "string" || !/^[a-f0-9]{64}$/.test(serverGeneration)) {
    throw new Error(
      "--server-generation is required for a model-backed run and must be a lowercase SHA-256 operator assertion"
    );
  }
  if (typeof roundCapContext !== "string" || !roundCapContext) {
    throw new Error(`--round-cap-context is required for a model-backed run (${PLAYGROUND_ROUND_CAP_CONTRACT})`);
  }
}

export function buildPlaygroundArtifactMeta({
  run,
  answering,
  judge,
  capContext,
  inputFiles,
  selectedCases,
  tree,
  server
}) {
  const inputSnapshot = {
    contract: PLAYGROUND_INPUT_SNAPSHOT_CONTRACT,
    casesSha256: sha256Json(selectedCases),
    caseIdsSha256: sha256Json(selectedCases.map((item) => item.id)),
    corpusFileSha256: inputFiles.corpusFileSha256,
    manifestFileSha256: inputFiles.manifestFileSha256,
    superSpecFileSha256: inputFiles.superSpecFileSha256,
    runnerFileSha256: inputFiles.runnerFileSha256,
    modelConfigFileSha256: inputFiles.modelConfigFileSha256,
    judgeFileSha256: inputFiles.judgeFileSha256,
    evidencePackFileSha256: inputFiles.evidencePackFileSha256,
    tree,
    serverGenerationSha256: server.generationSha256,
    answeringConfigSha256: sha256Json(answering),
    judgeTupleSha256: sha256Json(judge),
    capContextSha256: sha256Json(capContext)
  };

  const meta = {
    artifactContract: PLAYGROUND_ARTIFACT_CONTRACT,
    lane: PLAYGROUND_LANE,
    transport: "POST /playground/chat SSE",
    authentication: "run-scoped signed demo cookie (loopback only)",
    ...run,
    server,
    answering,
    judge,
    capContext,
    inputSnapshot
  };
  assertPlaygroundArtifactMeta(meta);
  return meta;
}

export function assertPlaygroundArtifactMeta(meta) {
  const fail = (message) => {
    throw new Error(`invalid ${PLAYGROUND_ARTIFACT_CONTRACT}: ${message}`);
  };
  const requiredString = (value, field) => {
    if (typeof value !== "string" || !value) fail(`${field} is required`);
  };
  const requiredSha = (value, field) => {
    requiredString(value, field);
    if (!/^[a-f0-9]{64}$/.test(value)) fail(`${field} must be a lowercase SHA-256`);
  };

  if (!meta || typeof meta !== "object") fail("meta must be an object");
  if (meta.artifactContract !== PLAYGROUND_ARTIFACT_CONTRACT) {
    fail(`artifactContract must be ${PLAYGROUND_ARTIFACT_CONTRACT}`);
  }
  if (meta.lane !== PLAYGROUND_LANE) fail(`lane must be ${PLAYGROUND_LANE}`);

  const answering = meta.answering;
  if (!answering || typeof answering !== "object") fail("answering is required");
  requiredString(answering.primaryModel, "answering.primaryModel");
  if (!Array.isArray(answering.fallbackModels)) fail("answering.fallbackModels must be an explicit array");
  if (answering.fallbackModels.some((model) => typeof model !== "string" || !model)) {
    fail("answering.fallbackModels must contain only non-empty model ids");
  }
  if (!Array.isArray(answering.models) || answering.models.length === 0) {
    fail("answering.models must contain the ordered primary/fallback attempts");
  }
  if (answering.models[0]?.model !== answering.primaryModel || answering.models[0]?.role !== "primary") {
    fail("answering.models must begin with answering.primaryModel as primary");
  }
  const modelFallbacks = answering.models.slice(1).map((entry) => entry?.model);
  if (JSON.stringify(modelFallbacks) !== JSON.stringify(answering.fallbackModels)) {
    fail("answering.fallbackModels does not match ordered answering.models");
  }
  requiredString(answering.apiMode?.requested, "answering.apiMode.requested");
  requiredString(answering.apiMode?.effective, "answering.apiMode.effective");
  requiredString(answering.reasoningEffort?.value, "answering.reasoningEffort.value");
  requiredString(answering.reasoningEffort?.source, "answering.reasoningEffort.source");
  if (typeof answering.temperature !== "number" || !Number.isFinite(answering.temperature)) {
    fail("answering.temperature must be a finite number");
  }
  requiredString(answering.configurationBasis, "answering.configurationBasis");
  if (answering.runtimeIntrospection !== "not-available" || answering.observedAttemptedModels !== null) {
    fail("answering must explicitly record unavailable runtime attempt introspection");
  }
  requiredString(answering.proofLimit, "answering.proofLimit");

  const judge = meta.judge;
  if (!judge || typeof judge !== "object" || typeof judge.enabled !== "boolean") {
    fail("judge.enabled is required");
  }
  if (judge.enabled) {
    requiredString(judge.model, "judge.model");
    requiredString(judge.rubric, "judge.rubric");
  } else if (judge.model !== null || judge.rubric !== null) {
    fail("disabled judge must use explicit null model and rubric");
  }
  requiredString(judge.packVersion, "judge.packVersion");
  if (judge.temperature?.value !== null || judge.temperature?.semantics !== "provider-default-unpinned") {
    fail("judge.temperature must explicitly record the unpinned provider default");
  }

  const caps = meta.capContext;
  if (!caps || typeof caps !== "object" || !caps.demo || !caps.evaluator) {
    fail("capContext.demo and capContext.evaluator are required");
  }
  for (const field of [
    "maxSteps",
    "maxOutputTokens",
    "maxHistoryMessages",
    "maxHistoryChars",
    "maxSearchLimit",
    "maxSearchCallsPerTurn",
    "maxExecuteCallsPerTurn",
    "maxExecuteCodeChars",
    "maxUserMessageChars",
    "chatsPerHour"
  ]) {
    if (!Number.isInteger(caps.demo[field]) || caps.demo[field] <= 0) fail(`capContext.demo.${field} is required`);
  }
  if (!Number.isInteger(caps.evaluator.timeoutMs) || caps.evaluator.timeoutMs <= 0) {
    fail("capContext.evaluator.timeoutMs is required");
  }
  if (!Number.isInteger(caps.evaluator.maxCasesPerRunSubject) || caps.evaluator.maxCasesPerRunSubject <= 0) {
    fail("capContext.evaluator.maxCasesPerRunSubject is required");
  }
  if (caps.evaluator.answerCallsThisRun !== caps.evaluator.selectedCases) {
    fail("capContext.evaluator.answerCallsThisRun must equal selectedCases");
  }
  if (![0, caps.evaluator.selectedCases].includes(caps.evaluator.judgeCallsThisRun)) {
    fail("capContext.evaluator.judgeCallsThisRun must be zero or selectedCases");
  }
  assertRoundCapContext(caps.roundAuthorization, caps.evaluator, fail);

  const snapshot = meta.inputSnapshot;
  if (!snapshot || typeof snapshot !== "object") fail("inputSnapshot is required");
  if (snapshot.contract !== PLAYGROUND_INPUT_SNAPSHOT_CONTRACT) {
    fail(`inputSnapshot.contract must be ${PLAYGROUND_INPUT_SNAPSHOT_CONTRACT}`);
  }
  for (const field of [
    "casesSha256",
    "caseIdsSha256",
    "corpusFileSha256",
    "manifestFileSha256",
    "superSpecFileSha256",
    "runnerFileSha256",
    "modelConfigFileSha256",
    "judgeFileSha256",
    "evidencePackFileSha256",
    "serverGenerationSha256",
    "answeringConfigSha256",
    "judgeTupleSha256",
    "capContextSha256"
  ]) {
    requiredSha(snapshot[field], `inputSnapshot.${field}`);
  }

  const tree = snapshot.tree;
  if (!tree || typeof tree !== "object") fail("inputSnapshot.tree is required");
  requiredString(tree.headRevision, "inputSnapshot.tree.headRevision");
  if (typeof tree.dirty !== "boolean") fail("inputSnapshot.tree.dirty is required");
  for (const field of ["statusSha256", "trackedDiffSha256", "untrackedFilesSha256", "generationSha256"]) {
    requiredSha(tree[field], `inputSnapshot.tree.${field}`);
  }
  if (tree.generationSha256 !== treeGenerationSha256(tree)) {
    fail("inputSnapshot.tree.generationSha256 does not match the tree components");
  }

  const server = meta.server;
  if (!server || typeof server !== "object") fail("server is required");
  requiredString(server.endpoint, "server.endpoint");
  if (server.generationBasis !== "operator-asserted-local-working-tree") {
    fail("server.generationBasis must explicitly be operator-asserted-local-working-tree");
  }
  requiredSha(server.generationSha256, "server.generationSha256");
  requiredSha(server.operatorAssertionSha256, "server.operatorAssertionSha256");
  if (server.operatorAssertionSha256 !== server.generationSha256) {
    fail("server operator assertion must match server.generationSha256");
  }
  if (server.runtimeIntrospection !== "not-available") {
    fail("server.runtimeIntrospection must honestly be not-available");
  }
  requiredString(server.proofLimit, "server.proofLimit");
  if (server.generationSha256 !== tree.generationSha256) {
    fail("server generation does not match the pinned local working-tree generation");
  }
  if (snapshot.serverGenerationSha256 !== server.generationSha256) {
    fail("inputSnapshot.serverGenerationSha256 does not match server.generationSha256");
  }
  if (snapshot.answeringConfigSha256 !== sha256Json(answering)) {
    fail("inputSnapshot.answeringConfigSha256 does not match answering");
  }
  if (snapshot.judgeTupleSha256 !== sha256Json(judge)) {
    fail("inputSnapshot.judgeTupleSha256 does not match judge");
  }
  if (snapshot.capContextSha256 !== sha256Json(caps)) {
    fail("inputSnapshot.capContextSha256 does not match capContext");
  }
}

function assertRoundCapContext(round, evaluator, fail) {
  if (!round || typeof round !== "object") fail("capContext.roundAuthorization is required");
  if (round.contract !== PLAYGROUND_ROUND_CAP_CONTRACT) {
    fail(`capContext.roundAuthorization.contract must be ${PLAYGROUND_ROUND_CAP_CONTRACT}`);
  }
  if (typeof round.experimentId !== "string" || !round.experimentId) {
    fail("capContext.roundAuthorization.experimentId is required");
  }
  if (typeof round.sourceFile?.path !== "string" || !round.sourceFile.path) {
    fail("capContext.roundAuthorization.sourceFile.path is required");
  }
  if (typeof round.sourceFile?.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(round.sourceFile.sha256)) {
    fail("capContext.roundAuthorization.sourceFile.sha256 must be a lowercase SHA-256");
  }
  const fields = [
    "plannedAnswerCalls",
    "absoluteAnswerCallCap",
    "answerCallsConsumedBeforeRun",
    "plannedJudgeCalls",
    "absoluteJudgeCallCap",
    "judgeCallsConsumedBeforeRun",
    "infraRetryReserve",
    "infraRetryConsumedBeforeRun",
    "savedAnswerRejudgeReserve",
    "savedAnswerRejudgesConsumedBeforeRun"
  ];
  if (round.kind === "not-applicable") {
    if (typeof round.reason !== "string" || !round.reason) {
      fail("not-applicable round authorization requires a non-empty reason");
    }
    for (const field of fields) {
      if (round[field] !== null) fail(`not-applicable round authorization must set ${field} to null`);
    }
    if (round.runAllocation !== null) fail("not-applicable round authorization must set runAllocation to null");
    return;
  }
  if (round.kind !== "reviewed-round") {
    fail("capContext.roundAuthorization.kind must be reviewed-round or not-applicable");
  }
  for (const field of fields) {
    if (!Number.isInteger(round[field]) || round[field] < 0) {
      fail(`reviewed round authorization requires non-negative integer ${field}`);
    }
  }
  if (round.runAllocation !== "planned" && round.runAllocation !== "infra-retry") {
    fail("reviewed round authorization requires runAllocation planned or infra-retry");
  }
  if (round.plannedAnswerCalls > round.absoluteAnswerCallCap) {
    fail("plannedAnswerCalls exceeds absoluteAnswerCallCap");
  }
  if (round.plannedJudgeCalls > round.absoluteJudgeCallCap) {
    fail("plannedJudgeCalls exceeds absoluteJudgeCallCap");
  }
  if (round.answerCallsConsumedBeforeRun + evaluator.answerCallsThisRun > round.absoluteAnswerCallCap) {
    fail("this run would exceed absoluteAnswerCallCap");
  }
  if (round.judgeCallsConsumedBeforeRun + evaluator.judgeCallsThisRun > round.absoluteJudgeCallCap) {
    fail("this run would exceed absoluteJudgeCallCap");
  }
  if (round.infraRetryConsumedBeforeRun > round.infraRetryReserve) {
    fail("infraRetryConsumedBeforeRun exceeds infraRetryReserve");
  }
  if (round.savedAnswerRejudgesConsumedBeforeRun > round.savedAnswerRejudgeReserve) {
    fail("savedAnswerRejudgesConsumedBeforeRun exceeds savedAnswerRejudgeReserve");
  }
  if (round.runAllocation === "planned") {
    if (round.answerCallsConsumedBeforeRun + evaluator.answerCallsThisRun > round.plannedAnswerCalls) {
      fail("this planned run would exceed plannedAnswerCalls");
    }
    if (round.judgeCallsConsumedBeforeRun + evaluator.judgeCallsThisRun > round.plannedJudgeCalls) {
      fail("this planned run would exceed plannedJudgeCalls");
    }
  } else if (evaluator.answerCallsThisRun > round.infraRetryReserve - round.infraRetryConsumedBeforeRun) {
    fail("this infra-retry run would exceed the remaining infraRetryReserve");
  }
}
