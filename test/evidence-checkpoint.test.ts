import { describe, expect, it } from "vitest";
import {
  candidateEvidenceBlock,
  evidenceCheckpointBlock
} from "../src/policy/evidence-checkpoint";

describe("evidence checkpoint prose", () => {
  it("keeps candidate guidance conditional and attribution-focused", () => {
    expect(candidateEvidenceBlock(undefined)).toBe("");
    expect(candidateEvidenceBlock(2, true)).toBe("");

    const block = candidateEvidenceBlock(2);
    expect(block).toContain("--- CANDIDATE EVIDENCE ---");
    expect(block).toContain("2 semantic, research, A/V, or fallback-directory call(s)");
    expect(block).toContain("rows are candidates, not identity or absence proof");
    expect(block).toContain("discard adjacent matches");
  });

  it("names only catalog-derived recovery candidates", () => {
    const block = evidenceCheckpointBlock({
      mode: "narrow-only",
      sourceOperations: ["scout.getBuilders"],
      candidates: [
        {
          id: "lumenloop.search_content_semantic",
          relation: "broader-semantic",
          reasons: ["empty", "weak"]
        }
      ]
    });
    expect(block).toContain("scout.getBuilders");
    expect(block).toContain("lumenloop.search_content_semantic (broader-semantic; empty/weak)");
    expect(block).toContain("If it exactly answers the request");
  });

  it("renders broad alternatives conditionally without judging payload relevance", () => {
    const block = evidenceCheckpointBlock({
      mode: "conditional-alternatives",
      sourceOperations: ["stellarDocs.search_docs"],
      candidates: [
        {
          id: "lumenloop.search_content_semantic",
          relation: "cross-family",
          reasons: ["weak", "adjacent", "ambiguous"]
        }
      ]
    });
    expect(block).toContain("successful broad operation class(es)");
    expect(block).toContain("did not inspect or judge the returned rows");
    expect(block).toContain("If exact evidence already answers");
    expect(block).toContain("closed-world question");
    expect(block).toContain("at most one bounded alternative pass");
    expect(block).not.toMatch(/rows (?:were|are) weak|irrelevant rows|non-match/i);
  });
});
