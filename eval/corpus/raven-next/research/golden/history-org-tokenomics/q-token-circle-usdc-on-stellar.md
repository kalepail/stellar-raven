---
id: q-token-circle-usdc-on-stellar
q: "Is Circle's USDC available natively on Stellar, and what's Circle's involvement?"
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Circle's USDC is issued natively on the Stellar network.", weight: 5 }
should_have:
  - { claim: "USDC on Stellar underpins many Stellar payment/remittance use cases (e.g. MoneyGram, disbursements).", weight: 2 }
  - { claim: "Circle has expanded its Stellar support over time (e.g. CCTP / Cross-Chain Transfer Protocol on Stellar).", weight: 2 }
nice_to_have:
  - { claim: "EURC (Circle's euro stablecoin) is also available on Stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim USDC is NOT available on Stellar, or that Stellar's only dollar stablecoin is a Tether/USDT issuance.", weight: 4 }
  - { claim: "Do NOT confuse USDC with XLM (USDC is a Circle-issued stablecoin, not Stellar's native asset).", weight: 3 }
must_cite:
  - "stellar.org / Circle documentation on USDC on Stellar."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/products-and-tools/circle-usdc-eurc
  - https://stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Stellar-own + vendor: USDC-on-Stellar documented on stellar.org/Circle; Circle CCTP went live on Stellar May 19, 2026 (stellar.org blog). The 'USDC not on Stellar' and USDC-vs-XLM confusions are the traps. Verified 2026-06-22."
---

## Reference answer (gospel)

- Yes — **Circle's USDC is issued natively on Stellar** (and **EURC**, Circle's euro stablecoin, is also on Stellar) [1].
- USDC on Stellar underpins many of Stellar's payment/remittance use cases (MoneyGram on/off ramps, UNHCR disbursements, etc.) [1].
- Circle has **expanded** its Stellar support over time: **CCTP (Cross-Chain Transfer Protocol) went live on Stellar (May 19, 2026)**, enabling native USDC interoperability across chains [2].
- Note: **USDC is a Circle-issued stablecoin, not Stellar's native asset** — Stellar's native token is **XLM** [1].

- [1] stellar.org/products-and-tools/circle-usdc-eurc
- [2] stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar

## Why these cards (routing rationale)

USDC-on-Stellar is first-party-documented → `scout_research` / `stellar_docs_mcp`; perplexity
acceptable for latest Circle/CCTP news.

## Edge / traps

Traps: denying USDC is on Stellar; conflating USDC with native XLM.
