# Architecture — how `search` and `execute` actually work

The end-to-end mechanics of the two tools, verified against the code as of 2026-07-03
(`codemode.skill.run` surface added and code-verified 2026-07-06). Read
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
   mistakenly deployed to production is inert, because the public hosts (`raven.stellar.buzz`,
   its `agents.stellar.buzz` alias) are not local hosts. The var itself is only ever set in
   `.dev.vars`.
3. **OAuth** — everything else goes through `@cloudflare/workers-oauth-provider`
   (options built by `oauthProviderOptions` in `src/auth/gate.ts`): the Worker is its own
   OAuth 2.1 authorization server (opaque tokens in `OAUTH_KV`, S256-PKCE only, CIMD
   enabled), with WorkOS AuthKit as the upstream IdP behind `/authorize` → `/callback`
   (`src/auth/workos.ts`). `src/server.ts` also aliases the path-suffixed RFC 8414 and OIDC
   discovery paths onto the lib's exact-path metadata endpoint.

**Non-`/mcp` requests are the public site.** Everything the OAuth provider doesn't claim falls
through to its `defaultHandler` (`src/auth/workos.ts`), which — besides `/authorize` /
`/callback` / the consent page — serves the public site from `src/site.ts`: the landing page,
`robots.txt`, `sitemap.xml`, JSON-LD, and `/og.png`. The OG image and the site/OG fonts are
**generated code** (`src/og.ts`, `src/fonts.ts`, rebuilt via `npm run site:og` /
`npm run site:fonts`), embedded in the Worker bundle — nothing is served from `public/`, which
holds GitHub-only assets (`public/README.md`).

Each authorized request gets a **fresh, stateless `McpServer`** served over streamable HTTP
by `createMcpHandler` (from `agents/mcp`) — no Durable Objects, no session state. Tool
registration and all model-facing prose live in `src/mcp/tools.ts`; the initialize-time
`SERVER_INSTRUCTIONS` (workflow + envelope contract) ride along because clients surface
them in the system prompt, where they outlive per-tool descriptions.

The `search` tool handler is a pure function call: `searchCatalogPage(getCatalog(), { query,
kind?, service?, limit? })`. `getCatalog()` (`src/catalog/load.ts`) imports the generated
`catalog/manifest.json` as a bundled JSON module and validates it once per isolate via
`loadManifest` — a malformed manifest throws loudly at first use, never softens. The
response is `{ hits, total, truncated, nextSteps }` (as both `text` and
`structuredContent`): `total` counts every distinct catalog entry the consulted scorer
tiers matched (post-filter, pre-paging), `truncated` = `total > hits.length` (retry with a
higher `limit` or a narrower query — mirrors upstream codemode's search shape), and
`nextSteps` is a server-authored hint that restates the compose-in-one-script workflow and
the envelope rule on every call. The handler also validates the `service` filter against
the catalog's real service set (`catalogServices`): an unknown value ("stellardocs",
"stellar-docs") returns zero hits with a `nextSteps` naming the bad value and the valid
ones instead of a silently-empty page — the frozen `searchCatalog` contract keeps filters
silent, so validation lives at the tool boundary (and, for `codemode.search`, at the
sandbox boundary in `src/executor/providers.ts`, where an unknown `kind`/`service` is an
error envelope listing the valid values). A `search` telemetry event
(`src/observability.ts` → Workers Logs) records the query, hit/total/truncated counts,
top-3 ids, response size in chars (`responseChars` — the measurement that set
`COMPACT_OUTPUT_THRESHOLD`, §2; it stays on to verify the compaction holds), and latency.

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
2. *Kind weighting* — `skill-section` entries are scaled ×0.75 so 203 near-duplicate
   fragments don't blanket-outrank the operations on shared topical vocabulary.
3. *Service diversity* — the returned set is selected with a per-service quota
   (`max(2, ceil(0.4 × limit))`, score order preserved, top hit never displaced,
   overflow backfills empty slots).
4. *Keyword blend* — skill-section entries carry build-time `keywords` distilled from the
   section body (`src/catalog/extract-keywords.ts`); the entry is scored twice (as-is and
   with keywords appended to the description) and the keyword-attributable delta blends in
   at 0.4 damping. The routing eval is the guard on this trade; changing the blend requires
   re-running it (`eval/EVALS.md`).
