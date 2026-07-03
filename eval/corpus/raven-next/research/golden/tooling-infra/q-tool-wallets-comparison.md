---
id: q-tool-wallets-comparison
q: "Which Stellar wallets are out there and which support hardware wallets or WalletConnect?"
category: tooling-infra
subcategory: wallets-comparison
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_projects]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Mainstream Stellar wallets include Freighter (SDF), LOBSTR, xBull, Albedo, Rabet, and Hana.", weight: 5 }
  - { claim: "Hardware (Ledger/Trezor) and WalletConnect are reached via the Stellar Wallets Kit's modules rather than being standalone Stellar wallets.", weight: 3 }
should_have:
  - { claim: "Freighter is the SDF-maintained reference wallet; the others are independent.", weight: 2 }
nice_to_have:
  - { claim: "LOBSTR and Freighter have both extension and mobile forms.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent wallets that don't exist or claim there is only one Stellar wallet.", weight: 3 }
  - { claim: "Do NOT name an EVM-only wallet (e.g. MetaMask) as a native Stellar wallet.", weight: 3 }
must_cite:
  - "developers.stellar.org wallets docs and/or the Wallets Kit supported-wallets list."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/developer-tools/wallets
  - https://github.com/Creit-Tech/Stellar-Wallets-Kit
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Enumerate-wallets list; hardware/WC via Wallets Kit is the nuance. MetaMask-as-Stellar is the trap."
---

## Reference answer (gospel)

Mainstream Stellar wallets: **Freighter** (SDF, extension + mobile), **LOBSTR** (extension + mobile),
**xBull**, **Albedo** (web), **Rabet**, and **Hana**. Freighter is the **SDF-maintained reference
wallet**; the others are independent.

**Hardware wallets (Ledger/Trezor) and WalletConnect** aren't standalone Stellar wallets — they're
reached via the **Stellar Wallets Kit's modules** (`LedgerModule`, `TrezorModule`, and a WalletConnect
module from `@creit.tech/stellar-wallets-kit`), which also provides a uniform signing interface across
the injected wallets above. **MetaMask and other EVM-only wallets are not native Stellar wallets.**

## Why these cards (routing rationale)

Wallet enumeration from first-party docs → `stellar_docs_mcp`; `scout_projects` acceptable. Deep-research/general-web are misses.

## Edge / traps

Inventing non-existent wallets, claiming there is only one Stellar wallet, or naming an EVM-only wallet
(e.g. MetaMask) as native Stellar.
