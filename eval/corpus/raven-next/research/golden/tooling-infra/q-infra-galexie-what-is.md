---
id: q-infra-galexie-what-is
q: "What is Galexie and how do I run it to archive Stellar ledger data?"
category: tooling-infra
subcategory: analytics-galexie
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Galexie is an SDF-published tool that extracts/exports Stellar ledger metadata (in XDR) into a cloud-storage datastore / data lake.", weight: 5 }
  - { claim: "It is run from a Docker image (stellar/stellar-galexie) and is the first step / foundation of the Composable Data Pipeline (CDP).", weight: 3 }
should_have:
  - { claim: "It produces a raw ledger datastore for downstream pipelines/replay, distinct from Hubble's ready-to-query BigQuery dataset.", weight: 2 }
  - { claim: "It exports to cloud blob storage via a `DataStore` interface — both Google Cloud Storage (GCS) and AWS S3 are implemented backends.", weight: 1 }
nice_to_have:
  - { claim: "Can export a fixed ledger range or continuously stream new ledgers (the `append` command).", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Galexie as a SQL/BigQuery query tool or as an RPC endpoint.", weight: 4 }
must_cite:
  - "developers.stellar.org data docs (Galexie) and/or the stellar/go Galexie source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/galexie
  - https://github.com/stellar/stellar-galexie
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Re-verified 2026-06-29: Docker image/repo is `stellar/stellar-galexie` (extracted from stellar/go into its own repo 2026-06-10; old services/galexie path now 404s). Both GCS and S3 are IMPLEMENTED DataStore backends (support/datastore gcs.go + s3.go; `S3DataStore implements DataStore for AWS S3`) — corrected the prior 'S3 pluggable/planned' wording. Reconciled with q-infra-galexie-vs-etl. Trap = conflating with Hubble's SQL layer."
---

## Reference answer (gospel)

**Galexie** is SDF's tool for **extracting, processing, and exporting Stellar ledger metadata** to a
remote **cloud-storage data lake** — it is the **foundation / first step of the Composable Data
Pipeline (CDP)**
([Galexie docs](https://developers.stellar.org/docs/data/galexie)).

- It uses captive-core to read raw ledger metadata, bundles it, and writes **XDR** (Stellar Core's
  native format, compressed) to a configurable cloud datastore via the `DataStore` interface — both
  **Google Cloud Storage (GCS)** and **AWS S3** are implemented backends (`gcs.go` + `s3.go`).
- Run it from the **`stellar/stellar-galexie`** Docker image, e.g.
  `stellar-galexie append --start <ledger> [--end <ledger>] --config-file config.toml` — `append`
  either exports a fixed range or **continuously streams** new ledgers
  ([Galexie developer guide](https://github.com/stellar/stellar-galexie/blob/main/DEVELOPER_GUIDE.md)).

It produces a **raw archival datastore** for downstream pipelines/replay — it is **not** a SQL/BigQuery
query tool (that's Hubble) nor an RPC endpoint.

## Why these cards (routing rationale)

Definitional/how-to for a first-party data tool → `stellar_docs_mcp`; `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Calling Galexie a SQL/query tool is the trap.
