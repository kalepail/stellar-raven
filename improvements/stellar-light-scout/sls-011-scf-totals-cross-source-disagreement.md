---
id: sls-011
service: stellar-light-scout
status: verified
discovered: 2026-07-03
evidence:
  - live production execute 2026-07-03 (scout.searchProjects + lumenloop.get_project on slug lobstr; Solo scratchpad 521 follow-up, todo 826 comment 2224)
  - consumer-side workaround shipped: eval/qa/golden-overrides.json q-eco-lobstr-wallet graderNotes instruct not penalizing either figure
---

## Finding

Scout and Lumenloop disagree on the same project's total SCF funding with no
documented counting basis on either side: for slug `lobstr`, Scout reports
`scfTotalAwardedUSD: 232000` while Lumenloop reports
`scf: { awarded_round: [2, 17, 22], awarded_total: 267463 }`. A consumer (or
an eval golden) cannot know whether one source is stale, they count different
award sets (e.g. excluding one round type), or one is simply wrong. Filed under
scout because Scout exposes a bare total with no round breakdown — Lumenloop at
least shows its work; the reconciliation itself needs both owners.

## Evidence

Live 2026-07-03, production `execute` in a single script: both records fetched
in the same instant, figures as above ($35,463 apart, ~15%). Neither record
carries an as-of date or a basis note for the figure.

## Root cause (deep-verified 2026-07-03, todo 828)

The disagreement is structural, not a simple staleness bug: **no official
source publishes cumulative per-project SCF totals at all.** Official records
confirm LOBSTR/Ultra Stellar participation in exactly rounds 2, 17, and 22
(matching Lumenloop's round list), but published only ONE dollar amount ever
($88,000, SCF #22); SCF #2 was a percentage-of-XLM-pool award (17.9486%) with
no official USD value, and no SCF #17 amount was published. Both aggregator
totals are therefore in-house reconstructions sensitive to XLM→USD valuation
dates and name normalization (see also the LOBSTR-wallet vs 'Lobster' SCF #36
$109,000 name collision, and the Blend-vs-Script3-team scoping gap where the
team's cumulative take across YBX/Script3/Blend names far exceeds the
Blend-row figure).

## Recommendation

Cheapest first: (1) document each source's counting basis (rounds/award types
included, XLM valuation method and date) next to the figure; (2) expose the
per-round breakdown in Scout the way Lumenloop does, so consumers can
reconcile mechanically; (3) longer-term, the real fix is upstream of both
aggregators: SCF itself publishing per-award amounts (or explicit
"undisclosed" markers) would make totals computable instead of reconstructed.
Until then no consumer can hard-gate an SCF dollar amount — this repo's eval
goldens now treat all cumulative totals as reconstructions and instruct
graders that "no official cumulative figure exists" is the most correct
answer.