5. *Ungated backfill* (`scoreEntryWeightedUngated`) — the vendor coverage gate
   (`search-scoring.ts`, `<60%` token coverage and no exact phrase → `null`) is structurally
   unreachable for long multi-clause questions: at 20+ query tokens no single entry covers
   60% of the vocabulary, so the whole catalog gates to zero (the stopword rescue doesn't
   help — the surplus tokens are content words). `scoreEntryWeightedUngated` runs the same
   pipeline (keyword blend → stopword rescue → kind weight) over a **gate-free replica of the
   vendor math** — kept beside the vendor file, byte-for-byte except the coverage gate is
   dropped (the coverage *bonus* stays), the same way lever 4 double-scores rather than editing
   the vendor. `searchCatalog` uses it only to **backfill a short page** (below): gated tier-1
   hits always rank first, so any page the gated tier fills is byte-identical to the pre-lever-5
   behavior; only long questions that previously returned zero hits change.

**Set shaping** — `src/catalog/search.ts`. `loadManifest` enforces structural invariants at
load: globally unique entry ids, and unique operation terminal names per service (those
segments become sandbox function names in `src/executor/providers.ts`, so a collision would
silently shadow one operation with another). `searchCatalog` needs no exposure filter —
everything in the manifest is exposed by construction (ADR-0003,
`research/decisions/0003-build-time-exposure-filtering.md`: exclusions, including the old
`lumenloop.skill.*` twin namespace and the retired onboarding skills, are never emitted by
`scripts/build-catalog.mjs`). The page-shaping pipeline lives in `searchCatalogPage`
(returns `{ hits, total, truncated }`; `searchCatalog` is its thin `.hits` wrapper — the
frozen eval/vitest contract). It sorts score-desc then id-asc, and shapes the page in one
way:

- *Tiered gate-rescue backfill* — tier 1 is the pipeline above (levers 1–4). Only when it leaves
  the page short (fewer than `limit` gate-passing candidates exist — measured on long
  extended-lane questions that gate to zero) does tier 2 re-run the same pipeline under the
  ungated scorer (lever 5) and append its novel hits **strictly below** every tier-1 hit. Tier-2
  hits never displace or outrank a tier-1 hit, so a full page is byte-identical to the
  pre-tiering behavior; a page mixing tiers is score-sorted within each tier but **not across
  the seam** — the two scorers use different math, so a tier-2 raw score can exceed the tier-1
  scores ranked above it. Every hit therefore carries `tier: "gated" | "backfill"`, and `score`
  is documented as comparable only among same-tier hits within one response. Behavior changes
  only for long multi-clause queries that previously returned a short (or empty) page.
- `total` counts the distinct candidates the consulted tiers accepted (post kind/service
  filter, pre diversity/paging): tier-1 candidates alone when tier 1 filled the page, plus the
  novel ungated candidates when the backfill ran; `truncated` = `total > hits.length`.

**Hit anatomy**: `{ id, service, kind, score, tier, description }`, plus a rendered **TypeScript
signature** for operations *and the two runnable skills* (`renderSignature` — input/output
type declarations from the entry's JSON Schemas via the vendored type generator, and a
callable line that spells out the *full result envelope union*, because a bare
`Promise<Output>` teaches exactly the wrong-level access the envelope exists to prevent;
for a runnable skill the callable line is the exact `codemode.skill.run("<id>", …)` form —
§5), plus **`availableSections`** for skill hits (`sectionKeysOf` — the same key set
`readSkill` advertises; runnable-skill hits carry both). Non-runnable skills and sections
render no signature — their affordance is `skill.read`, not a call. Search hits render
signatures in **compact mode**: the input type and callable line are always full, but an
output type block over `COMPACT_OUTPUT_THRESHOLD` (2,000 chars — measured to trim only the
three Scout monsters, `searchProjects`/`searchRepos`/`explainRepo`, whose output types ran
to ~12.7KB and made a limit-10 page ~26KB with the bloat usually attached to an off-target
hit) is replaced by a stub declaration keeping the type name and the output schema's
top-level field names (so payload field selection like `r.data.projects` still works from
the hit alone), pointing at `codemode.describe(id)` for the full shape. The compaction
wraps *around* the vendored renderer — the vendor file is untouched — and applies to
search hits only; `codemode.describe` always renders the full signature (§5).

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
   `stellarDocs.search_docs(args)`) — currently 18 + 20 + 12 fns — plus the `codemode`
   discovery global (§5). Wrong names fail loudly through codemode's per-namespace Proxy
   ("Tool not found"); there is no fuzzy resolution. Providers are rebuilt per run so the
   skill-read advice flag is run-scoped; the expensive derivations (catalog view, resolved
   spec) are WeakMap-cached module-level.
