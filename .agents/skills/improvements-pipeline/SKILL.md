---
name: improvements-pipeline
description: Maintain the improvements/ upstream-findings pipeline for stellar-raven-codemode. Use when filing or updating service-improvement findings, resolving intake targets, maintaining improvements/intake.json, interpreting improvements lint failures, running recurrence probes, regenerating improvements/INDEX.md, reviewing upstream issues or PRs opened from findings, or handling eval-round and drift-refresh improvement maintenance.
---

# Improvements pipeline

Use this skill when work touches `improvements/`: filing upstream findings, changing statuses,
running probes, updating intake targets, regenerating the index, or interpreting lint failures.
Read `improvements/README.md` first; it is the charter.

## Status lifecycle

Statuses are evidence bars:
- `proposed`: plausible finding, usually from an eval transcript or review, but not yet live-proven.
- `verified`: live re-execution proves the finding against the upstream surface; record the command,
  service response, result stamp, or other reproducible evidence.
- `reported-upstream`: filed with the service owner; evidence must include the durable filed ref.
- `fixed-upstream`: live re-check confirms the upstream fix. If a residual remains, create or update a
  successor finding instead of stretching the old one.

Findings are for upstream service/data/content/spec gaps only. Own-repo fixes go to Solo todos.

GitHub state is not truth by itself. An upstream issue being closed or a PR being merged is
evidence to inspect; a finding moves to `fixed-upstream` only after re-running the original
trigger, recurrence probe, or live repro and observing the fix.

## Filing workflow

Dedupe first: search existing finding ids, titles, and recurrences before adding a file. A new finding
needs a concrete owner-facing recommendation, quantified prevalence when possible, and evidence a
stranger can reproduce. Use the next id in the service prefix sequence:

- `lumenloop` -> `ll-NNN`
- `stellar-light-scout` -> `sls-NNN`
- `stellar-docs` -> `sd-NNN`
- `skills` -> `sk-NNN`

Use the standard frontmatter plus `Finding`, `Evidence`, and `Recommendation` sections. Keep
`discovered` as `YYYY-MM-DD`. Evidence must be a non-empty list. If evidence contains a GitHub issue
or PR URL, the status must be `reported-upstream` or `fixed-upstream`; otherwise lint fails.

Resolve intake through `improvements/intake.json`: per-finding override wins, then a service repo,
then an explicit service-level `unclear` or `mixed` rule. Use honest unclear when no public owner can
plausibly receive it; do not file to this repo just to close the loop. The drafter script renders and
scrubs the upstream issue body, resolves the repo from intake when unambiguous, and refuses unclear or
mixed targets unless a human supplies `--repo`.

When adding or editing a finding, run:

```sh
npm run improvements:index
npm run improvements:lint
```

Use `npm run improvements:lint -- --live` when intake repos were added, renamed, or questioned.

## Direct Algolia remediation (stellar-docs search-mechanism findings)

`stellar-docs` findings split into content gaps and search-mechanism gaps. Content gaps (a page is
stale/wrong/missing) stay upstream on the docs repo. Search-mechanism gaps (ranking, tokenization,
synonym/vocabulary, crawler config) are now directly remediable with the operator Algolia
credentials in `.env` — write, crawler, and analytics tiers documented in
`research/services/stellar-docs-algolia.md`. Reach for the direct lever only when it clears the bar:

- **General mechanism only.** No per-page/per-query rules or synonyms — the same anti-overfitting
  rule the eval loop enforces. The single load-bearing rule (`raven-promote-stellar-cli-install`) is
  the ceiling of an acceptable single-target mechanism, not a template.
- **Measured win first.** Prove it on the read-only A/B harness (`npm run eval:algolia-raven`,
  `scripts/eval-algolia-raven.mjs`) before landing. A change that only helps its own case does not ship.
- **Lowest-risk rung.** Analytics read < rule/settings write < crawler/index write; the corpus also
  serves the real DocSearch frontend, so prefer reads and coordinate content-shaped changes upstream.
- **Record it like a fix.** Put the change, the A/B before/after, and the live re-check in the
  finding's `evidence`; keep any GitHub ref when a content/crawler cause also concerns the docs owner.
- **Never print or commit an Algolia key**, and never wire the operator keys into the `execute`
  sandbox — a model-invokable write is a gated side-effecting op, not a maintenance lever.

