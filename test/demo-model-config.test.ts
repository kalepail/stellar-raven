import { streamText } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { describe, expect, it } from "vitest";
import {
  DEMO_GROK_MODEL,
  DEMO_KIMI_MODEL,
  DEMO_MODEL,
  DEMO_MODELS,
  DEMO_REASONING_EFFORT,
  DEMO_TEMPERATURE,
  demoSessionAffinity
} from "../src/demo/model-config";

describe("demo model config", () => {
  it("uses Grok 4.3 with Kimi 2.7 Code fallback, conservative sampling, and medium reasoning", () => {
    expect(DEMO_GROK_MODEL).toBe("xai/grok-4.3");
    expect(DEMO_KIMI_MODEL).toBe("@cf/moonshotai/kimi-k2.7-code");
    expect(DEMO_MODEL).toBe(DEMO_GROK_MODEL);
    expect(DEMO_MODELS).toEqual([
      { model: DEMO_GROK_MODEL, role: "primary" },
      { model: DEMO_KIMI_MODEL, role: "fallback" }
    ]);
    expect(DEMO_TEMPERATURE).toBe(0.1);
    expect(DEMO_REASONING_EFFORT).toBe("medium");
  });

  it("derives stable non-raw session affinity keys", async () => {
    const a = await demoSessionAffinity("subject@example.com");
    const b = await demoSessionAffinity("subject@example.com");
    const c = await demoSessionAffinity("other@example.com");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toMatch(/^demo-[a-f0-9]{32}$/);
    expect(a).not.toContain("subject");
  });

  it("passes reasoning effort, temperature, and session affinity to workers-ai-provider", async () => {
    const calls: Array<{ model: string; inputs: Record<string, unknown>; options?: { extraHeaders?: Record<string, string> } }> =
      [];
    const binding = {
      async run(model: string, inputs: Record<string, unknown>, options?: { extraHeaders?: Record<string, string> }) {
        calls.push({ model, inputs, options });
        return {
          choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content: "ok" } }],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 }
        };
      }
    };

    const workersai = createWorkersAI({ binding: binding as unknown as Ai });
    const result = streamText({
      model: workersai(DEMO_MODEL, {
        sessionAffinity: "demo-test-affinity",
        reasoning_effort: DEMO_REASONING_EFFORT
      } as never),
      system: "system",
      messages: [{ role: "user", content: "hi" }],
      maxOutputTokens: 16,
      temperature: DEMO_TEMPERATURE
    });
    for await (const _ of result.fullStream) {
      // Drain stream so the provider call runs.
    }

    expect(calls).toHaveLength(1);
    expect(calls[0]?.model).toBe(DEMO_MODEL);
    expect(calls[0]?.inputs.temperature).toBe(DEMO_TEMPERATURE);
    expect(calls[0]?.inputs.reasoning_effort).toBe(DEMO_REASONING_EFFORT);
    expect(calls[0]?.options?.extraHeaders?.["x-session-affinity"]).toBe("demo-test-affinity");
  });
});
