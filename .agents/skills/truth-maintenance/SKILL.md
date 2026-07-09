---
name: truth-maintenance
description: Coordinate a full truth-maintenance pass for stellar-raven-codemode across live drift, evals, golden questions/answers, and improvements/issues/PR follow-up. Use when asked to ensure repo truth is current, review the current state of upstream findings or PRs the repo opened, run a multi-lane maintenance round, or orchestrate CI-like review work with Solo agents instead of one monolithic context window.
---

# Truth maintenance

This is the coordinator skill. It does not replace the lane runbooks:

- `live-drift-resolution` owns catalog/inventory/spec/op-class drift from live upstream services.
- `run-evals` owns eval instrument selection, result review, and eval-round closeout.
- `golden-truth` owns any golden question/answer/key-fact/avoid/source/grader-note change.
- `improvements-pipeline` owns `improvements/`, intake, probes, upstream issue/PR tracking, and index/lint.

Use this skill when the work crosses lanes or when the user asks for "truth is up to date"
rather than a single drift issue. The product is a Solo-recorded maintenance round with
lane verdicts, evidence, follow-ups, and cleaned-up spawned work.

## Solo orchestration contract

Solo is the control plane. Before doing work, call `whoami`, confirm the Solo project
binding from `CLAUDE.md`, and inspect current processes/todos/scratchpads. Do not start duplicate
dev servers; use the Solo `dev` command and `wait_for_bound_port`/`services_list` when a
live server is needed.

Create or claim one Solo todo for the maintenance round and one scratchpad as the ledger.
Use fixed headings so spawned agents can append without clobbering each other:

```
# Truth maintenance <YYYY-MM-DD>
## Scope
## Lane plan
## Drift verdict
## Eval verdict
## Golden verdict
## Improvements/issues/PR verdict
## Own-repo todos
## Decisions
## Final checklist
```

For anything beyond a tiny single-lane check, spawn isolated Solo agents with narrow briefs.
Use `list_agent_tools`, then `spawn_agent`, then `send_input` with the returned
`agent_instructions` prepended. Spawn each agent in non-interactive yolo/permission-bypass mode
(pass the runtime's bypass flag via `spawn_agent`'s `extra_args`; per-runtime flags are in the
`CLAUDE.md` Coordination bullet) so a child never stalls on an approval prompt, and have the brief
tell any agent that spawns its own sub-agents to do the same. By default, agents research/review
and append to the Solo ledger; the coordinator owns repo edits. Only delegate patches when the write set is narrow,
explicit, and disjoint. Use `timer_fire_when_idle_all` or `timer_fire_when_idle_any` to wake
the coordinator when agents go idle. Do not poll in a loop.

Agent/model selection is a default, not a limit. The current model rankings, per-axis scores,
and per-runtime spawn mechanics are bindings that live in `CLAUDE.md` ("Picking models for
sub-agent fan-out") — consult them when spawning; this skill carries only the patterns:

- Mechanical catalog/data/script checks and bulk sweeps: the cheapest agent that clears the bar
  (per the rankings' bulk/mechanical row), or a terminal script — then a stronger reviewer samples.
- Adversarial plan/code/golden review: the strongest reasoning agents in the rankings, with an
  independent second perspective from a different vendor's agent when useful.
- UI/copy/API-design taste calls: an agent whose model meets the rankings' taste bar; cost is a
  tie-breaker only.
- Escalate without asking: if a cheaper agent's output misses the bar, redo the work with a
  smarter model. Judge the output, not the price tag.

Reviewer and author are separate roles. A spawned reviewer must re-derive from files, diffs,
live probes, or GitHub state, not rubber-stamp the coordinator's summary. Let reviewers finish
unless the user cancels or they clearly error.

## Round plan

1. Define the question: scheduled truth refresh, drift issue, post-eval closeout, upstream
   PR/issue follow-up, golden-health sweep, or release/CI readiness.
2. Open the Solo ledger and write the lane plan: lanes in scope, spawned agents, exact
   commands/probes, expected artifacts, and stopping criteria.
3. Run the lane runbooks in parallel where independent:
   - Drift lane: use `live-drift-resolution` for service inventory/catalog/spec/op-class
     refresh and drift classification.
   - Eval lane: use `run-evals` for selected instruments and result review.
   - Golden lane: use `golden-truth` for stale, contradictory, disputed, or volatile truth.
   - Improvements lane: use `improvements-pipeline` for findings, probes, intake, and
     upstream issue/PR state.
4. Reconcile cross-lane effects:
   - Drift changed facts consumed by goldens or eval cases.
   - Eval failures imply new or updated improvements.
   - Upstream issue/PR resolution requires live re-probe of the original trigger.
   - Golden override changes require root-cause capture in improvements or Solo todos.
5. Run the final gates from the affected lane runbooks, then record exact commands, result
   stamps, issue/PR URLs, commit refs, and remaining risks in the Solo ledger.

## Lane briefs

Use briefs like these; keep each agent's task bounded and append-only to the Solo ledger.

**Drift reviewer**

Rebuild or inspect the generated drift artifacts, classify each changed service as
provenance/data, operation-surface, routing-text, or runner-affecting, run the relevant
guards, and append file:line/diff evidence plus a close/block verdict.

**Eval reviewer**

Review stored or newly produced eval results. Join rows with goldens, re-check wrong/partial
claims live, classify failures with the `run-evals` root-cause table, and identify new or
updated improvements and own-repo Solo todos.

**Golden reviewer**

For candidate golden changes or contradiction clusters, build the `golden-truth`
corroboration matrix from independent source classes. Do not edit files; return confirmed,
disputed, contradicted, or unverifiable with exact sources and as-of dates.

**Improvements/PR reviewer**

Enumerate findings with upstream issue/PR evidence, check current GitHub state, inspect
unresolved reviews/checks/comments for PRs this repo opened, re-run the original trigger or
probe, and append a deterministic status table plus recommended file updates.

## Deterministic state table

Use this table shape in the Solo ledger for improvements/issues/PRs:

| finding | trigger | upstream ref | ref state | PR checks/reviews/blocker | live re-check | repo action | next wake-up |
|---|---|---|---|---|---|---|---|
| `sls-005` | eval stamp / probe / drift fact | issue/PR URL | open/closed/merged/stale/unknown | pass/fail/requested-changes/none | fixed/still-repro/inconclusive | no-op/status edit/successor/own todo | date/timer/todo |

Only mark `fixed-upstream` when the live re-check of the original trigger passes. A closed
GitHub issue or merged PR is evidence to inspect, not proof of resolution. If a PR is open
and waiting on review/CI/author changes, track the blocker and set a Solo timer/todo for the
next follow-up instead of relying on memory.

## Closeout checklist

- Solo ledger has lane verdicts, exact commands/probes, spawned process IDs, and final status.
- Every spawned agent is idle/finished; useful output is incorporated; no orphan follow-up
  timer remains unless intentionally scheduled.
- Drift-generated artifacts are regenerated, not hand-edited.
- Golden changes went through `golden-truth` and include root-cause capture.
- Improvements index/lint/probes ran when `improvements/` changed.
- Open upstream PRs/issues have deterministic next actions or scheduled follow-up.
- `npm run secrets:scan -- --tree` runs before any commit that includes generated artifacts
  or copied upstream content.
