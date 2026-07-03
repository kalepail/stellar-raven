---
id: q-pc-sequence-numbers-ordering-replace
q: "How do Stellar sequence numbers behave compared with an EVM nonce, including ordering across unrelated accounts, duplicate or seq+2 submissions, and replacing a stuck pending transaction?"
category: protocol-core
subcategory: transactions-sequence
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains Stellar sequence numbers are per source account and each transaction consumes the next sequence number only if applied.", weight: 5 }
  - { claim: "Contrasts with EVM nonce mental models without claiming global ordering across unrelated accounts.", weight: 4 }
  - { claim: "Explains seq+2 cannot apply before seq+1 for the same account.", weight: 4 }
  - { claim: "Discusses replacing/resubmitting a pending transaction through same sequence and fee/timebounds semantics, with caveats.", weight: 4 }
should_have:
  - { claim: "Mentions pending vs failed/expired status affects whether the sequence number is consumed.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT say unrelated accounts have a deterministic in-ledger ordering by nonce.", weight: 5 }
  - { claim: "Do NOT say a failed or never-applied transaction always consumes sequence.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/transaction-lifecycle"
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions"
  - "https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering#fee-bumps-on-past-transactions"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Replacement semantics verified from docs; exact queue behavior can depend on RPC/Core submission path and whether the original transaction is still queued."
---

## Reference answer (gospel)

Stellar sequence numbers are per transaction source account. A transaction carries a source account and sequence number; invalid transactions rejected before inclusion do not increment the account sequence number or consume a fee, and only one transaction/sequence number for the same account can be consumed per ledger. Sources: https://developers.stellar.org/docs/learn/fundamentals/transactions/transaction-lifecycle and https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions

Compared with an EVM nonce, the useful similarity is "per-account ordering." A transaction using sequence `N+2` for the same source account cannot apply before `N+1`; if submitted too early it gets `tx_bad_seq`, and docs note a too-high `tx_bad_seq` transaction may become valid later if the account sequence catches up. Unrelated accounts do not share a global nonce order; consensus orders the accepted transaction set for a ledger, but one account's sequence does not constrain another account's source sequence. Source: https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions

To replace a pending transaction, submit the same transaction sequence with a better fee strategy before it expires. Stellar Docs describe fee-bumping a transaction that failed to make it into the ledger and note that a second transaction with the same source and sequence, when wrapped as a fee-bump transaction, replaces the first in the transaction queue only if its fee bid is at least 10x the first bid. Use timebounds/ledger bounds so a stale transaction cannot unexpectedly land later. Source: https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering#fee-bumps-on-past-transactions

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because sequence/finality/result-code semantics are in the official transaction lifecycle and API-result-code docs. `scout_research` is acceptable for corroboration, but a general web answer is likely to import EVM-specific assumptions.

## Edge / traps

Do not say a failed or never-included submission always burns the sequence number. Do not say unrelated accounts are ordered by a global account nonce. Do not suggest "speed up" by using sequence `N+2`; that only creates a too-high sequence transaction for the same source account.
