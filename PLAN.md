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
     App `VNSJF5AWIZ`, index `crawler_Stellar Docs - Docusaurus` (12,867 entries, crawler active;
     one replica `docs_replica_agent` used by the MCP). A **dedicated search key is in hand**
     (`.env`: `ALGOLIA_APPLICATION_ID` / `ALGOLIA_API_KEY` — verified live: ACL
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
   guards; machine-checkable deny-lists; paid calls need dedup + budget caps.

## 1. Architecture

```
MCP client (LLM)
  │  streamable HTTP /mcp   (createMcpHandler, stateless; bearer auth in front)
  ▼
Host Worker  (Workers Paid · wrangler: worker_loaders LOADER · nodejs_compat)
  ├─ tool "search"  { query, kind?, service?, limit? }        [no isolate — host-side]
  │     ranked search over the unified catalog (ConnectorDescription[]):
  │     every service operation + every skill + every skill section
  │     top-k hits returned WITH rendered TS signatures (describeTarget)
  ├─ tool "execute" { code }                                   [one Dynamic Worker per call]
  │     DynamicWorkerExecutor · globalOutbound: null · limits{cpuMs, subRequests} · 60s
  │     sandbox globals:
  │       lumenloop.*   scout.*   stellarDocs.*        ← host RPC stubs (secrets stay host-side)
  │       codemode.spec()                              ← the unified super spec as data
  │                                                      (specs/super-spec.json, $refs inlined) —
  │                                                      upstream openApiMcpServer parity
  │       codemode.search / codemode.describe          ← mid-script ranked discovery
  │       codemode.catalog()                           ← full manifest as flat data (arbitrary code-grep)
  │       codemode.skill.read(name, {sections})        ← partial skill retrieval
  └─ host-side layers:
        adapters/   per-service clients, designed fresh per the live service research
        policy/     deny-list · arg validation vs manifest · paid-call budget+dedup · redaction
        catalog/    manifest → ConnectorDescription[] builder, cached (KV)
        skills/     bundled skill store, section-indexed at build time
```

**Search shape — settled 2026-07-02 (`research/decisions/0001-search-tool-shape.md`, accepted).**
Exactly two tools ship: top-level `search` is a **host-side ranked query** `{ query, kind?,
service?, limit? }` (the round-2 implementation, over upstream's own vendored `searchConnectors`
scorer), and `execute` is `{ code }`. The code-shaped discovery variant that upstream's
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
  "auth": "partner-key",          // none | partner-key
  "cost": "free",                 // free | metered (request_research)
  "policy": { "allow": true, "denyReason": null },
  "provenance": { "source": "https://api.lumenloop.com/v1/tools", "fetchedAt": "..." }
  // further fields only when a concrete consumer exists — no speculative schema
}
```

Actual catalog (`catalog/manifest.json`; counts are authoritative in the manifest — the ADR
below records the last structural change): **299 searchable entries** — 57 operations (lumenloop
21, scout 24, stellarDocs 12; the Docs MCP is fallback only) + 39 skill-kind entries (25 `skills.*`
mirror + 14 metadata-only `lumenloop.skill.*` twins) + 203 skill `##`/file sections. Of these, **25
are deny-listed** (4 operations + 7 retired mirror skills + 14 `lumenloop.skill.*` twins) and never
surface in `search` — see [`research/decisions/0002-skills-retirement-twin-dedup.md`](./research/decisions/0002-skills-retirement-twin-dedup.md)
(ADR-0002: the 2026-07-03 skills retirement + twin de-dup that moved the catalog 374→299,
25→18 exposed skills, 278→203 sections, 4→25 denied). Entries additionally carry an `outputSchema`
wherever the source declares one.

Build pipeline: `scripts/build-catalog.mjs` reads the three service inventories + the skills
index → emits `manifest.json` + a compiled search index bundled into the Worker. Catalog assembly
is deterministic and offline-testable; only the inventory *refresh* touches the network.

## 3. Skills directory — selective + partial exposure

