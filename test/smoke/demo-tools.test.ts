import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { buildDemoTools } from "../../src/demo/tools";
import type { DemoFrame } from "../../src/demo/frames";

type ToolWithExecute = {
  execute: (args: Record<string, unknown>) => Promise<unknown>;
};

function makeTools() {
  const frames: DemoFrame[] = [];
  const built = buildDemoTools({
    env: env as unknown as Env,
    emit: (frame) => frames.push(frame)
  });
  return {
    frames,
    countersReport: built.countersReport,
    search: built.tools.search as ToolWithExecute,
    execute: built.tools.execute as ToolWithExecute
  };
}

describe("demo tools at the worker boundary", () => {
  it("does not spend the single search budget on an invalid service filter", async () => {
    const { search, countersReport } = makeTools();

    const invalid = (await search.execute({
      query: "search directory",
      service: "not-a-service"
    })) as { hits: unknown[]; nextSteps: string };
    expect(invalid.hits).toEqual([]);
    expect(invalid.nextSteps).toContain("Unknown service");
    expect(countersReport().searchCalls).toBe(0);

    const valid = (await search.execute({ query: "search directory" })) as { hits: unknown[] };
    expect(valid.hits.length).toBeGreaterThan(0);
    expect(countersReport().searchCalls).toBe(1);
  });

  it("disables in-script codemode discovery in demo execute", async () => {
    const { execute } = makeTools();
    const result = (await execute.execute({
      code: `async () => {
        return await codemode.search("search directory");
      }`
    })) as string;

    expect(result).toContain("Execution failed:");
    expect(result).toContain('Tool "search" not found');
  });
});
