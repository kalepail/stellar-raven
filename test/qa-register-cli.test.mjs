import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "..", "eval", "qa", "register-helper.mjs");

describe("QA register CLI", () => {
  it("hashes raw bytes and keeps --check read-only", () => {
    const root = mkdtempSync(join(tmpdir(), "qa-register-cli-"));
    try {
      const corpus = join(root, "corpus");
      const register = join(root, "register.json");
      mkdirSync(corpus);
      writeFileSync(join(corpus, "case.json"), '{"id":"q-temp"}\n');
      writeFileSync(register, '{"clusters":[{"id":"temp","members":["q-temp"]}]}\n');
      const run = (...args) => spawnSync(process.execPath, [
        CLI, "--corpus", corpus, "--register", register, "--date", "2026-07-28", ...args
      ], { cwd: root, encoding: "utf8" });

      expect(run().status).toBe(0);
      const baseline = readFileSync(register, "utf8");
      const firstHash = JSON.parse(baseline).clusters[0].memberContentSha256["q-temp"];
      writeFileSync(join(corpus, "case.json"), '{ "id": "q-temp" }\n');

      const check = run("--check");
      expect(check.status).toBe(1);
      expect(check.stdout).toContain("changes required");
      expect(readFileSync(register, "utf8")).toBe(baseline);

      expect(run().status).toBe(0);
      const updated = readFileSync(register, "utf8");
      expect(JSON.parse(updated).clusters[0].memberContentSha256["q-temp"]).not.toBe(firstHash);
      expect(readdirSync(root).some((name) => name.endsWith(".tmp"))).toBe(false);
      expect(run("--check").status).toBe(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
