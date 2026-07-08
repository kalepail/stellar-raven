---
name: improvements-pipeline
description: Maintain the improvements/ upstream-findings pipeline for stellar-raven-codemode. Use when filing or updating service-improvement findings, resolving intake targets, maintaining improvements/intake.json, interpreting improvements lint failures, running recurrence probes, regenerating improvements/INDEX.md, or handling eval-round and drift-refresh improvement maintenance.
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
