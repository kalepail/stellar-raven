---
id: q-ti-classic-submission-errors
q: "Why do classic txs fail with tx_bad_seq or op_underfunded even when balance/sequence look right (selling liabilities + base reserve + subentry reserves), and how do I interpret/fix the broader result-code taxonomy (op_no_destination, op_bad_signer, PAYMENT_SRC_NO_TRUST, TRY_AGAIN_LATER)?"
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
  - { claim: "Explains that `tx_bad_seq` means the transaction sequence does not match the source account and is often caused by stale reads or concurrent submissions.", weight: 5 }
  - { claim: "Explains that `op_underfunded`/payment underfunding can be caused by available-balance constraints, not just displayed balance: minimum reserve, subentries, offers, and selling liabilities can make funds unavailable.", weight: 5 }
  - { claim: "Maps the named result codes to their operation family: `op_no_destination`/`PAYMENT_NO_DESTINATION`, `PAYMENT_SRC_NO_TRUST`, `op_bad_signer` for SetOptions, and `TRY_AGAIN_LATER` as a temporary submission status.", weight: 5 }
  - { claim: "Gives an actionable debug sequence: fetch latest account, inspect result_codes.transaction and result_codes.operations, inspect balances/liabilities/subentry count/offers/trustlines, then rebuild only when the user intent remains valid.", weight: 4 }
should_have:
  - { claim: "Cites official Horizon error handling and operation-specific result-code docs.", weight: 3 }
  - { claim: "Mentions that Horizon 400 transaction_failed often means the submitted transaction will never succeed, with a `tx_bad_seq` high-sequence caveat.", weight: 2 }
nice_to_have:
  - { claim: "Warns that balances shown by wallets/explorers may not equal spendable XLM after reserves and liabilities.", weight: 1 }
must_avoid:
  - { claim: "Do NOT diagnose every underfunded error as a faucet/provider outage.", weight: 5 }
  - { claim: "Do NOT ignore operation-level result codes when transaction-level code is `tx_failed`.", weight: 5 }
  - { claim: "Do NOT tell users to reduce reserves or bypass trustline requirements.", weight: 5 }
must_cite:
  - "Official transaction result-code docs."
  - "Official payment and/or offer result-code docs for underfunded/liability behavior."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/error-handling"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/payment"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/manage-sell-offer"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified official docs on 2026-06-29."
---

## Reference answer (gospel)

Start from Horizon's `extras.result_codes`. A transaction-level `tx_bad_seq` means the sequence number does not match the source account; the official error guide calls out stale account views and concurrent submissions as typical causes and warns that rebuilding with a fresh sequence can accidentally duplicate a payment (https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/error-handling). If the transaction-level code is `tx_failed`, inspect the operation-level array because one operation failed and none applied (https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/transactions).

For "I have enough balance" underfunded cases, check spendable balance, not just nominal balance. Payment `PAYMENT_UNDERFUNDED` means the sender cannot send the amount while maintaining minimum reserve; `PAYMENT_SRC_NO_TRUST` means the source lacks the trustline for the asset; `PAYMENT_NO_DESTINATION` means the destination account does not exist (https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/payment). Offer result codes make the liabilities issue explicit: manage-sell-offer underfunding accounts for selling liabilities and, for XLM, the minimum reserve assuming the offer may not execute immediately (https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/manage-sell-offer).

Debug in order: reload the source account; confirm the current sequence; inspect `subentry_count`, balances, buying/selling liabilities, active offers, and trustlines; decode both transaction and operation result codes; then rebuild only if the same user intent still makes sense. `TRY_AGAIN_LATER` is different: it is a temporary submission status where the client should wait before resubmitting the same transaction rather than immediately creating a different one (https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/error-handling).

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer is mostly official Horizon result-code taxonomy. `scout_research` is acceptable for cross-checking but should not be the primary evidence.

## Edge / traps

The trap is reading only the wallet balance and ignoring reserves/liabilities or reading only the transaction-level code and missing the operation result. Another trap is rebuilding failed transactions automatically; for payments, that can turn a stale-sequence failure into duplicate successful payments.
