# Code Mode + Dynamic Workers: implementation reference for a unified `search` + `execute` MCP server

> Research snapshot 2026-07-01. Sources: pinned docs mirror at
> `/Users/kalepail/Desktop/stellar-raven-next/agents-docs/` (cloudflare/agents `docs/` @ `936d2cb6e97b`),
> shallow clone of `cloudflare/agents` at
> `/private/tmp/claude-501/-Users-kalepail-Desktop-stellar-raven-codemode/3572cb94-7157-4dfe-a2f7-077295dbf1db/scratchpad/agents`
> (`@cloudflare/codemode` v0.4.2), https://blog.cloudflare.com/code-mode/,
> https://developers.cloudflare.com/dynamic-workers/, https://developers.cloudflare.com/agents/.
>
> **Ephemeral sources — this is a verified dated snapshot, not a live pointer.** The
> `../stellar-raven-next/agents-docs/` mirror (repo being retired) and the `/private/tmp/…`
> scratchpad clone are both gone/transient; do NOT rely on those paths. To re-verify against
> upstream, pull `github.com/cloudflare/agents` (`packages/codemode`, pinned `@cloudflare/codemode`
> version) directly.

---

## 0. Headline finding

**Cloudflare already ships the exact two-tool shape we want.**
`@cloudflare/codemode/mcp` exports `openApiMcpServer({ spec, executor, request })`, which registers
precisely two MCP tools named **`search`** and **`execute`**, both with input schema
`{ code: string }` (a JS async arrow function). `search` runs the LLM's code against the OpenAPI
spec *as data* inside the sandbox; `execute` additionally injects a host-side `request()` callback
that carries auth. Source: `packages/codemode/src/mcp.ts` (lines 441–585); working example:
`examples/codemode-mcp-openapi/`. Our server is a generalization of this pattern to *multiple*
services + a skills directory, and the gaps we must fill are enumerated in §9.

---

## 1. Architecture of Codemode (the three API layers)

`@cloudflare/codemode` (npm, v0.4.2, MIT, lives in `cloudflare/agents` monorepo at
`packages/codemode/`) has three progressively richer layers. All share one idea: the model gets
**one tool that takes `{ code }`**; the code runs in an isolated Worker; every capability the code
touches is dispatched back to the trusted host over Workers RPC.

| Layer | Entry point | Model-facing tool(s) | State | Discovery |
|---|---|---|---|---|
| 1. Stateless AI-SDK tool | `createCodeTool()` from `@cloudflare/codemode/ai` | one AI SDK tool (you name it, conventionally `codemode`) | none | **all types dumped into the tool description** (`{{types}}`) |
| 2. Durable runtime | `createCodemodeRuntime()` from `@cloudflare/codemode` | `runtime.tool()` — one tool | Durable Object facet (SQLite): tool-call log, approvals, snippets | **in-sandbox** `codemode.search()` / `codemode.describe()` |
| 3. MCP-facing | `codeMcpServer()` / `openApiMcpServer()` from `@cloudflare/codemode/mcp` | `code` (1 tool) / **`search` + `execute`** (2 tools) | none | types in description / spec-as-data in sandbox |

Package deps: runtime deps are only `acorn` + `@types/json-schema`. Peer deps (all optional):
`ai ^6.0.0`, `zod ^4.0.0`, `@modelcontextprotocol/sdk ^1.25.0`, `@tanstack/ai`. Docs mark the whole
feature **Experimental**.

### 1.1 Layer 1 — `createCodeTool` (`src/tool.ts`, `src/shared.ts`)

```ts
import { createCodeTool } from "@cloudflare/codemode/ai";
import { DynamicWorkerExecutor } from "@cloudflare/codemode";

const executor = new DynamicWorkerExecutor({ loader: env.LOADER });
const codemode = createCodeTool({ tools, executor });          // AI SDK Tool
// streamText({ model, messages, tools: { codemode } })
```

- Input schema: `z.object({ code: z.string().describe("JavaScript async arrow function to execute") })`.
- Default description (`DEFAULT_DESCRIPTION` in `src/shared.ts`):

  ```
  Execute code to achieve a goal.

  Available:
  {{types}}

  Write an async arrow function in JavaScript that returns the result.
  Do NOT use TypeScript syntax — no type annotations, interfaces, or generics.
  Do NOT define named functions then call them — just write the arrow function body directly.

  Example: async () => { const r = await codemode.searchWeb({ query: "test" }); return r; }
  ```

  `{{types}}` is replaced by `generateTypes(tools)` output, e.g.:

  ```ts
  type CreateProjectInput = { name: string; description?: string }
  declare const codemode: { createProject: (input: CreateProjectInput) => Promise<unknown>; }
  ```

- Accepts `ToolProvider[]` for namespacing: `[{ name: "github", tools: ghTools }, { name: "shell", tools: shellTools }]`
  → sandbox globals `github.*`, `shell.*` (default namespace `codemode`).
- Tools with AI SDK `needsApproval` are **filtered out** at this layer (no approval support here).
- Type generation: `generateTypes()` (`src/tool-types.ts`) for AI SDK/zod tools;
  `generateTypesFromJsonSchema()` (`src/json-schema-types.ts`, ~400 lines, hand-rolled JSON-Schema→TS,
  no `zod-to-ts`/tsc in the hot path) for raw JSON Schema descriptors.
