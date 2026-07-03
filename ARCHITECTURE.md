# Architecture — how `search` and `execute` actually work

The end-to-end mechanics of the two tools, verified against the code as of 2026-07-03. Read
[`PLAN.md`](./PLAN.md) first for *why* the design is shaped this way; this doc is the *how*,
with file paths for every claim. Nothing here is aspirational — if the code moves, this doc
is wrong until refreshed.

Two tools, one Worker: `search` is a host-side ranked query over a generated catalog;
`execute` runs LLM-authored JavaScript in a network-less Dynamic Worker isolate whose only
I/O is host-RPC stubs that hold the secrets and enforce the policy.

## 1. A `search` call, end to end

Every request enters `src/server.ts` (`export default { fetch }` — the only Worker entry).
For `/mcp` paths the auth gate runs in this order (both bypass checks live in
`src/auth/gate.ts`):

1. **Admin token** — `isAdminAuthorized`: `MCP_ADMIN_TOKEN` secret presented as
   `Authorization: Bearer` or `X-MCP-Admin-Token`, compared as SHA-256 digests with a
   timing-safe equality check (`crypto.subtle.timingSafeEqual` on Workers, branch-free XOR
   fold under plain-Node tests). Unset secret → bypass off.
2. **Local-dev bypass** — `allowDevUnauthenticated`: requires `DEV_ALLOW_UNAUTHENTICATED`
   to be the exact string `"true"` **and** the request hostname to be loopback
   (`localhost` / `127.0.0.1` / `::1`). The hostname gate is a hard second factor: a var
   mistakenly deployed to production is inert, because `agents.stellar.buzz` is not a local
   host. The var itself is only ever set in `.dev.vars`.
3. **OAuth** — everything else goes through `@cloudflare/workers-oauth-provider`
   (options built by `oauthProviderOptions` in `src/auth/gate.ts`): the Worker is its own
   OAuth 2.1 authorization server (opaque tokens in `OAUTH_KV`, S256-PKCE only, CIMD
   enabled), with WorkOS AuthKit as the upstream IdP behind `/authorize` → `/callback`
   (`src/auth/workos.ts`). `src/server.ts` also aliases the path-suffixed RFC 8414 and OIDC
   discovery paths onto the lib's exact-path metadata endpoint.

Each authorized request gets a **fresh, stateless `McpServer`** served over streamable HTTP
by `createMcpHandler` (from `agents/mcp`) — no Durable Objects, no session state. Tool
registration and all model-facing prose live in `src/mcp/tools.ts`; the initialize-time
`SERVER_INSTRUCTIONS` (workflow + envelope contract) ride along because clients surface
them in the system prompt, where they outlive per-tool descriptions.

The `search` tool handler is a pure function call: `searchCatalog(getCatalog(), { query,
kind?, service?, limit? })`. `getCatalog()` (`src/catalog/load.ts`) imports the generated
`catalog/manifest.json` as a bundled JSON module and validates it once per isolate via
`loadManifest` — a malformed manifest throws loudly at first use, never softens. The
response is `{ hits, nextSteps }` (as both `text` and `structuredContent`); `nextSteps` is
a server-authored hint that restates the compose-in-one-script workflow and the envelope
rule on every call. A `search` telemetry event (`src/observability.ts` → Workers Logs)
records the query, hit count, top-3 ids, response size in chars (search has no output cap
today — `responseChars` exists to set any future cap from data), and latency.

## 2. The scoring pipeline

Three layers, strictly separated:

**Vendored lexical scorer** — `src/catalog/vendor/search-scoring.ts`, adapted from
`@cloudflare/codemode@0.4.2`'s unexported `searchConnectors` (vendored because it is not
exported and the package's main entry imports `cloudflare:workers`). Field weights: id 12,
name (last id segment) 10, service 8, description 5, kind 2. Per field: exact match ×14,
prefix ×9, phrase ×6, plus per-token hits (×4 exact token, ×2 prefix-overlap, ×1
substring). A **coverage gate** returns `null` (no hit) unless matched tokens cover 100% of
the query for ≤2-token queries, 60% otherwise — or an exact phrase matched. Bonuses: +25
full coverage, +8 first-token match, +20 exact id/name match. The math is upstream's,
untouched.

