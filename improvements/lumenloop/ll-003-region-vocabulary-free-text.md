---
id: ll-003
service: lumenloop
status: proposed
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - live-lane case q-live-ll-regions-vocab (passes on behavior; drift recurring)
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

Region vocabulary is free-text rather than a controlled list. The live-lane eval
case `q-live-ll-regions-vocab` currently passes on behavior, but the vocabulary
drifts recurringly, which makes region-scoped queries and drift gates fragile.

## Evidence

Recurring drift observed across eval rounds; tracked via the live-lane case above
and the 2026-07-03 results files.

## Recommendation

Publish a canonical region enum (and validate/normalize incoming region values
against it), so consumers can filter deterministically.
