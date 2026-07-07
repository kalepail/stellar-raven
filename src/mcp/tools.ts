/**
 * MCP tool registration for the unified `search` + `execute` server.
 *
 *  - `search`  → host-side ranked search over the generated catalog
 *                (catalog/manifest.json). This is the SHIPPED shape per
 *                ADR-0001 (research/decisions/0001-search-tool-shape.md):
 *                the code-shaped spec search that briefly held this slot
 *                (todo 801, A/B candidate B) lost the golden Q→A A/B on
 *                reliability and retired INTO `execute`'s sandbox, where
 *                `codemode.spec()` / `codemode.search` / `codemode.catalog()`
 *                keep arbitrary discovery-in-code available at zero extra
 *                turn cost. Operation hits carry rendered TypeScript
 *                signatures.
 *  - `execute` → runs LLM JavaScript in a Dynamic Worker sandbox via
 *                the injected `runExecute` (src/executor/run.ts, wired
 *                by src/server.ts). The runner is INJECTED because run.ts
 *                imports @cloudflare/codemode (→ cloudflare:workers),
 *                which plain-Node vitest cannot load; without a runner
 *                the tool degrades to an error-as-data explanation.
 *                Errors never cross the tool boundary as throws (PLAN §4).
 *
 * The `execute` description mirrors upstream's REQUEST_TYPES template
 * (node_modules/@cloudflare/codemode/dist/mcp.js), adapted to the
 * multi-service super spec; deltas are documented in
 * research/super-spec-design.md §5.
 */
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchCatalogPage, catalogServices } from "../catalog/search.ts";
import { getCatalog } from "../catalog/load.ts";
import { CATALOG_KINDS } from "../catalog/types.ts";
import type { ExecuteRunner } from "../executor/run.ts";
import { logEvent, preview, CODE_LOG_MAX } from "../observability.ts";
import { truncateForModel, truncateLogsForModel } from "../policy/truncate.ts";

// Single source of truth: the search tool's `kind` enum IS the catalog's kind
// set (F7 — no duplicated literal to drift from src/catalog/types.ts).
export const SEARCH_KINDS = CATALOG_KINDS;

export const SEARCH_TOOL_NAME = "search";
export const EXECUTE_TOOL_NAME = "execute";

