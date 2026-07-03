---
id: q-protocol-accounts-signers-thresholds
q: "How do Stellar accounts handle signing — what are signers, weights, thresholds, and the sequence number for?"
category: protocol-core
subcategory: accounts
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains a Stellar account has signers, each with a weight, and three operation thresholds (low / medium / high) that a transaction's combined signature weight must meet.", weight: 5 }
  - { claim: "Explains the sequence number increments per transaction and prevents replay / enforces ordering (a transaction's seq num must be exactly one greater than the account's current).", weight: 4 }
should_have:
  - { claim: "Notes the master key is itself a signer (with a weight); adding signers + setting thresholds yields multisig.", weight: 3 }
  - { claim: "Notes different operations require different threshold categories (e.g. set_options/account-merge are high-threshold).", weight: 2 }
nice_to_have:
  - { claim: "Notes signers can be ed25519 keys, pre-authorized transaction hashes, or hashX, and (with P21) secp256r1 via smart accounts.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar accounts are single-key-only with no native multisig.", weight: 4 }
  - { claim: "Do NOT describe the sequence number as a nonce that can be any unused value (it must increment by exactly one).", weight: 3 }
must_cite:
  - "The accounts / multisig / signature docs on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/signatures-multisig
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Accounts subtopic. Traps: 'no native multisig' and Ethereum-style arbitrary nonce."
---

## Reference answer (gospel)

A Stellar account has **signers**, each with a **weight**, and three operation **thresholds** —
**low / medium / high** — that a transaction's combined signature weight must meet [1]. The **master
key** is itself a signer (with a weight); adding signers and setting thresholds yields **native
multisig** [1]. Different operations require different threshold categories (e.g. `SetOptions` and
`AccountMerge` are high-threshold) [1]. Signers can be ed25519 keys, pre-authorized transaction
hashes, or hashX, and (with Protocol 21) secp256r1 via smart accounts [1]. The **sequence number**
increments per transaction to prevent replay / enforce ordering — a transaction's seq num must be
**exactly one greater** than the account's current value, so it is not a free-form nonce [2].

- [1] developers.stellar.org/docs/learn/fundamentals/transactions/signatures-multisig
- [2] developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts

## Why these cards (routing rationale)

Account model how-to → `stellar_docs_mcp`; `scout_research` acceptable. No general-web.

## Edge / traps

Claiming no native multisig, or treating the sequence number as a free-form Ethereum nonce (it must
increment by exactly one), are the traps.
