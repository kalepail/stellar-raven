---
id: q-ti-tx-too-late-resubmit
q: "My pre-built/saved XDR fails with tx_too_late — how do timebounds and the sequence number cause this, and how do I refresh the sequence / min-max time and resubmit?"
category: tooling-infra
subcategory: developer-tooling
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
  - { claim: "Explains `tx_too_late` means the ledger close time was after the transaction maxTime, not a sequence-number mismatch.", weight: 5 }
  - { claim: "Explains `tx_bad_seq` separately as the result code for a sequence number that does not match the source account.", weight: 4 }
  - { claim: "States unchanged XDR can be safely resubmitted only while status is uncertain and before expiry; once expired, rebuild the transaction with fresh time bounds and usually a fresh account sequence.", weight: 5 }
  - { claim: "Gives a practical refresh workflow: load/fetch the source account, rebuild same intended operations with updated time bounds, re-sign, submit, and poll by hash.", weight: 4 }
  - { claim: "Warns changing an expired transaction creates a new transaction and can duplicate effects if the old one actually succeeded; verify status by hash first.", weight: 4 }
should_have:
  - { claim: "Mentions SDK/Lab transaction builders commonly require or encourage time bounds.", weight: 2 }
  - { claim: "Mentions fee-bump or higher max fee can help with congestion after the first transaction expires.", weight: 2 }
nice_to_have:
  - { claim: "Explains maxTime 0 means no upper bound and why docs advise against indefinite transactions.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say editing the XDR in place without rebuilding/re-signing is sufficient.", weight: 5 }
  - { claim: "Do NOT confuse `tx_too_late` with `tx_bad_seq`.", weight: 5 }
  - { claim: "Do NOT recommend resubmitting changed transactions before checking whether the original was included.", weight: 4 }
must_cite:
  - "Transaction result code docs for `tx_too_late` and `tx_bad_seq`."
  - "Error-handling/time-bounds docs for safe resubmission guidance."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions
  - https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/error-handling
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions
  - https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/response
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Horizon result-code and transaction error-handling docs. Applies to classic transaction semantics; Soroban RPC surfaces transaction result XDR/status differently but the result codes are protocol-level."
---

## Reference answer (gospel)

`tx_too_late` means the ledger close time was after the transaction's `maxTime`; it is a time-bounds failure, not a sequence-number failure [transaction result codes](https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions). A sequence mismatch is `tx_bad_seq`, where the sequence number does not match the source account [transaction result codes](https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions).

If submission status is uncertain, first poll by the original transaction hash. Docs say unchanged resubmission is safe only when the transaction is unchanged; after the time bounds expire and you confirm `tx_too_late`, rebuild the transaction with updated time bounds and resubmit [error handling](https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/error-handling). Practically: load/fetch the current source account to get its current sequence, rebuild the same intended operations with fresh `minTime`/`maxTime` (or SDK `setTimeout`), re-sign because the envelope hash changed, submit, and poll the new hash. Time bounds are optional but strongly encouraged; if `maxTime` is 0 there is no upper bound, which docs warn can leave transactions retrying indefinitely [operations and transactions](https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions).

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer is in official transaction result-code and error-handling docs. `scout_research` is acceptable as a secondary lookup but should not replace the primary result-code pages.

## Edge / traps

The trap is "just resubmit the saved XDR forever" or "bump sequence to fix `tx_too_late`." Expired XDR must be rebuilt and re-signed; stale sequence is a separate failure mode.
