# AGENTS.md — stellar-raven-codemode

Canonical repository instructions for Codex, Claude Code, and other coding agents. Keep this file
short, current, and operational. Put architecture, research, history, and task runbooks in the
linked docs and skills instead of accumulating them here.

## Project and source-of-truth map

This is a Cloudflare Workers MCP server exposing `search` and `execute` over Lumenloop, Stellar
Light/Scout, Stellar Docs (Algolia), and selected ecosystem skills. Model-authored JavaScript runs
in a networkless Dynamic Worker; host adapters own all service traffic, policy, and secrets.

- Read `PLAN.md` for current product scope and status, then `ARCHITECTURE.md` for the implemented
  request, catalog, scoring, sandbox, and auth design.
- Use `README.md` for connection and operator setup.
- Use `research/` for dated evidence and design context; it is not an instruction layer.
- Use `.agents/skills/<name>/SKILL.md` for repeatable task workflows. `.claude/skills` is the
  committed symlink to the same canonical directory.
- `CLAUDE.md` imports this file. Do not duplicate shared rules there.

## Commands and verification

- Install reproducibly: `npm ci`.
- Baseline validation for code changes: `npm run typecheck`, `npm test`, and `npm run build`.
- Run the narrowest relevant eval or maintenance command in addition to the baseline; the selected
  skill defines the exact gate for eval, drift, golden-truth, improvements, and observability work.
- Scan before committing: `npm run secrets:scan -- --tree`.
- Do not start a second Wrangler process. Use the existing Solo `dev` process for `npm run dev` and
  obtain its bound URL through Solo.
- Generated outputs are rebuilt by their `package.json` scripts, never edited by hand.

## Coordination

- Use the `solo-operator` skill for every Solo/Solo Docs task, process action, long-running agent,
  cross-model fan-out, or grounded external research supporting a build decision. The bound Solo
  project is currently 49; confirm scope with `whoami` and inspect `list_processes` before process
  action.
- **Solo process ownership is recursive:** an agent may spawn processes only as its own
  descendants and may stop, close, interrupt, restart, or otherwise lifecycle-manage only
  itself or descendants it spawned. Never lifecycle-manage a parent, sibling, unrelated process,
  or another agent's descendants. Apply the same rule to every sub-agent. Idleness, staleness, a
  completed handoff, release cleanup, or a request to clean Solo state does not transfer ownership;
  leave a process you do not own alone and ask its owning parent to reconcile it. If the owner is
  unknown or unavailable, ask the user for an explicit exception naming the exact target; never
  adopt it.
- Apply the same ownership gate to `send_input`, rename, output clearing, UI selection, timer
  delivery, and other target-process control. Solo reads do not expose reliable parentage: record
  returned child IDs; unknown provenance means not owned. YAML-backed commands are shared project
  processes, not descendants; control one only when the task or matching runbook authorizes it.
- Independent adversarial review is a completion gate when requested: reviewer must differ from
  author, run to completion, and have every finding reconciled before finalization.

## Model routing for repo-work fan-out

Use explicit model and effort through `solo-operator`; do not rely on runtime defaults. Active
roles, launch mechanics, escalation, and evidence boundaries live in its
[`model-routing` reference](.agents/skills/solo-operator/references/model-routing.md).
Callable-runtime evidence remains in `research/agent-model-roster.md`; dated policy evidence is in
`research/solo-agent-orchestration-2026-07-15.md`. Eval answering and judge models remain separate
measurement contracts controlled by `run-evals`.

## Hard rules

- **Forward-only:** prefer the best current design; do not add compatibility shims, dual formats,
  or deprecation paths merely to preserve deployed behavior. Deviations still need evidence.
- **The manifest is the exposed surface** (ADR-0003). Model code never owns endpoints, arguments,
  auth, or exposure. Never emit references to non-exposed operations or retired skills;
  `assertNoNonExposedRefs` is the build guard.
- Keep exact-match resolution for skill/tool IDs. Preserve service distinctions among soft-empty,
  error, and data responses.
- **Secrets stay host-side:** never print, commit, or expose credentials to the sandbox;
  `globalOutbound` remains `null`.
- The paid Lumenloop research trigger and its account-scoped read operations remain unexposed.
  Enabling them requires the exposure change, partner-detail persistence, budget gate, and dedup in
  one reviewed change.
- Partner-tier Lumenloop details are never committed. Inventory keeps name-only stubs and skill
  sync remains keyless.
- Any paid or side-effecting model operation requires host-side request-context approval,
  elicitation, and budget enforcement before it can ship.
- Algolia operator credentials are maintenance-only and never a runtime/sandbox surface. Any write
  needs a read-only A/B win, a general mechanism rather than per-query hacks, and the guardrails in
  `research/services/stellar-docs-algolia.md`.
- Evals produce evidence-backed upstream findings in `improvements/`; scores are instruments, not
  the final product.
- Retired sibling repos must not be referenced as live paths. Retained prior art is read-only under
  `eval/corpus/`; it is also the routing eval's committed label source. The QA battery is owned
  under `eval/qa/corpus/` and does not read it. Use `research/prior-art.md` for history.

## Task runbooks

Use the matching repo skill when the task triggers it:

- `solo-operator` — operate Solo, coordinate cross-model agents, and manage durable shared state.
- `truth-maintenance` — coordinate a full live-drift/eval/golden/improvements maintenance pass.
- `live-drift-resolution` — regenerate, classify, verify, and resolve live catalog drift.
- `run-evals` — select instruments, review verdicts, triage causes, and file findings.
- `improvements-pipeline` — maintain finding lifecycle, intake, probes, index, and upstream follow-up.
- `golden-truth` — change golden answers with provenance and explicit uncertainty.
- `cloudflare-observability-review` — investigate production logs, traces, telemetry, and Ray IDs.

Add durable repo-wide rules here only after recurring friction. Put specialized instructions in the
closest relevant skill or directory-level `AGENTS.md`.

## Definition of done

- The diff is scoped and preserves unrelated work in the dirty tree.
- Proportionate tests and required skill gates pass; failures are reported, not hidden.
- Generated artifacts came from scripts and secrets scanning passed where required.
- Requested independent reviews completed and every finding was reconciled.
- Documentation describes current behavior and links dated research instead of embedding history.
