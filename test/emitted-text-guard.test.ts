/**
 * assertNoNonExposedRefsInText — the ADR-0003 leak guard's reusable core
 * (scripts/emitted-text-guard.mjs), factored out of build-catalog.mjs's
 * per-entry check so /demo page copy and prompt text (which have no
 * manifest opIds allowlist) can run the SAME exclusion-data checks. Real
 * exclusion data from scripts/exposure.mjs, not fixture stand-ins — a
 * renamed/removed exclusion must surface here, not just in the build.
 */
import { describe, expect, it } from "vitest";
import { assertNoNonExposedRefsInText } from "../scripts/emitted-text-guard.mjs";
import { EXCLUDED_LUMENLOOP_OPS, RETIRED_ONBOARDING_SKILLS } from "../scripts/exposure.mjs";

describe("assertNoNonExposedRefsInText", () => {
  it("passes clean text with no non-exposed references", () => {
    expect(() =>
      assertNoNonExposedRefsInText(
        "search the catalog, then call execute — this playground exercises the same " +
          "server-side Raven tool implementations as /mcp.",
        "demo system prompt"
      )
    ).not.toThrow();
  });

  it("throws on a bare excluded lumenloop op name", () => {
    expect(EXCLUDED_LUMENLOOP_OPS.has("request_research")).toBe(true);
    expect(() =>
      assertNoNonExposedRefsInText(
        "the gateway can commission a request_research job for you",
        "demo page copy"
      )
    ).toThrow(/request_research/);
  });

  it("throws on the service-qualified form of an excluded lumenloop op", () => {
    expect(() =>
      assertNoNonExposedRefsInText(
        "call lumenloop.request_research to start a deep-research job",
        "demo tool description"
      )
    ).toThrow(/lumenloop\.request_research/);
  });

  it("throws on a retired-skill id taken from the real exclusion data", () => {
    const [retiredSkillId] = RETIRED_ONBOARDING_SKILLS;
    expect(typeof retiredSkillId).toBe("string");
    // The retired-skill check (like build-catalog.mjs's original) reports
    // that a reference was found without echoing the matched id back — the
    // id itself is still what triggers the throw.
    expect(() =>
      assertNoNonExposedRefsInText(
        `see the ${retiredSkillId} skill for connector setup`,
        "demo page copy"
      )
    ).toThrow(/retired-skill reference/);
  });

  it("names the offending reference and the label in the thrown message", () => {
    expect(() =>
      assertNoNonExposedRefsInText("request_research", "rendered demo HTML")
    ).toThrow(/rendered demo HTML.*request_research/s);
  });
});
