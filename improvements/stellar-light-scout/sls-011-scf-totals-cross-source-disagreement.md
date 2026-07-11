---
id: sls-011
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live production execute 2026-07-03 (scout.searchProjects + lumenloop.get_project on slug lobstr; Solo scratchpad 521 follow-up, todo 826 comment 2224)
  - consumer-side workaround shipped in the golden for q-eco-lobstr-wallet: grader notes instruct not penalizing either figure (owned case eval/qa/corpus/battery/defi-ecosystem/q-eco-lobstr-wallet.json)
  - live re-verified 2026-07-06 (eval round todo 846): lobstr still Scout $232,000 (scfAmountStatus:"disclosed") vs Lumenloop $267,463 — same $35,463 gap, same rounds [2,17,22], still no basis note on either figure; partial improvement: Scout now exposes scfAwardedRounds:[2,17,22], but no per-round dollars
  - upstream issue filed 2026-07-07: https://github.com/Stellar-Light/stellar-scout/issues/1
  - "fixed upstream and live re-verified 2026-07-09T13:01Z after Stellar-Light/stellar-scout#1 closure: GET https://stellarlight.xyz/api/projects/search?q=lobstr&limit=5 returns LOBSTR with scfTotalAwardedUSD:232000, scfAwardedRounds:[2,17,22], and meta.scfCountBasis explaining totals are in-house reconstructions and should reconcile on rounds; GET https://stellarlight.xyz/api/analyze?dimension=funding returns funding.countBasis plus byRound entries for rounds 2, 17, and 22"
  - 2026-07-10 GT-14 re-check corrected the finding's own overgeneralization: the current official Blend SCF project payload publishes totalAwarded=50000 and totalPaid=50000 for its Q1-2024 Liquidity Award; historical/aggregated projects still require basis reconciliation
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

Live re-check 2026-07-09T13:01Z after upstream issue
`Stellar-Light/stellar-scout#1` was closed:

- `GET https://stellarlight.xyz/api/projects/search?q=lobstr&limit=5` returns
  LOBSTR with `scfTotalAwardedUSD:232000`, `scfAwardedRounds:[2,17,22]`, and
  `scfAmountStatus:"disclosed"`. The response `meta.scfCountBasis` now says
  dollar totals are in-house reconstructions because SCF does not publish all
  per-award amounts, and that consumers should reconcile on
  `scfAwardedRounds`.
- `GET https://stellarlight.xyz/api/analyze?dimension=funding` returns
  `funding.countBasis`, `methodologyVersion:"funding-v2 (2026-07-05)"`, and
  `funding.byRound` entries for the recorded LOBSTR rounds: round 2
  `count:1,totalUSD:77333`, round 17 `count:12,totalUSD:1185546`, and round 22
  `count:19,totalUSD:801698`.

The Scout total still differs from the recorded Lumenloop total
(`awarded_total:267463`), but the live Scout response now exposes the basis and
round-membership reconciliation fields that were missing from the original
finding.

## Root cause (deep-verified 2026-07-03, todo 828)

The LOBSTR disagreement is structural, not a simple staleness bug. Official
historical records confirm LOBSTR/Ultra Stellar participation in exactly
rounds 2, 17, and 22 (matching Lumenloop's round list), but published only one
dollar amount ($88,000, SCF #22); SCF #2 was a percentage-of-XLM-pool award
(17.9486%) with no official USD value, and no SCF #17 amount was published.
Those aggregator totals are therefore reconstructions sensitive to XLM→USD
valuation dates and name normalization (including the LOBSTR-wallet vs
'Lobster' SCF #36 name collision).

This limitation is **not universal across all current SCF project pages**. A
2026-07-10 primary re-check of Blend's current official project payload found
`totalAwarded=50000` and `totalPaid=50000` for its Q1-2024 Liquidity Award.
Consumers must distinguish an official, project-scoped published total from a
historical reconstruction and must keep predecessor/team lineage separate.

## Recommendation

Cheapest first: (1) document each source's counting basis (official published
project total versus reconstruction, rounds/award types
included, XLM valuation method and date) next to the figure; (2) expose the
per-round breakdown in Scout the way Lumenloop does, so consumers can
reconcile mechanically; (3) longer-term, the real fix is upstream of both
aggregators: SCF itself publishing per-award amounts (or explicit
"undisclosed" markers) would make totals computable instead of reconstructed.
Consumers may use an official published total when its project scope, source,
and as-of date are explicit; reconstructed totals remain non-gating unless
their valuation/counting basis is disclosed.
