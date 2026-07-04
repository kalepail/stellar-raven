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
import { searchCatalog } from "../catalog/search.ts";
import { getCatalog } from "../catalog/load.ts";
import { CATALOG_KINDS } from "../catalog/types.ts";
import type { ExecuteRunner } from "../executor/run.ts";
import { logEvent, preview, CODE_LOG_MAX } from "../observability.ts";
import { truncateForModel, truncateLogsForModel } from "../policy/truncate.ts";

// Single source of truth: the search tool's `kind` enum IS the catalog's kind
// set (F7 — no duplicated literal to drift from src/catalog/types.ts).
export const SEARCH_KINDS = CATALOG_KINDS;
export type SearchKind = (typeof SEARCH_KINDS)[number];

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
  score: z.number().describe("Relevance score (higher is better; only comparable within one search)."),
  description: z.string(),
  signature: z
    .string()
    .optional()
    .describe("Rendered TypeScript signature (operation hits only)."),
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

const SEARCH_DESCRIPTION = `Ranked lexical search over the unified catalog of everything this server can do: every service operation (lumenloop.*, scout.*, stellarDocs.*), every skill, and every skill section.

Returns ranked hits with rendered TypeScript signatures so you can call them from the \`execute\` tool without guessing.

## Workflow

1. \`search\` with a short intent phrase (2-6 words) describing what you need.
2. Read the top hits' signatures and descriptions.
3. Write ONE \`execute\` script that composes SEVERAL relevant operations — hits are composable building blocks, not one-answer routes. Fan out broad calls (often across services) with Promise.all, then make targeted follow-up calls from what comes back.

## Rules

- Never guess operation or skill names — always discover them here first (or with \`codemode.search\` mid-script).
- Prefer specific queries ("account trustlines", "soroban storage patterns") over broad ones.
- Use \`kind\` to narrow to operations vs skills vs skill sections, and \`service\` to narrow to one namespace.
- Skill hits are operational playbooks and carry \`availableSections\` — read those sections via \`codemode.skill.read(id, { sections })\` inside \`execute\`.
- Deeper or arbitrary discovery lives inside \`execute\`: \`codemode.search(...)\` (this same ranked search, mid-script), \`codemode.catalog()\` (the full catalog as plain data for code-shaped grepping), and \`codemode.spec()\` (the unified OpenAPI super spec) — use them for follow-ups without another tool round-trip.`;

const EXECUTE_DESCRIPTION = `Execute JavaScript in a sandboxed Worker isolate with access to the service SDKs discovered via the \`search\` tool.

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
- Mid-script discovery, three affordances: \`codemode.spec()\` returns the unified OpenAPI-style super spec covering every service ($refs resolved inline — paths keyed "/{service}/{operation}", operationId = the exact callable, x-execute = the exact sandbox call line); \`codemode.search("intent phrase")\` (or \`{ query, kind?, service?, limit? }\`) for RANKED results; and \`codemode.catalog()\` for the full catalog as plain data (every entry: id, service, kind, description, inputSchema, outputSchema — everything listed is callable/readable). \`codemode.describe("<exact id>")\` returns one entry's docs + signature. Use these for follow-ups instead of ending the script early.
- Skills are operational playbooks — tested build/integration/recovery procedures: \`codemode.skill.read("<exact skill id>", { sections: ["<section-slug>"] })\`; section keys come from search hits' \`availableSections\` or the spec's x-skill-index. \`{ sections }\` is the ONLY option (unknown option keys are rejected, not ignored). It resolves to { ok: true, id, content | sections, availableSections, notice? } — skill content sits at the TOP LEVEL of the result, not under \`.data\` (that envelope is for service calls); failures are { ok: false, error } as usual. Large reads come back whole for in-sandbox use (grep/aggregate freely) with an advisory \`notice\` — but RETURN sections or aggregates from the script, not whole bodies. For build/integrate questions pair skill sections with \`stellarDocs.search_*\` (current reference truth); purely factual questions: docs first.
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

Workflow: \`search\` a short intent phrase → read the hits' TypeScript signatures → write ONE \`execute\` script composing several operations (Promise.all for independent calls, then targeted follow-ups parameterized by their results). Skills are operational playbooks (tested procedures — read sections via \`codemode.skill.read(id, { sections })\`, keys in the hit's \`availableSections\`); stellarDocs is informational reference. Build/integration questions: read matching skill sections AND search the docs; purely factual ones: docs first. Scout research items and lumenloop articles/content are community-aggregated sources — treat protocol-governance, standards-authorship, incident, and audit claims from them as unverified unless corroborated by stellarDocs or skills content.

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
      const hits = searchCatalog(getCatalog(), {
        query: args.query,
        kind: args.kind,
        service: args.service,
        limit: args.limit
      });
      const nextSteps =
        hits.length > 0
          ? "These hits are composable: write ONE `execute` script that calls the several relevant operations (Promise.all across services for independent calls), then follows up with deeper calls parameterized by their results — e.g. `await lumenloop.search_directory({ query: \"...\" })` then `lumenloop.get_project({ slug })`. Every call resolves to { ok: true, data } or { ok: false, error: { kind, message, hint? } } — payload fields live under `.data` (`r.data.projects`, never `r.projects`); check `r.ok` first. Skill hits are operational playbooks — read the sections you need in-script via `codemode.skill.read(id, { sections })` (keys: the hit's `availableSections`), and pair them with stellarDocs searches for current reference truth. Use `codemode.search(...)` mid-script for follow-up discovery; search again here with narrower terms or `kind`/`service` filters if none fit."
          : "No hits. Try fewer, more specific words (e.g. \"account trustlines\" not a full sentence), or drop the `kind`/`service` filters. Do not conclude the capability is missing from one empty result.";
      const structured = { hits, nextSteps };
      const text = JSON.stringify(structured);
      logEvent("search", {
        source: "tool",
        query: args.query,
        kind: args.kind ?? null,
        service: args.service ?? null,
        hits: hits.length,
        top: hits.slice(0, 3).map((h) => h.id),
        // Context-cost observability: search has NO output cap today (per-hit
        // signatures vary widely); this measures real-world response sizes so
        // any future cap is set from data, not guessed.
        responseChars: text.length,
        ms: Date.now() - t0
      });
      return {
        content: [{ type: "text" as const, text }],
        structuredContent: structured
      };
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
