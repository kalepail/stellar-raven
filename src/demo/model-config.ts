export type DemoModelConfig = {
  model: string;
  role: "primary" | "fallback";
};

export const DEMO_GROK_MODEL = "xai/grok-4.3";
export const DEMO_KIMI_MODEL = "@cf/moonshotai/kimi-k2.7-code";
export const DEMO_MODELS: readonly DemoModelConfig[] = [
  { model: DEMO_GROK_MODEL, role: "primary" },
  { model: DEMO_KIMI_MODEL, role: "fallback" }
] as const;
export const DEMO_MODEL = DEMO_GROK_MODEL;
export const DEMO_REASONING_EFFORT = "medium" as const;
export const DEMO_TEMPERATURE = 0.1;
export const DEMO_GATEWAY_ID_FALLBACK = "default";

export async function demoSessionAffinity(subject: string): Promise<string> {
  const bytes = new TextEncoder().encode(`demo:${subject}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return `demo-${[...new Uint8Array(digest)]
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}
