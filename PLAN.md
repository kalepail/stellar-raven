# Plan — stellar-raven-codemode

A single remote MCP server on Cloudflare Workers exposing **two tools — `search` and `execute`** —
over a unified API layer that covers three third-party services plus a selectively-exposed skills
directory. The LLM calling this MCP discovers capabilities via `search`, then authors JavaScript
that `execute` runs inside a **Dynamic Worker isolate** with no network access; all real traffic
goes through host-side, secret-holding, policy-enforcing adapters.

Grounding research (live-verified across 2026-07-01…07-03; service specs refreshed daily by CI):

- [`research/services/lumenloop.md`](./research/services/lumenloop.md) (current spec: [`inventory/lumenloop.json`](./inventory/lumenloop.json))
- [`research/services/stellar-light.md`](./research/services/stellar-light.md) (current spec: [`inventory/stellar-light.json`](./inventory/stellar-light.json))
- [`research/services/stellar-docs-algolia.md`](./research/services/stellar-docs-algolia.md) (primary; [`stellar-docs-mcp.md`](./research/services/stellar-docs-mcp.md) is the fallback path)
- [`research/codemode.md`](./research/codemode.md) — Cloudflare codemode / Dynamic Workers implementation reference
- [`research/prior-art.md`](./research/prior-art.md) — map of prior art in `stellar-raven-next` / `stellar-raven` (references for lessons, not templates)

## 0. Headline findings that shape the design

1. **Cloudflare already ships our exact tool shape.** `@cloudflare/codemode`'s
   `openApiMcpServer()` registers MCP tools named `search` and `execute`; its
   `DynamicWorkerExecutor` natively supports multiple namespaced service globals in one sandbox
   (`lumenloop.*`, `scout.*`, …). Dynamic Workers are **open beta, Workers Paid, no signup**.
   We generalize the shipped single-spec server into a multi-service catalog — the scoring
   (`searchConnectors`) and TS-rendering (`describeTarget`) functions are already written and
   importable.
2. **All three services are highly machine-readable**, each with a drift-detection affordance:
   - **Lumenloop** — 21 tools (18 free + 3 partner research; only `request_research` costs money),
     uniform `POST /v1/tools/{name}`, per-tool JSON Schemas, OpenAPI 3.1, keyless
     `/v1/changelog?since=`. Quirk: `/v1/tools` and `/v1/skills` hide partner items even with a
     partner key — inventory must union `/v1/me` + per-item detail fetches. Also serves 14 skills
     as zips via `/v1/skills`.
   - **Stellar Light / Scout** — 23 paths / 24 ops (2026-07-02 partner-pipeline release), fully keyless, self-describing via
     `/api/openapi.json`, `/api/status` (live counts + endpoint enumeration), `/api/changelog`.
     scout-mcp is a pure 1:1 wrapper → we integrate over HTTP directly.
   - **Stellar Docs** — integrate via **direct Algolia REST** (decided 2026-07-01), not the MCP.
     App `VNSJF5AWIZ`, index `crawler_Stellar Docs - Docusaurus` (crawler active; one replica
     `docs_replica_agent` used by the MCP). A **dedicated search key is in hand**
     (`.env`: `ALGOLIA_APPLICATION_ID_DOCS` / `ALGOLIA_API_KEY_DOCS` — verified live: ACL
     search/listIndexes/settings-read, no index restriction, no per-IP rate cap, never expires).
     Spec: `research/services/stellar-docs-algolia.md`. The Docs MCP endpoint stays documented in
     `research/services/stellar-docs-mcp.md` as fallback only; it's the same index behind
     JSON-RPC/SSE with analytics params bolted on.
3. **Prior art in `stellar-raven-next` / `stellar-raven` — learn, don't clone.** Those repos are
   references, not templates: they carry complexity from a different architecture (multi-agent
   research pipeline) that this two-tool service doesn't need. We design our own types, formats,
   and adapters from this project's actual needs and the live research. What we do take:
   **content/data** (the 25-skill `ecosystem-skills/` mirror, the labeled golden corpus for
   evals) and **lessons** (see item 4). `research/prior-art.md` is the map of what exists there —
   consult it to avoid known pitfalls, not to source code.
