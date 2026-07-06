/**
 * ADR-0003 emitted-text discipline for the demo SYSTEM PROMPT (design review
 * finding 7): the combined SERVER_INSTRUCTIONS + playground preamble is
 * emitted text and must never reference a non-exposed op or retired skill.
 * src/demo/prompt.ts is a pure module precisely so this test can import it
 * without the worker-only chat/tools graph.
 */
import { describe, expect, it } from "vitest";
import { assertNoNonExposedRefsInText } from "../scripts/emitted-text-guard.mjs";
import { SERVER_INSTRUCTIONS } from "../src/mcp/tools";
import { DEMO_PREAMBLE, DEMO_SYSTEM_PROMPT } from "../src/demo/prompt";

describe("demo system prompt", () => {
  it("contains the production SERVER_INSTRUCTIONS verbatim plus the preamble", () => {
    expect(DEMO_SYSTEM_PROMPT.startsWith(SERVER_INSTRUCTIONS)).toBe(true);
    expect(DEMO_SYSTEM_PROMPT.endsWith(DEMO_PREAMBLE)).toBe(true);
    // The demo's turn budget is stated to the model (numbers enforced in
    // src/demo/budget.ts; drift here is a lie to the model, not a crash).
    expect(DEMO_PREAMBLE).toContain("5 steps");
    expect(DEMO_PREAMBLE).toContain("2 `execute` calls");
  });

  it("references no non-exposed operations or retired skills (ADR-0003)", () => {
    expect(() => assertNoNonExposedRefsInText(DEMO_SYSTEM_PROMPT, "demo system prompt")).not.toThrow();
  });
});
