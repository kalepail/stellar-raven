/**
 * AI SDK tool defs for the /demo playground — `search` + `execute` wrapping
 * the SAME in-process internals the MCP handlers use (design Decision 2:
 * searchCatalogPage/getCatalog and createExecuteRunner directly, no HTTP
 * round-trip to /mcp), with the exported production descriptions/input
 * schemas so the demo drives the exact production contract.
 *
 * Behavior mirrors src/mcp/tools.ts registerTools handler-for-handler —
 * unknown-service validation, nextSteps copy, truncateForModel /
 * truncateLogsForModel shaping, logEvent fields — with three demo deltas
 * (design Decision 5, all in-request enforced here because stepCountIs alone
 * does not cap tool calls within one model step):
 *  - search `limit` clamped to DEMO_CAPS.maxSearchLimit,
 *  - ≤ DEMO_CAPS.maxSearchCallsPerTurn catalog searches per shared turn
 *    budget (structured refusal as data, never a throw),
 *  - ≤ DEMO_CAPS.maxExecuteCallsPerTurn sandbox runs per shared turn
 *    budget (structured refusal as data, never a throw),
 *  - execute code length capped at DEMO_CAPS.maxExecuteCodeChars.
 * Every call emits tool-start/tool-result trace frames via opts.emit.
 *
 * WORKER-ONLY MODULE: imports src/executor/run.ts (→ cloudflare:workers);
 * only the demo chat handler may import it, never plain-Node test graphs.
 */
import { tool } from "ai";
import { z } from "zod";
import { parseExpressionAt } from "acorn";
import { searchCatalogPage, catalogServices, type SearchHit } from "../catalog/search.ts";
import { getCatalog } from "../catalog/load.ts";
import {
  SEARCH_DESCRIPTION,
  EXECUTE_DESCRIPTION,
  rankedSearchInputSchema,
  executeInputSchema
} from "../mcp/tools.ts";
import { createExecuteRunner, type ExecuteRunner } from "../executor/run.ts";
import { logEvent, preview, CODE_LOG_MAX } from "../observability.ts";
import {
  modelBoundaryMaxTokensFromEnv,
  truncateForModel,
  truncateLogsForModel
} from "../policy/truncate.ts";
import { DEMO_CAPS, createDemoToolBudget, type DemoToolBudget } from "./budget.ts";
import type { DemoFrame } from "./frames.ts";

// One sandbox executor per isolate, exactly like src/server.ts — the runner
// only closes over env bindings (stable across requests in an isolate).
let cachedRunner: ExecuteRunner | undefined;
let cachedRunnerMaxTokens: number | undefined;
function getRunner(env: Env): ExecuteRunner {
  const modelBoundaryMaxTokens = modelBoundaryMaxTokensFromEnv(env as unknown as Record<string, unknown>);
  if (!cachedRunner || cachedRunnerMaxTokens !== modelBoundaryMaxTokens) {
    cachedRunner = createExecuteRunner(env, {
      codemodeDiscovery: false,
      codemodeDescribe: true,
      modelBoundaryMaxTokens
    });
    cachedRunnerMaxTokens = modelBoundaryMaxTokens;
  }
  return cachedRunner;
}

type SearchStructured = {
  hits: SearchHit[];
  total: number;
  truncated: boolean;
  nextSteps: string;
};