**Structural wrappers** — `src/catalog/scoring.ts`, ours, deliberately query-independent
(no per-question special cases):

1. *Stopword gate-rescue* — an entry that fails the coverage gate on the full query is
   rescored with closed-class English stopwords removed. Entries that already passed keep
   their exact vendor score (filtering stopwords for all scoring was tried and regressed).
2. *Kind weighting* — `skill-section` entries are scaled ×0.75 so 278 near-duplicate
   fragments don't blanket-outrank the operations on shared topical vocabulary.
3. *Service diversity* — the returned set is selected with a per-service quota
   (`max(2, ceil(0.4 × limit))`, score order preserved, top hit never displaced,
   overflow backfills empty slots).
4. *Keyword blend* — skill-section entries carry build-time `keywords` distilled from the
   section body (`src/catalog/extract-keywords.ts`); the entry is scored twice (as-is and
   with keywords appended to the description) and the keyword-attributable delta blends in
   at 0.4 damping. The routing eval is the guard on this trade; changing the blend requires
   re-running it (`eval/EVALS.md`).

**Set shaping** — `src/catalog/search.ts`. `loadManifest` enforces structural invariants at
load: globally unique entry ids, and unique operation terminal names per service (those
segments become sandbox function names in `src/executor/providers.ts`, so a collision would
silently shadow one operation with another). `searchCatalog` never returns denied entries
(`policy.allow === false` filtered before scoring), sorts score-desc then id-asc, and drops
**metadata twins**: a `lumenloop.skill.*` entry (metadata-only, `transport: null`) is
suppressed when its readable `skills.*` twin (same terminal name) exists — except under an
explicit `service: "lumenloop"` filter, where suppression would make the skill
undiscoverable.

**Hit anatomy**: `{ id, service, kind, score, description }`, plus a rendered **TypeScript
signature** for operations (`renderSignature` — input/output type declarations from the
entry's JSON Schemas via the vendored type generator, and a callable line that spells out
the *full result envelope union*, because a bare `Promise<Output>` teaches exactly the
wrong-level access the envelope exists to prevent), plus **`availableSections`** for skill
hits (`sectionKeysOf` — the same key set `readSkill` advertises; denied sections excluded
on both surfaces).

## 3. An `execute` call, end to end

The tool takes `{ code }`. The runner is **injected** into `registerTools` by
`src/server.ts` (`createExecuteRunner(env)`, one per isolate) because
`src/executor/run.ts` imports `@cloudflare/codemode` → `cloudflare:workers`, which
plain-Node vitest cannot load; without a runner the tool degrades to an error-as-data
explanation, never a throw.

Per call (`src/executor/run.ts`):

1. **Normalize** — `DynamicWorkerExecutor.execute` applies upstream `normalizeCode`
   internally (strips markdown fences, unwraps `export default`, wraps bare statements into
   the `async () => {}` shape; our vendored copy in `src/catalog/vendor/normalize.ts` is
   used by the spec-sandbox source generator).
2. **Fresh isolate** — one Dynamic Worker per call via `env.LOADER.load()`, with
   `globalOutbound: null` pinned explicitly (any `fetch()`/`connect()` in model code
   throws) and a 60s wall-clock timeout. Known limitation: codemode 0.4.2 doesn't expose
   Worker `limits` (`cpuMs`/`subRequests`); we rely on its timeout + plan defaults.
3. **Sandbox globals** (`src/executor/providers.ts`, `buildSandbox`): one namespace global
   per service with one async fn per cataloged operation, named by the id's terminal
   segment (`lumenloop.search_directory(args)`, `scout.getStatus()`,
   `stellarDocs.search_docs(args)`) — currently 21 + 24 + 12 fns — plus the `codemode`
   discovery global (§5). Wrong names fail loudly through codemode's per-namespace Proxy
   ("Tool not found"); there is no fuzzy resolution. Providers are rebuilt per run so the
   skill-read advice flag is run-scoped; the expensive derivations (catalog view, resolved
   spec) are WeakMap-cached module-level.