- Tool names sanitized to JS identifiers: `sanitizeToolName("get-weather") === "get_weather"`,
  `"3d-render" → "_3d_render"`, reserved words get `_` suffix (`"delete" → "delete_"`).

### 1.2 Layer 2 — `createCodemodeRuntime` (`src/runtime.ts`, `src/proxy-tool.ts`, `src/runtime-handle.ts`)

The durable control plane. Requires a Durable Object (the runtime is a **DO facet** with its own
SQLite DB; the Worker entry module must `export { CodemodeRuntime } from "@cloudflare/codemode"` —
the `@cloudflare/codemode/vite` plugin appends that export automatically).

```ts
const runtime = createCodemodeRuntime({
  ctx: this.ctx,                                   // DurableObjectState
  executor: new DynamicWorkerExecutor({ loader: this.env.LOADER }),
  connectors: [new GithubConnector(this.ctx, this.env, conn), new StripeConnector(this.ctx, this.env)],
  name: "default",                                 // facet identity; distinct names = separate histories
  maxExecutions: 50,
  transformResult: (r) => truncateResult(r)        // shape model-facing final result (~6k tokens default)
});

tools: { codemode: runtime.tool() }                // the single model-facing tool
```

Handle surface: `tool()`, `pending()`, `approve({executionId})`, `reject({seq, executionId})`,
`rollback({executionId})`, `expirePaused({maxAgeMs})`, `executions(limit?)`, `deleteExecution(id)`,
`pruneExecutions(n)`, `saveSnippet(name, {executionId?, description?, inputSchema?})`, `snippets()`,
`deleteSnippet(name)`.

