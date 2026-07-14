import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "..");

describe("improvements probe scoping", () => {
  test("can exclude an explicitly out-of-scope service", () => {
    const output = execFileSync(
      process.execPath,
      [
        "scripts/improvements-run-probes.mjs",
        "--service",
        "stellar-docs",
        "--exclude-service",
        "stellar-docs",
      ],
      { cwd: ROOT, encoding: "utf8" },
    );

    expect(output).toContain("0 errors, 0 run");
  });

  test("rejects an unknown service before running any probe", () => {
    const result = spawnSync(
      process.execPath,
      ["scripts/improvements-run-probes.mjs", "--service", "not-a-service"],
      { cwd: ROOT, encoding: "utf8" },
    );

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("unknown service 'not-a-service'");
  });
});
