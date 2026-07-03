---
id: q-hist-mastercard-crypto-credential
q: "Did Mastercard partner with Stellar, and what was the integration about?"
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
  - { claim: "Mastercard partnered with SDF to integrate Mastercard's Crypto Credential with the Stellar network.", weight: 5 }
should_have:
  - { claim: "Crypto Credential helps verify counterparties / make wallet-to-wallet transfers safer (aliases instead of raw addresses).", weight: 2 }
  - { claim: "The partnership was announced around late 2024.", weight: 2 }
nice_to_have:
  - { claim: "It was announced alongside other Stellar enterprise news (e.g. Meridian 2024 era).", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent a Mastercard partnership detail that isn't supported (e.g. a Mastercard-issued stablecoin on Stellar) without a source.", weight: 3 }
  - { claim: "Do NOT claim there was no Mastercard x Stellar partnership.", weight: 3 }
must_cite:
  - "A reputable dated source on Mastercard x Stellar Crypto Credential (stellar.org press or news)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/stellar-joins-the-mastercard-crypto-credential-ecosystem-to-unlock-verified-interactions-across-public-blockchain-networks
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified 2026-06-22 against stellar.org press: announced Oct 15, 2024 at Meridian 2024 (London). Crypto Credential = exclusive credentialing solution in the Stellar ecosystem; initial focus on remittances/P2P (Coins.ph, Mercado Bitcoin, Wirex named)."
---

## Reference answer (gospel)

- Yes — at **Meridian 2024 (announced October 15, 2024)** SDF announced a partnership with **Mastercard to integrate Mastercard's Crypto Credential** with the Stellar network [1].
- **Crypto Credential** helps **verify counterparties** and make wallet-to-wallet transfers safer — letting users transact via verified **aliases (e.g. email)** instead of raw blockchain addresses, with compliance checks behind the scenes [1].
- It was embedded as the **exclusive credentialing solution** in the Stellar ecosystem, initially for **remittances and P2P transfers** (with wallet providers such as Coins.ph, Mercado Bitcoin, and Wirex) [1].
- Traps to avoid: inventing unsupported details (e.g. a Mastercard-issued stablecoin on Stellar), or denying the partnership exists [1].

- [1] stellar.org/press/stellar-joins-the-mastercard-crypto-credential-ecosystem...

## Why these cards (routing rationale)

A dated partnership announcement → recency-aware `perplexity_search`; `scout_research` acceptable for
the stellar.org press release.

## Edge / traps

Traps: inventing unsupported Mastercard details, or denying the partnership exists.
