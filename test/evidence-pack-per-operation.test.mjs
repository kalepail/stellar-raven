import { describe, expect, it } from "vitest";
import { buildTranscriptEvidence } from "../eval/qa/judge.mjs";

describe("live evidence pack for the per-operation A/B arm", () => {
  it("admits direct manifest-operation results but still ignores top-level search metadata", () => {
    const common = {
      question: "Which project won the live example?",
      candidateAnswer: "Beta Bridge won the live example.",
      golden: {
        answer: "Use the current returned winner.",
        keyFacts: ["Names the live returned winner."],
        avoid: ["Do not invent a winner absent from returned data."],
        notes: "Behavioral live-data case."
      },
      tags: { freshness: "live" }
    };
    const direct = buildTranscriptEvidence({
      ...common,
      transcript: [
        {
          tool: "mcp__raven__scout_getHackathons",
          result: '{"ok":true,"data":{"winner":{"name":"Beta Bridge","url":"https://example.test/beta"}}}',
          resultChars: 96,
          isError: false
        }
      ]
    });
    expect(direct).toContain("Beta Bridge");

    const searchOnly = buildTranscriptEvidence({
      ...common,
      transcript: [
        {
          tool: "mcp__raven__search",
          result: '{"hits":[{"description":"Beta Bridge"}]}',
          resultChars: 46,
          isError: false
        }
      ]
    });
    expect(searchOnly).toBe("");
  });
});
