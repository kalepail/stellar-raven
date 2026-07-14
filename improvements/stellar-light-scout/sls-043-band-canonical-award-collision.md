---
id: sls-043
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live re-check 2026-07-14: Band search returns one canonical row with $60,000 and round 16; resolving PR https://github.com/Stellar-Light/stellarlight/pull/498
  - Scout band-protocol row points canonicalSlug band and reports SCF #16 / $60K
  - Scout canonical band row reports SCF #41 / $100K
  - official Band Protocol project record reports one SCF #16 award, $60K awarded and paid
  - 2026-07-11 live re-check: scout.searchProjects(q=Band) returns one canonical band row with scfTotalAwardedUSD=60000 and the 1.7.15 changelog identifies the SCF #16 correction
  - Solo scratchpad 575 GT-37 primary 3296 and blind 3298
---

## Finding

Scout exposes two canonically linked Band identities with opposite SCF histories.
The alias row matches the authoritative project record ($60K, SCF #16), while the
canonical row reports $100K and SCF #41 without matching official support. A caller
following canonicalSlug can therefore replace the correct award with the wrong one.

## Recommendation

Merge award membership only from source-bearing official rows, expose alias lineage
and conflicting-source status, and add a Band regression fixture requiring SCF #16,
$60K awarded/paid. Never silently promote the canonical row over a contradictory
official project record.
