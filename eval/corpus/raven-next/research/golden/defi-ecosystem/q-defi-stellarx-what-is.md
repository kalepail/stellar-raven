---
id: q-defi-stellarx-what-is
q: "What is StellarX and is it built by the Stellar Development Foundation?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [lumenloop_find_content_about_project, scout_projects]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "StellarX is a decentralized trading platform / front-end built on the Stellar network, giving access to the Stellar DEX and AMM pools.", weight: 5 }
  - { claim: "It is NOT built by the Stellar Development Foundation — it is built by Ultra Stellar (the team behind LOBSTR / StellarTerm).", weight: 4 }
should_have:
  - { claim: "It is a trading UI / wrapper, not a DEX aggregator (contrast with Soroswap).", weight: 3 }
nice_to_have:
  - { claim: "Notes it connects a user wallet to buy/sell Stellar tokens and access AMM pools.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim StellarX is built by the Stellar Development Foundation.", weight: 4 }
  - { claim: "Do NOT claim StellarX is a DEX aggregator, a lending protocol, or an oracle.", weight: 4 }
  - { claim: "Do NOT assert StellarX has been shut down — no source confirms a shutdown.", weight: 3 }
must_cite:
  - "A source identifying StellarX as a Stellar trading platform/UI by Ultra Stellar."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/stellarx
  - https://stellarlight.xyz/project/ultra-stellar
  - https://www.stellarx.com/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Per-project identity → lumenloop_get_project. Sponsor now grounded: StellarX is built by Ultra Stellar (NOT the SDF), the same team behind LOBSTR and StellarTerm. It is a decentralized trading platform/UI with AMM access — not an aggregator. No source confirms a shutdown."
---

## Reference answer (gospel)

**StellarX** is a **decentralized trading platform / front-end built on Stellar**, letting users trade
a wide range of assets directly from their wallets, with access to the Stellar DEX and **AMM pools**
[Scout: stellarlight.xyz/project/stellarx; stellarx.com]. **No — it is not built by the SDF.** It is
built by **Ultra Stellar**, the same team behind the **LOBSTR** wallet and **StellarTerm**. It is a
**trading UI**, not a DEX aggregator (contrast Soroswap), and there is no source confirming a shutdown.

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`.

## Edge / traps

The graded trap: attributing StellarX to the SDF (it's Ultra Stellar). Don't claim aggregator status or
a shutdown.
