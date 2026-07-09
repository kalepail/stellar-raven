# CLAUDE.md — stellar-raven-codemode

**What this is:** a single remote MCP server (Cloudflare Workers) exposing two tools — `search`
and `execute` — over a unified catalog covering Lumenloop, Stellar Light/Scout, the Stellar Docs
(Algolia), and a selectively-exposed skills directory. `execute` runs LLM-authored JS in a Dynamic
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
stellar-raven-codemode 2026-07-02). The worker also serves a small browser surface — landing +
Terms/Privacy consent pages and the demo playground (`src/site.ts`, `src/demo/`). Work is
coordinated via Solo MCP project 49 (todos + scratchpads; backlog items tracked there).

## Solo first

Use Solo MCP as the first stop for project state, process management, coordination, and long-lived
work. At the start of any task that may touch a running service, another agent, a todo/scratchpad,
or a dev command, call Solo (`whoami`/`list_processes` as needed) to confirm project scope and
current process state before using raw shell commands.

- **Dev servers and long-running commands:** check Solo processes first (`list_processes`,
  `get_process_ports`, `wait_for_bound_port`). Reuse the existing Solo command and URL when one
  exists (for this repo the normal dev command is the Solo `dev` process, `npm run dev`, usually on
  `http://localhost:8787`). Start/restart through Solo (`start_process`/`restart_process`) instead
  of spawning a duplicate shell process.
- **Coordination:** use Solo todos/scratchpads/process output for shared state and multi-agent work.
  If a task needs an independent reviewer or helper, spawn/coordinate that agent through Solo and
  let it finish. **Spawn every sub-agent — and instruct each to spawn any sub-sub-agents — in
  non-interactive "yolo"/permission-bypass mode**, because a Solo-managed child has no human at the
  keyboard to answer approval prompts and will otherwise silently stall waiting on one. Pass the
  runtime's bypass flag via `spawn_agent`'s `extra_args` (Claude `--dangerously-skip-permissions`,
  Codex `--yolo` / `--dangerously-bypass-approvals-and-sandbox`, Gemini `--yolo`, or the equivalent
  full-auto flag for Copilot/OpenCode/Amp/Kimi/etc.), and make the spawn brief tell the child to
  launch its own sub-agents the same way so the bypass propagates down the whole tree. Check the
  saved agent tool's default command first (its `command` shows in `list_processes`/spawn output):
  the Solo **Codex** tool default already includes `--yolo` (as of 2026-07-09), and passing it
  again via `extra_args` duplicates the flag and kills the spawn on launch; Claude tolerates a
  duplicated `--dangerously-skip-permissions`.
- **Fallback:** use local shell process management only for short foreground commands or when Solo
  has no matching process/tool. If you must start a non-Solo long-running process, say why and stop
  it before finalizing.

### Picking models for sub-agent fan-out

