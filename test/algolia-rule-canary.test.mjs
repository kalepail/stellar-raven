import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  RULE_CANARY_CASES,
  buildRuleCanaryParams,
  evaluateRuleCanary,
} from "../scripts/lib/algolia-rule-canary.mjs";

const target = (url = "https://developers.stellar.org/docs/tools/cli/install-cli") => ({
  url_without_anchor: url,
});
const unrelated = { url_without_anchor: "https://developers.stellar.org/docs/unrelated" };

describe("Algolia behavioral rule canary", () => {
  it("makes every rules-on/off request read-only and analytics-free", () => {
    for (const testCase of RULE_CANARY_CASES) {
      const rulesOn = buildRuleCanaryParams(testCase, true);
      const rulesOff = buildRuleCanaryParams(testCase, false);
      expect(rulesOn).toMatchObject({ analytics: false, clickAnalytics: false, enableRules: true });
      expect(rulesOff).toMatchObject({ analytics: false, clickAnalytics: false, enableRules: false });
    }
  });

  it("accepts a material rules-on improvement over miss and lower-rank controls", () => {
    const [curlCase, naturalCase] = RULE_CANARY_CASES;
    const miss = evaluateRuleCanary(curlCase, [target()], Array(5).fill(unrelated));
    const rankFour = evaluateRuleCanary(
      naturalCase,
      [target()],
      [unrelated, unrelated, unrelated, target(), unrelated],
    );
    expect(miss.assertions.every((assertion) => assertion.ok)).toBe(true);
    expect(rankFour.assertions.every((assertion) => assertion.ok)).toBe(true);
  });

  it("fails named assertions when the target or the material delta silently disappears", () => {
    const testCase = RULE_CANARY_CASES[0];
    const lostRule = evaluateRuleCanary(testCase, [unrelated], [unrelated]);
    const noLongerMaterial = evaluateRuleCanary(testCase, [target()], [target()]);
    expect(
      lostRule.assertions.filter((assertion) => !assertion.ok).map((assertion) => assertion.name),
    ).toEqual([
      `${testCase.assertionPrefix}/rules-on-target-rank-1`,
      `${testCase.assertionPrefix}/rules-on-off-material-delta`,
    ]);
    expect(
      noLongerMaterial.assertions.find((assertion) => assertion.name.endsWith("material-delta"))?.ok,
    ).toBe(false);
  });

  it("is safely inconclusive without credentials and makes no request", () => {
    const env = { ...process.env };
    delete env.ALGOLIA_APPLICATION_ID_DOCS;
    delete env.ALGOLIA_API_KEY_DOCS;
    const result = spawnSync(process.execPath, ["scripts/check-algolia-rule-canary.mjs"], {
      cwd: process.cwd(),
      env,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("algolia rule canary: INCONCLUSIVE");
    expect(result.stdout).toContain("no requests made");
  });

  it("fails closed on missing credentials when daily CI requires them", () => {
    const env = { ...process.env };
    delete env.ALGOLIA_APPLICATION_ID_DOCS;
    delete env.ALGOLIA_API_KEY_DOCS;
    const result = spawnSync(
      process.execPath,
      ["scripts/check-algolia-rule-canary.mjs", "--require-env"],
      { cwd: process.cwd(), env, encoding: "utf8" },
    );
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("algolia rule canary: ERROR (missing host credentials");
  });

  it("exits non-zero and prints the named assertion when drift is detected", () => {
    const result = spawnSync(
      process.execPath,
      ["scripts/check-algolia-rule-canary.mjs", "--self-test-drift"],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    expect(result.status).toBe(1);
    expect(result.stdout).toContain(
      "FAIL [raven-promote-stellar-cli-install/curl-command/rules-on-target-rank-1]",
    );
    expect(result.stderr).toContain("algolia rule canary: DRIFT");
  });
});
