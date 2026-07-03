---
id: q-infra-galexie-vs-etl
q: "What's the difference between Galexie, stellar-etl, and Hubble for getting Stellar ledger data into my own pipeline?"
category: tooling-infra
subcategory: analytics-pipeline
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Hubble is the ready-made public BigQuery dataset for historical SQL; you query it directly rather than building a pipeline.", weight: 4 }
  - { claim: "stellar-etl is a Go data pipeline that extracts data from Stellar Core history archives.", weight: 4 }
  - { claim: "Galexie exports/streams ledger metadata (XDR) into a cloud-storage datastore (GCS or S3), distributed as the `stellar/stellar-galexie` Docker image.", weight: 4 }
should_have:
  - { claim: "Pick based on need: Hubble for SQL analytics, stellar-etl for ETL into a private warehouse, Galexie for raw archive replay.", weight: 3 }
nice_to_have:
  - { claim: "Notes these are distinct from RPC providers/indexers, which serve live current-state reads.", weight: 1 }
must_avoid:
  - { claim: "Do NOT conflate Galexie/stellar-etl/Hubble with each other or describe them as RPC/Horizon APIs.", weight: 4 }
  - { claim: "Do NOT claim Galexie is a SQL query tool or that Hubble is an ingestion daemon.", weight: 3 }
  - { claim: "Do NOT call the Galexie image `stellar/galexie` — the published image/repo is `stellar/stellar-galexie`.", weight: 2 }
must_cite:
  - "developers.stellar.org Hubble docs + the stellar/stellar-etl and stellar/stellar-galexie sources."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/galexie
  - https://github.com/stellar/stellar-etl
  - https://github.com/stellar/stellar-galexie
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Reconciled with q-infra-galexie-what-is 2026-06-29: Galexie image/repo is `stellar/stellar-galexie` (extracted from stellar/go into its own repo 2026-06-10), NOT `stellar/galexie`; datastore backends are GCS and S3 (both implemented in support/datastore: gcs.go + s3.go, `S3DataStore implements DataStore`). Three-tool comparison; trap is conflating roles. scout_repos acceptable for galexie/stellar-etl repos."
---

## Reference answer (gospel)

Three distinct roles, not interchangeable:

- **Hubble** — a **ready-made public BigQuery dataset** (`crypto-stellar.crypto_stellar`) with the full
  historical record. You **query it directly with SQL**; no pipeline to build. Best for analytics.
- **stellar-etl** — a **Go data pipeline** that **extracts** data from Stellar Core history archives
  (transform/load into your own warehouse). It's an ETL tool, not a query surface.
- **Galexie** — an SDF tool that **exports/streams ledger metadata (XDR) into a cloud-storage
  datastore** (Google Cloud Storage or AWS S3 — both implemented via the `DataStore` interface),
  distributed as the **`stellar/stellar-galexie` Docker image** (its own `stellar/stellar-galexie`
  repo, extracted from `stellar/go`). Best for raw archive replay / feeding your own pipeline; it is
  the foundation of the Composable Data Pipeline (CDP).

Pick: **Hubble** for SQL analytics, **stellar-etl** for ETL into a private warehouse, **Galexie** for
raw archive ingestion/replay. All three are distinct from RPC providers/indexers, which serve live
current-state reads.

## Why these cards (routing rationale)

Comparison across first-party data tools → `stellar_docs_mcp`; `scout_repos` acceptable for the repos. Deep-research/general-web are misses.

## Edge / traps

Conflating the three (e.g. calling Galexie a SQL query tool, or Hubble an ingestion daemon), or
describing them as RPC/Horizon APIs.
