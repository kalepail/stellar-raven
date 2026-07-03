---
id: q-soroban-sac-what-is
q: "What is the Stellar Asset Contract (SAC) and how does it relate to a classic Stellar asset?"
category: soroban
subcategory: sac
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The SAC is a built-in contract that wraps a classic Stellar asset (issuer + asset code) so it can be called from Soroban contracts as a token.", weight: 5 }
  - { claim: "The SAC implements the SEP-41 token interface (per CAP-46-6).", weight: 4 }
should_have:
  - { claim: "A SAC is deployed/enabled per classic asset (e.g., via `stellar contract asset deploy --asset CODE:ISSUER`); it is not custom Rust you write.", weight: 3 }
  - { claim: "Native XLM also has a SAC.", weight: 2 }
nice_to_have:
  - { claim: "Notes the SAC respects the issuer's auth flags (authorize/clawback/etc.).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the SAC is an ERC-20 contract or that classic assets are ERC-20 tokens.", weight: 4 }
  - { claim: "Do NOT claim you must hand-write a custom token contract to make a classic asset usable in Soroban.", weight: 3 }
must_cite:
  - "The developers.stellar.org Stellar Asset Contract documentation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "ERC-20 conflation is the trap; SEP-41/CAP-46-6 is the standard, verified against the SAC docs page."
---

## Reference answer (gospel)

The **Stellar Asset Contract (SAC)** is a **special built-in contract** that wraps a classic Stellar
asset (issuer `G...` + asset code) so it can be used and transferred from inside Soroban contracts as
a token. The docs describe it as "an implementation of **CAP-46-6** Smart Contract Standardized Asset"
and the **SEP-41 Token Interface**. [sac]

- It is **not custom Rust you write** — you deploy/enable the SAC for a given classic asset, e.g.
  `stellar contract asset deploy --asset CODE:ISSUER`. [sac]
- **Native XLM** also has a SAC.
- The SAC respects the issuer's **auth flags** (authorize/clawback/etc.), bridging classic Stellar
  asset semantics into Soroban. [sac]

Trap: calling the SAC (or classic assets) an "ERC-20," or claiming you must hand-write a custom token
contract to make a classic asset usable in Soroban.

## Why these cards (routing rationale)

SAC fundamentals → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Calling SAC an ERC-20; claiming you must write custom token code for a classic asset.
