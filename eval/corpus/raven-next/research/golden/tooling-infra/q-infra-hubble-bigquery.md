---
id: q-infra-hubble-bigquery
q: "What is Hubble and how do I query Stellar's full history with SQL?"
category: tooling-infra
subcategory: analytics-hubble
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
  - { claim: "Hubble is an open-source, publicly available dataset providing a complete historical record of the Stellar network.", weight: 5 }
  - { claim: "Hubble is queried as a public BigQuery dataset — project `crypto-stellar`, dataset `crypto_stellar`.", weight: 5 }
should_have:
  - { claim: "You can access it via the BigQuery UI, the BigQuery client SDK (e.g. google-cloud-bigquery), or Looker Studio.", weight: 2 }
  - { claim: "Example tables include current-state tables like `accounts_current`.", weight: 1 }
nice_to_have:
  - { claim: "Hubble is the right layer for bulk historical SQL analytics, whereas RPC is for live reads.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Hubble as an RPC endpoint or a wallet; it is a BigQuery analytics dataset.", weight: 4 }
  - { claim: "Do NOT give a wrong BigQuery project/dataset path.", weight: 3 }
must_cite:
  - "developers.stellar.org Hubble docs (analytics/hubble, connecting-to-bigquery)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/analytics/hubble
  - https://developers.stellar.org/docs/data/analytics/hubble/developer-guide/connecting-to-bigquery
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "The crypto-stellar.crypto_stellar BigQuery path is the load-bearing fact — verified against connecting-to-bigquery (project crypto-stellar, dataset crypto_stellar; UI/SDK/Looker access; billing-enabled GCP project required)."
---

## Reference answer (gospel)

**Hubble** is an **open-source, publicly available dataset** providing a *complete historical record*
of the Stellar network, presented for easy consumption
([Hubble docs](https://developers.stellar.org/docs/data/analytics/hubble)).

You query it as a **public BigQuery dataset**: project **`crypto-stellar`**, dataset
**`crypto_stellar`** (e.g.
``select account_id, balance from `crypto-stellar.crypto_stellar.accounts_current` order by balance desc``)
([connecting to BigQuery](https://developers.stellar.org/docs/data/analytics/hubble/developer-guide/connecting-to-bigquery)).

- Access via the **BigQuery UI**, the **BigQuery client SDK** (e.g. `google-cloud-bigquery`), or
  **Looker Studio** (connector → shared project `crypto-stellar`). All require a GCP project with
  billing enabled + the BigQuery API on.
- Hubble is the layer for **bulk historical SQL analytics**; Stellar RPC is for **live/hot reads**.

It is **not** an RPC endpoint or a wallet — it is a BigQuery analytics dataset.

## Why these cards (routing rationale)

How-to/definitional for a first-party analytics product → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Mischaracterizing Hubble as RPC/wallet, or wrong dataset path, are the traps.
