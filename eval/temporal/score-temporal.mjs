#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assertNotPlaygroundQuarantine } from "../playground/artifact-contract.mjs";

export const EXPECTATIONS_CONTRACT = "temporal-expectations-v1";
export const FIXTURES_CONTRACT = "temporal-detector-fixtures-v1";
export const REPORT_CONTRACT = "temporal-score-report-v1";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_EXPECTATIONS_PATH = path.join(HERE, "expectations.json");
export const DEFAULT_FIXTURES_PATH = path.join(HERE, "fixtures", "detectors.json");

const PREREGISTERED_CLASSES = new Map([
  ["q-builder-justin-rice-history", "positive"],
  ["q-builder-content-by-person", "positive"],
  ["q-edge-noinfo-stellar-native-privacy-default", "positive"],
  ["q-scf-verified-members", "positive"],
  ["q-defi-lending-landscape-live", "positive"],
  ["q-eco-freighter-wallet", "positive"],
  ["q-sep53-message-signing", "control"],
  ["q-pc-bucketlist-vs-merkle-inclusion-proof", "control"],
  ["q-hist-cctp-stellar-live-announcement", "control"],
  ["q-hist-meridian-2026-corrected-venue", "control"],
  ["q-edge-closed-world-builder-directory-miss", "control"],
  ["q-edge-lumenloop-person-entity-empty", "control"]
]);