4. **Per-call host RPC** — every service fn runs: manifest entry (closure-captured, never
   model-supplied) → `guard` (`src/policy/guard.ts`: `validateArgs` against the entry's
   `inputSchema`, `src/policy/validate.ts` — the only runtime check; exposure is filtered at
   build time, ADR-0003) → adapter
   dispatch (`src/adapters/index.ts` → `lumenloop.ts` / `scout.ts` / `stellar-docs.ts`;
   secrets read from env host-side, model code never sees a URL, header, or key) →
   per-service normalization into the envelope (soft-empty ≠ error ≠ data; e.g. Scout 404s
   normalize to `soft-empty`, JSON and non-JSON alike) → `redactSecrets`
   (`src/policy/redact.ts` — every secret the Worker holds is scrubbed from serialized
   results). Build-excluded surfaces have no sandbox fn at all — an unknown name fails
   loudly via the per-namespace Proxy. Each dispatch emits an `op`
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
two-way: `"error"` (call failed / bad args) or `"soft-empty"` (the service answered with
nothing — *not* evidence of absence) (`src/adapters/types.ts`). There is no `"denied"`:
exposure is filtered at build time (ADR-0003), so nothing callable can be policy-refused.

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
  paths keyed `/{service}/{operation}`, operationId = the exact sandbox call, `x-execute` /
  `x-skill-index` vendor extensions; exactly the manifest's operations — every path callable
  (ADR-0003); design record and per-service
  mapping in [`research/services/stellar-docs-spec-design.md`](./research/services/stellar-docs-spec-design.md)
  for stellarDocs and [`research/super-spec-design.md`](./research/super-spec-design.md) for the
  whole document), with `$refs` resolved inline
  (`resolveSpecRefs` in `src/executor/spec-sandbox.ts` — the host-side twin of upstream's
  in-sandbox `__resolveRefs`, cached per spec object). Post-ADR-0001
  (`research/decisions/0001-search-tool-shape.md`) this is the super spec's role: the
  code-shaped `search` front door that injected ~183KB of serialized spec into each search
  sandbox lost the golden Q→A A/B and was retired; the document (~45k tokens) is now served
  as data over the provider RPC, greppable in-sandbox, and **never enters the agent's
  context** unless a script deliberately returns slices of it. The unregistered
  `createSpecSearchRunner` (`src/executor/run.ts`) keeps the source-injection variant
  buildable for future A/Bs.
- **`codemode.search(queryOrOpts)`** — the same host-side `searchCatalogPage`, mid-script:
  resolves to `{ ok: true, hits, total, truncated }` (tier-marked hits and pagination facts,
  §1/§2), with the same kind/service filter validation at the sandbox boundary — an unknown
  filter value returns `{ ok: false, error }` naming the valid ones (explicit `null` = no
  filter, like `limit`).
- **`codemode.catalog()`** — the full manifest as flat data for arbitrary code-grep, with
  host-only detail (transport, provenance) stripped. Everything in it is callable/readable —
  the manifest is pre-filtered at build time (ADR-0003), so there is no policy layer to show.
