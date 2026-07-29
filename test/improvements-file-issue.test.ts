import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "..");

describe("improvements issue filing template", () => {
  test("uses an explicit reader-first upstream title for an unreported finding", () => {
    const finding = "improvements/stellar-docs/sd-019-extend-footprint-multiple-entry-wording.md";
    const output = execFileSync(
      process.execPath,
      [
        "scripts/improvements-file-issue.mjs",
        "--file",
        finding,
        "--repo",
        "stellar/stellar-docs",
        "--dry-run",
      ],
      { cwd: ROOT, encoding: "utf8" },
    );

    expect(output).toMatch(/^# Correct multi-entry ExtendFootprintTTLOp guidance$/m);
    expect(output).not.toMatch(/^# sd-019:/m);
  });

  test("opens with a visible automation disclaimer and durable marker", () => {
    const finding = "improvements/stellar-docs/sd-019-extend-footprint-multiple-entry-wording.md";
    const output = execFileSync(
      process.execPath,
      [
        "scripts/improvements-file-issue.mjs",
        "--file",
        finding,
        "--repo",
        "stellar/stellar-docs",
        "--dry-run",
      ],
      { cwd: ROOT, encoding: "utf8" },
    );

    const marker = "<!-- generated-by-stellar-raven -->";
    const notice =
      "Generated automatically by Stellar Raven to flag a possible documentation or ecosystem-data gap. Please review before relying on it. Findings may be incomplete or incorrect.";
    expect(output).toContain(marker);
    expect(output).toContain(`> **Automated notice:** ${notice}`);
    expect(output.indexOf(marker)).toBeLessThan(output.indexOf("## Finding"));
    expect(output.indexOf("Automated notice")).toBeLessThan(output.indexOf("## Finding"));
  });

  test("omits an immutable snapshot when no matching committed blob exists", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "improvement-template-test-"));
    try {
      const finding = path.join(dir, "sd-999-uncommitted.md");
      writeFileSync(finding, `---
id: sd-999
service: stellar-docs
status: verified
discovered: 2026-07-14
upstreamTitle: Describe an uncommitted source record safely
evidence:
  - isolated template fixture
---

## Finding

An uncommitted finding must not link an older immutable blob.

## Evidence

The fixture has no committed blob.

## Recommendation

Keep the main link and omit the immutable snapshot.
`);
      const output = execFileSync(
        process.execPath,
        [
          "scripts/improvements-file-issue.mjs",
          "--file",
          finding,
          "--repo",
          "stellar/stellar-docs",
          "--dry-run",
        ],
        { cwd: ROOT, encoding: "utf8" },
      );

      expect(output).toContain("Public source record:");
      expect(output).not.toContain("Immutable source snapshot:");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

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
