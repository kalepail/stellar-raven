import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "..");
const CASES_PATH = join(ROOT, "eval", "qa", "cases.json");
const REJUDGE_PATH = join(ROOT, "eval", "qa", "re-judge.mjs");
const temporaryDirectories: string[] = [];

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function writeResults(verdicts: Array<null | { score: string }>) {
  const battery = JSON.parse(readFileSync(CASES_PATH, "utf8"));
  const selected = battery.cases.slice(0, verdicts.length);
  const directory = mkdtempSync(join(tmpdir(), "raven-rejudge-"));
  temporaryDirectories.push(directory);
  const resultsPath = join(directory, "results.json");
  writeFileSync(
    resultsPath,
    `${JSON.stringify({
      meta: {
        casesPath: CASES_PATH,
        judgeModel: null,
        judgeRubric: null,
        packVersion: "p3",
        inputSnapshot: { casesSha256: sha256(JSON.stringify(selected)) }
      },
      rows: selected.map((item: { id: string }, index: number) => ({
        id: item.id,
        answer: "Saved answer.",
        transcript: [],
        verdict: verdicts[index]
      }))
    })}\n`
  );
  return { resultsPath, ids: selected.map((item: { id: string }) => item.id) };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("re-judge saved-answer selection", () => {
  it("refuses a quarantine source or flips baseline before dry-run processing", () => {
    const directory = mkdtempSync(join(tmpdir(), "raven-rejudge-quarantine-"));
    temporaryDirectories.push(directory);
    const quarantinePath = join(directory, "quarantine.json");
    writeFileSync(quarantinePath, JSON.stringify({ artifactContract: "playground-semantic-quarantine/v1", quarantinedRows: [] }));
    const source = spawnSync(process.execPath, [REJUDGE_PATH, quarantinePath, "--ids", "anything", "--allow-non-identical", "--dry-run"], {
      cwd: ROOT,
      encoding: "utf8"
    });
    expect(source.status).toBe(1);
    expect(source.stderr).toContain("non-promotable playground quarantine");

    const { resultsPath } = writeResults([{ score: "correct" }]);
    const baseline = spawnSync(process.execPath, [REJUDGE_PATH, resultsPath, "--flips-vs", quarantinePath, "--allow-non-identical", "--dry-run"], {
      cwd: ROOT,
      encoding: "utf8"
    });
    expect(baseline.status).toBe(1);
    expect(baseline.stderr).toContain("non-promotable playground quarantine");
  });

  it("labels an all-unjudged --ids dry run as initial judging without spending", () => {
    const { resultsPath, ids } = writeResults([null]);
    const result = spawnSync(
      process.execPath,
      [REJUDGE_PATH, resultsPath, "--ids", ids[0]!, "--allow-non-identical", "--dry-run"],
      { cwd: ROOT, encoding: "utf8" }
    );

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({ selectedIds: ids, initialJudging: true });
  });

  it("rejects a mixed judged/unjudged --ids selection before any judge call", () => {
    const { resultsPath, ids } = writeResults([{ score: "correct" }, null]);
    const result = spawnSync(
      process.execPath,
      [REJUDGE_PATH, resultsPath, "--ids", ids.join(","), "--allow-non-identical", "--dry-run"],
      { cwd: ROOT, encoding: "utf8" }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("cannot mix saved verdicts with --no-judge rows");
  });
});