**In-sandbox platform SDK** (the model's four-method API, injected as global `codemode`):

| Method | Purpose |
|---|---|
| `codemode.search(query)` | ranked search across connector methods **and saved snippets** → `{ results: [{ path, connector, method, description, kind, score }], total, truncated }` |
| `codemode.describe(target)` | on-demand TS docs for a connector (`"github"`), method (`"github.list_pull_requests"`), or snippet → `{ path, description, types, kind }` |
| `codemode.step(name, fn)` | run a nondeterministic/side-effectful closure once; result recorded and replayed |
| `codemode.run(name, input?)` | run a saved snippet by name |

Connector methods appear as their own typed globals: `github.list_pull_requests({...})`.

**Tool description at this layer** (`buildDescription()` in `src/proxy-tool.ts` ~line 544) does NOT
dump types. It lists connector names (+ optional per-connector hints) and instructs a workflow:

```
1. const matches = await codemode.search("short intent phrase");
2. const docs = await codemode.describe(matches.results[0].path);
3. Call the method: await <connector>.<method>(args);
...
- The ONLY globals are `github`, `stripe` and `codemode` ... There is no `host`, `fs`, `require`, `process` ...
- Never guess method names ... run a discovery pass first
- Do not use `fetch` — use connector SDKs.
```

**Durability: abort-and-replay.** Every connector call routes through the runtime
(`decide → execute → recordResult`), logged as
`{ seq, connector, method, args, result?, requiresApproval, ephemeral?, state }` (one SQLite row per
entry). An approval-required call records `pending` and the run **aborts**; the tool returns
`{ status: "paused", executionId, pending }`. On `approve()`, the *same code re-runs*: logged calls
replay from the log, the approved call executes for real. Requires code deterministic up to tool
calls; divergence is detected (method/args diff vs recorded, stably stringified) and returned as
`{ status: "error", error: "Codemode replay divergence at step N ... Wrap nondeterministic work in codemode.step()." }`.
Sequential awaits are required in runs that may pause (`Promise.all` reorders seq numbers). Any
single logged value capped at 1 MB (`MAX_DURABLE_VALUE_BYTES`); oversized args/results fail the run
with a model-actionable error (final result exempt). `replay: "reexecute"` marks a tool ephemeral
(logged for sequencing, result never stored — re-runs on replay; for large idempotent reads).

**Tool output** (`ProxyToolOutput`, `docs/codemode/approvals.md`):

```ts
type ProxyToolOutput =
  | { status: "completed"; executionId: string; result: unknown; logs?: string[] }
  | { status: "paused";    executionId: string; pending: PendingAction[] }
  | { status: "error";     executionId: string; error: string; logs?: string[] };
```

**Snippets** = curated saved scripts (developer promotes a successful execution via
`runtime.saveSnippet(name)`); they surface in `codemode.search` with `kind: "snippet"`, record their
required connector names, and refuse to run if a required connector is missing. This is the package's
built-in analog of a "skills directory" — grown from real runs, not authored.

### 1.3 Layer 3 — MCP-facing (`src/mcp.ts`) — **the blueprint for our server**

Two factories, both returning an `McpServer` from `@modelcontextprotocol/sdk`:

**`codeMcpServer({ server, executor, description? })`** — wraps an *existing MCP server* into a
single tool named **`code`** (`{ code: z.string() }`). It connects to the upstream server over
`InMemoryTransport`, calls `listTools()`, generates TS types from every tool's JSON Schema into the
tool description (`{{types}}`), and exposes each upstream tool as `codemode.<sanitizedName>()` in
the sandbox. MCP results are unwrapped to plain values (`structuredContent` > all-text JSON.parse >
raw; `isError` → thrown). Example: `examples/codemode-mcp/`.

**`openApiMcpServer({ spec, executor, request, name?, version?, description? })`** — two tools:

- **`search`** — `{ code: z.string().describe("JavaScript async arrow function to search the spec") }`.
  The host embeds the full OpenAPI spec JSON into the generated sandbox module; sandbox global is
  `codemode.spec(): Promise<OpenApiSpec>` with `$ref`s lazily resolved inline. The tool description
  embeds the `OpenApiSpec` TS interfaces and examples ("list all paths", "find endpoints by tag").
  The LLM greps the spec *with code* — no server-side index at all.
- **`execute`** — `{ code: z.string() }`; sandbox gets `codemode.spec()` **plus**
  `codemode.request({ method, path, query?, body?, contentType?, rawBody? })`, which is dispatched
  back to the host-provided `request(options, context)` callback. **Auth lives only in that host
  callback** — the sandbox has no network and never sees tokens. `context` is the MCP SDK
  request-scoped context of the outer `execute` call, usable for **elicitation** (human approval
  mid-execution!) — see `examples/codemode-mcp-openapi/README.md`; keep executor timeout ≥ 60s
  elicitation timeout.
- Both tools truncate responses to ~6,000 tokens (24,000 chars) with a
  `--- TRUNCATED --- Response was ~N tokens (limit: 6,000). Use more specific queries...` footer.

Minimal server (from `examples/codemode-mcp-openapi/src/server.ts`, which wraps the live Cloudflare API):

```ts
import { createMcpHandler } from "agents/mcp";
import { DynamicWorkerExecutor } from "@cloudflare/codemode";
import { openApiMcpServer } from "@cloudflare/codemode/mcp";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const token = request.headers.get("Authorization")?.slice(7);  // bearer
    if (!token) return new Response("unauthorized", { status: 401 });

    const server = openApiMcpServer({
      spec: await getSpec(),                       // fetched+cached host-side
      executor: new DynamicWorkerExecutor({ loader: env.LOADER }),
      name: "cloudflare",
      request: async (opts) => {                   // HOST-SIDE: auth never enters sandbox
        const url = new URL(`https://api.cloudflare.com/client/v4${opts.path}`);
        for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, String(v));
        const res = await fetch(url, {
          method: opts.method,
          headers: { Authorization: `Bearer ${token}`, ...(opts.body ? { "Content-Type": "application/json" } : {}) },
          body: opts.body ? JSON.stringify(opts.body) : undefined
        });
        return res.json();
      }
    });
    return createMcpHandler(server)(request, env, ctx);
  }
};
```

`wrangler.jsonc` for that example — the whole config:

```jsonc
{
  "name": "codemode-mcp",
  "compatibility_date": "2026-06-11",
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/server.ts",
  "worker_loaders": [{ "binding": "LOADER" }]
}
```

### 1.4 Code normalization (`src/normalize.ts`)

Before execution, LLM code is normalized with **acorn** AST parsing: markdown fences stripped
(```js/```ts/bare), `export default <expr>` unwrapped, a single named function declaration wrapped
and called, a trailing expression turned into a `return`, and anything unparseable wrapped in
`async () => { ... }`. Note the prompt says "no TypeScript syntax" — acorn parses JS only; TS types
in generated code will fall through to the wrap-and-hope branch and then fail at eval. If we want to
accept TS, strip types host-side (e.g. `@cloudflare/worker-bundler`, also in the monorepo, does
runtime TS compilation + npm dependency resolution for Dynamic Workers).

---

## 2. The Executor: how code actually runs (`src/executor.ts`)

`DynamicWorkerExecutor` options:

| Option | Type | Default | Meaning |
|---|---|---|---|
| `loader` | `WorkerLoader` | required | the `env.LOADER` binding |
| `timeout` | `number` | `60000` | in-sandbox `Promise.race` timeout |
| `globalOutbound` | `Fetcher \| null` | **`null`** | `null` = fetch/connect throw; a `Fetcher` routes all egress through it |
| `modules` | `Record<string,string>` | `{}` | extra modules available in the sandbox (`"executor.js"` reserved) |
| `bindings` | `Record<string,unknown>` | `{}` | extra `env` bindings injected into the sandbox worker |

Per `execute(code, providers, options?)` call it **synthesizes a complete Worker module** ("executor.js"):
a `WorkerEntrypoint` subclass with an `evaluate(__dispatchers, __connectors)` RPC method that:

1. hijacks `console.log/warn/error` into a `__logs` array (returned to the host; captured, not leaked),
2. defines a JSON codec that round-trips `Uint8Array`/`ArrayBuffer` via base64 tagging,
3. creates one `Proxy` global per provider — property access returns
   `async (...args) => { const r = await __dispatchers.<name>.call(String(toolName), __stringifyForCodemode(args)); ... }`,
4. creates one `Proxy` global per connector — `__connectors.<name>.callTool(toolName, args[0])`
   direct Workers RPC (no JSON layer); pause/error come back as control markers
   (`{ __codemode_control__: "pause" | "error" }`) and are re-thrown locally,
5. runs `Promise.race([ (<normalized code>)(), timeout ])` in try/catch and returns
   `{ result, error?, logs }`.

Then it loads the isolate:

```ts
const worker = this.#loader.load({
  compatibilityDate: "2025-06-01",
  compatibilityFlags: ["nodejs_compat"],
  mainModule: "executor.js",
  modules: { ...this.#modules, "executor.js": executorModule },
  globalOutbound: this.#globalOutbound,   // null by default
  env: hasEnv ? env : undefined
});
const entrypoint = worker.getEntrypoint();
const response = await entrypoint.evaluate(dispatchers, connectorBindings);
```

Key details:
- Uses **`loader.load()`** (one-shot, uncached) not `get(id, cb)` — every run is unique generated
  code, so caching by id would only churn the isolate cache. (Billing consequence in §3.4.)
- `ToolDispatcher extends RpcTarget` — host object holding the tool functions; passed **as an RPC
  argument** to `evaluate()`. Live RPC stubs can be RPC call arguments but NOT Worker `env` config
  values (connector bindings are also passed via `evaluate()` args for this reason).
- Provider/connector names validated against reserved harness names
  (`__dispatchers`, `Promise`, `console`, ...) and JS-identifier syntax; sanitized tool-name
  collisions are hard errors.
- `worker` and `entrypoint` own native handles; both are eagerly `Symbol.dispose`d after the call.
- The `Executor` interface is minimal — `execute(code, providersOrFns, options?) → { result, error?, logs? }` —
  so alternate sandboxes (Node VM, QuickJS, containers, `IframeSandboxExecutor` in the browser) drop in.

---

## 3. Dynamic Workers / Worker Loader binding

Docs: https://developers.cloudflare.com/dynamic-workers/ (full text at `/dynamic-workers/llms-full.txt`);
also https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/.

### 3.1 Availability — **open beta, no signup**

- Announced closed beta with the Code Mode blog post (2025-09); moved to **open beta on
  2026-03-24** (changelog: `developers.cloudflare.com/changelog/post/2026-03-24-dynamic-workers-open-beta/`).
- **No beta flag or signup form needed today.** Requirement: **Workers Paid plan** ("Dynamic Workers
  are currently only available on the Workers Paid plan"). Works fully in local dev
  (wrangler/workerd) on any plan.

### 3.2 Config + runtime API

```jsonc
// wrangler.jsonc
{ "worker_loaders": [{ "binding": "LOADER" }] }
```

```toml
[[worker_loaders]]
binding = "LOADER"
```

Two load paths:

- `env.LOADER.load(workerCode)` → fresh isolate, no caching. "One-time code execution, for example
  when using Code Mode."
- `env.LOADER.get(id, async () => workerCode)` → cached by `id`; callback runs only if the isolate
  isn't already warm. "When the same code will receive subsequent requests."

`WorkerCode` fields: `compatibilityDate` (required), `compatibilityFlags?`, `mainModule` (required),
`modules` (required; `.js`, `.py`, `.cjs` or typed objects), `globalOutbound?` (`ServiceStub | null`),
`env?` (structured-clonable data, service bindings incl. loopback `ctx.exports.*` stubs, custom
`WorkerEntrypoint` RPC classes), `tails?` (Tail Worker stubs for observability), `limits?`.

The returned `WorkerStub` exposes `getEntrypoint(name?, { limits? })` (RPC/fetch to the child) and
`getDurableObjectClass(name)` for **Durable Object facets** — run dynamic code as a DO with its own
isolated SQLite:

```js
const facet = this.ctx.facets.get("app", async () => {
  const worker = this.env.LOADER.get(codeId, async () => ({
    compatibilityDate: "2026-04-01",
    mainModule: "worker.js",
    modules: { "worker.js": AGENT_CODE },
    globalOutbound: null
  }));
  return { class: worker.getDurableObjectClass("App") };
});
```

### 3.3 Egress control and limits

`globalOutbound`:

| Value | Behavior |
|---|---|
| `null` | "Totally cut off from the network. Both fetch() and connect() will throw" |
| `undefined` | inherits the parent Worker's network access (full internet) |
| a `ServiceStub`/`Fetcher` | **every** `fetch()`/`connect()` from the child routes through it — e.g. `globalOutbound: ctx.exports.HttpGateway({ props: { tenantId } })` for an allowlist/audit gateway |

Limits (`https://developers.cloudflare.com/dynamic-workers/usage/limits/`): per-worker or per-entrypoint

