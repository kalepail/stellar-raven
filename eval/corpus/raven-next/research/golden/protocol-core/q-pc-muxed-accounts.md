---
id: q-pc-muxed-accounts
q: "What is a muxed M-account, how does it relate to the underlying G-account sequence number, how does it differ from a memo, where can I use it, and how do I convert M to G plus memo?"
category: protocol-core
subcategory: accounts-muxed
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Defines muxed accounts as multiplexed account IDs that combine an underlying G-account with a 64-bit ID.", weight: 5 }
  - { claim: "Explains the underlying G-account owns the sequence number and funds; the M-address is an addressing layer.", weight: 5 }
  - { claim: "Contrasts muxed accounts with transaction memos for exchange/customer routing.", weight: 4 }
  - { claim: "Mentions compatibility caveats: some services/exchanges reject M-addresses and may require G-address plus memo.", weight: 4 }
should_have:
  - { claim: "Explains conversion requires decoding the muxed account into base G-account and ID, not changing ownership.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT claim M-addresses are independent accounts with separate balances or sequence numbers.", weight: 5 }
  - { claim: "Do NOT say muxed accounts replace memos everywhere or are universally accepted.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/pooled-accounts-muxed-accounts-memos
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0027.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against official pooled-account docs, CAP-0027, and SEP-0023. Compatibility caveat remains service-specific: some wallets/exchanges still require G+memo."
---

## Reference answer (gospel)

A muxed `M...` address is a first-class Stellar account identifier that combines an underlying `G...` Ed25519 account with a 64-bit ID [1][2]. It is an addressing/multiplexing layer: muxed accounts do not exist as separate ledger accounts; the underlying G-account owns the funds, sequence number, reserves, and ledger state [1]. CAP-0027 says the ID has no effect on operation semantics or authorization and exists so higher-layer software can multiplex one Stellar account among many users [2]. Muxed accounts solve many "forgot the memo" pooled-account problems because the ID travels with the account occurrence; traditional memos are transaction-level metadata and only one memo can be attached to a transaction [1]. To convert `M` to `G + memo ID`, decode the StrKey per SEP-0023: extract the underlying Ed25519 G-address and the 8-byte unsigned ID [3]. This does not transfer ownership or create a new balance. Some services still reject M-addresses and require the legacy G-address plus memo flow [1].

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because official pooled-account docs directly answer muxed-account semantics and compatibility. CAP-0027/SEP-0023 are the spec-level backing sources.

## Edge / traps

Do not say M-addresses have independent balances or sequence numbers. Do not say muxed accounts replace memos everywhere; unsupported services may still require G plus memo. Do not silently strip an M ID when the recipient expects it for deposit attribution.
