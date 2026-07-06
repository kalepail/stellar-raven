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
  - eval/qa/results/2026-07-03T16-06-45-variantA.json (q-soroban-deploy-cli, partial) — recurred; live skill.read of build-deploy-invoke still serves wasm32-unknown-unknown while live docs say wasm32v1-none (Solo scratchpad 521)
  - live re-verified 2026-07-06 (eval round todo 846): skill.read of build-deploy-invoke still serves wasm32-unknown-unknown twice (build comment + deploy --wasm path), zero occurrences of wasm32v1-none
  - recurred in the 2026-07-06 QA round: eval/qa/results/2026-07-06T18-48-22-variantA.json (q-soroban-deploy-cli, partial; verdict-review workflow wf_01b3347d-1b8) — live re-probe confirmed wasm32-unknown-unknown still in SKILL.md build/deploy plus development.md and testing.md while developers.stellar.org uniformly says wasm32v1-none (8/8 search hits; rust-dialect page: wasm32-unknown-unknown "not supported" on Rust 1.82+)
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