```js
// in WorkerCode:
limits: { cpuMs: 10, subRequests: 5 }
// or per call:
worker.getEntrypoint(null, { limits: { cpuMs: 10, subRequests: 5 } })
```

Defaults are your plan limits (paid: up to 300,000 ms CPU, 10,000 subrequests/invocation, standard
128 MB isolate memory). Hitting a custom limit throws immediately; when set in both places the lower
wins. Codemode adds its own wall-clock `timeout` (60 s default) inside the sandbox.

### 3.4 Pricing (page dated 2026-05)

Workers Paid plan; three dimensions:

| Metric | Included | Overage |
|---|---|---|
| Unique Dynamic Workers | 1,000 unique/month | +$0.002 per Dynamic Worker per day |
| Requests | 10 M/month | +$0.30 per million |
| CPU time | 30 M CPU-ms/month | +$0.02 per million CPU-ms |

Uniqueness = Worker ID + code version. **`.load(code)` (what codemode uses) counts as 1 Dynamic
Worker per invocation** — i.e. beyond the included 1,000/month, roughly $0.002 per `execute` call.
Unlike standard Workers, **startup CPU (isolate init + parse) is billed** in addition to execution CPU.

---

## 4. How codemode feeds the API surface to the LLM — and the built-in "search"

Two philosophies coexist in the package:

