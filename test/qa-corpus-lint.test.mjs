import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  isPullRequestCI,
  lintCorroboration,
  lintDateContingentTraps,
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

  it("fails uncovered numeric key facts for migration-carried real-world cases", () => {
    const kase = load("corroboration-missing.json");
    kase.truth = { ...kase.truth, domain: "real-world", status: "confirmed", origin: "raven-next fixture" };
    kase.golden = { ...kase.golden, keyFacts: ["Protocol 19 activated in 2022."] };
    const findings = lintCorroboration([kase], {});
    expect(findings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        level: "error",
        lane: "corroboration",
        message: expect.stringContaining("numeric/version/date keyFact lacks")
      })
    ]));
  });

  it("keeps the heuristic negative-claim detector at warning level", () => {
    const kase = load("corroboration-missing.json");
    kase.truth = { ...kase.truth, status: "confirmed" };
    kase.golden = { ...kase.golden, answer: "No compatible operation exists.", keyFacts: [] };
    expect(lintCorroboration([kase], {})).toEqual([
      expect.objectContaining({
        level: "warn",
        lane: "corroboration",
        message: expect.stringContaining("possible negative claim")
      })
    ]);
  });

  it("rejects non-manifest surfaces and reuses the emitted-text exclusion guard", () => {
    const findings = lintSurface([load("surface-hidden.json")], load("manifest.json"));
    expect(findings.map((item) => item.message).join("\n")).toMatch(/non-exposed surface id/);
    expect(findings.map((item) => item.message).join("\n")).toMatch(/ADR-0003 leak/);
  });

  it("seeds all register hashes without reopening, then reopens known changes", () => {
    const register = {
      clusters: [{ id: "storage", members: ["q-fixture-gospel"], verdict: "consistent" }],
      numericInvariants: {
        entries: [{ label: "numeric", affectedCaseIds: ["q-fixture-gospel"], verdict: "consistent" }]
      },
      dateContingentTraps: {
        entries: [{ triggerDateEvent: "date", caseIds: ["q-fixture-gospel"], verdict: "consistent" }]
      }
    };
    const seeded = updateRegister(register, new Map([["q-fixture-gospel", "aaa"]]), { seed: true, date: "2026-07-11" });
    expect(seeded.reopened).toEqual([]);
    expect(register.clusters[0].memberContentSha256).toEqual({ "q-fixture-gospel": "aaa" });
    expect(register.numericInvariants.entries[0].memberContentSha256).toEqual({ "q-fixture-gospel": "aaa" });
    expect(register.dateContingentTraps.entries[0].memberContentSha256).toEqual({ "q-fixture-gospel": "aaa" });
    const changed = updateRegister(register, new Map([["q-fixture-gospel", "bbb"]]), { date: "2026-07-12" });
    expect(changed.reopened).toEqual(["date", "numeric", "storage"]);
    for (const entry of [
      register.clusters[0],
      register.numericInvariants.entries[0],
      register.dateContingentTraps.entries[0]
    ]) expect(entry.verdict).toBe("reopen");
  });

  it("reports missing registered case ids as sorted warnings without throwing", () => {
    const register = {
      clusters: [{ id: "storage", members: ["q-fixture-vanished"], verdict: "consistent" }],
      dateContingentTraps: {
        entries: [{ triggerDateEvent: "date", caseIds: ["q-fixture-also-gone"], verdict: "consistent" }]
      }
    };
    const result = updateRegister(register, new Map(), { date: "2026-07-28" });
    expect(result.missingCases).toEqual([
      { entry: expect.stringContaining("date"), id: "q-fixture-also-gone" },
      { entry: expect.stringContaining("storage"), id: "q-fixture-vanished" }
    ]);
  });

  it("checks date-trap case ids and quoted reverifyBy dates", () => {
    const register = {
      dateContingentTraps: {
        entries: [{
          triggerDateEvent: "q-fixture-live reverifyBy 2026-08-01",
          disposition: "q-fixture-live reverifyBy 2026-08-02",
          caseIds: ["q-fixture-live", "q-fixture-missing"]
        }]
      }
    };
    const findings = lintDateContingentTraps([
      { id: "q-fixture-live", truth: { reverifyBy: "2026-08-01" } }
    ], register);
    expect(findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ level: "error", lane: "date-trap", id: "q-fixture-missing", message: expect.stringContaining("missing case") }),
      expect.objectContaining({ level: "error", lane: "date-trap", id: "q-fixture-live", message: expect.stringContaining("does not match") })
    ]));
  });

  // Regression: the gospel gate must fail-closed only for PRs. A push to a
  // branch (no PR base ref) resolves its base from the event `before` SHA and
  // must not be treated as a PR, or CI on every push to main errors out.
  it("treats push CI as non-PR so it does not fail closed without a PR base", () => {
    expect(isPullRequestCI({ CI: "true", GITHUB_EVENT_NAME: "push" })).toBe(false);
    expect(isPullRequestCI({ CI: "true", GITHUB_EVENT_NAME: "pull_request" })).toBe(true);
    expect(isPullRequestCI({ CI: "true", GITHUB_BASE_REF: "main" })).toBe(true);
    expect(isPullRequestCI({})).toBe(false);
  });
});