- **`codemode.describe(id)`** — the canonical detail-on-demand step (exact-match id only;
  mirrors upstream codemode's search → describe → call). A describe result carries all the
  DETAIL a search hit has and more (ranking facts — `score`, `tier` — stay on hits, since
  they describe a hit's place in one response, not the entry): operations carry the **full** rendered signature
  (complete output type, even where the search hit stubbed it — §2) plus the raw
  `inputSchema`/`outputSchema` as plain data (the same projection `codemode.catalog()`
  serves); skills carry `availableSections` (same `sectionKeysOf` derivation as search
  hits); skill sections carry the parent `skillId` and `section` key. Every kind includes
  a `usage` line naming the exact next call (the callable-line/envelope reminder for
  operations, the precise `codemode.skill.read(...)` invocation for skills and sections).
- **`codemode.skill.read(name, { sections? })`** — §6. Wired via a one-line prelude
  (`SKILL_PRELUDE`) because nested objects can't cross codemode's flat Proxy dispatch.
- **`codemode.skill.run(name, input)`** — runnable-skill dispatch (shipped 2026-07-06,
  todo 806; decision record [`research/skill-run-design.md`](./research/skill-run-design.md)).
  Exactly two skill entries carry `runnable: true` plus real input/output schemas on their
  existing `kind: "skill"` entries (one id, two affordances — read the playbook, run its
  data-gathering core): `skills.lumenloop.stellar-ecosystem-digest` (the sole v1
  runnable — the project-dossier runner shipped alongside it and was retired on
  measured evidence the same week: unreachable by its audience's entity-shaped
  queries, zero adoption across every battery run; Solo todo 849, the design doc
  §10 postscript is the decision record). The prelude wraps the flat `skill_run`
  dispatch fn (same mechanism as `skill.read`); all semantics live host-side in `runSkill`
  (`src/skills/run.ts`): exact-match id resolution (a miss or non-runnable id returns an
  error naming the full runnable set plus a nearest-id *suggestion*, never a resolution),
  input validated through the same `guard`/`validateArgs` path operations use, then the
  runner from the `RUNNERS` registry (`src/skills/runners/index.ts` — the
  allowlist-as-data) executes. `assertRunnersWired` throws at provider build
  (`buildSandbox`) on any registry↔manifest drift: id sets both ways, canonical-JSON schema
  equality per id, declared ops ⊆ emitted operation ids.
  - *Policy identity by construction*: the runner's ops facade is built by the **same
    `buildOpsFns`** (`src/executor/providers.ts`) that builds the sandbox service
    namespaces — `buildSandbox` builds the closures once and threads them to both — so
    every constituent call runs the identical guard → adapter → normalize → redact path
    and emits its own `op` event. A build-excluded op has no entry, hence no closure,
    hence nothing a runner can call (ADR-0003, structurally).
  - *Declared-ops sub-facade, host-owned audit trail*: `runSkill` hands the runner a
    sub-facade containing **only its declared `ops`**, each wrapped to append
    `{ op, ok, errorKind?, ms }` to a host-owned ledger. `data.calls`, the error path's
    `error.details`, and the `skill_run` event counts all come from that ledger, never
    from runner output (a runner-set `calls` key is overwritten unconditionally) — a
    buggy runner can project a section wrongly, but it cannot make a failed call
    disappear from the report or corroborate its own lie.
  - *Envelope + partial failure*: run is a **call** and returns the standard service-call
    envelope (`{ ok: true, data } | { ok: false, error }`), routed through
    `__guardEnvelope` so `.data`-misuse traps behave identically to operation calls — no
    `skill.read`-style top-level shape, no third shape to teach. Constituent failures
    never fail the run by themselves: an errored call's output section is `null`, a
    soft-emptied call's section is present with `softEmpty: true` (the three-way
    data ≠ soft-empty ≠ error distinction, in aggregate form); only the runner's declared
    **anchor** failing makes the run `ok: false`, with the ledger attached as
    `error.details`.
  - *Deadline*: `Promise.race` against a **30 s host deadline** (`RUNNER_DEADLINE_MS`,
    `src/skills/run.ts`) returns a timeout error envelope on expiry — NOT cancellation:
    in-flight facade calls continue detached (free read-only ops, each still logging its
    own `op` event); the executor's 60 s wall clock stays the hard stop. After the `calls`
    attach, the output is validated against the runner's `outputSchema` as a warn-only
    belt — a mismatch logs `outputSchemaOk: false` without failing the run.
  - *Trust framing, stated honestly*: runners are first-party, reviewed, repo-committed
    TypeScript at the **adapter trust tier** (`src/adapters/*`), executed **host-side —
    NOT sandbox-confined**. `globalOutbound: null` confines the isolate only; the rule
    "runners use only the facade" is enforced by first-party review backed by two drift
    *belts* (an import/token lint over runner sources and a behavioral CI test that runs
    every runner with `globalThis.fetch` stubbed to throw) — belts, not a sandbox, and
    this doc doesn't claim one. Manifest-only ops and no-env **are** structural: the
    facade is built from emitted entries only, and runners receive exactly
    `(input, ops)` — no env parameter exists to leak.

## 6. Skill splitting — mirror → sections → reads

**The mirror.** `ecosystem-skills/` is a pinned mirror of 19 public skills from 4 upstreams
(commit-SHA-pinned in `ecosystem-skills/MANIFEST.json`); `scripts/check-mirrors.mjs`
verifies integrity offline, `scripts/check-skills-drift.mjs` checks the pins against
upstream in the daily refresh (detection only — the mirror is never auto-synced). The former
credentialed Lumenloop API skill source is intentionally absent; partner skills remain visible
only as name-only inventory stubs.

**The bundle.** Workers have no filesystem, so `scripts/bundle-skills.mjs` packs every
exposed skill's `.md` files (markdown only — that's the exposed surface; 30 files, with
retired-skill cross-references scrubbed from the packed bodies via `scrubRetiredSkillRefs`
in `scripts/exposure.mjs`) into
`src/skills/bundle.json`, keyed by repo-root-relative path — chosen to equal catalog
entries' `transport.path` exactly, so the store resolves transport → content with no path
arithmetic. `generatedAt` comes from the mirror manifest's `synced_at`, never wall clock.