4. **The ADR pitfalls carry over:** never let the model own endpoint args/auth (validate against
   the manifest); soft-empty ≠ error ≠ evidence (per-service normalizers); exact-match slug/id
   guards; machine-checkable exclusion lists; paid calls need dedup + budget caps.

## 1. Architecture

```
MCP client (LLM)
  │  streamable HTTP /mcp   (createMcpHandler, stateless; bearer auth in front)
  ▼
Host Worker  (Workers Paid · wrangler: worker_loaders LOADER · nodejs_compat)
  ├─ tool "search"  { query, kind?, service?, limit?, recoverFrom?, reason? }
  │     [no isolate — host-side; recovery is exact-ID advisory metadata, separate from ranking]
  │     ranked search over the unified catalog (ConnectorDescription[]):
  │     every service operation + every skill + every skill section
  │     top-k hits returned WITH rendered TS signatures (describeTarget)
  ├─ tool "execute" { code }                                   [one Dynamic Worker per call]
  │     DynamicWorkerExecutor · globalOutbound: null · 60s wall-clock timeout
  │     sandbox globals:
  │       lumenloop.*   scout.*   stellarDocs.*        ← host RPC stubs (secrets stay host-side)
  │       codemode.spec()                              ← the unified super spec as data
  │                                                      (specs/super-spec.json, $refs inlined) —
  │                                                      upstream openApiMcpServer parity
  │       codemode.search / codemode.describe          ← mid-script ranked discovery
  │       codemode.catalog()                           ← full manifest as flat data (arbitrary code-grep)
  │       codemode.skill.read(name, {sections})        ← partial skill retrieval
  │       codemode.skill.run(name, input)              ← runnable-skill dispatch (host-side runners
  │                                                      over the same op closures — §3)
  └─ host-side layers:
        adapters/   per-service clients, designed fresh per the live service research
        policy/     arg validation vs manifest · redaction (exposure filtered at build, ADR-0003)
        catalog/    bundled manifest → validated in-memory catalog, cached per isolate
        skills/     bundled skill store, section-indexed at build time
```

**Search shape — settled 2026-07-02 (`research/decisions/0001-search-tool-shape.md`, accepted).**
Exactly two tools ship: top-level `search` is a **host-side ranked query** `{ query, kind?,
service?, limit?, recoverFrom?, reason? }` (the round-2 implementation, over upstream's own
vendored `searchConnectors` scorer); recovery is exact-ID advisory metadata returned separately
from ranked hits and never changes ranking. `execute` is `{ code }`. The code-shaped discovery variant that upstream's
`openApiMcpServer` puts at the front door was **retired into `execute`'s sandbox**: a golden Q→A
A/B (60 paired cases, `eval/qa/`) found the host-side ranked search directionally more accurate
and — decisively — more reliable, while the in-sandbox code search burned the caller's turn
budget grepping the ~45k-token super spec (all 9 of its failures were `error_max_turns`). So the
unified **super spec** (lumenloop + scout + stellarDocs + a skills core service,
`specs/super-spec.json`) stays a first-class artifact but is exposed *inside* `execute` as
`codemode.spec()`, alongside `codemode.search` and `codemode.catalog()` — discovery-in-code
survives at zero marginal turn cost; only the mandatory isolate-per-search front door goes.
Routing remains *shortlisting* — one script hedges across several candidate tools with follow-up
detail calls; committing to a single route is never required.

**Stateless first.** Fresh `McpServer` per request via `createMcpHandler`. Adopt
`McpAgent` + `createCodemodeRuntime` (DO facet) only if/when we want durable approvals,
abort-and-replay, or an audit log.

## 2. The unified catalog (the thing `search` searches)

One checked-in, machine-generated manifest (`catalog/manifest.json`) with a typed entry per
callable surface — fields chosen for what search/execute actually consume, nothing vestigial:

