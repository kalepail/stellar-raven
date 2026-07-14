import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "..");

describe("improvements resolution lifecycle", () => {
  test("dry-run emits a durable receipt and immutable source without mutating", () => {
    const finding = "improvements/skills/sk-001-wasm-target-stale.md";
    const output = execFileSync(
      process.execPath,
      [
        "scripts/improvements-resolve.mjs",
        "--file", finding,
        "--resolved", "2026-07-14",
        "--live-recheck", "2026-07-14 raw main uses wasm32v1-none and canonical flags",
        "--review-evidence", "independent reviewer repeated the trigger",
        "--references-reviewed",
        "--upstream-commented",
        "--dry-run",
      ],
      { cwd: ROOT, encoding: "utf8" },
    );

    expect(output).toContain('"id": "sk-001"');
    expect(output).toMatch(/"sourceCommit": "[0-9a-f]{40}"/);
    expect(output).toContain("--- suggested upstream resolution comment ---");
    expect(output).toContain("ephemeral improvements lifecycle");
  });

  test("refuses to retire a finding before fixed-upstream", () => {
    const result = spawnSync(
      process.execPath,
      [
        "scripts/improvements-resolve.mjs",
        "--file", "improvements/skills/sk-003-getledgers-retention-conflict.md",
        "--live-recheck", "still reproduces",
        "--review-evidence", "reviewed",
        "--references-reviewed",
        "--upstream-commented",
        "--dry-run",
      ],
      { cwd: ROOT, encoding: "utf8" },
    );

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("status must be fixed-upstream before resolution");
  });
});
