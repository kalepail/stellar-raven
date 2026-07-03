---
id: q-soroban-x402-auth-entry-signing
q: "Which Stellar wallets support the Soroban auth-entry signing x402 needs, and what's the payment flow?"
category: soroban
subcategory: agentic-payments
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "x402 requires Soroban authorization-entry signing (auth-entry signing), not just plain transaction signing.", weight: 5 }
  - { claim: "Wallets that support auth-entry signing include Freighter (browser extension), Albedo, Hana, HOT, Klever, and OneKey.", weight: 5 }
  - { claim: "Facilitators include Coinbase (testnet) and OpenZeppelin Relayer/Channels (testnet + mainnet).", weight: 4 }
should_have:
  - { claim: "Flow: server returns HTTP 402 with payment requirements → wallet signs the Soroban auth entry → facilitator verifies and settles → request is retried/completed.", weight: 3 }
nice_to_have:
  - { claim: "Notes the payment asset is a SEP-41 token (USDC by default).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim all Stellar wallets support x402 / auth-entry signing.", weight: 5 }
  - { claim: "Do NOT claim Freighter mobile supports x402 (only the browser extension does so far).", weight: 5 }
must_cite:
  - "At least one primary developers.stellar.org agentic-payments / x402 docs page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/agentic-payments/x402
  - https://stellar.org/x402
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: medium
notes: "Freshness:true — wallet/facilitator support is moving. Re-verified 2026-06-22 against developers.stellar.org/docs/build/agentic-payments/x402: wallets = Freighter (browser ext), Albedo, Hana, HOT, Klever, OneKey; Freighter Mobile NOT supported; facilitators = Coinbase (testnet) + OpenZeppelin Relayer (testnet+mainnet). List may change — keep medium confidence."
---

## Reference answer (gospel)

x402 on Stellar depends on **Soroban authorization-entry signing** — the payer signs an auth entry
(not a whole transaction), which the facilitator submits. Wallets that currently support auth-entry
signing for x402 include **Freighter (browser extension)**, **Albedo**, **Hana**, **HOT**, **Klever**,
and **OneKey**. **Freighter mobile** does **not** yet support it.

Facilitators (verify + settle the signed payment) include **Coinbase** (testnet) and **OpenZeppelin
Relayer / Channels** (testnet + mainnet).

Flow: the server returns **HTTP 402** with payment requirements → the wallet **signs the Soroban auth
entry** (a SEP-41 token, USDC by default) → the **facilitator verifies and settles** on-chain → the
original request is retried and completes.

Source of truth: developers.stellar.org agentic-payments / x402 docs.

## Why these cards (routing rationale)

A first-party "which wallets / what flow" question → **`stellar_docs_mcp`**. `scout_research` /
`scout_repos` are acceptable for corroborating wallet/facilitator coverage. Deep-research tier is
governance-forbidden.

## Edge / traps

Plausible-wrong answers: (a) blanket-claiming every Stellar wallet supports it; (b) claiming
**Freighter mobile** works (it does not yet). Both are encoded as `must_avoid` weight-5 traps.
