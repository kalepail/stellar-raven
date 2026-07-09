---
id: ll-003
service: lumenloop
status: verified
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - live-lane case q-live-ll-regions-vocab (passes on behavior; drift recurring)
  - Solo project 49, todo 822, comments 2204-2210
  - live re-verified 2026-07-06 (eval round todo 846): get_regions → 95 free-text values with duplicate casings/synonyms ('africa'/'Africa', 'mena'/'MENA', 'latam' vs 'Latin America & Caribbean') — still no canonical enum
  - live re-verified 2026-07-09: authenticated get_regions returned 95 values and the duplicate case pairs africa/Africa, asia/Asia, global/Global, and mena/MENA
recurrences:
  - date: 2026-07-09
    evidence: authenticated POST /v1/tools/get_regions returned count 95 with four case-insensitive duplicate pairs (africa/Africa, asia/Asia, global/Global, mena/MENA)
probe:
  type: http-text
  url: https://api.lumenloop.com/v1/tools/get_regions
  method: POST
  authEnv: LUMENLOOP_API_KEY
  body: '{}'
  expect:
    status: 200
    contains:
      - '"africa"'
      - '"Africa"'
      - '"mena"'
      - '"MENA"'
---

## Finding

Region vocabulary is free-text rather than a controlled list. The live-lane eval
case `q-live-ll-regions-vocab` currently passes on behavior, but the vocabulary
drifts recurringly, which makes region-scoped queries and drift gates fragile.

## Evidence

Recurring drift observed across eval rounds; tracked via the live-lane case above
and the 2026-07-03 results files. The 2026-07-09 authenticated recurrence returned
95 values and reproduced four capitalization-only duplicate pairs.

## Recommendation

Publish a canonical region enum (and validate/normalize incoming region values
against it), so consumers can filter deterministically.
