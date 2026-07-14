import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "..");

describe("improvements issue filing template", () => {
  test("links the exact source record and gives upstream a resolution handoff", () => {
    const finding = "improvements/skills/sk-012-mpp-session-mode-terminology.md";
    const output = execFileSync(
      process.execPath,
      ["scripts/improvements-file-issue.mjs", "--file", finding, "--dry-run"],
      { cwd: ROOT, encoding: "utf8" },
    );

    expect(output).toContain("## Source Record");
    expect(output).toContain(`https://github.com/kalepail/stellar-raven/blob/main/${finding}`);
    expect(output).toMatch(new RegExp(`https://github\\.com/kalepail/stellar-raven/blob/[0-9a-f]{40}/${finding}`));
    expect(output).toContain("## Resolution Handoff");
    expect(output).toContain("template=upstream-improvement-ready.yml");
    expect(output).toContain("Raven independently verifies the upstream surface");
    expect(output).toContain("retired to Raven's resolved ledger");
  });
});
