---
id: q-eco-pyusd-stellar-freshness
q: "Is PayPal's PYUSD live on Stellar, and when did it launch?"
category: defi-ecosystem
subcategory: stablecoins
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: easy
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [lumenloop_find_content_by_entity]
acceptable_cards: [lumenloop_search_content_semantic, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Confirms PayPal's PYUSD launched on Stellar in September 2025 (around Sep 18, 2025), citing a dated source.", weight: 5 }
should_have:
  - { claim: "Attributes PYUSD to PayPal and frames it as part of the issuer-led stablecoin set on Stellar.", weight: 3 }
nice_to_have:
  - { claim: "Notes the Sep 2025 launch was part of a cluster of RWA/stablecoin launches around Meridian 2025.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assign the wrong issuer or wrong launch date, or claim PYUSD is not on Stellar.", weight: 5 }
  - { claim: "Do NOT assert a current circulating/supply figure without a dated source and staleness caveat.", weight: 3 }
must_cite:
  - "A dated source for PYUSD on Stellar (Sep 2025)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/paypal-pyusd-is-now-available-on-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "FRESHNESS + entity. Verified: PayPal's PYUSD launched on Stellar Sep 18, 2025 (SDF press), part of the Sep-2025 RWA/stablecoin cluster around Meridian 2025. Issuer = PayPal (with Paxos). Any circulating/supply figure is volatile — gate on a dated source + staleness caveat."
---

## Reference answer (gospel)

**Yes — PayPal's PYUSD is live on Stellar.** It launched on Stellar on **September 18, 2025**
[stellar.org/press/paypal-pyusd-is-now-available-on-stellar]. PYUSD is **PayPal's** USD stablecoin
(issued with Paxos), and on Stellar it joins the **issuer-led stablecoin set** (USDC/EURC by Circle,
BENJI by Franklin Templeton). The Sep-2025 launch was part of a **cluster** of RWA/stablecoin launches
around **Meridian 2025**. Any current circulating/supply figure is **freshness-sensitive** — cite a
dated source and flag staleness rather than asserting a number. Don't assign the wrong issuer/date or
claim PYUSD is not on Stellar.

## Why these cards (routing rationale)

Entity-grounded recent fact → `lumenloop_find_content_by_entity`; semantic/general-web acceptable for the dated launch.

## Edge / traps

Right issuer (PayPal) + right date (Sep 18 2025); flag any volatile supply figure.