**Build-time sectioning.** `scripts/build-catalog.mjs` emits, per skill: one `kind:
"skill"` entry (id `skills.<source>.<name>`, description from frontmatter or first
paragraph); one `kind: "skill-section"` entry per `##` heading (id `<skillId>#<slug>`,
duplicate slugs deduped `-2`, `-3`…; description = heading + first paragraph, truncated to
200 chars; low-weight `keywords` extracted from the *section body* so mid-section content —
error codes, flags, function names — is lexically searchable); and one section-kind entry
per extra `.md` file (id `<skillId>#file:<relpath>`). Retired onboarding skills are never
emitted — no skill entry, no sections, no bundle bytes (ADR-0003; the retirement record is
`RETIRED_ONBOARDING_SKILLS` in `scripts/exposure.mjs` plus the ADR). Lumenloop-API-served
skill metadata (14 skills as zips) is likewise never emitted: public skills duplicate
canonical `skills.*` mirror entries, and partner skills are deliberately non-mirrored.
Currently 18 exposed skills + 203 sections; there is no `lumenloop.skill.*` namespace and no read alias —
unknown ids fail exact-match with a nearest-id suggestion.

**The read path** (`readSkill`, `src/skills/store.ts`) resolves through the **catalog**,
not the filesystem: `name` must be an exact catalog id (a `#slug` suffix reads that one
section), the entry must be `kind: "skill"`, and content comes from the
bundle. The body is re-sectioned at read time with the same slugify as the builder — the
builder-invariant test (`test/skills.test.ts`, via the exported `sectionSlugsOf`) asserts
the two sectionings agree for every bundled skill. Both read shapes are fail-closed on
drift:

- **Whole reads** return the full body — content is never withheld for *size* (the ~6k cap
  applies to what a script returns, never to data flowing into the sandbox).
- **Section reads** accept slugs, exact heading text, or `file:` keys; an unknown section
  fails the whole read and lists what exists (never a silent partial answer); and a `##`
  section present in the body but **absent from the catalog** (sectioning drift) is
  refused — default-deny, not default-allow.
- `availableSections` (returned on every ok read, and on search hits) advertises only
  cataloged keys.
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
(including the Algolia app id) appears in any output. Exposure filtering is build-time data
in `scripts/exposure.mjs` (ADR-0003: excluded Lumenloop ops + the account-op regex + the
metered flag, excluded Scout ops, retired onboarding skills, and the never-emitted
Lumenloop-served skill metadata), consumed by `scripts/build-catalog.mjs` and the other
emitters. The super spec emits exactly the manifest's
operations (a completeness assert catches a cataloged op the spec builders miss). Loud-
failure guards keep refreshes from silently changing exposure: `assertRetirementNamesResolve`
(a mirror sync renaming/removing a retired skill would otherwise un-retire it),
`assertLumenloopExclusionsResolve` / `assertScoutExclusionsResolve` (a stale exclusion means
an excluded surface may have moved upstream), `assertLumenloopSkillsMirrored` (a NEW
upstream-served skill must be mirrored or excluded, never silently invisible), and the
orphaned-note checks in both builders for stranded `description-notes.mjs` entries. See
`ecosystem-skills/README.md` "After a sync" for the operator chain.

CI (`.github/workflows/ci.yml`, Node 24 — build-catalog relies on native TS
type-stripping): types → tsc → vitest → workerd smoke lane (`npm run test:smoke`,
`test/smoke/` via vitest-pool-workers: the assembled router through `SELF` and the real
Dynamic Worker executor boundary through the LOADER binding; offline enforced by a
miniflare `outboundService` wall, auth values are test-only fakes) → eval self-test →
routing gate
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
