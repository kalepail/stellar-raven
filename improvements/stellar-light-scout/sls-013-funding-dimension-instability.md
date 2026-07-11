---
id: sls-013
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live production execute 2026-07-03T18:34Z (scout.analyzeEcosystem dimension=funding; todo 829 skeptic sweep, Solo scratchpad 521)
  - prior live probes recorded in the golden corpus: 2026-06-22 and 2026-06-29 (grader notes of q-scf-total-distributed)
  - communityfund.stellar.org fetched same day (homepage + awards page)
  - live re-check 2026-07-06 (eval round todo 846): FIXED — analyzeEcosystem funding now ships computedAt + methodologyVersion:"funding-v2 (2026-07-05)" + a countBasis note, byRound populated with 41 real rounds, and the funnel carries an explicit scope string ("hackathon-linked projects only"); total $40,456,895.13 / 399 projects is ~0.7% off the 07-03 reading — normal re-indexing, not the prior unmarked swings
---

## Finding

The `analyze` funding dimension is unstable and internally inconsistent:

1. **The headline metric swings violently between indexings**:
   `scfTotalDistributedUSD` went ~$21.36M (2026-06-22) → ~$19.97M (06-29,
   −6.5%) → **$40,736,895 (07-03, +104%)**, with `scfAwardedProjects`
   223 → 400 in the same four days. Nothing in the response marks a
   methodology change, backfill, or recomputation.
2. **Advertised breakdowns are empty**: the same 07-03 response carries
   `byRound: []` and a `postHackathonStatusFunnel` of all-zeros with
   `Unknown: 890` — the per-round view a consumer would use to sanity-check
   the total is currently missing.
3. Cross-reference: SDF's own communityfund.stellar.org states "42M Awarded
   in XLM" / 656 awarded submissions (homepage) and 504 previously-awarded
   submissions (awards page) — today's recomputed ~$40.7M roughly agrees
   with SDF's 42M, suggesting the earlier ~$20M figures under-counted by
   about half.

## Evidence

Live `execute` probe 2026-07-03T18:34Z: `scfTotalDistributedUSD:
40736895.13`, `scfAwardedProjects: 400`, `meanAwardUSD: 101842`,
`byRound: []`, funnel zeros/`Unknown: 890`. Prior figures per the golden
corpus's dated re-verifications (06-22, 06-29). SCF site counters fetched
the same day. Consumer impact is concrete: this repo's eval golden pinned
the 06-29 snapshot as "the live snapshot" and was broken by the swing —
goldens now refuse to pin the metric at all (owned case
eval/qa/corpus/battery/scf-grants-builders/q-scf-total-distributed.json).

Fixed upstream: the 2026-07-06 live re-check found all three recommendations
implemented (methodology/recomputation marker, populated byRound, documented
count basis plus an explained funnel scope), with only ~0.7% residual drift in
the headline total.

## Recommendation

(1) Stamp the funding dimension with a methodology/recomputation marker
(e.g. `computedAt` + `methodologyVersion`) so consumers can distinguish
drift from re-indexing from methodology change; (2) fix or remove the empty
`byRound` and zeroed funnel rather than shipping placeholders — an empty
breakdown next to a headline total reads as "no rounds", not "not
computed"; (3) document the intended count basis (distinct projects vs
awarded submissions) against SDF's own 504/656 counters. Until then no
consumer can safely quote the metric without attaching date + source label.
