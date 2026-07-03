---
id: q-ti-self-host-core-rpc-full-history
q: "How do I self-host stellar-core + a separate stellar-rpc with full history (captive-core config, history archives, pointing RPC at an already-synced core) without Quickstart, and which providers offer full Soroban history?"
category: tooling-infra
subcategory: rpc-horizon
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that Stellar RPC is a separate JSON-RPC service backed by captive-core/history access, while Horizon is a REST/HAL classic-data API; self-hosting one does not automatically give every endpoint of the other.", weight: 5 }
  - { claim: "States that default RPC history is a local sliding retention window, typically 7 days, and that full ledger history for RPC is currently the `getLedgers` archive/data-lake path, not full-history support for every RPC method.", weight: 5 }
  - { claim: "Describes the self-host path as running Stellar Core/history archive or Galexie/data lake plus configuring Stellar RPC to use that data lake for archive `getLedgers` access.", weight: 4 }
  - { claim: "Requires checking the live Stellar RPC Providers table for RPC Archive providers because provider coverage is freshness-sensitive.", weight: 4 }
  - { claim: "Avoids claiming that pointing RPC at an already-synced Core alone backfills arbitrary old `getEvents`/`getTransactions` data.", weight: 4 }
should_have:
  - { claim: "Mentions hardware/disk sizing depends on retention; official RPC prerequisites estimate default 7-day retention and additional disk per retention day.", weight: 2 }
  - { claim: "Mentions Hubble/Galexie/indexers for historical analytics beyond hot RPC retention.", weight: 2 }
nice_to_have:
  - { claim: "Mentions the `stellar-rpc` GitHub repo as the implementation source for operator-level verification.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar RPC fully replaces every Horizon endpoint.", weight: 5 }
  - { claim: "Do NOT advertise a static list of full-history providers without a dated source.", weight: 5 }
  - { claim: "Do NOT imply all RPC methods become full-history just because `getLedgers` archive is enabled.", weight: 5 }
must_cite:
  - "Stellar RPC data lake integration docs."
  - "Stellar RPC Providers table for current archive-provider claims."
  - "Stellar RPC and/or Horizon docs when distinguishing API roles."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/rpc/admin-guide/data-lake-integration
  - https://developers.stellar.org/docs/data/apis/rpc/providers
  - https://developers.stellar.org/docs/data/apis/rpc
  - https://github.com/stellar/stellar-rpc
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 differentiation: this file owns the self-host SETUP-ARCHITECTURE lane (run Core/history archive or Galexie/data-lake, point stellar-rpc at the data lake, check the live Providers table); q-ti-self-host-retention-backfill owns the env-var/DB-size MECHANICS lane. Re-verified 2026-06-29 Providers table: RPC Archive applies only to `getLedgers`; default RPC retention ~7 days (120960 ledgers), consistent with normalization. Provider checkmarks are freshness-sensitive and should remain dated."
---

## Reference answer (gospel)

Self-hosting full-history Stellar data is a data-lake/indexing problem, not just "run Core and point RPC at it." Stellar RPC is the JSON-RPC service for network/RPC methods, simulation, ledger entries, transactions, and contract events [RPC overview](https://developers.stellar.org/docs/data/apis/rpc). By default, RPC-backed historical access is bounded by the node's local `HISTORY_RETENTION_WINDOW` (typically 7 days); RPC v23+ data-lake integration extends historical ledger access for the `getLedgers` endpoint outside local retention, while other RPC endpoints still follow the node retention window [data lake integration](https://developers.stellar.org/docs/data/apis/rpc/admin-guide/data-lake-integration).

The self-host architecture is: run the needed Stellar Core/history infrastructure, export or provide ledger metadata through a Galexie/data-lake style backend, and configure `stellar-rpc` to use that data lake for archive `getLedgers` access. For historical analytics or old event/query workloads, use Hubble/Galexie/indexers rather than assuming hot RPC can backfill every method. Hosted "full history" claims must be read from the live RPC Providers table: its note says RPC Archive is for full ledger history and currently only `getLedgers` supports that feature [providers](https://developers.stellar.org/docs/data/apis/rpc/providers). The implementation source is [stellar/stellar-rpc](https://github.com/stellar/stellar-rpc).

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because official RPC admin docs and the providers table are the authoritative source. `parallel_search` is acceptable only for dated provider pages or release notes; `scout_research` can find ecosystem context but should not override the providers table.

## Edge / traps

The traps are saying "RPC full history" when only `getLedgers` archive is meant, confusing Horizon's classic REST surface with RPC, and freezing a provider list without a date. A good answer names the API boundary and tells the user to verify the provider table at answer time.
