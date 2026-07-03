---
id: q-crp-export-tx-history-taxes
q: "How do I export a complete Stellar account transaction history for tax or accounting, and what should I know about TurboTax or CoinTracker-style integrations?"
category: compliance-rwa-payments
subcategory: tax-accounting
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains transaction history can be exported by querying account transactions/operations/effects through Horizon or indexer/provider tools, with pagination for completeness.", weight: 5 }
  - { claim: "Mentions Soroban events, token transfers, trades, fees, memos, and asset metadata may require more than a simple payments-only export.", weight: 4 }
  - { claim: "Says tax software support and import formats are provider-specific and must be verified current; Raven should not guarantee TurboTax/CoinTracker support without cited docs.", weight: 5 }
should_have:
  - { claim: "Mentions reconciling CSV/export data with wallet/exchange records and fiat cost basis where applicable.", weight: 3 }
  - { claim: "Notes Horizon is not the only possible data source; RPC/indexers/archive providers may be relevant for historical completeness.", weight: 2 }
nice_to_have:
  - { claim: "Recommends consulting a tax professional for classification/reporting questions.", weight: 1 }
must_avoid:
  - { claim: "Do NOT provide personal tax advice as definitive.", weight: 5 }
  - { claim: "Do NOT claim a payments endpoint alone is a complete tax ledger for all Stellar activity.", weight: 5 }
must_cite:
  - "Stellar Horizon/RPC/indexer docs for export mechanics and dated tax-tool docs for named integrations."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/list-all-transactions"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/list-all-operations"
  - "https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getTransactions"
  - "https://www.cointracker.io/integrations/stellar"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "CoinTracker support was verified through search extraction but curl returned 403; Phase 3 should browser-check provider support if exact tax-tool wording matters."
---

## Reference answer (gospel)

A complete Stellar tax/accounting export is not just a list of payments. Start from the account's transactions and operations through Horizon, following pagination until history is exhausted. Include payments, path payments, trades/manage-offer effects, account creation/merge, fees, memos, trustline/asset changes, claimable balances, and any exchange or wallet records needed for cost basis. For Soroban activity, also use RPC/indexer data such as `getTransactions` and event tooling where contract events/token transfers are relevant.

For tax software, verify the provider's current import path. CoinTracker currently has a Stellar integration page that says Stellar history is imported by downloading a CSV export, reformatting it into CoinTracker CSV format, and importing it; CoinTracker also advertises TurboTax/H&R Block filing workflows. Raven should not promise direct TurboTax or CoinTracker sync unless the current provider docs say so.

The bounded answer should say how to get ledger data and how to hand it to accounting tools, but it should not give personal tax advice. Reconcile on-chain exports with exchange statements, wallet transfers, fiat purchase/sale records, and market-price/cost-basis records, then consult a tax professional for classification and reporting.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for Horizon/RPC export mechanics. `perplexity_search`/`parallel_search` are acceptable for tax-tool support because TurboTax/CoinTracker import behavior is current provider documentation.

## Edge / traps

Avoid a shallow payments-only export when the user asks for accounting completeness. Also avoid presenting IRS/tax classification advice as if Raven were the user's accountant.
