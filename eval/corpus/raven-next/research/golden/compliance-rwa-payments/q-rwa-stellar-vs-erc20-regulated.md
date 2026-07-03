---
id: q-rwa-stellar-vs-erc20-regulated
q: "Why do issuers say Stellar is easier than Ethereum/ERC-20 for issuing regulated, compliant RWA tokens?"
category: compliance-rwa-payments
subcategory: rwa-legal-structuring
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null
expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Stellar provides native, protocol-level regulated-asset controls: authorization flags (AUTH_REQUIRED/REVOCABLE), clawback, and SEP-8 approval servers.", weight: 5 }
  - { claim: "On Ethereum/ERC-20, equivalent issuer controls (allow/deny lists, clawback) must be implemented in custom smart-contract logic / wrappers rather than being native protocol features.", weight: 4 }
should_have:
  - { claim: "Stellar's regulated-asset tokenization can be a no-smart-contract, few-step process, which is easier to audit for issuer counsel.", weight: 3 }
nice_to_have:
  - { claim: "Notes the tradeoff: Stellar is purpose-built for payments/issuance while Ethereum is general-purpose programmable.", weight: 2 }
must_avoid:
  - { claim: "Do NOT claim ERC-20 has native protocol-level clawback / authorization flags (it does not; it requires contract logic).", weight: 4 }
  - { claim: "Do NOT claim Stellar regulated assets always require a Soroban smart contract.", weight: 3 }
must_cite:
  - "developers.stellar.org asset-control docs and/or a regulated-asset case study."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/control-asset-access
  - https://stellar.org/case-studies/wisdomtree
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Comparison rooted in on-chain mechanics → stellar_docs primary. Trap: claiming ERC-20 has native clawback."
---

## Reference answer (gospel)

- Stellar provides **native, protocol-level regulated-asset controls**: authorization flags
  (`AUTH_REQUIRED`/`AUTH_REVOCABLE`), **clawback**, and **SEP-8** approval servers — built into the
  ledger, not bolted on [1].
- On **Ethereum/ERC-20**, equivalent issuer controls (allow/deny lists, freeze, clawback) must be coded
  into **custom smart-contract logic / wrappers** — they are **not native protocol features** [1].
- So Stellar's regulated-asset tokenization can be a **few-step, no-smart-contract process** (WisdomTree
  used "the Stellar network standard for Regulated Assets"), which is **easier for issuer counsel to
  audit** than a bespoke ERC-20 contract [2].
- Tradeoff: Stellar is **purpose-built for payments/issuance**; Ethereum is **general-purpose
  programmable**. (Do not claim ERC-20 has native clawback, nor that Stellar regulated assets always need
  a Soroban contract.)

Sources: [1] developers.stellar.org control-asset-access; [2] stellar.org WisdomTree case study.

## Why these cards (routing rationale)

The mechanics (native flags/clawback/SEP-8 vs ERC-20 wrappers) are Stellar protocol facts → `stellar_docs_mcp`; `scout_research`/`perplexity_search` acceptable for issuer commentary.

## Edge / traps

Trap: attributing native protocol-level issuer controls to ERC-20.