4. **Per-call host RPC** — every service fn runs: manifest entry (closure-captured, never
   model-supplied) → `guard` (`src/policy/guard.ts`: deny-list → metered gate →
   `validateArgs` against the entry's `inputSchema`, `src/policy/validate.ts`) → adapter
   dispatch (`src/adapters/index.ts` → `lumenloop.ts` / `scout.ts` / `stellar-docs.ts`;
   secrets read from env host-side, model code never sees a URL, header, or key) →
   per-service normalization into the envelope (soft-empty ≠ error ≠ data; e.g. Scout 404s
   normalize to `soft-empty`, JSON and non-JSON alike) → `redactSecrets`
   (`src/policy/redact.ts` — every secret the Worker holds is scrubbed from serialized
   results). Denied/metered entries still get a sandbox fn so the model sees a typed
   `{ kind: "denied" }` refusal instead of a bare not-found. Each dispatch emits an `op`
   telemetry event (`id`, outcome, ms); fan-out via `Promise.all` is safe (no shared
   mutable state per call).
5. **Tracing** — the sandbox run is wrapped in a custom `codemode.execute` span because
   Worker Loader isolates are not auto-instrumented
   (`research/observability-cloudflare.md`).
6. **Output hygiene, three budgeted channels** — everything model-facing is capped at
   ~6k tokens (4 chars/token, `src/policy/truncate.ts`), because each channel is
   model-authored and would otherwise smuggle payloads past the others:
   - *result*: redacted again, then `truncateForModel` with an actionable footer
     (select fields / slice / aggregate in-script). The `skillSectionAdvice` flag can change
     footer wording only — advice flags never widen the budget or move the cut.
   - *logs*: `shapeLogs` (`src/executor/shape-logs.ts`) applies structural caps first —
     100 lines × 2,000 chars — **redacting each line before clipping** (clip-first would
     let a secret straddling the boundary leak its prefix), then the joined block gets its
     own ~6k budget at the tool boundary (`truncateLogsForModel` in `src/mcp/tools.ts`;
     structural caps alone still admit ~50k tokens).
   - *error text*: `throw new Error(payload)` is the third channel — same budget.
7. **Errors as data** — a failed run returns `isError: true` with `Execution failed: …`
   plus the console block; nothing throws across the tool boundary. The `execute`
   telemetry event records ok/ms/code preview/result preview + all three truncation flags;
   `execute_logs_shaped` fires only when structural shaping actually lost something.

## 4. The envelope contract

Every service call resolves — never throws — to `{ ok: true, data }` or
`{ ok: false, error: { service, kind, message, status?, code?, hint? } }`, with `kind`
three-way: `"error"` (call failed / bad args), `"soft-empty"` (the service answered with
nothing — *not* evidence of absence), `"denied"` (policy refused before any network)
(`src/adapters/types.ts`).

The observed LLM failure mode is reading payload fields one level too shallow
(`r.projects` instead of `r.data.projects`), which yields `undefined` and — after a
defensive `|| []` — masquerades as a legitimate empty result. A sandbox-side **guard
prelude** (`envelopeGuardPrelude` in `src/executor/providers.ts`) wraps every service fn
and plants non-enumerable accessor pairs on each envelope:

| Access | ok: true | ok: false |
|---|---|---|
| GET payload key on the envelope (`r.projects`) | **throws**, naming `r.data.projects` | — |
| GET `r.data` | plain data | `undefined` + ONE deduped `[envelope]` console warning naming the real error (kind/message/hint) |
| SET (either) | **writes through** (self-replaces with a plain property — decorating the envelope is legal) | warns once, then writes through |
| `r.error` on ok:true | stays plain `undefined` (the `if (r.error)` pattern keeps working) | — |

Non-enumerable accessors, deliberately **not** a Proxy (Proxies `DataCloneError` under
Workers RPC serialization): `Object.keys` / spread / JSON / structured clone / returning
the raw envelope all read enumerable-only and stay untouched; only direct wrong-level
access trips a trap. The SET is not try/caught — a frozen envelope must throw loudly at
the write. The guard applies to service namespaces only; `codemode.*` discovery fns return
their own shapes by design. The same contract is taught in four channels: rendered
signatures, `search`'s `nextSteps`, the `execute` description, and `SERVER_INSTRUCTIONS`.

## 5. Discovery inside the sandbox

The `codemode` provider (`buildCodemodeProvider`, `src/executor/providers.ts`) is
`execute`'s in-sandbox discovery surface — follow-up discovery at zero extra turn cost:

- **`codemode.spec()`** — the unified super spec (`specs/super-spec.json`: OpenAPI-3.1-style,
  paths keyed `/{service}/{operation}`, operationId = the exact sandbox call, `x-policy` /
  `x-cost` / `x-execute` / `x-skill-index` vendor extensions), with `$refs` resolved inline
  (`resolveSpecRefs` in `src/executor/spec-sandbox.ts` — the host-side twin of upstream's
  in-sandbox `__resolveRefs`, cached per spec object). Post-ADR-0001
  (`research/decisions/0001-search-tool-shape.md`) this is the super spec's role: the
  code-shaped `search` front door that injected ~183KB of serialized spec into each search
  sandbox lost the golden Q→A A/B and was retired; the document (~45k tokens) is now served
  as data over the provider RPC, greppable in-sandbox, and **never enters the agent's
  context** unless a script deliberately returns slices of it. The unregistered
  `createSpecSearchRunner` (`src/executor/run.ts`) keeps the source-injection variant
  buildable for future A/Bs.
- **`codemode.search(queryOrOpts)`** — the same host-side `searchCatalog`, mid-script.
- **`codemode.catalog()`** — the full manifest as flat data for arbitrary code-grep, with
  host-only detail (transport, provenance) stripped. Denied entries are *visible* with
  `policy.allow: false` + `denyReason` — see-but-not-call; the execution guard still
  refuses.
- **`codemode.describe(id)`** — one entry's docs + signature, exact-match id only.
- **`codemode.skill.read(name, { sections? })`** — §6. Wired via a one-line prelude
  (`SKILL_PRELUDE`) because nested objects can't cross codemode's flat Proxy dispatch.

## 6. Skill splitting — mirror → sections → twins → reads

**The mirror.** `ecosystem-skills/` is a pinned mirror of 25 skills from 5 upstreams
(commit-SHA-pinned in `ecosystem-skills/MANIFEST.json`); `scripts/check-mirrors.mjs`
verifies integrity offline, `scripts/check-skills-drift.mjs` checks the pins against
upstream in the daily refresh (detection only — the mirror is never auto-synced).

**The bundle.** Workers have no filesystem, so `scripts/bundle-skills.mjs` packs every
`.md` file (markdown only — that's the exposed surface; 43 files) into
`src/skills/bundle.json`, keyed by repo-root-relative path — chosen to equal catalog
entries' `transport.path` exactly, so the store resolves transport → content with no path
arithmetic. `generatedAt` comes from the mirror manifest's `synced_at`, never wall clock.

**Build-time sectioning.** `scripts/build-catalog.mjs` emits, per skill: one `kind:
"skill"` entry (id `skills.<source>.<name>`, description from frontmatter or first
paragraph); one `kind: "skill-section"` entry per `##` heading (id `<skillId>#<slug>`,
duplicate slugs deduped `-2`, `-3`…; description = heading + first paragraph, truncated to
200 chars; low-weight `keywords` extracted from the *section body* so mid-section content —
error codes, flags, function names — is lexically searchable); and one section-kind entry
per extra `.md` file (id `<skillId>#file:<relpath>`). Currently 25 skills + 278 sections.

**Metadata twins.** The Lumenloop API serves 14 skills of its own as zips; the catalog
carries them as `lumenloop.skill.*` entries with `transport: null` (metadata-only — bodies
not fetched from the API). Their bodies *are* in the mirror verbatim, so
`src/skills/store.ts` supports exactly one alias: `lumenloop.skill.X` resolves to the
`skills.*` entry with the identical terminal name — an exact equality, refused when
ambiguous, not a search. On the search side the metadata twin is suppressed when its
readable twin exists (§2), so the unreadable form doesn't waste a result slot.

**The read path** (`readSkill`, `src/skills/store.ts`) resolves through the **catalog**,
not the filesystem: `name` must be an exact catalog id (a `#slug` suffix reads that one
section), the entry must be `kind: "skill"` with `policy.allow`, and content comes from the
bundle. The body is re-sectioned at read time with the same slugify as the builder — the
builder-invariant test (`test/skills.test.ts`, via the exported `sectionSlugsOf`) asserts
the two sectionings agree for every bundled skill. Policy enforcement is fail-closed on
both read shapes:

- **Whole reads** return the full body (content is never withheld for *size* — the ~6k cap
  applies to what a script returns, never to data flowing into the sandbox), **except**
  deny-listed sections, whose bodies are excised and replaced by the heading plus a
  `[section omitted: <denyReason>]` marker — the deny-list is a control, not advice.
- **Section reads** accept slugs, exact heading text, or `file:` keys; an unknown section
  fails the whole read and lists what exists (never a silent partial answer); a denied
  section refuses with `kind: "denied"`; and a `##` section present in the body but
  **absent from the catalog** (sectioning drift) is refused — default-deny, not
  default-allow.
- `availableSections` (returned on every ok read, and on search hits) advertises only
  allowed, cataloged keys.
- Reads large enough that returning them whole would hit the model boundary carry an
  advisory `notice` (from ~5,000 estimated tokens) telling the model to request sections —
  advice only, the content is still fully present for in-sandbox grep/aggregate.

Skills also appear in the super spec as a synthetic core service (read via the same
`codemode.skill.read`; section keys under `x-skill-index`), so spec-grepping code discovers
them too.

## 7. Build & refresh chain — keeping the catalog honest

Generated artifacts are rebuilt by scripts, never hand-edited (CLAUDE.md rule). The chain:

```
scripts/refresh-inventory.mjs   (live; the ONLY network step)
   → inventory/lumenloop.json  inventory/stellar-light.json  inventory/stellar-docs.json
     (+ specs/stellar-docs.json — authored spec-as-data, not fetched)
scripts/build-catalog.mjs       → catalog/manifest.json        (offline, deterministic)
scripts/build-super-spec.mjs    → specs/super-spec.json        (npm run spec:build)
scripts/bundle-skills.mjs       → src/skills/bundle.json       (npm run skills:bundle)
```

Determinism is a hard property: sorted keys, sorted entries, `generatedAt` derived from the
newest *input* snapshot (never wall clock) — consecutive runs are byte-identical, and
`test/catalog.test.ts` additionally asserts the *checked-in* manifest matches a fresh
rebuild (staleness check). The refresh script is idempotent and asserts no key material
(including the Algolia app id) appears in any output; the deny-list is data applied in
`build-catalog.mjs` (`lumenloopPolicy` / `scoutPolicy` / `mirrorSkillPolicy` +
`lumenloopInventorySkillPolicy` — the 2026-07-03 skills retirement and twin de-dup, Solo
todo 825), and the super spec copies `x-policy` from the manifest rather than re-deriving
it, marking the ~16 un-cataloged Lumenloop account/billing endpoints always-denied for
honesty (its skill index is likewise policy-filtered). Two loud-failure guards keep
refreshes from silently changing exposure: `assertRetirementNamesResolve` breaks the build
if a mirror sync renames/removes a retired skill (would otherwise un-retire it), and the
orphaned-note checks break both builders if an upstream tool rename strands a
`description-notes.mjs` entry. See `ecosystem-skills/README.md` "After a sync" for the
operator chain.

CI (`.github/workflows/ci.yml`, Node 24 — build-catalog relies on native TS
type-stripping): types → tsc → vitest → eval self-test → routing gate
(`eval/run-routing.mjs --gate` against `eval/gates.json`) → the **artifact-sync gate**,
which rebuilds catalog, super spec, skills bundle, mirror check, both eval compiles, and
the plan op-classes, then fails on any diff. The daily drift job
(`.github/workflows/refresh.yml`, 06:17 UTC) re-fetches the live surfaces, rebuilds, and on
any diff opens/updates an issue and fails the run — op-id sets are the drift signal, not
`info.version` (Scout has shipped ops without bumping it).

## 8. Evals

Everything measurable about the two tools is instrumented in `eval/` — routing accuracy
(offline, gated in CI), the end-to-end golden Q→A battery, the agentic and plan lanes. The
map of instruments, the gate rules, and the re-baselining discipline live in
[`eval/EVALS.md`](./eval/EVALS.md); the mechanically-enforced gate baselines live in
[`eval/gates.json`](./eval/gates.json) (the source of truth for current numbers — they are
re-baselined by explicit decision, so this doc deliberately doesn't repeat them).
