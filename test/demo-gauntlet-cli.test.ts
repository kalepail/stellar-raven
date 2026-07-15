import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
// @ts-ignore The executable deliberately exposes pure CLI helpers for this test seam.
import * as gauntlet from "../scripts/run-demo-model-gauntlet.mjs";

const { buildLaunchPlan, formatLaunchPlan, parseGauntletArgs, validateGauntletInvocation } = gauntlet;

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function scratchOutDir() {
  const parent = await mkdtemp(path.join(os.tmpdir(), "demo-gauntlet-cli-"));
  temporaryDirectories.push(parent);
  return path.join(parent, "artifacts");
}

function runCli(args: string[]) {
  return spawnSync(process.execPath, ["scripts/run-demo-model-gauntlet.mjs", ...args], {
    cwd: process.cwd(),
    encoding: "utf8"
  });
}

describe("demo model gauntlet CLI safety", () => {
  it("lets literal help win before strict parsing and leaves its requested output absent", async () => {
    const outDir = await scratchOutDir();
    const result = runCli(["--help", "--not-a-real-flag", "--out-dir", outDir]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage: node scripts/run-demo-model-gauntlet.mjs");
    expect(existsSync(outDir)).toBe(false);
  });

  it("prints the validated plan but makes no output before --confirm-paid", async () => {
    const outDir = await scratchOutDir();
    const result = runCli(["--models", "openai/test", "--prompts", "rpc-simulate", "--out-dir", outDir]);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("planned Playground chat turns: 1 (not guaranteed provider calls)");
    expect(result.stderr).toContain("--confirm-paid");
    expect(existsSync(outDir)).toBe(false);
  });

  it("rejects an invalid invocation before creating its requested output", async () => {
    const outDir = await scratchOutDir();
    const result = runCli(["--models", "openai/test", "--prompts", "not-a-prompt", "--out-dir", outDir]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Invalid prompt ids: not-a-prompt.");
    expect(existsSync(outDir)).toBe(false);
  });

  it("strictly rejects unknown flags and flags missing a value", () => {
    expect(() => parseGauntletArgs(["--frobnicate"])).toThrow("Unknown argument: --frobnicate");
    expect(() => parseGauntletArgs(["--models", "--prompts", "rpc-simulate"])).toThrow("--models requires a value.");
  });

  it("does not default explicit empty model or prompt selections", () => {
    expect(() => validateGauntletInvocation(parseGauntletArgs(["--models", ""]))).toThrow("Model selection must be nonempty.");
    expect(() => validateGauntletInvocation(parseGauntletArgs(["--prompts", ""]))).toThrow("Prompt selection must be nonempty.");
  });

  it("rejects duplicate prompt ids before the paid launch plan", () => {
    expect(() => validateGauntletInvocation(parseGauntletArgs(["--prompts", "rpc-simulate,rpc-simulate"]))).toThrow(
      "Duplicate prompt ids: rpc-simulate."
    );
  });

  it("reports exact invalid prompt ids and rejects invalid numeric and effort values", () => {
    expect(() => validateGauntletInvocation(parseGauntletArgs(["--prompts", "rpc-simulate,not-real,also-not-real"]))).toThrow(
      "Invalid prompt ids: not-real, also-not-real."
    );
    for (const args of [
      ["--repeats", "0"],
      ["--timeout-ms", "abc"],
      ["--port-base", "65535"],
      ["--reasoning-effort", "bogus"]
    ]) {
      expect(() => validateGauntletInvocation(parseGauntletArgs(args))).toThrow();
    }
    expect(() => validateGauntletInvocation(parseGauntletArgs(["--openai-api-mode", "unsupported"]))).toThrow(
      "--openai-api-mode must be chat or responses."
    );
  });

  it("computes launch-plan turns across the full selected matrix", () => {
    const invocation = validateGauntletInvocation(
      parseGauntletArgs([
        "--models", "model-a,model-b",
        "--reasoning-efforts", "default,high",
        "--prompts", "rpc-simulate,soroswap-builder",
        "--repeats", "3",
        "--port-base", "9000",
        "--timeout-ms", "5000",
        "--out-dir", "/tmp/gauntlet-plan"
      ])
    );
    const plan = buildLaunchPlan(invocation);

    expect(plan.totalPaidTurns).toBe(24);
    expect(plan.portLast).toBe(9003);
    expect(formatLaunchPlan(plan)).toContain("planned Playground chat turns: 24 (not guaranteed provider calls)");
  });
});