// Demo deltas over the production page shape: a smaller default page and
// clipped per-hit prose. Full pages (~16-19KB of hits) blow up the follow-up
// call's prefill on a reasoning model — live tool turns routinely stalled past
// the whole-turn timeout before these caps. Signature clipping preserves the
// final callable line (renderSignature emits it last) and clips the middle
// output-type block within the same total budget.
const DEMO_SEARCH_DEFAULT_LIMIT = 5;
const DEMO_HIT_DESCRIPTION_CHARS = 220;
const DEMO_HIT_SIGNATURE_CHARS = 400;

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max)}… [clipped for the demo]`;
}

function clipSignature(text: string, max: number): string {
  if (text.length <= max) return text;
  const lastNewline = text.lastIndexOf("\n");
  if (lastNewline === -1) return clip(text, max);
  const callableLine = text.slice(lastNewline + 1);
  const marker = "\n… [middle clipped for the demo]\n";
  const headChars = max - callableLine.length - marker.length;
  if (headChars <= 0) return callableLine;
  return `${text.slice(0, headChars)}${marker}${callableLine}`;
}

function compactHitForDemo(hit: SearchHit): SearchHit {
  return {
    ...hit,
    description: clip(hit.description, DEMO_HIT_DESCRIPTION_CHARS),
    ...(hit.signature !== undefined
      ? { signature: clipSignature(hit.signature, DEMO_HIT_SIGNATURE_CHARS) }
      : {})
  };
}

type AstNode = {
  type?: string;
  callee?: AstNode;
  object?: AstNode;
  property?: AstNode;
  computed?: boolean;
  name?: string;
  value?: unknown;
  arguments?: AstNode[];
  [key: string]: unknown;
};

function isIdentifier(node: AstNode | undefined, name: string): boolean {
  return node?.type === "Identifier" && node.name === name;
}

function isPromiseAllObjectCall(node: AstNode): boolean {
  const callee = node.callee;
  if (node.type !== "CallExpression" || callee?.type !== "MemberExpression") return false;
  if (!isIdentifier(callee.object, "Promise")) return false;
  const property = callee.property;
  const allProperty =
    callee.computed === true
      ? property?.type === "Literal" && property.value === "all"
      : isIdentifier(property, "all");
  return allProperty && node.arguments?.[0]?.type === "ObjectExpression";
}

function walkAst(node: AstNode, visit: (node: AstNode) => boolean): boolean {
  if (visit(node)) return true;
  for (const [key, value] of Object.entries(node)) {
    if (key === "parent") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object" && walkAst(item as AstNode, visit)) return true;
      }
    } else if (value && typeof value === "object" && walkAst(value as AstNode, visit)) {
      return true;
    }
  }
  return false;
}

function demoExecutePreflightError(code: string): string | null {
  try {
    const ast = parseExpressionAt(code, 0, { ecmaVersion: "latest" }) as unknown as AstNode;
    if (!walkAst(ast, isPromiseAllObjectCall)) return null;
    return "invalid demo execute script: `Promise.all({ ... })` is not valid JavaScript fanout because `Promise.all` requires an array/iterable. Rewrite as `const [a, b] = await Promise.all([callA, callB])`, then build a named result object from those values.";
  } catch {
    // Let the real sandbox return syntax/runtime diagnostics; this preflight
    // only catches a known-good parse with a known-bad Promise.all shape.
    return null;
  }
}

export function buildDemoTools(opts: { env: Env; emit: (f: DemoFrame) => void; budget?: DemoToolBudget }): {
  tools: Record<string, unknown>;
  budgetReport: () => DemoToolBudget;
} {
  const { env, emit } = opts;
  const modelBoundaryMaxTokens = modelBoundaryMaxTokensFromEnv(env as unknown as Record<string, unknown>);
  // This object is created once by chat.ts and shared across fallback model
  // attempts. If callers omit it, a standalone turn budget is created for
  // direct smoke tests.
  const budget = opts.budget ?? createDemoToolBudget();

  const search = tool({
    description: SEARCH_DESCRIPTION,
    inputSchema: z.object(rankedSearchInputSchema),
    execute: async (args) => {
      const id = crypto.randomUUID();
      emit({ type: "tool-start", id, tool: "search", input: args });
      const t0 = Date.now();
      const catalog = getCatalog();

      // Mirror of the MCP handler (src/mcp/tools.ts, todo 839): a near-miss
      // `service` keeps the zero-hit response SHAPE with the diagnosis in
      // nextSteps. Same event fields under a demo-distinguishable evt name.
      const services = catalogServices(catalog);
      const respond = (structured: SearchStructured) => {
        logEvent("demo-search", {
          query: args.query,
          kind: args.kind ?? null,
          service: args.service ?? null,
          hits: structured.hits.length,
          total: structured.total,
          truncated: structured.truncated,
          top: structured.hits.slice(0, 3).map((h) => h.id),
          responseChars: JSON.stringify(structured).length,
          ms: Date.now() - t0
        });
        emit({ type: "tool-result", id, tool: "search", ok: true, output: structured });
        return structured;
      };

      if (budget.searchCalls >= DEMO_CAPS.maxSearchCallsPerTurn) {
        budget.searchRefusals += 1;
        const refusal = {
          hits: [],
          total: 0,
          truncated: false,
          nextSteps: "Search call limit reached for this demo turn. Use the earlier search result set(s), move to execute if an execute call remains, then summarize from tool evidence."
        };
        logEvent("demo-search-refused", {
          reason: "call-limit",
          query: args.query,
          searchCalls: budget.searchCalls,
          searchRefusals: budget.searchRefusals
        });
        emit({ type: "tool-result", id, tool: "search", ok: false, output: refusal });
        return refusal;
      }
      budget.searchCalls += 1;

      if (args.service !== undefined && !services.includes(args.service)) {
        budget.unknownServiceSearches += 1;
        return respond({
          hits: [],
          total: 0,
          truncated: false,
          nextSteps: `Unknown service "${args.service}" — service filter values are exact-match. Valid services: ${services.join(", ")}. Retry with one of those exact values, or drop the \`service\` filter.`
        });
      }

      const page = searchCatalogPage(catalog, {
        query: args.query,
        kind: args.kind,
        service: args.service,
        // Demo delta: page size clamped (the schema still advertises the
        // production max so the tool contract text stays verbatim).
        limit: Math.min(args.limit ?? DEMO_SEARCH_DEFAULT_LIMIT, DEMO_CAPS.maxSearchLimit)
      });
      const { total, truncated } = page;
      const hits = page.hits.map(compactHitForDemo);
      const remainingSearches = Math.max(0, DEMO_CAPS.maxSearchCallsPerTurn - budget.searchCalls);
      const searchAgain =
        remainingSearches > 0
          ? " If these hits are truncated, mismatched, or do not expose the right endpoint shape, spend the second and final `search` now with narrower endpoint-discovery terms or exact `kind`/`service` filters before executing."
          : " No search calls remain; do not conclude capability absence from mismatched hits alone, and use the best available exact ids.";
      const nextSteps =
        hits.length > 0
          ? `These hits are composable: write ONE \`execute\` script that calls the several relevant operations from the visible search result sets (Promise.all across services for independent calls), then follow up with deeper calls parameterized by their results only when the exact operation was returned here — e.g. \`await lumenloop.search_directory({ query: "..." })\` then \`lumenloop.get_project({ slug })\` only if both ids are present. Every call resolves to { ok: true, data } or { ok: false, error: { kind, message, hint? } } — payload fields live under \`.data\` (\`r.data.projects\`, never \`r.projects\`); check \`r.ok\` first. Skill hits are operational playbooks — read the sections you need in-script via \`codemode.skill.read(id, { sections })\` (keys: the hit's \`availableSections\`). Hits whose \`signature\` shows a \`codemode.skill.run("<exact id>", input)\` line are runnable skills — call that line verbatim to run the whole pipeline in one step (payload under \`.data\`, constituent calls audited in \`data.calls\`). Scores compare only within the same \`tier\` (gated hits always rank above backfill hits). Demo rule: \`codemode.describe("<exact id>")\` is available for exact visible hit ids when a signature is stubbed or row fields are unclear; \`codemode.search\`, \`codemode.catalog\`, and \`codemode.spec\` are disabled in-script. Avoid lossy projection false negatives: inspect row keys or filter against raw row JSON before selecting fields, and include nested/common field variants.${truncated ? " More entries matched than shown (truncated)." : ""}${searchAgain}`
          : remainingSearches > 0
            ? "No hits. Use the second and final search with a shorter, broader, or differently phrased endpoint-discovery query; do not conclude the capability is missing from one empty result."
            : "No hits and no search calls remain. Say the search found no matching exposed catalog entries, suggest a shorter query for a new turn, and do not conclude the capability is missing from one empty result.";
      return respond({ hits, total, truncated, nextSteps });
    }
  });

  const execute = tool({
    description: EXECUTE_DESCRIPTION,
    inputSchema: z.object(executeInputSchema),
    execute: async (args) => {
      const id = crypto.randomUUID();
      emit({ type: "tool-start", id, tool: "execute", input: args });

      const refuse = (reason: string, error: string) => {
        const refusal = { ok: false as const, error };
        budget.executeRefusals += 1;
        logEvent("demo-execute-refused", {
          reason,
          codeChars: args.code.length,
          executeCalls: budget.executeCalls,
          executeRefusals: budget.executeRefusals
        });
        emit({ type: "tool-result", id, tool: "execute", ok: false, output: refusal });
        return refusal;
      };
      if (budget.executeCalls >= DEMO_CAPS.maxExecuteCallsPerTurn) {
        return refuse("call-limit", "execute call limit reached for this turn");
      }
      if (args.code.length > DEMO_CAPS.maxExecuteCodeChars) {
        return refuse(
          "code-too-long",
          `execute code too long for the demo: ${args.code.length} chars (max ${DEMO_CAPS.maxExecuteCodeChars}). Write a shorter script — select fields and aggregate in-sandbox instead of inlining data.`
        );
      }
      const preflightError = demoExecutePreflightError(args.code);
      if (preflightError) {
        return refuse("invalid-promise-all-object", preflightError);
      }
      budget.executeCalls += 1;

      const t0 = Date.now();
      let outcome;
      try {
        outcome = await getRunner(env)(args.code);
      } catch (e) {
        // The runner is designed never to throw; belt-and-braces anyway.
        outcome = {
          ok: false as const,
          error: e instanceof Error ? e.message : String(e),
          logs: []
        };
      }
      if (!outcome.ok) budget.executeFailures += 1;
      if (outcome.ok && outcome.truncated) budget.executeResultTruncated += 1;
      // Same model-boundary budgets as the MCP handler: logs and error text
      // are model-authored channels and get the result's ~6k-token cap each
      // (rationale in src/policy/truncate.ts and src/mcp/tools.ts).
      const shapedLogs = truncateLogsForModel(outcome.logs.join("\n"), modelBoundaryMaxTokens);
      const shapedError = outcome.ok ? null : truncateForModel(outcome.error, modelBoundaryMaxTokens);

      logEvent("demo-execute", {
        ok: outcome.ok,
        ms: Date.now() - t0,
        codeChars: args.code.length,
        code: preview(args.code, CODE_LOG_MAX),
        // resultChars is kept for dashboard/back-compat. The explicit
        // original/returned fields below are the sizing data for cap tuning.
        resultChars: outcome.ok ? (outcome.resultReturnedChars ?? outcome.result.length) : 0,
        resultOriginalChars: outcome.ok ? (outcome.resultOriginalChars ?? outcome.result.length) : null,
        resultReturnedChars: outcome.ok ? (outcome.resultReturnedChars ?? outcome.result.length) : null,
        resultOriginalApproxTokens: outcome.ok ? outcome.resultApproxOriginalTokens : null,
        resultLimitTokens: outcome.ok ? outcome.resultMaxTokens : null,
        resultLimitChars: outcome.ok ? outcome.resultMaxChars : null,
        resultPreview: outcome.ok ? preview(outcome.result) : null,
        resultTruncated: outcome.ok ? outcome.truncated : null,
        logLines: outcome.logs.length,
        logsTruncated: shapedLogs.truncated,
        errorTruncated: shapedError ? shapedError.truncated : null,
        error: outcome.ok ? null : preview(outcome.error)
      });

      const logsBlock =
        outcome.logs.length > 0
          ? `\n\n--- console (${outcome.logs.length} lines) ---\n${shapedLogs.text}`
          : "";
      const truncationAdvisory =
        outcome.ok && outcome.truncated
          ? "\n\n--- demo advisory ---\nThis execute result was truncated before the final-answer step. Answer only from the visible returned fields, say the result was truncated if that affects completeness, and suggest a narrower follow-up for full detail."
          : "";

      const text = outcome.ok
        ? `${outcome.result}${truncationAdvisory}${logsBlock}`
        : `Execution failed: ${shapedError ? shapedError.text : outcome.error}${logsBlock}`;
      emit({ type: "tool-result", id, tool: "execute", ok: outcome.ok, output: text });
      return text;
    }
  });

  return {
    tools: { search, execute },
    budgetReport: () => ({ ...budget })
  };
}
