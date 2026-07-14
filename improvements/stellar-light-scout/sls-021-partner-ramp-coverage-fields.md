---
id: sls-021
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live re-check 2026-07-14: mobile-money/off-ramp search returns Honey Coin with USDC/USDT and explicit ramp fields; resolving PR https://github.com/Stellar-Light/stellarlight/pull/493
  - live scout.getPartners query for mobile money plus off-ramp returned only Zeam
  - HoneyCoin partner row has empty assets, seps, and rampTypes fields
  - current HoneyCoin operator coverage and API documentation describe mobile-money and off-ramp capabilities across multiple markets
  - Solo scratchpad 575 GT-10 primary process 3230
  - live re-check 2026-07-13: GET https://stellarlight.xyz/api/partners?q=mobile%20money&ramps=off-ramp returns Honey Coin with on-ramp/off-ramp and USDC/USDT fields, so the omission no longer reproduces
---

## Finding

Scout's partner search and structured partner fields omit current HoneyCoin
mobile-money/off-ramp coverage. A live partner query for mobile money with an
off-ramp constraint returned only Zeam, while HoneyCoin's partner row contains
empty assets, SEPs, and rampTypes fields.

This is distinct from fixed findings sls-012 and sls-018. Those covered project
coverage fields and project-search ranking. The current gap is specifically in
partner records and partner filtering: HoneyCoin's project coverage is also
limited to Kenya even though current operator documentation describes broader
mobile-money, bank, and stablecoin rails.

## Evidence

On 2026-07-10, the read-only partner probe was:

    scout.getPartners({ q: "mobile money", ramps: "off-ramp" })

It returned Zeam and omitted HoneyCoin. The live HoneyCoin partner record had
no structured assets, SEPs, or rampTypes values. Current HoneyCoin operator
coverage/API pages describe business APIs, mobile-money and bank rails across
multiple markets, including stablecoin rails.

The audit does not infer that every HoneyCoin rail settles on Stellar. The
finding is narrower: Scout's partner record and partner search omit the
provider's documented ramp capability and therefore cannot surface it for
verification.

## Recommendation

Populate HoneyCoin's partner-level assets, rampTypes, countries/regions, and
asOf provenance from current operator records. Keep chain settlement and rail
type as separate fields so a mobile-money capability is not silently promoted
into a claim that every route settles on Stellar.

Add a regression probe for the query above. HoneyCoin should appear as a
candidate with explicit coverage freshness and a source link, while the result
should preserve any unverified Stellar-settlement caveat.
