---
id: sk-003
service: skills
status: proposed
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - needs live adjudication against a live RPC
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

`stellar-dev/data/SKILL.md` (~lines 177, 365, 389, 409) claims getLedgers
supports "Infinite Scroll back to genesis". This repo's eval golden claims
bounded retention. Exactly one of the two is stale; it has not yet been
adjudicated which.

## Evidence

Conflict surfaced in the 2026-07-03 eval round (results files above). Not yet
live-verified — hence status: proposed.

## Recommendation

Verify against a live RPC and fix whichever side is wrong:

- If retention is bounded: fix the upstream skill source (all four line sites).
- If the skill is right (scroll to genesis works): the fix belongs in this
  repo's eval golden instead — file that as a Solo todo, and record the outcome
  here before closing this finding.

Do NOT patch the mirror in this repo either way.