function fail(message) {
  throw new Error(`Temporal scorer: ${message}`);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(value, label, { allowEmpty = false } = {}) {
  if (typeof value !== "string" || (!allowEmpty && value.length === 0)) {
    fail(`${label} must be a${allowEmpty ? "" : " non-empty"} string`);
  }
  return value;
}

function requirePattern(value, label, { nullable = false } = {}) {
  if (nullable && value === null) return null;
  const source = requireString(value, label);
  try {
    new RegExp(source, "iu");
  } catch (error) {
    fail(`${label} is not a valid /iu regular expression: ${error.message}`);
  }
  return source;
}

export function readJsonFile(filePath, label = "JSON") {
  let text;
  try {
    text = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") fail(`${label} file not found: ${filePath}`);
    fail(`cannot read ${label} file ${filePath}: ${error.message}`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`malformed ${label} JSON at ${filePath}: ${error.message}`);
  }
}

export function validateExpectations(raw, source = "expectations") {
  if (!isRecord(raw)) fail(`${source} must be a JSON object`);
  if (raw.contract !== EXPECTATIONS_CONTRACT) {
    fail(`${source}.contract must equal ${EXPECTATIONS_CONTRACT}`);
  }
  requireString(raw.candidateObservationMarker, `${source}.candidateObservationMarker`);

  const replicates = raw.expectedReplicatesPerSurfaceArm;
  if (!isRecord(replicates)) fail(`${source}.expectedReplicatesPerSurfaceArm must be an object`);
  for (const caseClass of ["positive", "control"]) {
    if (!Number.isInteger(replicates[caseClass]) || replicates[caseClass] < 1) {
      fail(`${source}.expectedReplicatesPerSurfaceArm.${caseClass} must be a positive integer`);
    }
  }

  if (!Array.isArray(raw.cases)) fail(`${source}.cases must be an array`);
  const seen = new Set();
  const validatedCases = raw.cases.map((entry, index) => {
    const label = `${source}.cases[${index}]`;
    if (!isRecord(entry)) fail(`${label} must be an object`);
    const id = requireString(entry.id, `${label}.id`);
    if (seen.has(id)) fail(`${source} contains duplicate case id ${id}`);
    seen.add(id);

    const expectedClass = PREREGISTERED_CLASSES.get(id);
    if (!expectedClass) fail(`${source} contains non-preregistered case id ${id}`);
    if (entry.class !== expectedClass) {
      fail(`${label}.class for ${id} must be ${expectedClass}, got ${JSON.stringify(entry.class)}`);
    }
    if (!isRecord(entry.perSurfaceBaseline)) fail(`${label}.perSurfaceBaseline must be an object`);
    for (const surface of ["mcp", "playground"]) {
      const value = entry.perSurfaceBaseline[surface];
      if (value !== null && !["correct", "partial", "wrong", "error"].includes(value)) {
        fail(`${label}.perSurfaceBaseline.${surface} must be a QA score or null`);
      }
    }
    if (typeof entry.asOfRequired !== "boolean") fail(`${label}.asOfRequired must be boolean`);
    if (entry.asOfRequired !== (expectedClass === "positive")) {
      fail(`${label}.asOfRequired must be ${expectedClass === "positive"} for a ${expectedClass}`);
    }
    if (!Array.isArray(entry.qualifierPatterns)) fail(`${label}.qualifierPatterns must be an array`);
    const qualifierPatterns = entry.qualifierPatterns.map((value, patternIndex) =>
      requirePattern(value, `${label}.qualifierPatterns[${patternIndex}]`)
    );
    if (entry.asOfRequired && qualifierPatterns.length === 0) {
      fail(`${label}.qualifierPatterns must not be empty when asOfRequired is true`);
    }
    if (!Array.isArray(entry.staleTraps)) fail(`${label}.staleTraps must be an array`);
    const staleTraps = entry.staleTraps.map((trap, trapIndex) => {
      const trapLabel = `${label}.staleTraps[${trapIndex}]`;
      if (!isRecord(trap)) fail(`${trapLabel} must be an object`);
      return {
        assertPattern: requirePattern(trap.assertPattern, `${trapLabel}.assertPattern`),
        historicalGuardPattern: requirePattern(trap.historicalGuardPattern, `${trapLabel}.historicalGuardPattern`),
        evidenceDate: requireString(trap.evidenceDate, `${trapLabel}.evidenceDate`)
      };
    });
    return {
      ...entry,
      id,
      qualifierPatterns,
      staleTraps,
      anchorAsFactPattern: requirePattern(entry.anchorAsFactPattern, `${label}.anchorAsFactPattern`, {
        nullable: true
      }),
      spuriousHedgePattern: requirePattern(entry.spuriousHedgePattern, `${label}.spuriousHedgePattern`, {
        nullable: true
      })
    };
  });

  const missing = [...PREREGISTERED_CLASSES].filter(([id]) => !seen.has(id)).map(([id]) => id);
  if (missing.length > 0) fail(`${source} is missing preregistered case ids: ${missing.join(", ")}`);
  if (seen.size !== PREREGISTERED_CLASSES.size) {
    fail(`${source} must contain exactly ${PREREGISTERED_CLASSES.size} preregistered cases`);
  }

  return {
    ...raw,
    cases: validatedCases,
    byId: new Map(validatedCases.map((entry) => [entry.id, entry]))
  };
}

export function loadExpectations(filePath = DEFAULT_EXPECTATIONS_PATH) {
  return validateExpectations(readJsonFile(filePath, "expectations"), filePath);
}

function matches(source, answer) {
  return source !== null && new RegExp(source, "iu").test(answer);
}

export function scoreAnswer(expectation, answer) {
  requireString(answer, `answer for ${expectation.id}`, { allowEmpty: true });
  const staleTrapMatches = expectation.staleTraps.filter(
    (trap) => matches(trap.assertPattern, answer) && !matches(trap.historicalGuardPattern, answer)
  );
  return {
    asOfDated: expectation.asOfRequired && expectation.qualifierPatterns.some((pattern) => matches(pattern, answer)),
    staleAsCurrent: staleTrapMatches.length > 0,
    staleTrapEvidenceDates: staleTrapMatches.map((trap) => trap.evidenceDate),
    anchorAsFact: matches(expectation.anchorAsFactPattern, answer),
    spuriousHedge: matches(expectation.spuriousHedgePattern, answer)
  };
}

function resultText(value) {
  if (typeof value === "string") return value;
  if (value === undefined) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function isExecuteEntry(entry) {
  return isRecord(entry) && typeof entry.tool === "string" && /(?:^|__)execute$/u.test(entry.tool);
}

export function hasObservationContext(row, marker) {
  if (!Array.isArray(row.transcript)) return false;
  return row.transcript.some((entry) => isExecuteEntry(entry) && resultText(entry.result).includes(marker));
}

function hasObservationContextInAnyResult(row, marker) {
  if (!Array.isArray(row.transcript)) return false;
  return row.transcript.some((entry) => isRecord(entry) && resultText(entry.result).includes(marker));
}

function detectedSurface(meta) {
  if (!isRecord(meta)) return null;
  if (
    (typeof meta.transport === "string" && meta.transport.includes("/playground/")) ||
    (typeof meta.lane === "string" && meta.lane.startsWith("playground-"))
  ) {
    return "playground";
  }
  if (meta.surface === "search-execute" || typeof meta.variant === "string") return "mcp";
  return null;
}

function validateArtifact(input, expectations) {
  const { surface, arm, source, data } = input;
  if (!["mcp", "playground"].includes(surface)) fail(`invalid input surface ${JSON.stringify(surface)}`);
  if (!["baseline", "candidate"].includes(arm)) fail(`invalid input arm ${JSON.stringify(arm)}`);
  if (!isRecord(data)) fail(`result artifact ${source} must be a JSON object`);
  assertNotPlaygroundQuarantine(data, `result artifact ${source}`);
  const inferred = detectedSurface(data.meta);
  if (inferred && inferred !== surface) {
    fail(`result artifact ${source} identifies surface ${inferred}, not declared surface ${surface}`);
  }
  if (!Array.isArray(data.rows) || data.rows.length === 0) {
    fail(`result artifact ${source} must contain a non-empty rows array`);
  }

  return data.rows.map((row, rowIndex) => {
    const label = `${source} rows[${rowIndex}]`;
    if (!isRecord(row)) fail(`${label} must be an object`);
    const id = requireString(row.id, `${label}.id`);
    const expectation = expectations.byId.get(id);
    if (!expectation) fail(`${label} has non-selected id ${id}`);
    if (row.class !== undefined && row.class !== expectation.class) {
      fail(`${label}.class for ${id} must be ${expectation.class}`);
    }
    const answer = requireString(row.answer, `${label}.answer`, { allowEmpty: true });
    if (!Array.isArray(row.transcript)) fail(`${label}.transcript must be an array`);
    const observationPresent = hasObservationContext(row, expectations.candidateObservationMarker);
    if (arm === "candidate" && !observationPresent) {
      fail(`${label} (${surface}/${arm}/${id}) lacks the candidate observation block in an execute result`);
    }
    if (arm === "baseline" && hasObservationContextInAnyResult(row, expectations.candidateObservationMarker)) {
      fail(`${label} (${surface}/${arm}/${id}) unexpectedly contains the candidate observation block`);
    }
    return { id, answer, expectation, observationPresent };
  });
}

function metric(count, eligible, ids) {
  return { count, eligible, ids: [...new Set(ids)].sort() };
}

function summarizeRows(rows) {
  const scored = rows.map((row) => ({ ...row, score: scoreAnswer(row.expectation, row.answer) }));
  const positives = scored.filter((row) => row.expectation.class === "positive");
  const staleEligible = scored.filter((row) => row.expectation.staleTraps.length > 0);
  const anchorEligible = scored.filter((row) => row.expectation.anchorAsFactPattern !== null);
  const hedgeEligible = scored.filter((row) => row.expectation.spuriousHedgePattern !== null);
  const asOfCount = positives.filter((row) => row.score.asOfDated).length;
  const staleRows = staleEligible.filter((row) => row.score.staleAsCurrent);
  const anchorRows = anchorEligible.filter((row) => row.score.anchorAsFact);
  const hedgeRows = hedgeEligible.filter((row) => row.score.spuriousHedge);
  return {
    rowCount: scored.length,
    attribution: {
      verifiedRows: scored.length,
      observationContextPresent: scored.filter((row) => row.observationPresent).length
    },
    asOfDatingRate: {
      numerator: asOfCount,
      denominator: positives.length,
      rate: positives.length === 0 ? null : Number((asOfCount / positives.length).toFixed(6)),
      missingIds: [...new Set(positives.filter((row) => !row.score.asOfDated).map((row) => row.id))].sort()
    },
    staleAsCurrent: metric(staleRows.length, staleEligible.length, staleRows.map((row) => row.id)),
    anchorAsFact: metric(anchorRows.length, anchorEligible.length, anchorRows.map((row) => row.id)),
    spuriousHedge: metric(hedgeRows.length, hedgeEligible.length, hedgeRows.map((row) => row.id))
  };
}

export function scoreArtifacts(expectations, inputs) {
  if (!Array.isArray(inputs) || inputs.length === 0) fail("at least one result artifact is required");
  const grouped = new Map([
    ["mcp/baseline", []],
    ["mcp/candidate", []],
    ["playground/baseline", []],
    ["playground/candidate", []]
  ]);
  for (const input of inputs) {
    const key = `${input.surface}/${input.arm}`;
    if (!grouped.has(key)) fail(`invalid result group ${key}`);
    grouped.get(key).push(...validateArtifact(input, expectations));
  }

  for (const [key, rows] of grouped) {
    if (rows.length === 0) fail(`missing required result group ${key}`);
    const counts = new Map();
    for (const row of rows) counts.set(row.id, (counts.get(row.id) ?? 0) + 1);
    for (const expectation of expectations.cases) {
      const expected = expectations.expectedReplicatesPerSurfaceArm[expectation.class];
      const actual = counts.get(expectation.id) ?? 0;
      if (actual !== expected) {
        fail(`${key} must contain ${expected} ${expectation.class} row(s) for ${expectation.id}; found ${actual}`);
      }
    }
  }

  const report = {
    contract: REPORT_CONTRACT,
    expectationsContract: expectations.contract,
    selectedCaseCounts: { positive: 6, control: 6 },
    surfaces: {}
  };
  for (const surface of ["mcp", "playground"]) {
    report.surfaces[surface] = {};
    for (const arm of ["baseline", "candidate"]) {
      report.surfaces[surface][arm] = summarizeRows(grouped.get(`${surface}/${arm}`));
    }
  }
  return report;
}

function validateDetectorFixtures(raw, source) {
  if (!isRecord(raw) || raw.contract !== FIXTURES_CONTRACT || !Array.isArray(raw.fixtures)) {
    fail(`${source} must use contract ${FIXTURES_CONTRACT} with a fixtures array`);
  }
  return raw.fixtures;
}

export function runSelfTest({
  expectationsPath = DEFAULT_EXPECTATIONS_PATH,
  fixturesPath = DEFAULT_FIXTURES_PATH
} = {}) {
  const expectations = loadExpectations(expectationsPath);
  const fixtures = validateDetectorFixtures(readJsonFile(fixturesPath, "detector fixtures"), fixturesPath);
  const requiredNames = new Set([
    "missing-as-of-detection",
    "justin-rice-stale-as-current",
    "observation-anchor-as-publication-fact",
    "spurious-hedge-on-stable-mechanism",
    "publication-date-control-zero-fires",
    "event-date-control-zero-fires"
  ]);
  for (const fixture of fixtures) {
    if (!isRecord(fixture)) fail(`${fixturesPath} contains a non-object fixture`);
    const name = requireString(fixture.name, "detector fixture name");
    requiredNames.delete(name);
    const expectation = expectations.byId.get(fixture.id);
    if (!expectation) fail(`detector fixture ${name} uses non-selected id ${fixture.id}`);
    if (!isRecord(fixture.expected)) fail(`detector fixture ${name}.expected must be an object`);
    const actual = scoreAnswer(expectation, fixture.answer);
    for (const field of ["asOfDated", "staleAsCurrent", "anchorAsFact", "spuriousHedge"]) {
      if (typeof fixture.expected[field] !== "boolean") {
        fail(`detector fixture ${name}.expected.${field} must be boolean`);
      }
      if (actual[field] !== fixture.expected[field]) {
        fail(`detector fixture ${name} expected ${field}=${fixture.expected[field]}, got ${actual[field]}`);
      }
    }
  }
  if (requiredNames.size > 0) fail(`detector fixtures are missing required scenarios: ${[...requiredNames].join(", ")}`);
  return { passed: fixtures.length, names: fixtures.map((fixture) => fixture.name) };
}

function usage() {
  return [
    "Usage:",
    "  node eval/temporal/score-temporal.mjs --self-test",
    "  node eval/temporal/score-temporal.mjs \\",
    "    --input mcp:baseline:<results.json> --input mcp:candidate:<results.json> \\",
    "    --input playground:baseline:<results.json> --input playground:candidate:<results.json>",
    "",
    "Repeat --input for replicate artifacts. Positives must total two rows and controls one row",
    "for every surface/arm. Optional: --expectations <path> --output <report.json>."
  ].join("\n");
}

function parseInputSpec(spec) {
  const match = /^(mcp|playground):(baseline|candidate):(.+)$/u.exec(spec);
  if (!match) fail(`invalid --input ${JSON.stringify(spec)}; expected surface:arm:path`);
  return { surface: match[1], arm: match[2], filePath: match[3] };
}

export function main(argv = process.argv.slice(2)) {
  let expectationsPath = DEFAULT_EXPECTATIONS_PATH;
  let outputPath = null;
  let selfTest = false;
  const specs = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--self-test") selfTest = true;
    else if (arg === "--help" || arg === "-h") {
      process.stdout.write(`${usage()}\n`);
      return;
    } else if (arg === "--expectations" || arg === "--output" || arg === "--input") {
      const value = argv[index + 1];
      if (!value) fail(`${arg} requires a value`);
      index += 1;
      if (arg === "--expectations") expectationsPath = value;
      else if (arg === "--output") outputPath = value;
      else specs.push(parseInputSpec(value));
    } else {
      fail(`unknown argument ${JSON.stringify(arg)}\n${usage()}`);
    }
  }

  if (selfTest) {
    if (specs.length > 0 || outputPath !== null) fail("--self-test cannot be combined with result inputs or --output");
    const result = runSelfTest({ expectationsPath });
    process.stdout.write(`Temporal scorer self-test PASS (${result.passed} fixtures)\n`);
    return result;
  }
  if (specs.length === 0) fail(`no result inputs supplied\n${usage()}`);
  const expectations = loadExpectations(expectationsPath);
  const inputs = specs.map((spec) => ({
    surface: spec.surface,
    arm: spec.arm,
    source: spec.filePath,
    data: readJsonFile(spec.filePath, "result artifact")
  }));
  const report = scoreArtifacts(expectations, inputs);
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (outputPath) fs.writeFileSync(outputPath, serialized);
  else process.stdout.write(serialized);
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
