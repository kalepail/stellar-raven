import { mkdtempSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "..");
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("generic result readers", () => {
  it("reject quarantine artifacts before producing any sidecar or aggregate", () => {
    const directory = mkdtempSync(join(tmpdir(), "raven-quarantine-reader-"));
    temporaryDirectories.push(directory);
    const input = join(directory, "input.json");
    writeFileSync(input, JSON.stringify({ artifactContract: "playground-semantic-quarantine/v1", quarantinedRows: [] }));
    const scripts = [
      ["eval/plan/grade-plan.mjs", `${input.replace(/\.json$/, "")}.plan.json`],
      ["eval/qa/analyze-composition.mjs", `${input.replace(/\.json$/, "")}.composition.json`],
      ["eval/qa/cluster-missing-facts.mjs", null]
    ] as const;
    for (const [script, sidecar] of scripts) {
      const result = spawnSync(process.execPath, [join(ROOT, script), input], { cwd: ROOT, encoding: "utf8" });
      expect(result.status, `${script}: ${result.stderr}`).toBe(1);
      expect(result.stderr).toContain("non-promotable playground quarantine");
      if (sidecar) expect(existsSync(sidecar)).toBe(false);
    }
  });
});
