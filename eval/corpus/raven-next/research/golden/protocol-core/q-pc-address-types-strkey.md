---
id: q-pc-address-types-strkey
q: "What are Stellar address types G, C, M, and S, how does StrKey encoding work, and how do I encode/decode between a raw Ed25519 key and a G-address?"
category: protocol-core
subcategory: accounts-addresses
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
  - { claim: "Identifies G as public account, S as secret seed, M as muxed account, and C as contract address.", weight: 5 }
  - { claim: "Explains StrKey is version-byte plus payload plus checksum encoded in base32 rather than raw base58/hex.", weight: 5 }
  - { claim: "Mentions checksum protection and the relevant payload sizes at a high level.", weight: 3 }
  - { claim: "Explains decoding a G-address yields the raw Ed25519 public key bytes, while S is secret material and must not be shared.", weight: 5 }
should_have:
  - { claim: "Mentions other StrKey prefixes only if relevant and avoids overloading C with EVM contracts.", weight: 2 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT treat G/C/M/S addresses as interchangeable.", weight: 5 }
  - { claim: "Do NOT ask users to paste secret seeds for decoding.", weight: 5 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md
  - https://developers.stellar.org/docs/build/guides/transactions/pooled-accounts-muxed-accounts-memos
  - https://developers.stellar.org/docs/tools/cli/cookbook/contract-invoke-arguments#address
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "SEP-0023 is the canonical StrKey source. It also documents other prefixes (T/X/P/L/B), but this golden focuses on G/C/M/S."
---

## Reference answer (gospel)

`G...` is an Ed25519 public account key, `S...` is the corresponding secret seed/private key material, `M...` is a muxed account address, and `C...` is a contract address [1]. StrKey is not base58 or raw hex: SEP-0023 defines it as a version byte whose top 5 bits pick the type, followed by the binary payload, a CRC16 checksum, and RFC4648 base32 without padding [1]. For normal Ed25519 public keys and contract hashes the payload is 32 bytes; muxed accounts append an 8-byte ID to the underlying Ed25519 key before checksum/base32 encoding [1][2]. Decoding a G-address yields the raw 32-byte Ed25519 public key. Decoding an S-seed yields private signing material and should never be requested from or shared by a user. C-addresses are Stellar contract addresses, not EVM `0x` addresses [3].

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for address conventions, contract-address examples, and pooled-account docs; SEP-0023 in `stellar-protocol` is the primary spec for exact encoding. Scout can corroborate but should not replace the spec.

## Edge / traps

G, C, M, and S strings are not interchangeable. Never ask a user to paste an S seed just to "decode an address." Do not treat C-addresses as EVM contracts or M-addresses as separate ledger accounts.