Source: `ecosystem-skills/` mirror lifted from raven-next (25 skills, 5 pinned upstreams:
lumenloop ×8, lumenloop-api ×6, openzeppelin ×3, stellar-dev ×7, stellar-light ×1), synced by an
adapted `update.sh` + `check-mirrors.mjs`. Lumenloop's own `/v1/skills` zips are one of those
pinned upstreams, not a separate runtime dependency.

- **Build-time sectioning:** each `SKILL.md` is split on `##` headings (multi-file skills keep
  their file structure); every skill and every section becomes a catalog entry with its own
  description, so `search("soroban storage patterns")` can return *a section*, not a 40 KB skill.
- **Selective exposure is policy, not code:** an allowlist in the manifest controls which skills
  and which sections are visible at all; unlisted entries never appear in search results or
  resolve in the sandbox.
- **Retrieval:** `codemode.skill.read(name, { sections?: string[] })` returns only the requested
  portions (exact-match-guarded names — no fuzzy resolution, per ADR-0019's wrong-entity lesson).
- **Executable skills (later):** skills that are really playbooks over the service APIs can be
  authored as parameterized snippets (`async (input) => {...}` using the same service globals) and
  run via `codemode.skill.run` — identical runtime mechanism to codemode's snippets layer.

## 4. Policy & security

- **Secrets host-side only.** `LUMENLOOP_API_KEY` via Worker secret; the sandbox sees only
  namespaced function stubs. `globalOutbound: null` — `fetch()` in generated code throws.
- **Deny-list (machine-checkable, in the manifest):** 25 denied catalog entries — **4 denied
  operations** (`lumenloop.request_research` (metered), `scout.submitFeedback`,
  `scout.submitPartnerListing` (both writes), and `scout.partnerAssistant` (side-effecting — logs
  surfaced partners as leads)) plus the **7 retired mirror skills + 14 `lumenloop.skill.*` twins**
  from the 2026-07-03 skills retirement + twin de-dup (ADR-0002,
  `research/decisions/0002-skills-retirement-twin-dedup.md`).
  The unified super spec additionally marks **16 lumenloop endpoints denied** (account/billing
  mutations — keys/webhooks/top-up/budget/introspection — plus the host-side discovery surfaces),
  none of which are ever exposed as callable catalog operations. `search` never returns denied
  entries; `codemode.catalog()` shows them with `policy.allow=false` + `denyReason`
  (see-but-not-call); `execute` refuses them by id.
- **Paid-call gate:** `lumenloop.request_research` disabled by default at launch; when enabled —
  prefer `answer` mode (~$0.02), dedup via `list_my_research` first, per-day budget cap
  (partner quota is $50/mo). Mirrors old ADR-0018.
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
  README.md “Auth”.

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
src/policy/              # deny-list, arg validation, budget gate, redaction
src/skills/              # skill store, section index, read resolution
src/executor/            # DynamicWorkerExecutor wiring, providers, super-spec sandbox, truncation
src/observability.ts     # structured JSON events → Workers Logs; custom execute span
scripts/                 # refresh-inventory.mjs · build-catalog.mjs · build-super-spec.mjs · smoke checks
specs/                   # super-spec.json (+ authored stellar-docs.json) — feeds codemode.spec()
inventory/               # regenerated service inventory JSONs (drift source for build-catalog)
ecosystem-skills/        # pinned mirror (lifted)
catalog/manifest.json    # generated — the unified index
public/                  # GitHub-only assets (README hero banner) — NOT served by the Worker (public/README.md)
research/                # this research + ADRs (research/decisions/) as decisions accrue
test/                    # vitest offline suites (adapters, server, super-spec, auth, …)
eval/                    # routing eval + qa/ (execute Q→A battery) + agentic/ + plan/
```

Pins: `@cloudflare/codemode@^0.4` (exact-pin; vendor `search.ts`/`describe.ts`/`normalize.ts`/
`json-schema-types.ts` if churn bites), `@modelcontextprotocol/sdk ^1.25`, `zod ^4`, wrangler
compat ≥ 2026-06-11 + `nodejs_compat`, `worker_loaders` binding `LOADER`.

## 7. Phased build

> Status (end of Round 4): **all 8 phases shipped and live** on the default route
> **https://raven.stellar.buzz** (with **https://agents.stellar.buzz** served as an alias — both
> in `wrangler.jsonc` routes) (Solo todos 788–825; evidence: `eval/README.md`,
> `eval/agentic/README.md`, `eval/plan/README.md`, `research/decisions/0001-search-tool-shape.md`,
> `research/decisions/0002-skills-retirement-twin-dedup.md`, `research/auth-workos.md`,
> README.md “Auth”). CI + daily drift refresh run in
> github.com/kalepail/stellar-raven (renamed from stellar-raven-codemode 2026-07-02). WorkOS
> OAuth verified end-to-end incl. human
> AuthKit sign-in (Tyler, 2026-07-02); CIMD enabled.
> - **Public site + SEO surface shipped 2026-07-02/03** (`src/site.ts`): landing page, OAuth
>   consent page, `robots.txt`, `sitemap.xml`, JSON-LD, and `/og.png` — routed via the OAuth
>   provider's `defaultHandler` (`src/auth/workos.ts`). The OG image and site fonts are generated
>   code (`src/og.ts`, `src/fonts.ts` via `npm run site:og` / `npm run site:fonts`), not served
>   from `public/`.
>
> Deferred / future work (tracked as Solo backlog todos; project binding in CLAUDE.md):
> - `codemode.skill.run` (executable skills) — **design settled do-not-build-now 2026-07-03**
>   (`research/skill-run-design.md`, with explicit reopen triggers); the in-code sandbox sketch is
>   in §3 above and the dispatch mechanism it would ride on is in `research/codemode.md`
>   §"platform global".
> - Plan-eval progression weighting — revisit ONLY if a run shows detail-starved wrong answers
>   (`eval/plan/README.md` “Results — 2026-07-02”, conclusion).

1. **Scaffold** — wrangler + pinned deps + CLAUDE.md + hygiene checks. *(small)*
2. **Catalog + `search`** — manifest types, builder over the three inventories + skills,
   host-side search with TS signatures in results. Fully offline-testable. *(the core)*
3. **Adapters + `execute`** — write clean per-service clients in `src/adapters/` from the
   research docs (raven code consulted only for pitfalls),
   wire `DynamicWorkerExecutor` with namespaced providers + `codemode.search/describe` sandbox
   globals; live smoke against all three services. *(the other core)*
4. **Skills store** — sectioned retrieval (`skill.read`), allowlist policy; `skill.run` stub.
5. **Policy + observability** — deny-list enforcement, paid gate, redaction, truncation,
   per-execution `{code, result, logs}` logging.
6. **Inventory refresh** — refresh script + drift CI + adapted surface smoke check.
7. **Evals** — recompile the golden corpus **keeping `expected_service`/`expected_cards` labels**
   (the current compile step drops them); grade `search` top-k routing accuracy; a small
   end-to-end `execute` battery.
8. **Deploy + auth** — WorkOS-backed OAuth at `/mcp` with admin-token + local-dev bypasses
   (shipped; §4 “Server auth”, README.md “Auth”); deploy + connector quickstart.

Phases 2–3 are independently parallelizable after 1; 4–6 after 3.

## 8. Open decisions (defaults chosen, flag to reverse)

| Decision | Default | Alternative |
|---|---|---|
| Docs search path | **Decided: direct Algolia REST** — dedicated key in hand (`.env` → Worker secrets `ALGOLIA_APPLICATION_ID`/`ALGOLIA_API_KEY`); MCP as documented fallback | MCP-only (slower, protocol overhead) |
| `request_research` (paid) | off at launch | on with budget gate from day one |
| Server auth | **Decided: WorkOS OAuth** (`workers-oauth-provider` + AuthKit; admin/dev bypasses — §4, README.md) | plain bearer secret (retired placeholder) |
| Skills scope | **18 of 25 mirrored skills exposed** (7 Lumenloop API-onboarding skills retired 2026-07-03, ADR-0002), read-only sections | re-expose on transport-agnostic rewrite; executable snippets later |
| Statefulness | stateless `createMcpHandler` | `McpAgent` + CodemodeRuntime DO (approvals/audit) |
