---
id: sls-001
service: stellar-light-scout
status: verified
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - live-lane case q-live-hackathon-recent-winners (wrong verdict caused by this)
  - live re-execution against local server confirmed no placement fields
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

The hackathon detail endpoint returns winner lists WITHOUT placement fields, but
in an order agents universally read as ranking. An eval agent asserted 1st-5th
place from the array order, producing a wrong verdict in the live lane
(`q-live-hackathon-recent-winners`).

## Evidence

Wrong verdict in the 2026-07-03 eval round (results files above). Live
re-execution confirmed the response carries no placement data — only an ordered
array.

## Recommendation

Either add explicit placement data to winner entries, or mark the array as
unordered in the response and/or docs so consumers cannot mistake order for rank.
