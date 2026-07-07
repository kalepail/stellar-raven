import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { buildDemoTools } from "../../src/demo/tools";
import { createDemoToolBudget, type DemoToolBudget } from "../../src/demo/budget";
import type { DemoFrame } from "../../src/demo/frames";

type ToolWithExecute = {
  execute: (args: Record<string, unknown>) => Promise<unknown>;
};

function makeTools(budget?: DemoToolBudget) {
  const frames: DemoFrame[] = [];
  const built = buildDemoTools({
    env: env as unknown as Env,
    emit: (frame) => frames.push(frame),
    budget
  });
  return {
    frames,
    budgetReport: built.budgetReport,
    search: built.tools.search as ToolWithExecute,
    execute: built.tools.execute as ToolWithExecute
  };
}

describe("demo tools at the worker boundary", () => {
  it("spends search budget on invalid service filters but allows one recovery search", async () => {
    const { search, budgetReport } = makeTools();

    const invalid = (await search.execute({
      query: "search directory",
      service: "not-a-service"
    })) as { hits: unknown[]; nextSteps: string };
    expect(invalid.hits).toEqual([]);
    expect(invalid.nextSteps).toContain("Unknown service");
    expect(budgetReport()).toMatchObject({ searchCalls: 1, unknownServiceSearches: 1 });

    const recovery = (await search.execute({ query: "search directory" })) as { hits: unknown[]; nextSteps: string };
    expect(recovery.nextSteps).toContain("No search calls remain");
    expect(budgetReport()).toMatchObject({ searchCalls: 2, unknownServiceSearches: 1 });

    const refused = (await search.execute({ query: "search directory" })) as { hits: unknown[]; nextSteps: string };
    expect(refused.hits).toEqual([]);
    expect(refused.nextSteps).toContain("Search call limit reached");
    expect(budgetReport()).toMatchObject({ searchCalls: 2, searchRefusals: 1, unknownServiceSearches: 1 });
  });

  it("shares the turn budget across buildDemoTools calls", async () => {
    const budget = createDemoToolBudget();
    const first = makeTools(budget);
    const second = makeTools(budget);

    await first.search.execute({ query: "search directory" });

    expect(first.budgetReport().searchCalls).toBe(1);

    const allowed = (await second.search.execute({ query: "search directory" })) as { hits: unknown[]; nextSteps: string };
    expect(allowed.nextSteps).toContain("No search calls remain");
    expect(second.budgetReport()).toMatchObject({ searchCalls: 2 });

    const refused = (await second.search.execute({ query: "search directory" })) as { hits: unknown[]; nextSteps: string };
    expect(refused.hits).toEqual([]);
    expect(refused.nextSteps).toContain("Search call limit reached");
    expect(second.budgetReport()).toMatchObject({ searchCalls: 2, searchRefusals: 1 });
  });

  it("keeps in-script codemode search disabled in demo execute", async () => {
    const { execute, budgetReport } = makeTools();
    const result = (await execute.execute({
      code: `async () => {
        return await codemode.search("search directory");
      }`
    })) as string;

    expect(result).toContain("Execution failed:");
    expect(result).toContain('Tool "search" not found');
    expect(budgetReport()).toMatchObject({ executeCalls: 1, executeFailures: 1 });

    const retry = (await execute.execute({
      code: `async () => {
        return "retry";
      }`
    })) as string;
    expect(retry).toContain("retry");
    expect(budgetReport()).toMatchObject({ executeCalls: 2, executeFailures: 1 });

    const refused = (await execute.execute({
      code: `async () => {
        return "third";
      }`
    })) as { ok: false; error: string };
    expect(refused.error).toContain("execute call limit reached");
    expect(budgetReport()).toMatchObject({ executeCalls: 2, executeFailures: 1, executeRefusals: 1 });
  });

  it("allows exact-id codemode.describe in demo execute", async () => {
    const { execute, budgetReport } = makeTools();
    const result = (await execute.execute({
      code: `async () => {
        const d = await codemode.describe("scout.searchProjects");
        return { ok: d.ok, id: d.id, hasOutputSchema: !!d.outputSchema, usage: d.usage };
      }`
    })) as string;

    expect(result).toContain("scout.searchProjects");
    expect(result).toContain("hasOutputSchema");
    expect(result).toContain("call it exactly as the signature");
    expect(budgetReport()).toMatchObject({ executeCalls: 1 });
  });

  it("adds a demo-only advisory when execute output is truncated", async () => {
    const { execute, budgetReport } = makeTools();
    const result = (await execute.execute({
      code: `async () => {
        return "x".repeat(25000);
      }`
    })) as string;

    expect(result).toContain("--- TRUNCATED ---");
    expect(result).toContain("--- demo advisory ---");
    expect(result).toContain("Answer only from the visible returned fields");
    expect(budgetReport()).toMatchObject({ executeCalls: 1, executeResultTruncated: 1 });
  });
});
