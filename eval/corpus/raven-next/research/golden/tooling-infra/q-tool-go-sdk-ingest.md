---
id: q-tool-go-sdk-ingest
q: "I'm building a Go service to stream Stellar ledger data — what's the official Go SDK and which package handles ingestion?"
category: tooling-infra
subcategory: sdks-go
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Go SDK is `go-stellar-sdk`, maintained by SDF.", weight: 5 }
  - { claim: "It ships multiple packages including `txnbuild`, a Horizon Client, an RPC Client, and an Ingest SDK.", weight: 4 }
  - { claim: "The Ingest SDK is the way to stream/extract ledger data from Stellar Core for custom pipelines.", weight: 4 }
should_have:
  - { claim: "Go is one of the SDF-maintained production SDKs (alongside JS, Rust contract/client).", weight: 2 }
nice_to_have:
  - { claim: "Notes Galexie/stellar-etl as alternative archive-streaming infra outside the SDK.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Go has no ingestion support or that you must use Horizon polling for streaming ledgers.", weight: 3 }
  - { claim: "Do NOT invent package names that aren't in go-stellar-sdk.", weight: 3 }
must_cite:
  - "developers.stellar.org client-sdks page or the stellar/go-stellar-sdk repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/sdks/client-sdks
  - https://github.com/stellar/go
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified against the client-SDKs page: the Go SDK is go-stellar-sdk (SDF-maintained), shipping txnbuild, Horizon Client, RPC Client, and the Ingest SDK. Ingest SDK is the way to stream ledger data. Code historically lives in the stellar/go monorepo."
---

## Reference answer (gospel)

The official Go SDK is **`go-stellar-sdk`**, **maintained by SDF**
([client SDKs](https://developers.stellar.org/docs/tools/sdks/client-sdks)). It ships multiple
packages:

- **`txnbuild`** — build transactions
- **Horizon Client** — REST queries
- **RPC Client** — Stellar RPC
- **Ingest SDK** — the way to **stream/extract ledger data** from Stellar Core for custom pipelines

For your streaming service, use the **Ingest SDK**. Go is one of the **SDF-maintained production
SDKs** (alongside JS and the Rust contract/client crates). For pure archival export outside the SDK,
**Galexie** / **stellar-etl** are alternatives.

Do not claim Go lacks ingestion support (or that you must poll Horizon to stream), and don't invent
package names not in go-stellar-sdk.

## Why these cards (routing rationale)

SDK + ingestion fact → `stellar_docs_mcp`; `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Denying ingestion support or inventing package names are the traps.
