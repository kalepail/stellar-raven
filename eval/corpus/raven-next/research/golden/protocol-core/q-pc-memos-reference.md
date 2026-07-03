---
id: q-pc-memos-reference
q: "How do memos work on Stellar: types, size limit, case-sensitivity, whether one transaction can carry multiple, which transactions support them, and why do exchanges require them?"
category: protocol-core
subcategory: transactions-memos
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
  - { claim: "Names the Stellar memo types and explains that a transaction carries at most one memo.", weight: 5 }
  - { claim: "States size/format limits for text, id, hash, and return memo types.", weight: 4 }
  - { claim: "Explains exchanges use memos/tags to map deposits to internal customer accounts.", weight: 5 }
  - { claim: "Clarifies memos are transaction-level metadata, not payment-operation fields.", weight: 4 }
should_have:
  - { claim: "Mentions memo text case/byte handling precisely and warns users to copy exchange memo exactly.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT claim a single Stellar transaction can include multiple memos.", weight: 5 }
  - { claim: "Do NOT treat a memo as a destination account or trustline.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions#memo
  - https://developers.stellar.org/docs/build/guides/transactions/pooled-accounts-muxed-accounts-memos
  - https://developers.stellar.org/docs/platforms/anchor-platform/sep-guide/sep24/integration#ready-to-receive-funds-1
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified memo types and limits from official docs. Soroban InvokeHostFunction transactions requiring MEMO_NONE are an important edge case but not the primary focus of this classic memo golden."
---

## Reference answer (gospel)

A Stellar memo is optional transaction-level metadata, not an operation field and not a destination account [1]. A transaction has at most one memo. The memo types are `MEMO_TEXT` (ASCII or UTF-8, up to 28 bytes, so byte length matters), `MEMO_ID` (64-bit unsigned integer), `MEMO_HASH` (32-byte hash), and `MEMO_RETURN` (32-byte hash intended as the refunded transaction hash) [1]. Exchanges, anchors, and custodians use memos because many customers may deposit to one pooled/omnibus G-account; the memo is the unique identifier that maps the on-chain deposit to the internal customer or SEP transaction [2][3]. Users should copy exchange memo/tag text exactly, including case and formatting, because services decide how to match it internally.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the official transactions page names memo types/limits and the pooled-account/anchor docs explain why custodians use memos. Scout can corroborate but should not be necessary.

## Edge / traps

Wrong answers say a transaction can carry many memos, put the memo on each payment operation, or treat a memo as a replacement destination/trustline. Another trap is ignoring byte length: 28 bytes is not necessarily 28 user-visible characters for UTF-8 text.
