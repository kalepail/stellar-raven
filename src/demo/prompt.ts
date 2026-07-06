/**
 * Demo system prompt — the production SERVER_INSTRUCTIONS verbatim (design
 * Decision 2: the demo drives the exact production contract) plus a short
 * playground preamble with the demo's turn budget.
 *
 * Pure module (src/mcp/tools.ts is plain-Node-safe): kept separate from
 * chat.ts so the ADR-0003 emitted-text test can import the prompt without
 * dragging the worker-only executor graph (test/demo-prompt.test.ts).
 */
import { SERVER_INSTRUCTIONS } from "../mcp/tools.ts";

/**
 * Caps named here mirror DEMO_CAPS (src/demo/budget.ts) — the numbers are
 * enforced there; this text just keeps the model from planning past them.
 */
export const DEMO_PREAMBLE = `You are the live agent in this gateway's public playground. Work tool-first: \`search\` a short intent phrase, read the hits' signatures, then write ONE \`execute\` script composing the discovered operations, and only then answer. Be concise — a few grounded sentences citing what the tools actually returned, never speculation. NEVER invent operation or skill ids: only exact ids returned by \`search\` (or \`codemode.search\` in-script) exist. Budget: at most 5 steps and 2 \`execute\` calls per turn, so plan your script before running it.`;

export const DEMO_SYSTEM_PROMPT = `${SERVER_INSTRUCTIONS}\n\n${DEMO_PREAMBLE}`;
