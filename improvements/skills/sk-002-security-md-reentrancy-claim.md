---
id: sk-002
service: skills
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - caused 1 baseline QA verdict in the 2026-07-03 round
  - Solo project 49, todo 822, comments 2204-2210
  - live re-verified 2026-07-06 (eval round todo 846): security.md still carries the verbatim "possible but rarely exploitable" self-reentrancy sentence, unqualified against the host's forbid-any-reentry behavior
  - upstream issue filed 2026-07-07: https://github.com/stellar/stellar-dev-skill/issues/46
  - fixed upstream in 2026-07-08 mirror sync: security.md now says the host blocks direct or indirect reentrant calls on normal cross-contract paths, while preserving the external-call boundary warning
  - upstream issue #46 closed completed 2026-07-09 after source proof was posted: https://github.com/stellar/stellar-dev-skill/issues/46#issuecomment-4930590461
recurrences:
  - date: 2026-07-03
    evidence: eval/qa/results/2026-07-03T16-06-45-variantA.json (q-soroban-reentrancy, partial); re-verified against rs-soroban-env source and docs reliable-negative on reentrancy.
  - date: 2026-07-07
    evidence: eval/qa/results/2026-07-07T19-58-35-variantA.json (q-soroban-reentrancy, partial); candidate copied the same security.md sentence while rs-soroban-env still prohibits normal reentry.
---

## Finding

`stellar-dev/smart-contracts/security.md:17` states self-reentrancy is
"possible but rarely exploitable". This contradicts the host's actual
forbid-any-reentry behavior, and caused 1 baseline QA verdict in the
2026-07-03 round.

## Evidence

2026-07-03 eval round results files above; the claim propagated into an agent
answer contradicted by host behavior.

Live re-check 2026-07-08: upstream `skills/smart-contracts/security.md` no
longer contains "possible but rarely exploitable". The mirrored file now says
`No reentrancy — the host blocks reentrant calls, direct or indirect, on normal
cross-contract paths`, matching the host behavior this finding asked for.

## Recommendation

Correct the statement in the upstream skill source, or qualify it precisely
against the host's forbid-any-reentry behavior. Do NOT patch the mirror in this
repo.
