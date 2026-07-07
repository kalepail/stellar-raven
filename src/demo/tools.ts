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
 *  - ≤ DEMO_CAPS.maxExecuteCallsPerTurn sandbox runs per buildDemoTools()
 *    call (structured refusal as data, never a throw),
 *  - execute code length capped at DEMO_CAPS.maxExecuteCodeChars.
 * Every call emits tool-start/tool-result trace frames via opts.emit.
 *
 * WORKER-ONLY MODULE: imports src/executor/run.ts (→ cloudflare:workers);
 * only the demo chat handler may import it, never plain-Node test graphs.
 */
import { tool } from "ai";
import { z } from "zod";
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
import { truncateForModel, truncateLogsForModel } from "../policy/truncate.ts";
import { DEMO_CAPS } from "./budget.ts";
import type { DemoFrame } from "./frames.ts";

// One sandbox executor per isolate, exactly like src/server.ts — the runner
// only closes over env bindings (stable across requests in an isolate).
let cachedRunner: ExecuteRunner | undefined;
function getRunner(env: Env): ExecuteRunner {
  cachedRunner ??= createExecuteRunner(env);
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
// the whole-turn timeout before these caps. Signature clipping keeps the head
// (input type + callable line come first; only oversized output stubs get cut).
const DEMO_SEARCH_DEFAULT_LIMIT = 5;
const DEMO_HIT_DESCRIPTION_CHARS = 220;
const DEMO_HIT_SIGNATURE_CHARS = 400;

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max)}… [clipped for the demo]`;
}

function compactHitForDemo(hit: SearchHit): SearchHit {
  return {
    ...hit,
    description: clip(hit.description, DEMO_HIT_DESCRIPTION_CHARS),
    ...(hit.signature !== undefined
      ? { signature: clip(hit.signature, DEMO_HIT_SIGNATURE_CHARS) }
      : {})
  };
}

export function buildDemoTools(opts: { env: Env; emit: (f: DemoFrame) => void }): {
  tools: Record<string, unknown>;
  countersReport: () => { executeCalls: number; searchCalls: number };
} {
  const { env, emit } = opts;
  // Per-turn closure counters — THE enforceable budget (design Decision 5).
  // executeCalls counts sandbox runs (each is a Worker Loader isolate
  // spin-up); refused calls don't increment, so the refusal is permanent for
  // the rest of the turn once the cap is hit.
  let executeCalls = 0;
  let searchCalls = 0;

  const search = tool({
    description: SEARCH_DESCRIPTION,
    inputSchema: z.object(rankedSearchInputSchema),
    execute: async (args) => {
      const id = crypto.randomUUID();
      emit({ type: "tool-start", id, tool: "search", input: args });
      searchCalls += 1;
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

      if (args.service !== undefined && !services.includes(args.service)) {
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
      const nextSteps =
        hits.length > 0
          ? `These hits are composable: write ONE \`execute\` script that calls the several relevant operations (Promise.all across services for independent calls), then follows up with deeper calls parameterized by their results — e.g. \`await lumenloop.search_directory({ query: "..." })\` then \`lumenloop.get_project({ slug })\`. Every call resolves to { ok: true, data } or { ok: false, error: { kind, message, hint? } } — payload fields live under \`.data\` (\`r.data.projects\`, never \`r.projects\`); check \`r.ok\` first. Skill hits are operational playbooks — read the sections you need in-script via \`codemode.skill.read(id, { sections })\` (keys: the hit's \`availableSections\`), and pair them with stellarDocs searches for current reference truth. Hits whose \`signature\` shows a \`codemode.skill.run("<exact id>", input)\` line are runnable skills — call that line verbatim to run the whole pipeline in one step (payload under \`.data\`, constituent calls audited in \`data.calls\`). Scores compare only within the same \`tier\` (gated hits always rank above backfill hits). Signatures with a stubbed output type (\`{ /* N top-level fields: ... */ }\`) list the payload's top-level field names — for the full output shape call \`codemode.describe("<exact id>")\` inside \`execute\`. Use \`codemode.search(...)\` mid-script for follow-up discovery; search again here with narrower terms or \`kind\`/\`service\` filters if none fit.${truncated ? " More entries matched than shown (truncated) — raise `limit` or narrow the query if none of these fit." : ""}`
          : "No hits. Try fewer, more specific words (e.g. \"account trustlines\" not a full sentence), or drop the `kind`/`service` filters. Do not conclude the capability is missing from one empty result.";
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
        logEvent("demo-execute-refused", {
          reason,
          codeChars: args.code.length,
          executeCalls
        });
        emit({ type: "tool-result", id, tool: "execute", ok: false, output: refusal });
        return refusal;
      };
      if (executeCalls >= DEMO_CAPS.maxExecuteCallsPerTurn) {
        return refuse("call-limit", "execute call limit reached for this turn");
      }
      if (args.code.length > DEMO_CAPS.maxExecuteCodeChars) {
        return refuse(
          "code-too-long",
          `execute code too long for the demo: ${args.code.length} chars (max ${DEMO_CAPS.maxExecuteCodeChars}). Write a shorter script — select fields and aggregate in-sandbox instead of inlining data.`
        );
      }
      executeCalls += 1;

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
      // Same model-boundary budgets as the MCP handler: logs and error text
      // are model-authored channels and get the result's ~6k-token cap each
      // (rationale in src/policy/truncate.ts and src/mcp/tools.ts).
      const shapedLogs = truncateLogsForModel(outcome.logs.join("\n"));
      const shapedError = outcome.ok ? null : truncateForModel(outcome.error);

      logEvent("demo-execute", {
        ok: outcome.ok,
        ms: Date.now() - t0,
        codeChars: args.code.length,
        code: preview(args.code, CODE_LOG_MAX),
        resultChars: outcome.ok ? outcome.result.length : 0,
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

      const text = outcome.ok
        ? `${outcome.result}${logsBlock}`
        : `Execution failed: ${shapedError ? shapedError.text : outcome.error}${logsBlock}`;
      emit({ type: "tool-result", id, tool: "execute", ok: outcome.ok, output: text });
      return text;
    }
  });

  return {
    tools: { search, execute },
    countersReport: () => ({ executeCalls, searchCalls })
  };
}
