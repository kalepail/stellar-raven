import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  lintCorroboration,
  lintGospelChanges,
  lintStale,
  lintSurface
} from "../eval/qa/lint-corpus.mjs";
import { updateRegister } from "../eval/qa/register-helper.mjs";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "qa-corpus");
const load = (name) => JSON.parse(readFileSync(join(FIXTURES, name), "utf8"));

describe("QA corpus lint lanes", () => {
  it("requires a changed verification event for judge-facing gospel edits", () => {
    const findings = lintGospelChanges([load("gospel-after.json")], [load("gospel-before.json")]);
    expect(findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ level: "error", lane: "gospel", message: expect.stringContaining("truth.verified") })
    ]));
  });

  it("rejects score-only root causes but permits explicit freshness drift", () => {
    const before = load("gospel-before.json");
    const scoreOnly = load("gospel-after.json");
    scoreOnly.truth.verified = {
      ...scoreOnly.truth.verified,
      date: "2026-07-11",
      rootCause: ["improve the eval score"]
    };
    expect(lintGospelChanges([scoreOnly], [before]).map((item) => item.message).join("\n")).toMatch(/score\/result/);

    const drift = structuredClone(scoreOnly);
    drift.truth.verified.rootCause = ["freshness-drift"];
    expect(lintGospelChanges([drift], [before])).toEqual([]);
  });

  it("requires verification evidence on every new case id, whatever its origin", () => {
    const fresh = load("gospel-after.json");
    fresh.id = "q-fixture-harvested";
    fresh.truth.origin = "kaan k-31";
    fresh.truth.verified = { ...fresh.truth.verified, evidence: [] };
    const findings = lintGospelChanges([fresh], [load("gospel-before.json")]);
    expect(findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ level: "error", lane: "gospel", id: "q-fixture-harvested", message: expect.stringContaining("new case requires non-empty truth.verified.evidence") })
    ]));
    const withEvidence = structuredClone(fresh);
    withEvidence.truth.verified.evidence = ["solo://proj/49/scratchpad/fixture"];
    expect(lintGospelChanges([withEvidence], [load("gospel-before.json")]).filter((item) => item.id === "q-fixture-harvested")).toEqual([]);
  });

  it("additionally requires a rootCause on new authored cases", () => {
    const authored = load("gospel-after.json");
    authored.id = "q-fixture-authored";
    authored.truth.origin = "authored 2026-07";
    authored.truth.verified = { ...authored.truth.verified, evidence: ["https://example.test/evidence"], rootCause: [] };
    const findings = lintGospelChanges([authored], [load("gospel-before.json")]);
    expect(findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ level: "error", lane: "gospel", id: "q-fixture-authored", message: expect.stringContaining("authored case requires non-empty truth.verified.rootCause") })
    ]));
  });

  it("fails the stale gate after truth.reverifyBy", () => {
    const findings = lintStale([load("stale.json")], "2026-07-11");
    expect(findings).toEqual([
      expect.objectContaining({ level: "error", lane: "stale", id: "q-fixture-stale" })
    ]);
  });

  it("requires corroboration for disputed truth", () => {
    const findings = lintCorroboration([load("corroboration-missing.json")], {});
    expect(findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ level: "error", lane: "corroboration", message: expect.stringContaining("requires corroboration") })
    ]));
  });

  it("rejects non-manifest surfaces and reuses the emitted-text exclusion guard", () => {
    const findings = lintSurface([load("surface-hidden.json")], load("manifest.json"));
    expect(findings.map((item) => item.message).join("\n")).toMatch(/non-exposed surface id/);
    expect(findings.map((item) => item.message).join("\n")).toMatch(/ADR-0003 leak/);
  });

  it("seeds missing register hashes without reopening, then reopens known changes", () => {
    const register = { clusters: [{ id: "storage", members: ["q-fixture-gospel"], verdict: "consistent" }] };
    const seeded = updateRegister(register, new Map([["q-fixture-gospel", "aaa"]]), { seed: true, date: "2026-07-11" });
    expect(seeded.reopened).toEqual([]);
    expect(register.clusters[0].memberContentSha256).toEqual({ "q-fixture-gospel": "aaa" });
    const changed = updateRegister(register, new Map([["q-fixture-gospel", "bbb"]]), { date: "2026-07-12" });
    expect(changed.reopened).toEqual(["storage"]);
    expect(register.clusters[0].verdict).toBe("reopen");
  });
});
