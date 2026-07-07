/**
 * The raw Lumenloop onboarding skills stay out of model-facing catalog text,
 * but the exclusion decision still needs an auditable classification. This
 * guards the review ledger in scripts/exposure.mjs without changing emitted
 * artifacts.
 */
import { describe, expect, it } from "vitest";
import {
  RETIRED_ONBOARDING_SKILLS,
  RETIRED_PARTNER_ONBOARDING_SKILLS,
  SKILL_EXPOSURE_CLASSIFICATION_BY_ID,
  SKILL_EXPOSURE_CLASSIFICATION_VALUES,
  SKILL_EXPOSURE_CLASSIFICATIONS
} from "../scripts/exposure.mjs";

describe("skill exposure classifications", () => {
  it("covers every retired or removed Lumenloop onboarding skill exactly once", () => {
    const expected = new Set([...RETIRED_ONBOARDING_SKILLS, ...RETIRED_PARTNER_ONBOARDING_SKILLS]);
    const actual = SKILL_EXPOSURE_CLASSIFICATIONS.map((entry) => entry.id);
    expect(new Set(actual)).toEqual(expected);
    expect(actual).toHaveLength(expected.size);
  });

  it("uses only known non-emitted classification values", () => {
    for (const entry of SKILL_EXPOSURE_CLASSIFICATIONS) {
      expect(SKILL_EXPOSURE_CLASSIFICATION_VALUES.has(entry.classification), entry.id).toBe(true);
      expect(entry.emittedSurface, entry.id).toBe("none");
      expect(entry.rationale.trim().length, entry.id).toBeGreaterThan(20);
    }
  });

  it("keeps the public connector as internal guidance and partner skills as removed", () => {
    expect(SKILL_EXPOSURE_CLASSIFICATION_BY_ID.get("lumenloop-mcp-connect")?.classification).toBe(
      "internal-guidance"
    );
    for (const id of RETIRED_PARTNER_ONBOARDING_SKILLS) {
      expect(SKILL_EXPOSURE_CLASSIFICATION_BY_ID.get(id)?.classification, id).toBe("removed");
    }
  });
});
