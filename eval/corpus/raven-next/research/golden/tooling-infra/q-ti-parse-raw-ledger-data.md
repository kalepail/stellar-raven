---
id: q-ti-parse-raw-ledger-data
q: "How do I parse raw ledger data — `LedgerCloseMeta`, the metadataXdr from getLedgers, v4 tx meta, and the `.xdr.zst` files from the AWS public dataset — to extract txs and contract events?"
category: tooling-infra
subcategory: indexing-data
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Centers the answer on `LedgerCloseMeta` as the raw ledger metadata object containing transactions, ledger-entry changes, and Soroban contract events.", weight: 5 }
  - { claim: "Recommends the Go Ingest SDK / `github.com/stellar/go-stellar-sdk/ingest` and `xdr` packages for production parsing rather than ad hoc base64/string parsing.", weight: 5 }
  - { claim: "Distinguishes data sources: RPC `getLedgers`/`getTransactions` for bounded API reads, RPCLedgerBackend for RPC-backed ingest, and data lakes/Galexie/BufferedStorageBackend for bulk historical files.", weight: 4 }
  - { claim: "Explains that `resultMetaXdr` / transaction metadata must be decoded as XDR and inspected for operations, ledger-entry changes, and contract events; v4 meta requires SDK support for current XDR.", weight: 4 }
should_have:
  - { claim: "Mentions the AWS Open Data S3 path `s3://aws-public-blockchain/v1.1/stellar/ledgers/pubnet` as the public data lake cited by Stellar RPC docs.", weight: 3 }
  - { claim: "Mentions `.zst` decompression before XDR decode when consuming compressed files directly.", weight: 2 }
nice_to_have:
  - { claim: "Mentions Hubble/BigQuery when the user only needs analytics tables rather than raw ledger replay.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Horizon/RPC JSON alone exposes every ledger-entry delta without decoding XDR metadata.", weight: 5 }
  - { claim: "Do NOT use stale SDKs that cannot decode current protocol/XDR variants such as newer transaction metadata.", weight: 4 }
  - { claim: "Do NOT confuse Horizon's 1-200 REST pagination limit with RPC `getEvents` pagination limits.", weight: 3 }
must_cite:
  - "Primary Stellar Ingest SDK and RPC/data-lake docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk"
  - "https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk/developer_guide/ledgerbackends"
  - "https://developers.stellar.org/docs/data/apis/rpc/admin-guide/data-lake-integration"
  - "https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc#endpoint-mapping"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: ""
---

## Reference answer (gospel)

Treat all of these inputs as different ways to get the same kind of raw material: XDR-encoded ledger/transaction metadata. `LedgerCloseMeta` is the commit-log-like object that includes transactions, nested operations, ledger-entry changes, and Soroban contract events. The recommended production parser is the Go Ingest SDK, especially `github.com/stellar/go-stellar-sdk/ingest` plus the `xdr` package, because it already understands current protocol XDR and exposes ledger readers/processors.

For source selection: use RPC `getLedgers`/`getTransactions` when you need bounded API reads; use `resultMetaXdr` from `getTransactions` when you need to inspect a transaction's effects/events; use RPCLedgerBackend or Captive Core for streaming/replay pipelines; use Galexie/data-lake files with BufferedStorageBackend for bulk historical replay. Stellar's RPC data-lake docs cite the AWS Open Data path `s3://aws-public-blockchain/v1.1/stellar/ledgers/pubnet`. If you read `.xdr.zst` objects directly, decompress with zstd first, then decode the resulting XDR as the appropriate ledger metadata type.

For v4 transaction metadata, do not hand-roll string parsing. Pin an SDK/XDR library that supports the current protocol, decode the XDR, iterate transactions with an ingest reader, then inspect operations, ledger-entry changes, and events. If you only need reporting or balances rather than raw replay, Hubble/BigQuery or an indexer may be cheaper than parsing raw files yourself.

## Why these cards (routing rationale)

`stellar_docs_mcp` is the expected card because the answer depends on official Ingest SDK, RPC data-lake, and Horizon-to-RPC migration docs. `scout_research` is acceptable for broader CDP/Galexie context, but the exact data-source and parser recommendations are in the official docs.

## Edge / traps

The common wrong answer is to parse `metadataXdr` or `resultMetaXdr` with string operations or assume JSON fields already contain all operation/effect data. Another wrong answer is to use Horizon effect endpoints as a universal replacement; RPC and Horizon expose different surfaces, and raw metadata parsing is specifically for cases where you need ledger-level deltas.
