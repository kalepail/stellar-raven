# AGENTS.md — stellar-raven-codemode

Entry point for Codex and any non-Claude CLI agent working in this repo.

## Source of truth: read `CLAUDE.md` first

`CLAUDE.md` is the single source of truth for what this project is, the architecture docs to
start from (`PLAN.md`, `ARCHITECTURE.md`), the research docs, the hard rules (manifest-is-the-
exposed-surface / ADR-0003, secrets host-side only, generated artifacts never hand-edited,
forward-only), the deployment/CI bindings, and the retired prior-art repos. This file does not
duplicate it — it points Codex at it and lists the shared skills. When guidance here and
`CLAUDE.md` could diverge, `CLAUDE.md` wins; keep this file thin.

## Skills — shared, agent-agnostic runbooks

The runbooks are plain markdown and **not Claude-specific** (a skill is just a `SKILL.md` plus
optional bundled resources). They are **repo-scoped and first-class for both agents**, stored once
and read by each tool from the location it scans:

- **Canonical files live in `.agents/skills/<name>/SKILL.md`.** Codex discovers these natively — it
  scans `.agents/skills` from the working directory up to the repo root (repo-scoped; no global
  install, no `AGENTS.md` bridge needed).
- **`.claude/skills` is a committed symlink → `../.agents/skills`.** Claude Code only scans
  `.claude/skills/` for project skills, but it follows the symlink and loads the same runbooks. The
  `.gitignore` negation (`!.claude/skills`, no trailing slash) is what keeps that symlink tracked
  under the `.claude/*` deny rule.

This mirrors the machine-wide store (`~/.agents/skills` canonical ← `~/.claude`/`~/.codex` symlink
farms) at repo scope, and matches the sibling repos. To add a runbook: create
`.agents/skills/<name>/SKILL.md` and list it in the index below — that's the whole job. No
per-skill manifest. `agents/openai.yaml` is an **optional** Codex-app UI/policy file (chip
metadata, `allow_implicit_invocation`, tool deps); the house pattern omits it — add it only if you
want to customize the Codex-app presentation, generated via the skill-creator's
`generate_openai_yaml.py`, never hand-authored.

Current skills:

- **truth-maintenance** — coordinate a full truth-maintenance pass across live drift, evals,
  golden truth, and improvements/issues/PR follow-up using Solo todos, scratchpads, spawned agents,
  and timers as the control plane.
- **live-drift-resolution** — resolve a "Live service drift detected" issue: regenerate the
  catalog, classify the drift (provenance/data vs operation-surface vs routing-text vs
  runner-affecting), decide policy/routing-baseline vs clean bump, dual-verify, commit,
  deploy when authorized, verify production, and close.
- **run-evals** — run a full eval round: pick instruments, let the runner spawn the answering and
  judge agents, review every verdict, triage to root cause, file upstream findings in
  `improvements/`. The scores are the instrument; the findings are the product.
- **improvements-pipeline** — maintain the `improvements/` upstream-findings pipeline: lifecycle
  statuses, filing quality bar, intake resolution, probes/recurrences, upstream issue/PR
  follow-up, generated index, and lint gates.
- **golden-truth** — change the golden Q→A corpus without codifying lies: classify the truth
  domain, triangulate across independent source classes, encode disputed/unverifiable facts
  honestly, land as a provenance-bearing override.
- **cloudflare-observability-review** — investigate live Cloudflare Workers logs, traces, and Ray
  IDs for production request/eval/agent-run forensics.

## Working norms (from `CLAUDE.md`)

- **Solo first.** Before starting dev servers, long-running commands, terminals, agents, todos, or
  scratchpads, check the Solo MCP project/process state and reuse the existing Solo process when
  available. In this repo, the normal dev server is the Solo `dev` command (`npm run dev`), so get
  its URL from Solo instead of spawning another Wrangler process.
- **Independent adversarial review is a quality gate, not a speed bump.** Reviewer ≠ author; let
  it run to completion; reconcile every finding before finalizing. Coordinate multi-agent work,
  todos, and scratchpads through the Solo MCP project bound in `CLAUDE.md`.
- **Spawn sub-agents in yolo/permission-bypass mode.** Solo-managed children have no human to
  answer approval prompts, so launch every spawned agent — and have it launch its own
  sub-sub-agents — non-interactively: pass the runtime's bypass flag via `spawn_agent`'s
  `extra_args` (Codex `--yolo`, Claude `--dangerously-skip-permissions`, or the equivalent). See
  the `CLAUDE.md` "Solo first → Coordination" bullet for the full per-runtime list.
- **Pick sub-agent models by the `CLAUDE.md` rankings** ("Picking models for sub-agent fan-out"):
  gpt-5.5 via Codex for bulk/mechanical work, fable-5 or opus-4.8 for plan/implementation
  reviews, taste ≥ 7 models for anything user-facing, never Haiku. Use the CLI aliases documented
  in `CLAUDE.md` when spawning them; for example Fable 5 is `claude --model fable`, not
  `--model fable-5`. Defaults, not limits — if a cheaper model's output misses the bar, redo it
  with a smarter model without asking; cost is a tie-breaker only. Eval answering/judge models are
  a separate measurement contract (`run-evals` skill), not covered by the rankings.
- **The manifest IS the exposed surface (ADR-0003).** Never tell a consumer what the gateway
  cannot do; never emit text referencing a non-exposed op or retired skill — the build guard
  (`assertNoNonExposedRefs`) enforces it.
- **Secrets host-side only**, never printed or committed; `npm run secrets:scan -- --tree` before
  committing regenerated artifacts.
- **Generated artifacts are rebuilt by `scripts/`, never hand-edited.**
- Prior-art sibling repos (`../stellar-raven*`) are retired and deleted — never reference the
  sibling paths; their kept content is vendored read-only in `eval/corpus/`. Learn, don't clone.
