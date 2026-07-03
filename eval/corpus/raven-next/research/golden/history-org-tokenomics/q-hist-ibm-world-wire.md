---
id: q-hist-ibm-world-wire
q: "What was IBM World Wire and how did it use Stellar?"
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "IBM World Wire was an IBM cross-border payments / settlement network built on the Stellar network.", weight: 5 }
  - { claim: "It used Stellar for near-real-time international payment settlement, optionally via stablecoins/digital assets.", weight: 3 }
should_have:
  - { claim: "It launched into limited/early production around 2019 (after a 2017 pilot), reaching dozens of countries.", weight: 2 }
nice_to_have:
  - { claim: "Notes World Wire was wound down / activity declined in later years.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim IBM World Wire was built on Ripple/XRP or on a non-Stellar blockchain.", weight: 5 }
  - { claim: "Do NOT invent a launch year far off (e.g. claim it launched in 2014 or 2022).", weight: 2 }
must_cite:
  - "A reputable dated source on IBM World Wire (IBM/PR or news coverage)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.prnewswire.com/news-releases/ibm-blockchain-world-wire-a-new-global-payment-network-to-support-payments-and-foreign-exchange-in-more-than-50-countries-300813674.html
  - https://stellar.org/blog/ecosystem/why-ibm-built-world-wire-on-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "World Wire: pilot ~Oct 2017, limited production across 50+ countries announced March 18, 2019 (PRNewswire + stellar.org). The 'built on Stellar not Ripple' point is the key trap. Verified 2026-06-22."
---

## Reference answer (gospel)

- **IBM World Wire** (later IBM Blockchain World Wire) was an IBM **cross-border payments / settlement network built on the Stellar network** [1][2].
- It used Stellar for **near-real-time international payment settlement**, optionally clearing through stablecoins / digital assets [1][2].
- It moved into **limited/early production across 50+ countries** around **March 2019** (announced March 18, 2019), after an earlier pilot (~2017) [1].
- Activity declined in later years [2].
- Trap to avoid: attributing World Wire to **Ripple/XRP** or a non-Stellar chain — it ran on **Stellar** [2].

- [1] prnewswire.com/news-releases/ibm-blockchain-world-wire-a-new-global-payment-network...
- [2] stellar.org/blog/ecosystem/why-ibm-built-world-wire-on-stellar

## Why these cards (routing rationale)

A partner-product history (IBM) → general-web `perplexity_search` / `parallel_search`; `scout_research`
acceptable if Stellar case studies surface.

## Edge / traps

Trap: attributing World Wire to Ripple/XRP. It ran on Stellar.
