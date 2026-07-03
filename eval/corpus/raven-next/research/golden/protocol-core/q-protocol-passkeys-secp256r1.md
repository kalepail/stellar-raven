---
id: q-protocol-passkeys-secp256r1
q: "When did Stellar add native support for passkeys / secp256r1 signature verification at the protocol level?"
category: protocol-core
subcategory: cryptography-caps
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States secp256r1 verification (enabling passkeys / WebAuthn smart wallets) landed in Protocol 21 via CAP-0051.", weight: 5 }
should_have:
  - { claim: "Notes Protocol 21 activated on Mainnet around 2024-06-18.", weight: 2 }
  - { claim: "Notes this is what enables passkey-based smart wallets (e.g. PasskeyKit) on Soroban.", weight: 2 }
nice_to_have:
  - { claim: "Notes Protocol 21 also added TTL extension (CAP-0053) and Soroban cost-model refinements.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute secp256r1/passkeys to the wrong CAP (e.g. CAP-0059, CAP-0046) or wrong protocol (P20, P22).", weight: 5 }
  - { claim: "Do NOT claim secp256r1 is the same curve as BLS12-381 or that passkeys require BLS.", weight: 3 }
must_cite:
  - "The Protocol 21 upgrade guide on stellar.org and/or CAP-0051 in stellar/stellar-protocol."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/protocol-21-upgrade-guide
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0051.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "secp256r1/passkeys = CAP-0051 = Protocol 21. Trap is wrong CAP/version or curve confusion."
---

## Reference answer (gospel)

- secp256r1 signature verification (enabling passkeys / WebAuthn smart wallets) landed in **Protocol 21 via CAP-0051** [1][2].
- Protocol 21 activated on Mainnet around **2024-06-18** [1].
- This is what enables passkey-based smart wallets (e.g. PasskeyKit) on Soroban [1].
- Protocol 21 also added TTL extension (CAP-0053) and Soroban cost-model refinements [1]. secp256r1 is **not** the same curve as BLS12-381.

## Why these cards (routing rationale)

Crypto/CAP fact → `stellar_docs_mcp` + `scout_research`. `perplexity_search` acceptable. No deep-research.

## Edge / traps

Wrong CAP/version (it is CAP-0051 / Protocol 21), or confusing secp256r1 with BLS12-381, are the traps.