1. **Types-in-description** (Layer 1 `createCodeTool`, Layer 3 `codeMcpServer`): every tool's
   JSON Schema is converted to TS declarations and pasted into the single tool's description. Fine
   for ≤ ~10–20 tools; "a GitHub MCP server plus a Stripe spec plus an internal API is thousands of
   prompt tokens the model pays for on every request" (docs/codemode/index.md).
2. **Discovery-in-sandbox** (Layer 2 runtime, Layer 3 `openApiMcpServer`): the tool description
   stays tiny (workflow + connector names); the model pulls type info on demand with
   `codemode.search`/`codemode.describe` (runtime) or by grepping `codemode.spec()` with its own
   code (openApi). Results land **in the running code**, not the context window.

**Yes, there is an existing "search the API" affordance** — but only inside the Layer-2 runtime
sandbox, not as a standalone MCP tool. Its implementation is small and fully reusable:

- `searchConnectors(query, descriptions, snippets?)` — `src/connectors/search.ts` (~200 lines,
  pure function, zero deps). Token-based ranking: names normalized (camelCase/snake_case/dots/paths
  split), field weights path=12, method=10, connector=8, description=5; multipliers for exact
  (×14) / prefix (×9) / phrase (×6) field matches and token hits (×4/×2/×1); coverage gate
  (100% required for ≤2-token queries, 60% otherwise, unless exact phrase); bonuses for full
  coverage (+25), leading-token match (+8), exact name (+20). Capped at 50 results with a
  `truncated` flag ("search again with a more specific query").
- `describeTarget(target, descriptions, snippets?)` — `src/connectors/describe.ts`. Snippet →
  description + fenced source; connector → instructions + full TS declarations; method → just that
  method's TS types. Backed by `generateTypesFromJsonSchema()`.

Both operate on `ConnectorDescription = { name, instructions?, descriptors: { [method]: { description?, inputSchema? } }, annotations? }` —
trivially constructible from any tool inventory. **We can import these two functions directly for
our top-level MCP `search` tool** (they are exported through the connectors barrel `src/connectors/index.ts`).

---

## 5. Wrapping external HTTP APIs and downstream MCP servers (connectors)

Layer-2 connector classes (`src/connectors/`) are the "one way to add a capability." All extend
`CodemodeConnector<Env> extends WorkerEntrypoint` and answer: `name()` (sandbox global),
`instructions()` (model guidance), `tools()` (record of `ConnectorTool`), plus decoration hook
`tool(name, t)` for tools you didn't author (add `requiresApproval`, `revert`, `replay`).

```ts
type ConnectorTool = {
  description?: string;
  inputSchema?: JSONSchema7;          // defaults to open object
  outputSchema?: JSONSchema7;
  requiresApproval?: boolean;         // pause for human approval
  replay?: "log" | "reexecute";       // ephemeral large reads
  execute: (args: unknown, ctx?: { executionId: string }) => Promise<unknown> | unknown;
  revert?: (args, result, ctx?) => Promise<void> | void;   // rollback compensation
};
```

Lifecycle hooks for per-run resources: `disposeExecution(executionId, status)` on terminal states
(completed/error/rejected/rolled_back; never on pause), `onPassEnd(executionId, status)` after every
pass including pauses. Rules: idempotent, no instance memory, never throw.