```jsonc
{
  "id": "lumenloop.search_directory",
  "service": "lumenloop",
  "kind": "operation",            // operation | skill | skill-section
  "description": "...",           // + when_to_use, returns
  "inputSchema": { ... },         // JSON Schema (rendered to TS on demand)
  "transport": { "type": "http", "method": "POST", "path": "/v1/tools/search_directory" },
  "provenance": { "source": "https://api.lumenloop.com/v1/tools", "fetchedAt": "..." }
  // further fields only when a concrete consumer exists — no speculative schema
}
```

Actual catalog counts are authoritative in `catalog/manifest.json`, not repeated here because
daily upstream and skill drift can change them. The catalog contains exposed service operations,
`skills.*` mirror entries, and skill `##`/file sections. **The manifest IS the exposed surface** —
excluded surfaces (the paid research lane incl. its read half, account mutations, scout writes
and their schema/assistant feeders, retired onboarding skills, the `lumenloop.skill.*` twin
namespace) are filtered at build time and never emitted; there is no `policy`/`cost`/`auth` field
and no runtime deny layer, and a build guard rejects any emitted text that references a
non-exposed surface. See
[`research/decisions/0003-build-time-exposure-filtering.md`](./research/decisions/0003-build-time-exposure-filtering.md)
(ADR-0003, 2026-07-04: 299→274 entries, 25→0 denied, superseding ADR-0002's deny-list model;
2026-07-04 follow-up: 274→271, dead-end read-halves and description leaks removed, exclusion
data consolidated in `scripts/exposure.mjs`; later skill mirror drift moved the section count to
204 without changing operation exposure).
Entries additionally carry an `outputSchema` wherever the source declares one.

Build pipeline: `scripts/build-catalog.mjs` has five snapshot/metadata roots:
`inventory/lumenloop.json`, `inventory/stellar-light.json`, the authored
`specs/stellar-docs.json`, `inventory/stellar-docs-titles.json` (page-title vocabulary), and
`ecosystem-skills/MANIFEST.json`. The skills manifest enumerates additional semantic inputs that
the builder reads directly from the mirror: each exposed `SKILL.md` and every additional listed
Markdown file supply skill descriptions, sections, and routing keywords. The imported runner
registry in `src/skills/runners/index.ts` supplies runnable flags and input/output schemas. The
builder emits only `catalog/manifest.json`; the Worker bundles that manifest and scores its
entries at request time, with no other search artifact. Catalog assembly is deterministic and
offline-testable; only inventory refresh and skill-mirror sync touch the network.

## 3. Skills directory — selective + partial exposure

Source: `ecosystem-skills/`, a pinned mirror of 19 public skills across 4 upstreams:
lumenloop ×8, openzeppelin ×3, stellar-dev ×7, stellar-light ×1. The mirror is synced by
`ecosystem-skills/update.sh` and verified by `scripts/check-mirrors.mjs`. Lumenloop's partner
skill set is not mirrored; it is represented only as name-only inventory stubs so credentialed
content cannot re-enter the public repo.

- **Build-time sectioning:** each `SKILL.md` is split on `##` headings (multi-file skills keep
  their file structure); every skill and every section becomes a catalog entry with its own
  description. Since the 2026-07-13 skills-form A/B, section entries carry `searchable: false`:
  `search` returns whole-skill hits (each carrying `availableSections` keys) and sections are
  read exact-id via `skill.read` — the measured arm-B outcome (`eval/README.md`
  "Skills-form A/B").
- **Selective exposure is build-time data (ADR-0003):** the exclusion lists in
  `scripts/exposure.mjs` control which skills exist in the catalog at all; excluded skills
  are never emitted, so they cannot appear in search or resolve in the sandbox.
