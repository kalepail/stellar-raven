---
id: q-pc-tx-finality-failure-semantics
q: "If a Stellar transaction fails or expires, is it recorded on-ledger and does it consume the sequence number, and how do I tell expired, dropped, and pruned transactions apart?"
category: protocol-core
subcategory: transactions-finality
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
  - { claim: "Distinguishes transactions included in a ledger with failed operation results from transactions never included/expired/dropped.", weight: 5 }
  - { claim: "Explains only included transactions affect ledger state/sequence according to protocol result semantics.", weight: 5 }
  - { claim: "Explains timebounds/expiration and RPC/history retention can make lookup results ambiguous without checking archives/providers.", weight: 4 }
should_have:
  - { claim: "Mentions fee charging/result codes for failed included transactions where applicable.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT say every submitted transaction is recorded on-ledger.", weight: 5 }
  - { claim: "Do NOT say an RPC not-found result alone proves a transaction never existed.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/transaction-lifecycle"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions"
  - "https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getTransaction"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/http-status-codes/horizon-specific/transaction-failed"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified from docs. A provider's retention window can make historical lookup ambiguous; the rubric should reward distinguishing protocol finality from API availability."
---

## Reference answer (gospel)

A submitted transaction is not automatically on-ledger. If stellar-core rejects it as invalid before inclusion, the transaction is not included, the source account sequence number is not incremented, and no fee is consumed. If a transaction is included in a ledger but has a transaction-level or operation-level failure result, that result is part of ledger history and the applicable protocol result semantics apply; Horizon result docs distinguish `tx_success` from `tx_failed`, where `tx_failed` means one operation failed and none of the operations were applied. Sources: https://developers.stellar.org/docs/learn/fundamentals/transactions/transaction-lifecycle and https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions

Expiration and dropping are different from failed inclusion. `tx_too_late` means the ledger close time was after the transaction's `maxTime`; an expired or dropped transaction that never made it into a closed ledger is not itself a ledger record and does not consume sequence. A transaction that was well-formed but not included may be returned as a submission error by Horizon and may never succeed except for the documented too-high `tx_bad_seq` caveat. Source: https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/http-status-codes/horizon-specific/transaction-failed

For lookups, do not treat one `not found` as proof that a transaction never existed. Stellar RPC `getTransaction` can report not found/pending/failed/success depending on retention and current processing; public RPC/Horizon/history providers may prune or retain different windows. To distinguish cases, check the submission response, result XDR/result code, ledger inclusion, timebounds, and a history source with sufficient retention. Source: https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getTransaction

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is official transaction lifecycle, result-code, and RPC-method behavior. `scout_research` is acceptable corroboration, but the answer should cite docs rather than general explanations.

## Edge / traps

Do not say every submitted transaction is recorded on-chain. Do not say all failures consume sequence. Also do not infer "never existed" from a single provider's missing result; retention and pruning are separate from protocol finality.
