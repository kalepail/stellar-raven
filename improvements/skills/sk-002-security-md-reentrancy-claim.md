---
id: sk-002
service: skills
status: verified
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - caused 1 baseline QA verdict in the 2026-07-03 round
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

`stellar-dev/smart-contracts/security.md:17` states self-reentrancy is
"possible but rarely exploitable". This contradicts the host's actual
forbid-any-reentry behavior, and caused 1 baseline QA verdict in the
2026-07-03 round.

## Evidence

2026-07-03 eval round results files above; the claim propagated into an agent
answer contradicted by host behavior.

## Recommendation

Correct the statement in the upstream skill source, or qualify it precisely
against the host's forbid-any-reentry behavior. Do NOT patch the mirror in this
repo.
