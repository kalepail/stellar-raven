---
id: q-ti-historical-pointintime-balances
q: "How do I reconstruct an account's full asset balances as of a specific past date via Hubble/BigQuery and compute their USD value with historical price data?"
category: tooling-infra
subcategory: indexing-data
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
  - { claim: "Identifies Hubble/BigQuery or a historical indexer as the right source for point-in-time balances; current Horizon/RPC account reads are insufficient.", weight: 5 }
  - { claim: "Uses Hubble project/dataset names correctly: crypto-stellar.crypto_stellar and/or crypto-stellar.crypto_stellar_dbt current-derived tables where relevant.", weight: 4 }
  - { claim: "Explains that state/history tables record ledger-entry changes over time, so a point-in-time balance requires taking the latest change at or before the target ledger/time.", weight: 5 }
  - { claim: "Separates balance reconstruction from USD valuation, requiring an external historical price source and a timestamp/ledger join policy.", weight: 4 }
should_have:
  - { claim: "Mentions public Horizon history truncation and why it is not enough for arbitrary historical snapshots.", weight: 3 }
nice_to_have:
  - { claim: "Mentions fees/reserves and issuer/trustline changes as possible accounting caveats.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT claim the current Horizon /accounts endpoint can reconstruct an arbitrary past portfolio snapshot.", weight: 5 }
  - { claim: "Do NOT invent USD prices from Stellar ledger data alone.", weight: 4 }
must_cite:
  - "Hubble/BigQuery docs and a source requirement for external historical prices."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/analytics/hubble/developer-guide/connecting-to-bigquery"
  - "https://developers.stellar.org/docs/data/analytics/hubble/analyst-guide/history-vs-state-tables"
  - "https://developers.stellar.org/docs/data/apis/horizon"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "No single SQL is hard-gated because Hubble schemas evolve; rubric gates source class and reconstruction method."
---

## Reference answer (gospel)

Use Hubble/BigQuery or another historical indexer, not current Horizon/RPC account reads. Hubble's public BigQuery access uses shared project `crypto-stellar` and dataset `crypto_stellar` [1]. Its state tables track ledger-entry changes over time; multiple rows can exist for the same ledger entry, and the docs note this differs from RPC `getLedgerEntries`, which returns the current value [2].

The method is: map the target date/time to a ledger/time boundary, select all relevant balance/trustline/account entries for the account, take the latest row at or before that boundary, normalize asset identifiers and decimal units, then join to an external historical price feed for USD valuation at the same timestamp. Stellar ledger data can tell you balances; it does not by itself provide complete USD price history.

Public Horizon is useful for current/recent API reads, but SDF's Horizon docs note the public instance had historical data truncated to one year and point users to providers/Hubble for deeper history [3]. That is why arbitrary past-date portfolio reconstruction belongs in Hubble/indexer land.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for Hubble/BigQuery and Horizon-retention docs. `scout_research` can identify indexers, but the core evidence is official Hubble documentation.

## Edge / traps

The traps are using today's Horizon account JSON for a past date, treating state tables as already materialized snapshots, or inventing USD prices from Stellar-only data. The answer should say "latest ledger-entry state at or before target time" plus an external historical pricing join.
