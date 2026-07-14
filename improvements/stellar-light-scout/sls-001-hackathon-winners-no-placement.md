---
id: sls-001
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live re-check 2026-07-14: ordinal winners carry placement labels and numeric ranks 1-5; resolving PR https://github.com/Stellar-Light/stellarlight/pull/219
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - live-lane case q-live-hackathon-recent-winners (wrong verdict caused by this)
  - live re-execution against local server confirmed no placement fields
  - Solo project 49, todo 822, comments 2204-2210
  - "2026-07-03 afternoon re-check: live probe of ALL 11 completed hackathons via production execute — winner entries now carry hackathonPlacement + placementRank (Solo todo 824, comment 2216)"
  - live re-verified 2026-07-06 (eval round todo 846): no regression — stellar-agents-x402-stripe-mpp winners carry hackathonPlacement "1st Place".."5th Place" with placementRank 1..5
---

## Finding

The hackathon detail endpoint returned winner lists WITHOUT placement fields, but
in an order agents universally read as ranking. An eval agent asserted 1st-5th
place from the array order, producing a wrong verdict in the live lane
(`q-live-hackathon-recent-winners`).

**FIXED UPSTREAM (re-checked 2026-07-03, same day, afternoon):** winner entries
now carry `hackathonPlacement` (e.g. "1st Place") and `placementRank` (1..n) on
ordinal events. All 11 completed events probed live; every winner-bearing event
carries `hackathonPlacement`. The half of the recommendation about marking
non-ordinal arrays as unordered remains open — split out as the narrower
**sls-005** (tier-labeled events return `hackathonPlacement: "Winners"` with
`placementRank: null` and an unordered array).

## Evidence

Wrong verdict in the 2026-07-03 eval round (results files above). Live
re-execution that morning confirmed the response carried no placement data —
only an ordered array. Afternoon re-check (production `execute`, all completed
events): `stellar-agents-x402-stripe-mpp`, `scaffoldstellar`,
`stellar-hacks-kale-reflector`, `stellar-hacks-paltalabs`, `stellar-hacks-blend`,
`build-on-stellar` all return ordinal labels with numeric `placementRank`.

## Recommendation

Done upstream for ordinal events. Residual ordering ambiguity on tier-labeled
events tracked as sls-005.
