import { describe, expect, it } from "vitest";
import {
  allowedCandidateUrl,
  matchFacts,
  parseSseJson,
  resolvedCommitForUrl,
  summarize,
  validateSuite
} from "../scripts/eval-partner-docs.mjs";

describe("partner docs eval harness", () => {
  it("accepts only the two bounded public source families", () => {
    expect(allowedCandidateUrl("https://www.alchemy.com/docs/data/llms.txt", "alchemy")).toBe(true);
    expect(allowedCandidateUrl("https://www.alchemy.com/docs/reference/page.md", "alchemy")).toBe(true);
    expect(allowedCandidateUrl("https://www.alchemy.com/docs/reference/page.md?raw=1", "alchemy")).toBe(false);
    expect(allowedCandidateUrl("https://www.alchemy.com/docs/%2e%2e/page.md", "alchemy")).toBe(false);
    expect(allowedCandidateUrl("https://www.alchemy.com/api/mutate", "alchemy")).toBe(false);
    expect(allowedCandidateUrl("https://evil.example/docs/page.md", "alchemy")).toBe(false);
    expect(allowedCandidateUrl(
      "https://raw.githubusercontent.com/OpenZeppelin/docs/refs/heads/main/content/stellar-contracts/index.mdx",
      "openzeppelin"
    )).toBe(true);
    expect(allowedCandidateUrl(
      "https://raw.githubusercontent.com/OpenZeppelin/other/refs/heads/main/content/stellar-contracts/index.mdx",
      "openzeppelin"
    )).toBe(false);
  });

  it("matches fact groups with explicit alternatives", () => {
    const score = matchFacts("Native XLM; pagination uses an opaque pageKey cursor.", [
      ["native XLM"],
      ["pageKey", "cursor"],
      ["NFT holdings"]
    ]);
    expect(score.matched).toBe(2);
    expect(score.total).toBe(3);
    expect(score.recall).toBeCloseTo(2 / 3);
    expect(matchFacts("posted the update", [["POST"]]).matched).toBe(0);
    expect(matchFacts("POST the request", [["POST"]]).matched).toBe(1);
  });

  it("parses Raven's single-event SSE responses", () => {
    expect(parseSseJson('event: message\ndata: {"result":{"ok":true}}\n\n')).toEqual({ result: { ok: true } });
  });

  it("records immutable GitHub revisions and leaves branch refs unresolved", () => {
    expect(resolvedCommitForUrl(
      "https://raw.githubusercontent.com/OpenZeppelin/docs/f304ed55579dedf7ee0d2cc46982cca67c48e700/content/stellar-contracts/index.mdx"
    )).toBe("f304ed55579dedf7ee0d2cc46982cca67c48e700");
    expect(resolvedCommitForUrl(
      "https://raw.githubusercontent.com/OpenZeppelin/docs/refs/heads/main/content/stellar-contracts/index.mdx"
    )).toBeNull();
  });

  it("makes a baseline error gate-inconclusive instead of dropping the row", () => {
    const passingScore = { matched: 1, total: 1, recall: 1, detail: [] };
    const rows = [
      {
        baseline: { score: passingScore, error: null },
        candidate: { score: passingScore, errors: [], allowlistViolations: 0, documents: [] }
      },
      {
        baseline: { score: null, error: "timeout" },
        candidate: { score: passingScore, errors: [], allowlistViolations: 0, documents: [] }
      }
    ];
    const summary = summarize(rows);
    expect(summary.baselineCases).toBe(1);
    expect(summary.baselineErrors).toBe(1);
    expect(summary.retrievalAdmissionGate).toBe("inconclusive");
  });

  it("rejects duplicate case ids and unsupported baseline calls", () => {
    const baseCase = {
      id: "case-a",
      partner: "alchemy",
      question: "question",
      baseline: { type: "operation", id: "stellarDocs.search_docs" },
      candidateUrls: ["https://www.alchemy.com/docs/reference/page.md"],
      facts: [["fact"]]
    };
    expect(() => validateSuite({ contract: "partner-docs-retrieval-v1", cases: [baseCase, { ...baseCase }] })).toThrow(/duplicate/);
    expect(() => validateSuite({
      contract: "partner-docs-retrieval-v1",
      cases: [{ ...baseCase, baseline: { type: "operation", id: "partner.fetch_url" } }]
    })).toThrow(/unsupported baseline/);
  });
});
