---
id: sls-002
service: stellar-light-scout
status: proposed
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

Some SCF award entries carry null amounts — e.g. Liqvid.xyz is marked awarded
with amount null. Null is a legitimate value here, but it is ambiguous between
"undisclosed" and "missing data", which invites downstream guessing.

## Evidence

Observed in the 2026-07-03 eval round (results files above).

## Recommendation

Add an explicit "amount undisclosed" marker (or equivalent enum/flag) so
consumers can distinguish undisclosed awards from data gaps instead of guessing.