- **`McpConnector`** — wraps a downstream MCP server. Implement `createConnection()` (return an
  `McpConnectionLike`, e.g. from the agent's `this.mcp.mcpConnections[serverId]`); each MCP tool
  becomes one method via `connection.client.callTool()`; names sanitized; decorate via `tool()`.
- **`OpenApiConnector`** — wraps an OpenAPI spec **per-operation**. Implement `spec()` (the
  document) and `request({ path, method, params, body, headers })` (authenticated call, host-side).
  The base parses the spec once host-side, inlines local `$ref`s, derives one typed tool per
  operation (`stripe.CreatePaymentIntent({ amount, currency })`) — zero prompt tokens — plus a
  low-level `request` escape-hatch tool. `exposeSpec()` optionally exposes the raw spec as a tool.
- **`ToolSetConnector`** (`src/connectors/toolset.ts`) — wraps an AI SDK `ToolSet`; also any
  connector's `tools()` may return an AI SDK ToolSet directly (shape-compatible).
- **Custom** — implement `tools()` yourself against `this.env` bindings.

Constructor convention: constructors take **dependencies** (`(ctx, env, conn)`); identity/behavior
come from overridden methods. Secrets are read from `this.env` on the host — connector `execute`
always runs host-side.

So the package explicitly supports all three source kinds we need: downstream MCP servers, raw
HTTP/OpenAPI services, and hand-written tool records — under one uniform model-facing protocol.

---

## 6. McpAgent / remote MCP server essentials

From `agents-docs/docs/agents/mcp-servers.md` + cloudflare/mcp-server-cloudflare.

Three approaches:

| Approach | Stateful? | DO needed? | Use for |
|---|---|---|---|
| `createMcpHandler(server, opts?)` from `agents/mcp` | no | no | stateless tools — simplest; **new `McpServer` per request** |
| `McpAgent` subclass | yes (DO per session) | yes | per-session state, elicitation, SSE + streamable HTTP |
| raw `WorkerTransport` / `WebStandardStreamableHTTPServerTransport` | optional | no | full control |

**Stateless skeleton** (what the codemode examples use — sufficient for our server unless we want
durable executions):

```ts
import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    const server = new McpServer({ name: "unified", version: "1.0.0" });
    server.registerTool("search",  { description: "...", inputSchema: { code: z.string() } }, handler);
    server.registerTool("execute", { description: "...", inputSchema: { code: z.string() } }, handler);
    return createMcpHandler(server, { route: "/mcp" })(request, env, ctx);
  }
};
```

`createMcpHandler` options: `route` (default `/mcp`), `enableJsonResponse`, `sessionIdGenerator`,
`corsOptions`, `authContext`, `transport`. Transport is **streamable HTTP** (SSE streaming by
default; `enableJsonResponse: true` for plain JSON).

**McpAgent skeleton** (DO-backed; needed if we adopt the Layer-2 durable runtime with approvals):

```ts
export class UnifiedMcp extends McpAgent<Env, State> {
  server = new McpServer({ name: "unified", version: "1.0.0" });
  async init() { this.server.registerTool("search", {...}, ...); }
}
export default UnifiedMcp.serve("/mcp");             // also supports { jurisdiction: "eu" }
```

```jsonc
{
  "durable_objects": { "bindings": [{ "name": "MCP_OBJECT", "class_name": "UnifiedMcp" }] },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["UnifiedMcp"] }]
}
```

`McpAgent` supports both `/mcp` (streamable HTTP) and legacy `/sse`; each client session gets its
own DO; `this.props` carries auth context; **elicitation** (`this.server.server.elicitInput(...)`)
is supported for human-in-the-loop mid-tool-call.

**Auth options:**
- None (dev only).
- **Bearer token pass-through** — the `codemode-mcp-openapi` example reads
  `Authorization: Bearer <token>` per request and closes over it in the host `request()` callback.
- **OAuth 2.1** — wrap with `@cloudflare/workers-oauth-provider`:
  `new OAuthProvider({ authorizeEndpoint, tokenEndpoint, clientRegistrationEndpoint, apiHandlers: { "/mcp": UnifiedMcp.serve("/mcp") }, defaultHandler })`,
  requires an `OAUTH_KV` KV namespace; `props` set in `completeAuthorization()` flow to
  `this.props` / `getMcpAuthContext()` inside tools.
- cloudflare/mcp-server-cloudflare in production: one `McpAgent` subclass per app, streamable HTTP
  at `/mcp` (deprecated `/sse` kept for compat), shared `@repo/mcp-common` package
  (`CloudflareMCPServer` base, `cloudflare-oauth-handler`, plus `api-token-mode` for header-token
  auth for clients like the OpenAI Responses API that can't do OAuth). Supporting *both* OAuth and
  bearer-header modes is their proven pattern.

---

## 7. Security / egress model (summary)

- **Isolation**: each `execute` runs in a fresh V8 isolate (`loader.load()`), one-shot, disposed
  eagerly. Isolate memory standard (128 MB); `limits: { cpuMs, subRequests }` optional; codemode
  wall-clock timeout 60 s default.
- **No ambient network**: `globalOutbound: null` is runtime-enforced — `fetch()`/`connect()` throw.
  The only I/O channels are the RPC dispatchers/connector stubs the host passes into `evaluate()`.
  Controlled egress = pass a `Fetcher` (e.g. a loopback `ctx.exports.Gateway({ props })` that
  allowlists hosts and logs) — but for our design, prefer keeping `null` and forcing all traffic
  through named host functions.
- **Secrets never enter the sandbox**: tokens/keys live in host `env`/secrets and are used inside
  connector `execute` / the `request()` callback on the host. The child gets only capability stubs.
  ("This binding-based approach prevents API key leaks since credentials remain with the
  supervisor, not in agent-written code." — blog.)
- **Console capture**: sandbox console is buffered into `logs` and returned as data.
- **Result hygiene**: ~6k-token truncation on MCP tool outputs; `transformResult`/`truncateResult`
  at the runtime layer; 1 MB cap per durably logged value.
- **Approvals** (runtime layer only): `requiresApproval: true` + abort-and-replay + `revert`
  rollback + audit log. At the stateless MCP layer, the equivalent lever is **MCP elicitation** from
  the host `request()` callback.
- Residual risks to own ourselves: CPU-burn within limits (billing), data exfiltration *through the
  tools we expose* (the sandbox can call any exposed method with any args — per-tool allowlists,
  scopes, and arg validation on the host remain our job), prompt-injected code calling destructive
  endpoints (gate writes behind approval/elicitation or exclude them).

---

## 8. Exact answers to the key questions

1. **What does codemode generate/expose; exact tool names/schemas today?**
   - `createCodeTool` → one AI SDK tool (name chosen by integrator, canonically `codemode`),
     input `{ code: string }`.
   - `runtime.tool()` → one AI SDK tool `codemode({ code })`, output `ProxyToolOutput`
     (completed/paused/error).
   - `codeMcpServer` → one MCP tool **`code`**, input `{ code: string }`.
   - `openApiMcpServer` → two MCP tools **`search`** and **`execute`**, both input `{ code: string }`
     (descriptions embed TS types for `codemode.spec()` / `codemode.request()`).
2. **Worker Loader**: `worker_loaders: [{ binding: "LOADER" }]`; `env.LOADER.load(code)` one-shot vs
   `env.LOADER.get(id, cb)` cached; child gets only what you pass (`env` bindings, RPC-arg stubs);
   egress via `globalOutbound: null | Fetcher`; `limits: { cpuMs, subRequests }`; **open beta since
   2026-03-24, Workers Paid only, no signup/flag**; billed per unique worker/requests/CPU (startup
   CPU included).
3. **API surface to the LLM**: either full TS declarations in the tool description (small toolsets)
   or in-sandbox discovery (`codemode.search`/`describe`, or spec-as-data). A reusable ranked-search
   implementation exists (`searchConnectors`/`describeTarget`) but only as an *in-sandbox* affordance;
   there is **no first-class top-level MCP `search` tool over multiple connectors** — that part we
   assemble ourselves from their exported pieces (§9).
4. **Wrapping external APIs/MCP servers**: `McpConnector`, `OpenApiConnector`, `ToolSetConnector`,
   custom `CodemodeConnector`; or at the MCP layer `codeMcpServer`/`openApiMcpServer` with a
   host-side `request()`.
5. **McpAgent essentials**: §6 — stateless `createMcpHandler` (new server per request) vs DO-backed
   `McpAgent.serve()`; zod schemas via `registerTool(name, { description, inputSchema: { x: z... } }, handler)`;
   auth = none / bearer header / `OAuthProvider`.
6. **Security model**: §7 — isolate + `globalOutbound: null` + RPC-only capabilities + host-side
   secrets + timeouts/limits + truncation.

---

## 9. Design implications for our unified `search` + `execute` MCP

Target: one MCP server, two tools, over a unified API layer spanning several third-party services
(HTTP APIs + downstream MCP servers) plus a skills directory.

### Recommended architecture

```
MCP client (LLM)
  │  streamable HTTP /mcp  (createMcpHandler; bearer or OAuth in front)
  ▼
Host Worker  (Workers Paid; wrangler: worker_loaders LOADER, nodejs_compat)
  ├─ tool "search"  { query: string } or { code: string }        ← see decision below
  │     runs over a unified index: ConnectorDescription[] built from
  │     each service adapter + skills directory entries
  ├─ tool "execute" { code: string }
  │     DynamicWorkerExecutor({ loader: env.LOADER, globalOutbound: null, timeout })
  │     sandbox globals: one namespace per service (stellar.*, github.*, ...)
  │     + platform global (search/describe/skill-run) dispatched back to host
  └─ service adapters (host-side, hold secrets):
        OpenAPI-derived per-operation fns · MCP client passthroughs · custom fns
```

Concrete recommendations:

1. **Start from `openApiMcpServer`'s shape, generalize with `createCodeTool`'s provider machinery.**
   Register `search` and `execute` with `server.registerTool(name, { description, inputSchema: { code: z.string() } }, ...)`
   via `createMcpHandler`. For execution, call `executor.execute(code, providers)` directly with
   `ResolvedProvider[]` — one provider per service (`{ name: "github", fns }`) plus a platform
   provider (`{ name: "codemode", fns: { search, describe, runSkill } }`). This is exactly what
   `DynamicWorkerExecutor` supports natively (multiple namespaced Proxy globals) without adopting
   the whole Layer-2 runtime.
2. **Decide `search`'s input shape deliberately.** Two proven variants:
   (a) `search({ code })` à la `openApiMcpServer` — LLM greps the unified catalog as data
   (maximally flexible, zero index maintenance, costs one isolate per search);
   (b) `search({ query })` plain string — run `searchConnectors()` host-side (no isolate, cheaper,
   faster, simpler for the model). **Recommendation: (b) for the top-level tool**, importing
   `searchConnectors` + `describeTarget` from `@cloudflare/codemode` (or vendoring the ~300 lines),
   and *also* exposing `codemode.search`/`codemode.describe` as sandbox globals inside `execute` so
   mid-script discovery works. Return `describe`-style TS types directly in search results for
   top-k hits to save a round trip.
3. **Build the unified index as `ConnectorDescription[]`.** For each OpenAPI service, reuse
   `OpenApiConnector`'s host-side derivation (per-operation descriptors with inlined `$ref`s); for
   each downstream MCP server, `listTools()` → descriptors (names via `sanitizeToolName`); for
   skills, map each skill file to `{ path: skillName, kind: "snippet", description }` — the search
   scorer already handles a `snippet` kind. Cache the assembled index (KV or in-isolate) since spec
   parsing is the only expensive step.
4. **Skills directory ≈ snippets.** Model each skill as a parameterized saved script
   (`async (input) => { ... }` using the same service globals), discoverable via `search`,
   inspectable via `describe`, runnable via a sandbox `codemode.run(name, input)` global that the
   host resolves from the skills store. Unlike Cloudflare's grown-not-authored snippets, ours are
   authored — that's fine; the runtime mechanism is identical (host injects the skill source and
   executes it in the same sandbox).
5. **Egress: keep `globalOutbound: null`.** All service traffic goes through host-side namespaced
   functions where secrets live (bearer keys per service from Worker secrets). Only if the LLM
   legitimately needs arbitrary-URL fetch (e.g. following API-returned links) add a loopback
   gateway: `globalOutbound: ctx.exports.EgressGateway(...)` with a host allowlist + logging.
6. **Stateless first; DO only if we want approvals/audit.** `createMcpHandler` with a fresh
   `McpServer` per request suffices, and the codemode MCP examples are stateless. If we later want
   `requiresApproval` + durable replay + audit trail, adopt `McpAgent` + `createCodemodeRuntime`
   (DO facet; needs `export { CodemodeRuntime }` from the entry module and DO bindings/migrations).
   Interim human-in-the-loop without DOs: **MCP elicitation from the host callback** (keep executor
   timeout ≥ 60 s).
7. **Result hygiene:** adopt their truncation (~6k tokens with actionable footer) on both tools'
   outputs — `truncateResult`/`truncateResponse` are exported from `@cloudflare/codemode`.
   Return errors as data (`isError` content / `{ status: "error" }`) — never throw across the tool
   boundary.
8. **Prompting:** copy `buildDescription()`'s rules block for the `execute` description ("ONLY
   globals are …; never guess method names; search first; no fetch; plain JS, no TS syntax") and
   `openApiMcpServer`'s worked examples in `search`. Use `normalizeCode` (exported path: it's
   applied inside the executor already) so fenced/`export default` code just works.
9. **Cost/limits awareness:** every `execute` (and the retired code-shaped `search`) = one
   `.load()` = one billable Dynamic Worker beyond 1,000/month (+$0.002/worker/day) — another
   reason the shipped top-level `search` is a host-side string query. Worker Loader supports
   resource controls in principle, but `@cloudflare/codemode@0.4.2` does not expose those knobs
   through `DynamicWorkerExecutor`; the current implementation relies on `globalOutbound: null`
   plus the 60s wall-clock timeout.
10. **Version pins:** `@cloudflare/codemode@^0.4`, peer `ai ^6`, `zod ^4`,
    `@modelcontextprotocol/sdk ^1.25`; wrangler compat date ≥ 2026-06-11 with `nodejs_compat`;
    child isolates loaded with `compatibilityDate: "2025-06-01"` internally. The package is
    experimental — pin exactly and vendor the small pure modules we depend on
    (`search.ts`, `describe.ts`, `normalize.ts`, `json-schema-types.ts`) if churn becomes a problem.

### Gaps we must build ourselves

- **Top-level `search` MCP tool over a multi-service catalog + skills** — no off-the-shelf export;
  assemble from `searchConnectors` + `describeTarget` + our own catalog builder (small: the scoring
  and TS-rendering are already written).
- **Multi-service `openApiMcpServer`** — the shipped one takes a single spec and a single
  `request()`; ours needs N specs + N MCP clients + custom fns under distinct namespaces (use
  `executor.execute(code, ResolvedProvider[])` directly, which already supports this).
- **Skills store** (R2/KV/D1 or bundled) + `codemode.run` host resolution + connector-requirement
  checks (mirror `Snippet.connectors` validation).
- **Per-tool policy** (allow/deny writes, arg validation, scopes per bearer identity) — codemode
  validates schemas (AI SDK `asSchema`) but authorization is ours.
- **Auth front-end** — bearer pass-through is trivial; OAuth needs `workers-oauth-provider` + KV.
- **Observability** — attach `tails` to loaded workers and/or log `{ code, result, logs }` per
  execution if we skip the DO-backed audit log.

### Reference files (paths below are from the ephemeral 2026-07-01 clone — see the header note; re-fetch from `github.com/cloudflare/agents` to read them today)

- `packages/codemode/src/mcp.ts` — `search`/`execute` + `code` MCP tools (the blueprint)
- `packages/codemode/src/executor.ts` — `DynamicWorkerExecutor`, sandbox module synthesis
- `packages/codemode/src/connectors/{base,mcp,openapi,toolset,search,describe}.ts`
- `packages/codemode/src/{tool,shared,normalize,json-schema-types,proxy-tool,runtime}.ts`
- `examples/codemode-mcp-openapi/`, `examples/codemode-mcp/`, `examples/dynamic-workers/`
- Docs mirror: `agents-docs/docs/codemode/{index,runtime,connectors,approvals,snippets,vite-plugin}.md`,
  `agents-docs/docs/agents/{codemode,mcp-servers,mcp-transports,securing-mcp-servers}.md`
