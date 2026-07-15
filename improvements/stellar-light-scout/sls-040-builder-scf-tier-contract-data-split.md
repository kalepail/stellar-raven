---
id: sls-040
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live getBuilders returned 114 profiles and all 114 scfTier values were blank
  - live OpenAPI and wrapper implementation expose q, location, and skill but not scfTier
  - operation descriptions and README still advertise SCF-tier or award-track recruiting
  - unknown scfTier input was ignored and returned the same unfiltered result
  - upstream issue filed 2026-07-13: https://github.com/Stellar-Light/stellarlight/issues/521
  - Solo scratchpad 575 GT-35 primary 3287 and blind 3289
  - 2026-07-14 live unknown scfTier still returns HTTP 200 unfiltered; follow-up https://github.com/Stellar-Light/stellarlight/issues/521#issuecomment-4971409043
  - 2026-07-15 live recheck on spec 1.7.26 found no scfTier field on 118 builder rows and GET /api/builders?scfTier=top returned HTTP 400; upstream resolution https://github.com/Stellar-Light/stellarlight/issues/521#issuecomment-4974457684
---

## Finding

Scout presents mutually incompatible builder contracts. Descriptions and the
README advertise SCF-tier/award-track filtering, but the callable surface omits
the parameter, every live value is blank, and an unknown `scfTier` argument is
silently ignored. Consumers can therefore present an unfiltered 114-person
directory as a high-SCF-tier advisor roster. Project award history, person-level
attribution, and Verified-Member governance roles are also distinct concepts.

## Recommendation

Either restore a typed, populated, provenance-bearing field with explicit
semantics, or remove `scfTier` and all advisor/award-track claims from every
description and README. Reject unknown parameters. If award history is added,
link each person to dated official project records and state the attribution
method; do not reuse governance tiers.
