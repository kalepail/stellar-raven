---
id: q-ti-self-host-retention-backfill
q: "When self-hosting Horizon/RPC, how do HISTORY_RETENTION_COUNT / HISTORY_RETENTION_WINDOW affect DB size (~1.3 TB for 30d), and why doesn't increasing the window backfill older history?"
category: tooling-infra
subcategory: state-archival
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
  - { claim: "Distinguishes Horizon `HISTORY_RETENTION_COUNT` from Stellar RPC `HISTORY_RETENTION_WINDOW`.", weight: 5 }
  - { claim: "Explains retention as a forward-moving sliding window/purge policy: increasing the value changes what will be retained going forward but does not automatically recreate purged historical rows.", weight: 5 }
  - { claim: "States Horizon docs recommend about a 1-month sliding window (`HISTORY_RETENTION_COUNT=518400`) when retaining unfiltered history, and recommend Hubble for broader history.", weight: 4 }
  - { claim: "States RPC default retention is typically 7 days, with official sizing guidance adding roughly 40GB per retention day; data lake only extends `getLedgers` archive access.", weight: 4 }
  - { claim: "Gives the remedy: run historical ingestion/backfill explicitly where supported, use filters before ingestion, or use Hubble/Galexie/indexers for old history.", weight: 4 }
should_have:
  - { claim: "Mentions changing Horizon ingestion filters also does not retroactively backfill matching historical data; a historical range ingestion is needed.", weight: 3 }
  - { claim: "Caveats storage estimates like 1.3TB/30d as workload/version-dependent rather than a universal constant.", weight: 2 }
nice_to_have:
  - { claim: "Mentions current-state data is separate from history tables in Horizon filtering docs.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say increasing retention backfills older history automatically.", weight: 5 }
  - { claim: "Do NOT conflate Horizon's DB retention count with Soroban contract TTL/archival semantics.", weight: 5 }
  - { claim: "Do NOT imply RPC data lake makes all old events/transactions available through every RPC method.", weight: 4 }
must_cite:
  - "Horizon ingestion storage/retention docs."
  - "RPC retention/data-lake docs."
  - "Horizon filtering docs if discussing retroactive filtering/backfill."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/horizon/admin-guide/ingestion
  - https://developers.stellar.org/docs/data/apis/horizon/admin-guide/ingestion-filtering
  - https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk/developer_guide/ledgerbackends/rpcledgerbackend
  - https://developers.stellar.org/docs/data/apis/rpc/admin-guide/data-lake-integration
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29 differentiation: this file owns the env-var/DB-size MECHANICS lane (HISTORY_RETENTION_COUNT vs HISTORY_RETENTION_WINDOW, sliding-window/no-backfill, sizing); q-ti-self-host-core-rpc-full-history owns the self-host SETUP-ARCHITECTURE lane (Core/Galexie/data-lake + provider table). Retention consistent with normalization: Horizon default ~1-month count (518400 ledgers); RPC default ~7 days (120960 ledgers). The user's ~1.3 TB/30d figure was not made a required exact claim; exact DB size depends on version, filters, and workload."
---

## Reference answer (gospel)

Horizon and RPC use different knobs. Horizon's `HISTORY_RETENTION_COUNT` controls how much ingested historical data remains in Horizon's database; official docs recommend a 1-month sliding window (`518400` ledgers) for unfiltered full-network history and point larger-history use cases toward Hubble [Horizon ingestion](https://developers.stellar.org/docs/data/apis/horizon/admin-guide/ingestion). Stellar RPC's `HISTORY_RETENTION_WINDOW` controls the RPC local sliding ledger range, with docs stating the default is the latest 7 days [RPC ledger backend](https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk/developer_guide/ledgerbackends/rpcledgerbackend).

Increasing a retention window is not a time machine. If older history was purged or never ingested, the database will not repopulate it automatically. Horizon filtering docs explicitly say filter changes do not retroactively filter or backfill existing historical data; to include prior history for newly included entities, run a new Historical Ingestion Range [Horizon filtering](https://developers.stellar.org/docs/data/apis/horizon/admin-guide/ingestion-filtering). For RPC, data-lake integration can extend `getLedgers` outside local retention, but other RPC endpoints still operate from the configured retention window [RPC data lake](https://developers.stellar.org/docs/data/apis/rpc/admin-guide/data-lake-integration).

## Why these cards (routing rationale)

This is an official-docs infrastructure question. `stellar_docs_mcp` should retrieve the Horizon admin guide, RPC ledger backend docs, and data-lake integration docs. `scout_research` is acceptable as a fallback index over the same docs.

## Edge / traps

Do not mix up Horizon history retention, RPC retention, and Soroban contract TTL. Do not promise old data appears after a config bump. The correct remediation is explicit historical ingestion/backfill or a historical data product, not wishful retention tuning.
