---
id: sk-001
service: skills
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - caused 2 baseline QA verdicts in the 2026-07-03 round
  - Solo project 49, todo 822, comments 2204-2210
  - live re-verified 2026-07-06 (eval round todo 846): skill.read of build-deploy-invoke still serves wasm32-unknown-unknown twice (build comment + deploy --wasm path), zero occurrences of wasm32v1-none
  - upstream remediation filed 2026-07-07: https://github.com/stellar/stellar-dev-skill/issues/44; https://github.com/stellar/stellar-dev-skill/pull/45 updates the source skill to `wasm32v1-none`, removes `--global`, and switches examples to canonical `--source-account`.
  - live re-check 2026-07-14: upstream SKILL.md contains wasm32v1-none four times, contains no wasm32-unknown-unknown or --global, and retains --source-account; resolving PR https://github.com/stellar/stellar-dev-skill/pull/45 remains merged
  - fixed upstream and refreshed locally 2026-07-07: PR #45 merged at stellar-dev-skill commit 3d75a157f6fe; `ecosystem-skills/update.sh` now pins `stellar-dev` to that commit.
recurrences:
  - date: 2026-07-03
    evidence: eval/qa/results/2026-07-03T16-06-45-variantA.json (q-soroban-deploy-cli, partial); live skill.read still served wasm32-unknown-unknown while live docs said wasm32v1-none.
  - date: 2026-07-06
    evidence: eval/qa/results/2026-07-06T18-48-22-variantA.json (q-soroban-deploy-cli, partial); live re-probe found stale target in SKILL.md build/deploy plus development.md and testing.md.
  - date: 2026-07-07
    evidence: eval/qa/results/2026-07-07T19-58-35-variantA.json (q-soroban-deploy-cli, partial); transcript sourced target/wasm32-unknown-unknown/release/*.wasm from skill.read before upstream PR #45 landed.
probe:
  type: http-text
  url: https://raw.githubusercontent.com/stellar/stellar-dev-skill/main/skills/smart-contracts/SKILL.md
  expect:
    status: 200
    contains:
      - wasm32v1-none
    excludes:
      - wasm32-unknown-unknown
---

## Finding

The upstream `stellar-dev/smart-contracts` skill instructed the stale build
target `wasm32-unknown-unknown`: SKILL.md lines ~137 and ~145, plus
`development.md` and `testing.md`. The current CLI target is `wasm32v1-none`.
This caused 2 baseline QA verdicts in the 2026-07-03 round. The local Raven
demo and QA goldens now guard against repeating the stale example, and the
mirrored skill has been refreshed from the fixed upstream source.

## Evidence

2026-07-03 eval round results files above; the stale target propagated directly
into agent answers. The 2026-07-07 local mitigation was verified by regenerating
the demo and QA cases, then scanning the local non-mirror changes for the
canonical command forms. Upstream issue #44 and PR #45 carried the source-skill
fix, and the mirror was refreshed through the normal sync path.

## Recommendation

No further upstream action is needed for this finding. Keep the QA overrides as
freshness/canonicalization guards; future syncs should preserve the fixed
`wasm32v1-none`, no-`--global`, `--source-account` examples.
