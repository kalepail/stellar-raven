---
id: q-edge-metamask-evm-mental-model
q: Can I add Stellar to MetaMask or use an XLM contract address like on Ethereum, and if not how do I hold, buy, or move XLM?
category: edge-governance
subcategory: conceptual-skeptic
axes:
  - edge-governance
  - ecosystem-spectrum
query_type: comparison
difficulty: easy
freshness_sensitive: false
freshness_horizon: null
expected_cards:
  - stellar_docs_mcp
acceptable_cards:
  - scout_research
forbidden_cards: []
expected_service: stellar_docs
should_fire: true
must_have:
  - claim: "Explains Stellar is not an EVM chain and native XLM does not use an Ethereum-style contract address."
    weight: 5
  - claim: "Explains Stellar accounts use Stellar public keys/addresses and Stellar-compatible wallets/exchanges/anchors."
    weight: 4
  - claim: "Warns about wrapped or bridged tokens on other chains being different from native XLM on Stellar."
    weight: 4
should_have:
  - claim: "Mentions Stellar assets are identified by asset code plus issuer, and Soroban contracts use C-addresses."
    weight: 2
nice_to_have: []
must_avoid:
  - claim: "Do NOT give an Ethereum contract address as native XLM."
    weight: 5
  - claim: "Do NOT tell users to send native Stellar assets to an EVM address unless a specific bridge/wrapped flow is verified."
    weight: 5
must_cite:
  - At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository.
must_not_use_tier: []
pass_threshold: 0.8
weight_profile: standard
sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts
  - https://developers.stellar.org/docs/tokens
  - https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-c-accounts
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: high
notes: Verified 2026-06-29 against official Stellar account/token docs.
---

## Reference answer (gospel)

Native Stellar is not an EVM network, so you do not add it to MetaMask as an EVM chain and native XLM has no Ethereum-style token contract address. Stellar accounts use Stellar addresses, primarily G-addresses for classic accounts; Stellar also has C-addresses for contract accounts. Stellar assets are identified as asset code plus issuer account, while Soroban contract tokens use contract accounts/IDs.

To hold, buy, or move native XLM, use a Stellar-compatible wallet, exchange withdrawal flow, or anchor/on-off-ramp that explicitly supports the Stellar network. Wrapped or bridged XLM-like assets on Ethereum or other chains are different assets with bridge/custody risk; do not send native Stellar assets to an EVM address unless a specific, verified bridge flow tells you exactly how to do it.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for canonical account/address and token model facts. `scout_research` is acceptable but secondary.

## Edge / traps

The EVM mental model can cause irreversible fund loss. The answer must not invent a native XLM contract address or imply MetaMask support for native Stellar.
