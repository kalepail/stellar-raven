---
id: q-hist-paxos-pyusd-usdg
q: "Did Paxos integrate with Stellar, and which stablecoins did it bring?"
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
  - { claim: "Paxos announced an integration that brings Paxos-issued stablecoins to Stellar.", weight: 5 }
should_have:
  - { claim: "The integration makes stablecoins such as PYUSD (PayPal USD) and USDG available on Stellar.", weight: 3 }
  - { claim: "It was announced around late 2024 (e.g. at Meridian 2024).", weight: 1 }
nice_to_have:
  - { claim: "Paxos is a regulated stablecoin issuer (also issues USDP, BUSD historically).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim PYUSD is a Stellar-issued or SDF-issued token — it is issued by Paxos (for PayPal).", weight: 3 }
  - { claim: "Do NOT deny the Paxos x Stellar integration exists.", weight: 3 }
must_cite:
  - "A reputable dated source on Paxos x Stellar (stellar.org press or news)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/paxos-plans-expansion-to-stellar-network-in-collaboration-with-stellar-development-foundation
  - https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21581.html
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Paxos x Stellar announced at Meridian 2024 (Oct 16, 2024, stellar.org press). Paxos issues USDG (Global Dollar) and PYUSD (PayPal USD) — corroborated by Visa's July 2025 release naming Paxos as the issuer of USDG/PYUSD. PYUSD-issuer trap (Paxos, not Stellar/SDF). Verified 2026-06-22."
---

## Reference answer (gospel)

- Yes — **Paxos announced an integration** (at **Meridian 2024**, ~October 16, 2024) to expand its tokenization platform to **Stellar** [1].
- It brings **Paxos-issued stablecoins** to Stellar, notably **USDG (Global Dollar)** and **PYUSD (PayPal USD)** [1][2].
- Paxos is a **regulated stablecoin issuer** (historically also USDP / BUSD) [2].
- Trap to avoid: claiming **PYUSD is a Stellar/SDF-issued token** — it is **issued by Paxos** (for PayPal); and don't deny the integration exists [1][2].

- [1] stellar.org/press/paxos-plans-expansion-to-stellar-network...
- [2] usa.visa.com/about-visa/newsroom/press-releases.releaseId.21581.html (names Paxos as USDG/PYUSD issuer)

## Why these cards (routing rationale)

A dated partnership announcement → `perplexity_search`; `scout_research` acceptable for stellar.org press.

## Edge / traps

Traps: misattributing PYUSD's issuer; denying the integration.
