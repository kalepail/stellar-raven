---
id: ll-001
service: lumenloop
status: verified
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - live re-execution against local server confirmed slug/content mismatch
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

Weekly-roundup canonical slugs mismatch their content dates. The research doc for
"week of May 29, 2026" lives at slug `stellar-weekly-roundup-week-29-2026`, which
reads as "week 29". Readers — including an eval judge — parsed a citation to it as
fabricated because the slug's week number does not correspond to the content's date.

## Evidence

Surfaced in the 2026-07-03 eval round (results files above); the judge flagged the
citation as fabricated purely from the slug. Live re-execution against the local
server confirmed the doc's content is the week of May 29, 2026 while the slug says
week 29.

## Recommendation

The slug or item metadata should carry the actual week date (e.g. an explicit
`week_of: 2026-05-29` field, or date-based slugs), so citations to roundups are
verifiable without fetching the body.
