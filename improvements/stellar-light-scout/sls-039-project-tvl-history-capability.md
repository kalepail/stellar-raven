---
id: sls-039
service: stellar-light-scout
status: declined-upstream
disposition: Accept provider-hosted history as the upstream design boundary; keep consumer guidance directing trend and peak questions to tvlMethodUrl and do not request duplicated in-API history without new evidence.
discovered: 2026-07-10
evidence:
  - Scout project rows expose tvlUSD and tvlAsOf but not a history or method URL
  - direct same-provider Blend/Soroswap series distinguish current, quarter trend, peak, and record
  - Solo scratchpad 575 GT-23 primary 3264 and blind 3267
  - upstream issue filed 2026-07-13: https://github.com/Stellar-Light/stellarlight/issues/522
  - upstream issue closed completed 2026-07-14 after exposing llamaSlugs, tvlMethodUrl, and methodology while explicitly leaving history at the provider
---

## Finding

Scout's project-level `tvlUSD`/`tvlAsOf` point is useful but cannot answer a
trend question or distinguish current, quarter start/end, quarter peak, and
record. It also lacks an answer-visible provider/method URL sufficient to
reconcile its point with concurrent external reads. Borrowed, pool/backstop,
fees, and volume can be mistaken for additive TVL.

This extends the methodology problem in sls-031 and is distinct from sls-038's
missing ecosystem-analyze TVL response: the project row exists, but its history
and metric decomposition do not.

## Recommendation

Expose provider and methodology URL, inclusion set, refresh time, compact
history or current/period-start/period-peak/record fields, and distinct metric
classes for base TVL, borrowed, pool/backstop, fees, and volume. Add Blend and
Soroswap regression fixtures that prevent metric addition and current/peak
conflation.