Rankings, higher = better (Tyler, 2026-07-09). Cost reflects what we actually pay (the OpenAI
plan's limits are very generous), not list price. Intelligence is how hard a problem you can hand
the model unsupervised. Taste covers UI/UX, code quality, API design, and copy.

| model    | cost | intelligence | taste |
|----------|------|--------------|-------|
| gpt-5.5  | 9    | 8            | 5     |
| sonnet-5 | 5    | 5            | 7     |
| opus-4.8 | 4    | 7            | 8     |
| fable-5  | 2    | 9            | 9     |

How to apply:

- These are defaults, not limits. Standing permission to override: if a cheaper model's output
  doesn't meet the bar, rerun or redo the work with a smarter model without asking. Judge the
  output, not the price tag — escalating costs less than shipping mediocre work.
- Cost is a tie-breaker only; when axes conflict for anything that ships,
  intelligence > taste > cost.
- Bulk/mechanical work (clear-spec implementation, data analysis, migrations): gpt-5.5 — it's
  effectively free.
- Anything user-facing (UI, copy, API design) needs taste ≥ 7.
- Reviews of plans/implementations: fable-5 (Claude CLI alias: `fable`) or opus-4.8,
  optionally gpt-5.5 as an extra
  independent perspective.
- Never use Haiku.

Mechanics — **Solo is the fan-out plane** (yolo rule and per-runtime bypass flags in the
Coordination bullet above):

- **gpt-5.5 is only reachable through the Codex CLI.** Fan out via the Solo Codex agent tool —
  `spawn_agent` (Codex, `extra_args: ["--yolo"]`) then `send_input` the brief — for reviewers and
  long-lived helpers; for fire-and-forget work, one-shot `codex exec -s read-only` (investigation)
  or `codex exec --yolo` (edits) with a fully self-contained prompt. `~/.codex/config.toml`
  already defaults to gpt-5.5. No wrapper gymnastics: Solo spawns Codex directly, so gpt-5.5 is a
  first-class fan-out target.
- **Claude models** fan out via the Solo Claude agent tool —
  `spawn_agent` (Claude, `extra_args: ["--model", "<claude-cli-model>", "--dangerously-skip-permissions"]`).
  The model names in the ranking table are product/ranking names, not always CLI aliases:
  Fable 5 must be spawned with `--model fable` (not `fable-5`; verified 2026-07-09).
  An orchestrator running inside Claude Code may use its native subagent `model` parameter for
  quick in-harness helpers (same rankings apply), but anything long-lived, reviewable, or shared
  across agents goes through Solo so its output lands in project state.
- Eval-lane models are NOT covered by this table: QA answering/judge model defaults are part of
  the measurement contract (`.agents/skills/run-evals/SKILL.md`) and change only by explicit
  eval decision.

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
  telemetry query API, GraphQL metrics. What we enabled and why. For live production log/trace
  reviews, use `.agents/skills/cloudflare-observability-review/SKILL.md` (Claude reaches the
  same file through the committed `.claude/skills` symlink).
- `research/prior-art.md` — historical map of the retired sibling repos (see "Retired prior-art
  repos" below). **Learn, don't clone:** they were references, not templates — design this
  project's own types, formats, and adapters; take their *content* (skills mirror, golden
  corpus) and *lessons* (ADR pitfalls), not their code or schemas by default.

## Rules

- **Forward-only; the service has no users to protect (Tyler, reaffirmed 2026-07-07).** When
  options are ranked, pick the best design even when it breaks contracts — no legacy formats, no
  dual paths, no deprecation shims, no "least disruptive" weighting. The fact that this service is
  deployed must carry ZERO weight in design decisions; breaking deployed behavior is fine and
  preferred over compat code. Deviations from upstream codemode still need conviction or a golden
  A/B win — forward-only is not careless.
- **Model code never owns endpoints/args/auth** — everything validates against the catalog
  manifest.
- **The manifest IS the exposed surface (ADR-0003,
  `research/decisions/0003-build-time-exposure-filtering.md`)** — exposure is filtered at
  BUILD time; exclusions are exact-match data in `scripts/exposure.mjs` (shared by every
  emitter, with fail-loud drift guards in `scripts/build-catalog.mjs`), never runtime policy,
  never prose. Consumers are never told what the gateway cannot do — emitted text must not
  reference a non-exposed op or retired skill (`assertNoNonExposedRefs` breaks the build on it).
- Exact-match guards on skill/tool id resolution; no fuzzy top-hit acceptance, no aliases.
- Soft-empty ≠ error ≠ data — keep per-service normalizers.
- The paid Lumenloop research lane is not emitted at all — the `request_research` trigger AND
  its read half (`research_result`, `list_my_research`; account-scoped dead ends without the
  trigger). Enabling it = remove all three exclusions (`scripts/exposure.mjs`) AND deliberately
  restore partner detail persistence in `scripts/refresh-inventory.mjs` AND ship the budget
  gate + dedup in the same change. `list_research` (public editorial pieces) stays.
- **Partner-tier LumenLoop content is never committed** (go-public cleanup 2026-07-06):
  `inventory/lumenloop.json` keeps name-only stubs (`partner_stub: true`, no
  descriptions/schemas/limits), the `ecosystem-skills/` mirror has no credentialed source, and
  `ecosystem-skills/update.sh` must stay keyless so agent-run skill syncs can never pull
  partner content back in. `buildLumenloop` fails the build on any non-excluded stub.
- **Before ANY side-effecting or paid operation ships** (the research lane above, or future
  write ops): adopt upstream OpenAPI-MCP-style request-context plumbing — the sandbox calls a
  host function; the host adapter receives the outer MCP request context and owns
  approval/elicitation/budget there. Approval state never lives in sandbox code. (Todo 845
  item 3; design reference: `@cloudflare/codemode` OpenApiMcpServerOptions.request.)
- Secrets host-side only; sandbox keeps `globalOutbound: null`.
- Generated artifacts (`catalog/manifest.json`, inventory JSONs, `src/fonts.ts`, `src/og.ts`)
  are rebuilt by `scripts/` (`npm run` targets), never hand-edited.
- Prior-art sibling checkouts are **retired and deleted** — never reference `../stellar-raven*`
  paths. Everything kept from them is vendored read-only in `eval/corpus/` (provenance +
  checksums in `eval/corpus/PROVENANCE.md`).
- **Evals' primary artifact is upstream findings** — this server's own tuning ceiling is
  limited; every eval run files evidence-backed service-improvement recommendations in
  `improvements/` (charter there; own-repo fixes go to Solo todos instead). To run a
  round, use the `run-evals` skill (`.agents/skills/run-evals/SKILL.md` — agent-agnostic
  runbook: instrument selection, gates, agentic verdict review, failure triage, filing;
  lifecycle/intake/probe maintenance lives in the `improvements-pipeline` skill).
- **Let independent adversarial reviews finish.** When a Solo/subagent review is requested for
  design, code, eval, or research work, treat it as a quality gate, not a speed bump. Do not
  interrupt or close the reviewer merely because it is taking longer than expected; let it run to
  completion unless the user explicitly cancels it, it clearly errors, or it is blocking on input
  that only the user can provide. Capture and incorporate the review findings before finalizing.

## Retired prior-art repos

The sibling checkouts `../stellar-raven`, `../stellar-raven-next`, and `../raven-golden-qa` are
retired and no longer exist on disk; older docs/ADRs may still name them. Everything kept is
vendored read-only in `eval/corpus/` (provenance + checksums in `eval/corpus/PROVENANCE.md`):
the 538-case golden corpus under `eval/corpus/raven-next/`, the raven-golden-qa corpora
(big.json, the semantic battery) under `eval/corpus/raven-golden-qa/`. The raw jutsu
user-question pool was **removed** for privacy (real user ids + user-pasted secret keys/emails)
and is not vendored here. `research/prior-art.md` is the historical map of what those repos
contained.