export const rankedSearchInputSchema = {
  query: z
    .string()
    .min(1)
    .describe(
      "Short intent phrase to search for, e.g. \"soroban contract storage\" or \"list validators\"."
    ),
  kind: z
    .enum(SEARCH_KINDS)
    .optional()
    .describe(
      "Restrict results to one entry kind: a service operation, a whole skill, or a single skill section."
    ),
  service: z
    .string()
    .optional()
    .describe(
      "Restrict results to one service namespace, e.g. \"lumenloop\", \"scout\", or \"stellarDocs\"."
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe("Maximum number of hits to return (default 10, max 50).")
};

export const searchHitSchema = z.object({
  id: z.string().describe("Exact catalog id — use it verbatim; never guess variants."),
  service: z.string(),
  kind: z.enum(SEARCH_KINDS),
  score: z
    .number()
    .describe(
      "Relevance score — higher is better, but ONLY comparable among hits with the same `tier` in this response. Gated and backfill scores come from different scorers on different scales; a backfill score can be numerically larger than the gated hits ranked above it."
    ),
  tier: z
    .enum(["gated", "backfill"])
    .describe(
      "Which scorer ranked this hit: \"gated\" = the strict coverage-gated scorer (primary tier); \"backfill\" = the gate-relaxed scorer used only to fill out a page the gated tier left short (long multi-clause queries). Gated hits always rank above backfill hits."
    ),
  description: z.string(),
  signature: z
    .string()
    .optional()
    .describe(
      "Rendered TypeScript signature (operation hits and runnable-skill hits — a runnable skill's callable line is `codemode.skill.run(\"<id>\", input)`). The input type and callable line are always complete; an oversized OUTPUT type is compacted to a stub listing its top-level field names — the full shape comes from `codemode.describe(id)` inside `execute`."
    ),
  availableSections: z
    .array(z.string())
    .optional()
    .describe(
      "Skill hits only: section keys for `codemode.skill.read(id, { sections })` in `execute` — ## slugs, then file:<relpath> keys. Omitted for skills without readable sections (metadata-only)."
    )
});

export const rankedSearchOutputSchema = {
  hits: z
    .array(searchHitSchema)
    .describe(
      "Ranked catalog entries. Operation hits include a rendered TypeScript signature you can call from `execute`."
    ),
  total: z
    .number()
    .int()
    .describe(
      "Distinct catalog entries in the match pool this page was drawn from (post kind/service filter, pre paging). Counts only the scorer tiers consulted for THIS page, so it is a floor, not an exhaustive match count — searching again with a higher `limit` can consult the backfill tier and report a larger total. total > hits.length means more matches exist than shown."
    ),
  truncated: z
    .boolean()
    .describe(
      "True when total > hits.length — more matching entries exist than returned. If none of these hits fit, retry with a higher `limit` or a narrower query/filter before concluding the capability is missing."
    ),
  nextSteps: z.string().describe("What to do with these results (server hint).")
};

export const executeInputSchema = {
  code: z
    .string()
    .min(1)
    .describe(
      "JavaScript async arrow function to execute in the sandbox, e.g. async () => { ... return result; }"
    )
};

// Runnable-skill sentences (research/skill-run-design.md §11 row 13) — one
// each in SEARCH_DESCRIPTION, EXECUTE_DESCRIPTION, SERVER_INSTRUCTIONS, and
// the search nextSteps text below. Leave-with-the-feature rule: if the
// runnable set ever returns to zero, those sentences leave in the SAME change
// (ADR-0003 spirit — consumers are never told about, and never sold, what
// the gateway cannot do). Exported (with EXECUTE_DESCRIPTION) so the /demo
// playground drives the exact production tool contract.
export const SEARCH_DESCRIPTION = `Ranked lexical search over the unified catalog of everything this server can do: every service operation (lumenloop.*, scout.*, stellarDocs.*), every skill, and every skill section.

Returns ranked hits with rendered TypeScript signatures so you can call them from the \`execute\` tool without guessing.

## Workflow

1. \`search\` with a short intent phrase (2-6 words) describing what you need.
2. Read the top hits' signatures and descriptions.
3. Write ONE \`execute\` script that composes SEVERAL relevant operations — hits are composable building blocks, not one-answer routes. Fan out broad calls (often across services) with Promise.all, then make targeted follow-up calls from what comes back.

## Rules

- Never guess operation or skill names — always discover them here first (or with \`codemode.search\` mid-script).
- Prefer specific queries ("account trustlines", "soroban storage patterns") over broad ones.
- Use \`kind\` to narrow to operations vs skills vs skill sections, and \`service\` to narrow to one namespace. Filter values are exact-match — an unknown \`service\` is rejected with the valid names, never silently empty.
- Each hit's \`tier\` says which scorer ranked it: "gated" (strict, primary) or "backfill" (gate-relaxed page fill for long queries, always ranked below every gated hit). \`score\` is comparable only among same-tier hits within one response — a backfill score can be numerically larger than a gated one ranked above it.
- \`truncated: true\` means more entries matched (\`total\`) than the page shows — if nothing here fits, search again with a higher \`limit\` or a narrower query before concluding the capability is missing.
- Skill hits are operational playbooks and carry \`availableSections\` — read those sections via \`codemode.skill.read(id, { sections })\` inside \`execute\`.
- A few skills are also RUNNABLE — their hits additionally carry a \`signature\` whose callable line is \`codemode.skill.run("<exact id>", input)\`: one call inside \`execute\` that runs the skill's whole data-gathering pipeline and resolves to the standard { ok: true, data } | { ok: false, error } envelope.
- Operation signatures are compact: the input type and callable line are always complete, but a very large OUTPUT type is stubbed down to its top-level field names. When you need the full output shape (or the raw JSON schemas), call \`codemode.describe("<exact id>")\` inside \`execute\`.
- Deeper or arbitrary discovery lives inside \`execute\`: \`codemode.search(...)\` (this same ranked search, mid-script), \`codemode.describe(id)\` (one entry's full detail), \`codemode.catalog()\` (the full catalog as plain data for code-shaped grepping), and \`codemode.spec()\` (the unified OpenAPI super spec) — use them for follow-ups without another tool round-trip.`;

export const EXECUTE_DESCRIPTION = `Execute JavaScript in a sandboxed Worker isolate with access to the service SDKs discovered via the \`search\` tool.

Write an async arrow function in JavaScript that returns the result. One script should compose MANY operations: broad discovery calls first (in parallel where independent), then targeted deeper calls parameterized by their results, then return one merged, compact value.

Worked example (multi-service fan-out, then a follow-up detail call):

async () => {
  const [dir, docs] = await Promise.all([
    lumenloop.search_directory({ query: "soroswap", limit: 3 }),
    stellarDocs.search_docs({ query: "AMM liquidity pool", hitsPerPage: 3 })
  ]);
  let project = null;
  if (dir.ok && dir.data.projects.length > 0) {
    const detail = await lumenloop.get_project({ slug: dir.data.projects[0].slug, compact: true });
    if (detail.ok) project = detail.data;
  }
  return { project, docs: docs.ok ? docs.data.hits.map(h => ({ url: h.url, snippet: h.snippet })) : docs.error };
}

## Result envelope

Every service call resolves (never throws) to either { ok: true, data } or { ok: false, error: { service, kind, message, status?, hint? } } where kind is "error" (call failed / bad args) or "soft-empty" (the service answered with nothing — unknown slug, zero hits; NOT evidence). Check \`r.ok\` before using \`r.data\`. Payload fields live one level down — \`r.data.projects\`, never \`r.projects\`; reading a payload field directly on the envelope throws an Error naming the correct path. \`r.data\` on a failed call is undefined and logs a one-line \`[envelope]\` warning naming the error. Writes to the envelope are allowed.

## Rules

- The ONLY globals are \`lumenloop\`, \`scout\`, \`stellarDocs\`, \`codemode\`, and standard JavaScript. There is no \`host\`, \`fs\`, \`require\`, \`process\`, or Node.js API.
- Never guess method names — call an operation as \`<service>.<name>(args)\` exactly as the spec's operationId / x-execute line (or a search hit's signature) shows. Unknown names fail; there is no fuzzy resolution.
- Mid-script discovery: \`codemode.spec()\` returns the unified OpenAPI-style super spec covering every service ($refs resolved inline — paths keyed "/{service}/{operation}", operationId = the exact callable, x-execute = the exact sandbox call line); \`codemode.search("intent phrase")\` (or \`{ query, kind?, service?, limit? }\`) for RANKED results — resolves to { ok: true, hits, total, truncated }; truncated means more entries matched than returned (raise \`limit\` or narrow the query — \`total\` is a floor, not exhaustive: it counts only the scorer tiers consulted for this page and can grow at a higher \`limit\`), and an unknown \`kind\`/\`service\` filter value comes back as an error listing the valid ones; and \`codemode.catalog()\` for the full catalog as plain data (every entry: id, service, kind, description, inputSchema, outputSchema — everything listed is callable/readable). Use these for follow-ups instead of ending the script early.
- \`codemode.describe("<exact id>")\` is the canonical detail step after \`search\`: for an operation it returns the FULL rendered signature (complete output type, even where the search hit showed a compacted stub), the raw inputSchema/outputSchema as data, and a \`usage\` line; for a skill, its \`availableSections\` plus the skill.read call to make; for a skill section, the parent skill id, section key, and the exact skill.read call. Reach for it whenever a search hit's stub, description, or field names aren't enough to write the call or select payload fields.
- Skills are operational playbooks — tested build/integration/recovery procedures: \`codemode.skill.read("<exact skill id>", { sections: ["<section-slug>"] })\`; section keys come from search hits' \`availableSections\` or the spec's x-skill-index. \`{ sections }\` is the ONLY option (unknown option keys are rejected, not ignored). It resolves to { ok: true, id, content | sections, availableSections, notice? } — skill content sits at the TOP LEVEL of the result, not under \`.data\` (that envelope is for service calls); failures are { ok: false, error } as usual. Large reads come back whole for in-sandbox use (grep/aggregate freely) with an advisory \`notice\` — but RETURN sections or aggregates from the script, not whole bodies. For build/integrate questions pair skill sections with \`stellarDocs.search_*\` (current reference truth); purely factual questions: docs first.
- A few skills are RUNNABLE: \`codemode.skill.run("<exact skill id>", input)\` executes that skill's data-gathering pipeline host-side in one call, resolving to the ordinary service-call envelope ({ ok: true, data } | { ok: false, error }) with \`data.calls\` auditing every constituent call it made — ids are exact-match (runnable search hits and \`codemode.describe\` show the exact callable line and input type), and \`skill.read\` on the same id still returns the prose playbook: run gathers the data, read carries the judgment steps.
- Do NOT use \`fetch\` — the sandbox has no network access; it will throw. All I/O goes through the service globals.
- Do NOT use TypeScript syntax — no type annotations, interfaces, or generics. Plain JavaScript only.
- Do NOT define named functions and then call them — just write the arrow function body directly.
- Parallelize independent calls with Promise.all; sequence only where a call needs a previous result.
- Directory/list-style results are summaries: most services pair them with a per-item detail operation (\`lumenloop.get_project\`, \`scout.getHackathon\`, \`lumenloop.get_document\`, …). When the question needs specifics beyond a list row, follow up with the detail call parameterized by the row — answering detail questions from a broad payload alone is a known failure mode.
- The final return value is truncated at ~6k tokens — select fields, slice arrays, aggregate in-script, and read skills by section rather than returning raw payloads or whole skill bodies. console.log output comes back as logs.`;

/**
 * MCP initialize-time instructions (SDK ServerOptions.instructions) — clients
 * like Claude Desktop surface this in the system prompt, where it outlives
 * per-tool descriptions over a long session. Kept short: workflow + the
 * envelope contract, the two things models get wrong mid-session.
 */
export const SERVER_INSTRUCTIONS = `Unified Stellar-ecosystem gateway: \`search\` (ranked discovery over every service operation and skill) and \`execute\` (sandboxed JavaScript composing the discovered operations).

Workflow: \`search\` a short intent phrase → read the hits' TypeScript signatures → write ONE \`execute\` script composing several operations (Promise.all for independent calls, then targeted follow-ups parameterized by their results). Oversized output types are stubbed in search hits — \`codemode.describe("<exact id>")\` inside \`execute\` is the canonical full-detail step (full signature + schemas + a usage line). Skills are operational playbooks (tested procedures — read sections via \`codemode.skill.read(id, { sections })\`, keys in the hit's \`availableSections\`); stellarDocs is informational reference. A few skills are also runnable — \`codemode.skill.run("<exact id>", input)\` (the callable line their hit signatures show) executes the skill's data-gathering pipeline in one call and resolves to the ordinary service-call envelope with a \`data.calls\` audit of its constituent calls. Build/integration questions: read matching skill sections AND search the docs; purely factual ones: docs first. Scout research items and lumenloop articles/content are community-aggregated sources — treat protocol-governance, standards-authorship, incident, and audit claims from them as unverified unless corroborated by stellarDocs or skills content.

Interpreting \`execute\` results: every service call resolves (never throws) to { ok: true, data } or { ok: false, error: { kind, message, hint? } }. Payload fields live under .data — \`r.data.projects\`, never \`r.projects\`; reading a payload field on the envelope throws an Error naming the correct path, \`r.data\` on a failed call is undefined and logs a one-line \`[envelope]\` warning naming the error, and writes to the envelope are allowed. error.kind is two-way: "error" (call failed) or "soft-empty" (the service answered with nothing — inconclusive, NOT evidence of absence). Operation and skill ids are exact-match — never guess them; discover via \`search\` or \`codemode.search\` mid-script.`;

export type RegisterToolsOptions = {
  /**
   * The sandbox runner from src/executor/run.ts (createExecuteRunner(env)).
   * Injected by src/server.ts; omitted in plain-Node tests, where `execute`
   * answers with an error-as-data explaining the sandbox is not wired.
   */
  runExecute?: ExecuteRunner;
};

/**
 * Register the model-facing tools on a (fresh, per-request) McpServer.
 */
export function registerTools(server: McpServer, options: RegisterToolsOptions = {}): void {
  server.registerTool(
    SEARCH_TOOL_NAME,
    {
      description: SEARCH_DESCRIPTION,
      inputSchema: rankedSearchInputSchema,
      outputSchema: rankedSearchOutputSchema
    },
    async (args) => {
      const t0 = Date.now();
      const catalog = getCatalog();

      // Filter validation (todo 839): `kind` is already zod-enum-guarded at
      // the tool boundary, but `service` is a free string — a near-miss like
      // "stellardocs" or "stellar-docs" used to silently exact-match nothing
      // and read as "the capability is missing". searchCatalog stays silent
      // on filters by (frozen) contract, so the correction lives here: keep
      // the zero-hit response SHAPE and put the diagnosis in nextSteps.
      const services = catalogServices(catalog);
      const respond = (structured: {
        hits: unknown[];
        total: number;
        truncated: boolean;
        nextSteps: string;
      }) => {
        const text = JSON.stringify(structured);
        logEvent("search", {
          source: "tool",
          query: args.query,
          kind: args.kind ?? null,
          service: args.service ?? null,
          hits: structured.hits.length,
          total: structured.total,
          truncated: structured.truncated,
          top: (structured.hits as { id: string }[]).slice(0, 3).map((h) => h.id),
          // Context-cost observability: this measured the pre-cap response
          // sizes that set COMPACT_OUTPUT_THRESHOLD (todo 841 — oversized
          // output types in hits are now stubbed); it stays on to verify the
          // compaction holds and to ground any future page-level cap in data.
          responseChars: text.length,
          ms: Date.now() - t0
        });
        return {
          content: [{ type: "text" as const, text }],
          structuredContent: structured
        };
      };

      if (args.service !== undefined && !services.includes(args.service)) {
        return respond({
          hits: [],
          total: 0,
          truncated: false,
          nextSteps: `Unknown service "${args.service}" — service filter values are exact-match. Valid services: ${services.join(", ")}. Retry with one of those exact values, or drop the \`service\` filter.`
        });
      }

      const { hits, total, truncated } = searchCatalogPage(catalog, {
        query: args.query,
        kind: args.kind,
        service: args.service,
        limit: args.limit
      });
      const nextSteps =
        hits.length > 0
          ? `These hits are composable: write ONE \`execute\` script that calls the several relevant operations (Promise.all across services for independent calls), then follows up with deeper calls parameterized by their results — e.g. \`await lumenloop.search_directory({ query: "..." })\` then \`lumenloop.get_project({ slug })\`. Every call resolves to { ok: true, data } or { ok: false, error: { kind, message, hint? } } — payload fields live under \`.data\` (\`r.data.projects\`, never \`r.projects\`); check \`r.ok\` first. Skill hits are operational playbooks — read the sections you need in-script via \`codemode.skill.read(id, { sections })\` (keys: the hit's \`availableSections\`), and pair them with stellarDocs searches for current reference truth. Hits whose \`signature\` shows a \`codemode.skill.run("<exact id>", input)\` line are runnable skills — call that line verbatim to run the whole pipeline in one step (payload under \`.data\`, constituent calls audited in \`data.calls\`). Scores compare only within the same \`tier\` (gated hits always rank above backfill hits). Signatures with a stubbed output type (\`{ /* N top-level fields: ... */ }\`) list the payload's top-level field names — for the full output shape call \`codemode.describe("<exact id>")\` inside \`execute\`. Use \`codemode.search(...)\` mid-script for follow-up discovery; search again here with narrower terms or \`kind\`/\`service\` filters if none fit.${truncated ? " More entries matched than shown (truncated) — raise `limit` or narrow the query if none of these fit." : ""}`
          : "No hits. Try fewer, more specific words (e.g. \"account trustlines\" not a full sentence), or drop the `kind`/`service` filters. Do not conclude the capability is missing from one empty result.";
      return respond({ hits, total, truncated, nextSteps });
    }
  );

  server.registerTool(
    EXECUTE_TOOL_NAME,
    {
      description: EXECUTE_DESCRIPTION,
      inputSchema: executeInputSchema
    },
    async (args) => {
      const runExecute = options.runExecute;
      if (!runExecute) {
        // No runner injected (plain-Node tests / misconfigured server):
        // error as data, never a throw (PLAN §4).
        logEvent("execute_unavailable", { codeChars: args.code.length });
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: "execute is unavailable: the Dynamic Worker sandbox runner is not wired on this server instance. No code was run. Use the search tool to explore the catalog."
            }
          ]
        };
      }

      const t0 = Date.now();
      let outcome;
      try {
        outcome = await runExecute(args.code);
      } catch (e) {
        // The runner is designed never to throw; belt-and-braces anyway.
        outcome = {
          ok: false as const,
          error: e instanceof Error ? e.message : String(e),
          logs: []
        };
      }
      // Logs get their own token budget at the model boundary (equal to the
      // result's ~6k) — shapeLogs' structural caps alone still admit ~50k
      // tokens, which would smuggle payloads past the result cap via
      // console.log. Rationale + tuning note in src/policy/truncate.ts.
      const shapedLogs = truncateLogsForModel(outcome.logs.join("\n"));
      // Error text is model-authored too (`throw new Error(payload)`) — same
      // budget as the result, or it becomes the third smuggling channel.
      const shapedError = outcome.ok ? null : truncateForModel(outcome.error);

      logEvent("execute", {
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
        outcome.logs.length > 0 ? `\n\n--- console (${outcome.logs.length} lines) ---\n${shapedLogs.text}` : "";

      if (!outcome.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Execution failed: ${shapedError ? shapedError.text : outcome.error}${logsBlock}`
            }
          ]
        };
      }

      return {
        content: [{ type: "text" as const, text: `${outcome.result}${logsBlock}` }]
      };
    }
  );
}