Analytics/usage keys are also a low-risk **evidence** source: real user query and no-result streams
quantify a finding's prevalence better than the eval corpus. Cite the analytics query and window.

## Upstream issue and PR follow-up

Use this loop when reviewing issues/PRs that were opened from findings, during drift refresh,
or when a user asks whether previous improvements were resolved.

1. Enumerate durable refs from frontmatter/evidence:
   - `rg -n "github.com/.+/(issues|pull)/" improvements`
   - include `reported-upstream` and non-fixed `verified` findings first, then fixed findings
     if a regression/recurrence is suspected.
2. Build a deterministic state table in a Solo scratchpad:

```
| finding | trigger evidence | upstream ref | ref state | PR checks/reviews | live re-check | action |
|---|---|---|---|---|---|---|
```

3. For each issue/PR, inspect current upstream state with the GitHub MCP tools or `gh`:
   title, open/closed/merged state, close reason, linked PRs/issues, latest maintainer
   comments, review decision, unresolved requested changes, failing checks, and last update.
   For PRs this repo opened, also check whether it needs author action, review response,
   rebase, CI fix, or abandonment.
4. Re-run the original trigger:
   - finding with `probe` frontmatter: `npm run improvements:probes` or a targeted equivalent.
   - eval-origin finding: use the stored transcript only to reconstruct the original claim,
     then re-run the smallest live `execute` or direct service call that can prove current
     upstream state.
   - drift-origin finding: compare the refreshed inventory/catalog/service response that
     originally exposed the gap.
5. Classify the outcome:
   - `fixed`: live trigger no longer reproduces; update status to `fixed-upstream`, add dated
     evidence, and note the resolving issue/PR.
   - `still-repro`: keep status, add a recurrence with date and evidence, and comment/follow up
     upstream if the ref claims to be fixed.
   - `closed-unfixed`: keep or return to `reported-upstream` while the GitHub ref remains in
     evidence, record why closure did not resolve it, and open a successor or follow-up ref
     only when the owner path is clear.
   - `superseded`: link the successor finding or upstream ref; do not stretch the old finding.
   - `inconclusive`: do not change status; record the missing evidence and create a Solo todo or
     timer for the next concrete check.
6. Regenerate and verify after edits:

```sh
npm run improvements:index
npm run improvements:lint
npm run improvements:lint -- --live
npm run improvements:probes
```

Use Solo timers for unresolved follow-up instead of memory. A timer body should include the
finding ids, upstream refs, scratchpad id, and the exact re-check to run.

## Probes and recurrences

Probe frontmatter is optional and shaped as:
`probe.type: http-text`, `probe.url`, and `probe.expect.status`, `contains`, or `excludes`.
Run `npm run improvements:probes` to re-check non-fixed findings with probes. A recurring hit should
be converted into a structured `recurrences` entry with a date and evidence; probe failures or
inconclusive results are review signals, not automatic status changes.

## Regeneration and lint

`improvements/INDEX.md` is generated. Never hand-edit it; run `npm run improvements:index`
after finding/frontmatter/status changes.
`npm run improvements:lint` is the gate. It fails when finding frontmatter is malformed, status/service
values are invalid, evidence or recurrence fields are missing, the generated index bytes differ from
the committed file, intake services do not cover the four collections exactly, an override points to a
missing finding id, a repo string is not `owner/repo`, or a finding cannot resolve to a repo, mixed
rule, or explicit unclear marker. `npm run improvements:lint -- --live` additionally checks each
distinct intake repo with GitHub and fails on stale, inaccessible, or redirected repo strings.

## Intake maintenance

When adding or renaming repos, update `improvements/intake.json`, keep repo strings canonical, and run
the live lint. Add per-finding overrides when the service rule is too broad. Leave intake unclear only
when the public owner is genuinely unknown; include the rule or reason so future agents understand why.

## Cadence

During eval rounds, file or update findings before closing the round. On drift-refresh days, run probes,
refresh statuses for upstream fixes with live evidence, and run live intake lint. Ad hoc edits to
findings, probes, or intake always end with index regeneration if needed and lint.

For broad cadence work, use the `truth-maintenance` skill as the coordinator: it creates the
Solo scratchpad/todo, fans out issue/PR, drift, eval, and golden reviewers, and reconciles the
lane verdicts before closeout.
