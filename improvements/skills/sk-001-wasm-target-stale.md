---
id: sk-001
service: skills
status: verified
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - caused 2 baseline QA verdicts in the 2026-07-03 round
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

`stellar-dev/smart-contracts` still instructs the stale build target
`wasm32-unknown-unknown`: SKILL.md lines ~137 and ~145, plus `development.md`
and `testing.md`. The current CLI target is `wasm32v1-none`. This caused 2
baseline QA verdicts in the 2026-07-03 round.

## Evidence

2026-07-03 eval round results files above; the stale target propagated directly
into agent answers.

## Recommendation

Update the upstream skill source (SKILL.md, development.md, testing.md) to
`wasm32v1-none`. Do NOT patch the mirror in this repo — the fix belongs in the
upstream skill source.
