# CLAUDE.md — stellar-raven-codemode

**What this is:** a single remote MCP server (Cloudflare Workers) exposing two tools — `search`
and `execute` — over a unified catalog covering Lumenloop, Stellar Light/Scout, the Stellar Docs
MCP, and a selectively-exposed skills directory. `execute` runs LLM-authored JS in a Dynamic
Worker isolate with **no network**; all service traffic goes through host-side adapters that hold
secrets and enforce policy.

**Start here:** [`PLAN.md`](./PLAN.md) — architecture, catalog design, skills model, phases
(§7 status note = current truth on what's shipped/deferred); then
[`ARCHITECTURE.md`](./ARCHITECTURE.md) — how `search`/`execute` actually work end to end
(auth gates, scoring pipeline, sandbox, envelope, skill splitting), code-verified.

**Deployed:** live since 2026-07-02; default route https://raven.stellar.buzz, with
https://agents.stellar.buzz served as an alias (both in `wrangler.jsonc` routes) (worker
`stellar-raven-codemode`, "Ecosystem - Stellar" CF account). WorkOS OAuth + admin-token/local
bypasses — design in `research/auth-workos.md`, connection guide in [`README.md`](./README.md).
CI + daily live-drift refresh: github.com/kalepail/stellar-raven Actions (repo renamed from
stellar-raven-codemode 2026-07-02). Work is
coordinated via Solo MCP project 49 (todos + scratchpads; backlog items tracked there).

## Research docs (current truth, live-verified; refresh before trusting)

- `research/services/lumenloop.md` — 21 tools, envelope, quirks (partner items hidden from
  `/v1/tools` — union with `/v1/me`), `/v1/changelog` drift feed. Key: `LUMENLOOP_API_KEY` in
  `.env` (local) / Worker secret (deployed). **Never print or commit the key.**
- `research/services/stellar-light.md` — keyless, 23 paths / 24 ops (2026-07-02 partner-pipeline
  release), `/api/openapi.json` + `/api/status` + `/api/changelog` self-description.
- `research/services/stellar-docs-algolia.md` — docs search is **direct Algolia REST** (app
  `VNSJF5AWIZ`, index `crawler_Stellar Docs - Docusaurus`; dedicated search key in `.env` as
  `ALGOLIA_APPLICATION_ID`/`ALGOLIA_API_KEY`, mirrored to Worker secrets). The MCP endpoint
  (`stellar-docs-mcp.md`) is fallback only.
- `research/codemode.md` — `@cloudflare/codemode` internals, DynamicWorkerExecutor, Worker Loader
  binding, McpAgent vs `createMcpHandler`, security/egress model.
- `research/observability-cloudflare.md` — CF observability survey: Workers Logs, Traces (beta;
  Worker Loader NOT auto-instrumented — custom spans via `tracing.enterSpan`), OTel export,
  telemetry query API, GraphQL metrics. What we enabled and why.
- `research/prior-art.md` — map of `../stellar-raven-next` / `../stellar-raven`. **Learn, don't
  clone:** those repos are references, not templates — design this project's own types, formats,
  and adapters; take their *content* (skills mirror, golden corpus) and *lessons* (ADR pitfalls),
  not their code or schemas by default.

## Rules

- **Model code never owns endpoints/args/auth** — everything validates against the catalog
  manifest. Deny-list is data in the manifest, not prose.
- Exact-match guards on skill/tool id resolution; no fuzzy top-hit acceptance.
- Soft-empty ≠ error ≠ data — keep per-service normalizers.
- Paid Lumenloop research is gated: dedup via `list_my_research`, budget cap, off by default.
- Secrets host-side only; sandbox keeps `globalOutbound: null`.
- Generated artifacts (`catalog/manifest.json`, inventory JSONs) are rebuilt by `scripts/`,
  never hand-edited.
- Prior-art repos `../stellar-raven-next` and `../stellar-raven` are **read-only reference** —
  copy code in, never modify them.
- **Evals' primary artifact is upstream findings** — this server's own tuning ceiling is
  limited; every eval run files evidence-backed service-improvement recommendations in
  `improvements/` (charter there; own-repo fixes go to Solo todos instead).

## Neighboring repos

- `../stellar-raven-next` — primary prior art (see its `AGENTS.md`); `agents-docs/` there mirrors
  the Cloudflare Agents SDK docs incl. `docs/codemode/`. **Being retired** — everything
  eval-corpus-related is vendored in `eval/corpus/` (see `eval/corpus/PROVENANCE.md`); don't add
  new dependencies on the sibling path.
- `../raven-golden-qa` — **retired**; its corpora (big.json, the semantic battery) live at
  `eval/corpus/raven-golden-qa/`. The raw jutsu user-question pool was **removed** for privacy
  (real user ids + user-pasted secret keys/emails) and is not vendored here.
