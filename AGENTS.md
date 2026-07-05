# AGENTS.md — stellar-raven-codemode

Entry point for Codex and any non-Claude CLI agent working in this repo.

## Source of truth: read `CLAUDE.md` first

`CLAUDE.md` is the single source of truth for what this project is, the architecture docs to
start from (`PLAN.md`, `ARCHITECTURE.md`), the research docs, the hard rules (manifest-is-the-
exposed-surface / ADR-0003, secrets host-side only, generated artifacts never hand-edited,
forward-only), the deployment/CI bindings, and the neighboring repos. This file does not
duplicate it — it points Codex at it and lists the shared skills. When guidance here and
`CLAUDE.md` could diverge, `CLAUDE.md` wins; keep this file thin.

## Skills — shared, agent-agnostic runbooks

The runbooks in `.claude/skills/<name>/SKILL.md` are plain markdown and **not Claude-specific** (a
skill is just a `SKILL.md` plus optional bundled resources). Claude Code auto-discovers them as
**project-scoped** skills from this repo's `.claude/skills/`. Codex has no repo-scoped skill
discovery — its skills are global, auto-loaded from `$CODEX_HOME/skills` (`~/.codex/skills`) — so
**this `AGENTS.md` is how Codex is pointed at these repo runbooks**: Codex auto-reads it from the
repo root, sees the index below, and reads the referenced `SKILL.md` directly.

Two ways to expose a runbook to Codex, by scope:

- **Repo-scoped (default, committed, portable):** add the `SKILL.md` under `.claude/skills/<name>/`
  and list it in the index below. That is the whole job — no per-skill manifest, no sidecar.
- **First-class global Codex skill (opt-in, machine-local):** symlink the skill dir into the
  Codex farm, `ln -s "$PWD/.claude/skills/<name>" ~/.codex/skills/<name>` (mirror into
  `~/.claude/skills/<name>` for user-level Claude too), then restart Codex. This matches the
  user's shared-store pattern where `~/.codex/skills/*` and `~/.claude/skills/*` symlink into the
  canonical `~/.agents/skills/` store — but it hoists a repo-specific runbook into every Codex
  session everywhere, so only do it deliberately.

Current skills:

- **live-drift-resolution** — resolve a "Live service drift detected" issue: regenerate the
  catalog, classify the drift (provenance/data vs operation-surface vs routing-text), decide
  policy/routing-baseline vs clean bump, dual-verify, commit and close.
- **run-evals** — run a full eval round: pick instruments, let the runner spawn the answering and
  judge agents, review every verdict, triage to root cause, file upstream findings in
  `improvements/`. The scores are the instrument; the findings are the product.
- **golden-truth** — change the golden Q→A corpus without codifying lies: classify the truth
  domain, triangulate across independent source classes, encode disputed/unverifiable facts
  honestly, land as a provenance-bearing override.
- **cloudflare-observability-review** — investigate live Cloudflare Workers logs, traces, and Ray
  IDs for production request/eval/agent-run forensics.

## Working norms (from `CLAUDE.md`)

- **Independent adversarial review is a quality gate, not a speed bump.** Reviewer ≠ author; let
  it run to completion; reconcile every finding before finalizing. Coordinate multi-agent work,
  todos, and scratchpads through the Solo MCP project bound in `CLAUDE.md`.
- **The manifest IS the exposed surface (ADR-0003).** Never tell a consumer what the gateway
  cannot do; never emit text referencing a non-exposed op or retired skill — the build guard
  (`assertNoNonExposedRefs`) enforces it.
- **Secrets host-side only**, never printed or committed; `npm run secrets:scan -- --tree` before
  committing regenerated artifacts.
- **Generated artifacts are rebuilt by `scripts/`, never hand-edited.**
- Prior-art repos `../stellar-raven-next` / `../stellar-raven` are read-only reference — learn,
  don't clone.