- **Retrieval:** `codemode.skill.read(name, { sections?: string[] })` returns only the requested
  portions (exact-match-guarded names — no fuzzy resolution, per ADR-0019's wrong-entity lesson).
- **Executable skills (BUILT 2026-07-06, todo 806):** one composite playbook is additionally
  *runnable* — `skills.lumenloop.stellar-ecosystem-digest` carries `runnable: true` + real
  input/output schemas (the dossier runner was retired on measured evidence, todo 849)
  on their existing `kind: "skill"` entries (one skill, one id, two affordances: read + run) and
  dispatch via `codemode.skill.run(id, input)` to repo-authored TypeScript runners executed
  **host-side** over the same per-op closures the sandbox namespaces use. The original sketch
  ("parameterized snippets over the service globals") did not survive contact with the corpus —
  no mirrored skill body is a program, so v1 runners are build-time repo modules, not
  model-promoted snippets. Design + ship decision record: `research/skill-run-design.md`;
  mechanics in `ARCHITECTURE.md` §5.

## 4. Policy & security

- **Secrets host-side only.** `LUMENLOOP_API_KEY` via Worker secret; the sandbox sees only
  namespaced function stubs. `globalOutbound: null` — `fetch()` in generated code throws.
- **Exposure is filtered at build time (ADR-0003,
  `research/decisions/0003-build-time-exposure-filtering.md`):** the manifest contains only what
  the sandbox may call or read — excluded surfaces (`lumenloop.request_research` (metered paid),
  `scout.submitFeedback`/`submitPartnerListing` (writes), `scout.partnerAssistant`
  (side-effecting — logs surfaced partners as leads), lumenloop account/billing mutations, the 7
  retired onboarding skills, the 14 `lumenloop.skill.*` twins) are never emitted, by `search`,
  `codemode.catalog()`, `codemode.spec()`, or anything else. Consumers never see what they
  cannot use. Exclusions are exact-match data in `scripts/exposure.mjs`, consumed by
  `scripts/build-catalog.mjs` and the other emitters with fail-loud drift guards; reasons live
  there and in the ADR, not in runtime entries.
- **Paid-call gate:** `lumenloop.request_research` is not emitted at all today; enabling it is a
  deliberate feature — remove the build exclusion AND ship the budget-gate + dedup runtime in
  the same change (prefer `answer` mode (~$0.02), dedup via `list_my_research` first, per-day
  budget cap; partner quota is $50/mo). Mirrors old ADR-0018.
- **Arg validation against the manifest** before any host call — model code never owns URLs,
  headers, or auth.
- **Result hygiene:** per-service normalizers (soft-empty vs error vs data), redaction pass,
  ~6k-token truncation with actionable footer (`truncateResult` from codemode), errors returned
  as data — never thrown across the tool boundary.
- **Server auth (shipped 2026-07-02, research/auth-workos.md):** WorkOS-backed OAuth for
  everything at `/mcp` — the Worker is its own OAuth 2.1 authorization server via
  `@cloudflare/workers-oauth-provider` (opaque tokens in `OAUTH_KV`; WorkOS AuthKit is only the
  upstream IdP behind `/authorize` → `/callback`, its tokens dropped after the code exchange).
  Two bypasses only: the `MCP_ADMIN_TOKEN` secret (SHA-256 + timing-safe compare) and
  `DEV_ALLOW_UNAUTHENTICATED=true` from `.dev.vars` (never deployed). Connection guide:
  README.md “Connect”.

## 5. Inventory refresh — keeping the catalog honest

`scripts/refresh-inventory.mjs` (runnable locally, in CI, or as a cron Worker):

| Service | Probe | Drift signal |
|---|---|---|
| Lumenloop | `/v1/tools` ∪ `/v1/me` tool list ∪ per-tool detail (partner items hidden from the list!); `/v1/skills` same union trick | keyless `/v1/changelog?since=` |
| Stellar Light | `/api/openapi.json` (diff), `/api/status` endpoint enumeration | `/api/changelog` |
| Stellar Docs (Algolia) | `GET /1/indexes/{index}/settings` diff + one smoke query | settings/nbHits diff; MCP `tools/list` checked only as fallback health |
| Skills | `ecosystem-skills/update.sh` against pinned SHAs | `check-mirrors.mjs` |

Output: regenerated inventory JSONs under `inventory/` + a diff report; `build-catalog`
then rebuilds the manifest; `test/adapters.test.ts` plus CI's generated-artifacts-sync gate
validate manifest ↔ adapter wiring offline. The exact curl incantations live in each service
research doc.

## 6. Repo layout (target)

```
src/server.ts            # Worker entry: createMcpHandler → search/execute
src/auth/                # WorkOS OAuth 2.1 provider + admin-token / local-dev bypasses
src/site.ts              # public site: landing, OAuth consent, robots.txt, sitemap.xml, JSON-LD, /og.png
src/fonts.ts src/og.ts   # generated (npm run site:fonts / site:og) — embedded fonts + OG image
src/mcp/                 # tool registration, descriptions (copy codemode's rules-block prompting)
src/catalog/             # manifest types, builder, search (vendored searchConnectors/describeTarget)
src/adapters/            # lumenloop.ts · scout.ts · stellar-docs.ts (own design, per live research)
src/policy/              # arg validation, redaction, truncation (no runtime deny layer — ADR-0003)
src/skills/              # skill store, section index, read resolution
src/executor/            # DynamicWorkerExecutor wiring, providers, super-spec sandbox, truncation
src/observability.ts     # structured JSON events → Workers Logs; custom execute span
scripts/                 # refresh-inventory.mjs · build-catalog.mjs · build-super-spec.mjs · smoke checks
specs/                   # super-spec.json (+ authored stellar-docs.json) — feeds codemode.spec()
inventory/               # regenerated service inventory JSONs (drift source for build-catalog)
ecosystem-skills/        # pinned mirror (lifted)
catalog/manifest.json    # generated — the unified index
assets/repo/             # GitHub-only assets (README hero banner) — NOT served by the Worker
research/                # this research + ADRs (research/decisions/) as decisions accrue
test/                    # vitest offline suites (adapters, server, super-spec, auth, …)
eval/                    # routing eval + qa/ (execute Q→A battery) + agentic/ + plan/
```

Pins: `@cloudflare/codemode` exact `0.4.2` (vendor `search.ts`/`describe.ts`/`normalize.ts`/
`json-schema-types.ts` if churn bites), `@modelcontextprotocol/sdk ^1.29.0`, `zod ^4.4.3`,
wrangler `^4.107.0`, compat ≥ 2026-06-11 + `nodejs_compat`, `worker_loaders` binding `LOADER`.

## 7. Phased build

> Status (end of Round 4): **all 8 phases are shipped and live** on the default route, including
> the evidence-poor recovery and build-stage prior-art additions deployed on 2026-07-13.
> The current production route is **https://raven.stellar.buzz** (with **https://agents.stellar.buzz** served as an alias — both
> in `wrangler.jsonc` routes) (Solo todos 788–825; evidence: `eval/README.md`,
> `eval/agentic/README.md`, `eval/plan/README.md`, `research/decisions/0001-search-tool-shape.md`,
> `research/decisions/0002-skills-retirement-twin-dedup.md`,
> `research/decisions/0003-build-time-exposure-filtering.md`, `research/auth-workos.md`,
> README.md “Connect”). CI + daily drift refresh run in
> github.com/kalepail/stellar-raven (renamed from stellar-raven-codemode 2026-07-02). WorkOS
> OAuth verified end-to-end incl. human
> AuthKit sign-in (Tyler, 2026-07-02); CIMD enabled.
> - **Public site + SEO surface shipped 2026-07-02/03** (`src/site.ts`): landing page, OAuth
>   consent page, `robots.txt`, `sitemap.xml`, JSON-LD, and `/og.png` — routed via the OAuth
>   provider's `defaultHandler` (`src/auth/workos.ts`). The OG image and site fonts are generated
>   code (`src/og.ts`, `src/fonts.ts` via `npm run site:og` / `npm run site:fonts`), not served
>   from static asset files.
> - **Discovery orientation shipped 2026-07-09** (`src/mcp/micro-map.ts`): the two-tool surface
>   remains unchanged, while generated source-family/workflow guidance teaches multi-query
>   planning. `eval/discovery/` measures the narrow one-search route-discovery layer. Searchable
>   service/workflow catalog cards were built and cleanly reverted after real-query interception
>   measured below the run-to-run noise floor. The successor Vectorize frontier spike was then
>   measured no-ship on 2026-07-10 (todo 902): the pinned isolated harness and discovery
>   measurement extensions remain under `eval/`, while no production binding/index/scorer was
>   left behind (`eval/vectorize/README.md`).
>
> Follow-ups and former deferrals (tracked as Solo backlog todos; project binding in
> [`AGENTS.md` “Coordination”](./AGENTS.md#coordination)):
> - `codemode.skill.run` (executable skills) — **BUILT 2026-07-06, ship-approved** (todo 806;
>   the 2026-07-03 do-not-build decision's reopen triggers fired). Two v1 runners (project
>   dossier, ecosystem digest) passed the design's §10 A/B gate — retrieval-neutral by
>   ranked-id proof, verdict improvement on the targeted battery, digest-runner adoption
>   demonstrated. The dossier follow-up (todo 849) then measured three surfacing levers
>   (all net-negative or no-effect) and retired that runner; the digest remains the sole
>   runnable. Decision record:
>   `research/skill-run-design.md` (§10 outcome, §14.1 as-built deviations); eval record:
>   `eval/README.md` todo-806 section; surface summary in §3 above.
> - Plan-eval progression weighting — revisit ONLY if a run shows detail-starved wrong answers
>   (`eval/plan/README.md` “Results — 2026-07-02”, conclusion).

1. **Scaffold** — wrangler + pinned deps + CLAUDE.md + hygiene checks. *(shipped)*
2. **Catalog + `search`** — manifest types, builder over the service snapshots, authored Docs
   spec, Docs page-title snapshot, and skills manifest; host-side search with TS signatures plus
   manifest-validated, exact-ID evidence-poor recovery candidates kept separate from ranking and
   returned only after non-empty explicit `recoverFrom` ids (a reason alone never escalates).
   Fully offline-testable. *(shipped)*
3. **Adapters + `execute`** — per-service clients in `src/adapters/`, `DynamicWorkerExecutor`
   with namespaced providers, and `codemode.search/describe` sandbox globals. *(shipped)*
4. **Skills store** — sectioned retrieval (`skill.read`), build-time exposure policy, and
   `skill.run` for the runnable skill set (v1 shipped one after the dossier runner was
   retired on measured evidence — design doc §10 postscript). *(shipped)*
5. **Policy + observability** — build-time exposure filtering, paid lane excluded, redaction,
   truncation, structured logs, and execute spans. *(shipped)*
6. **Inventory refresh** — refresh script + drift CI + adapted surface smoke check. *(shipped)*
7. **Evals** — routing, discovery, QA, plan, agentic, and live-data lanes with committed gate
   baselines and own-repo formats. The mechanism/unit holdouts cover contract, dapp, SDK, protocol,
   and infrastructure authority roles; behavioral QA currently pairs contract and infrastructure
   design-stage cases with a known-step no-detour control. *(shipped, including the 2026-07-13
   controls; see `eval/EVALS.md`)*
8. **Deploy + auth** — WorkOS-backed OAuth at `/mcp` with admin-token + local-dev bypasses;
   deployed on the default route and alias. *(shipped)*

Phases 2–3 are independently parallelizable after 1; 4–6 after 3.

## 8. Open decisions (defaults chosen, flag to reverse)

| Decision | Default | Alternative |
|---|---|---|
| Docs search path | **Decided: direct Algolia REST** — dedicated key in hand (`.env` → Worker secrets `ALGOLIA_APPLICATION_ID_DOCS`/`ALGOLIA_API_KEY_DOCS`; the stellar.org site lane uses the `_SITE` pair); MCP as documented fallback | MCP-only (slower, protocol overhead) |
| `request_research` (paid) | off at launch | on with budget gate from day one |
| Server auth | **Decided: WorkOS OAuth** (`workers-oauth-provider` + AuthKit; admin/dev bypasses — §4, README.md) | plain bearer secret (retired placeholder) |
| Skills scope | **18 of 19 mirrored public skills exposed**; retired onboarding surfaces never emitted, and one composite skill is runnable via `codemode.skill.run` | re-expose an onboarding skill only after a transport-agnostic rewrite and a fresh ADR |
| Statefulness | stateless `createMcpHandler` | `McpAgent` + CodemodeRuntime DO (approvals/audit) |
