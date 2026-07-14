---
id: sls-027
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live re-check 2026-07-14: Phoenix reports $394,500 and awarded rounds 16, 20, and 25 while excluding not-awarded rounds 18 and 24; resolving PR https://github.com/Stellar-Light/stellarlight/pull/490
  - live Scout Phoenix record reports 394500 but awarded-round membership includes rounds 18 and 24
  - official Phoenix SCF project page exposes seven submission cards, four Awarded and three Not Awarded
  - live Lumenloop Phoenix SCF response returns the same four awarded rows and 394500 total
  - Solo scratchpad 575 GT-16 primary process 3244 and blind process 3245
  - live re-check 2026-07-13: https://stellarlight.xyz/api/projects/search?q=Phoenix&limit=20 returns scfAwardedRounds [16,20,25], excluding the prior false memberships in rounds 18 and 24
---

## Finding

Scout's Phoenix total is correct, but its awarded-round membership is not.
The official SCF project page shows seven submissions and exactly four awards:
SCF #16 ($150K), #20 ($100K), #25 ($94.5K), and one Q1-2024
Liquidity Award ($50K), totaling $394.5K. SCF #18 and #24 are explicitly Not
Awarded, as is the other Q1-2024 liquidity submission.

The Scout record preserves the $394.5K total but includes #18 and #24 in its
awarded-round list. A consumer using the aggregate and membership together
therefore reports two official non-awards as wins.

## Evidence

Two independent GT-16 lanes fetched the official Phoenix project page and
live directory records on 2026-07-10. Lumenloop returned the same four awarded
entries and total as the official row statuses. The mismatch is isolated to
Scout's award membership, not Phoenix identity or the cumulative amount.

## Recommendation

Derive awarded-round membership from row status rather than project
association. Expose all submissions separately from awarded submissions, with
status, amount, award type, source URL, and as-of date.

Add a Phoenix regression fixture: seven total submissions, four Awarded,
three Not Awarded, awarded total $394.5K. Rounds 18 and 24 must never appear in
the awarded-round array.
