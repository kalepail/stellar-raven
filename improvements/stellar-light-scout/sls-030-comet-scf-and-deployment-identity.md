---
id: sls-030
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live re-check 2026-07-14: Comet reports $291,000, rounds 13 and 18, inactive status, and its embedded Blend-backstop lifecycle; resolving PR https://github.com/Stellar-Light/stellarlight/pull/490
  - live Scout Comet record reported scfAwarded false
  - official SCF pages show Comet Awarded 150000 in round 13 and 141000 in round 18
  - mainnet Blend backstop contract/interface verifies a live Comet-derived weighted pool
  - Solo scratchpad 575 GT-15 primary process 3243 and independent blind process 3246
  - live re-check 2026-07-13: https://stellarlight.xyz/api/projects/search?q=Comet&limit=5 returns Inactive, scfAwarded true, $291,000, rounds 13 and 18, plus the embedded Blend backstop lifecycle note
---

## Finding

Scout's Comet record reports `scfAwarded: false` and does not represent the
project's current embedded deployment identity. Official SCF pages show two
awards—$150,000 in round 13 and $141,000 in round 18. Separately, current Blend
deployment documentation and a mainnet contract/interface read show Comet's
weighted-pool implementation live as Blend's 80/20 BLND:USDC backstop.

The standalone Comet repo/frontend are stale, so simply changing the row to
"Live DEX" would also be wrong. The record needs to represent a funded
historical project whose implementation now serves embedded infrastructure,
without implying a current major standalone venue.

## Evidence

Two independent GT-15 lanes fetched the official award pages and current
Scout/Lumenloop records on 2026-07-10. The blind lane additionally fetched the
mainnet backstop contract, matched its deployed code/interface, and observed
weighted-pool join/exit and swap functions.

## Recommendation

Correct the SCF fields and split project lifecycle from implementation reuse:

- awarded rounds 13 and 18, with row amounts and sources;
- reconstructed project total $291,000 with basis/as-of;
- standalone product/repo lifecycle;
- embedded deployment record linking Comet implementation to Blend backstop;
- no standalone TVL/volume inference from the embedded contract.

Add a Comet regression fixture that forbids both `scfAwarded:false` and a
blanket "major live standalone DEX" interpretation.
