---
id: q-ti-historical-events-beyond-retention
q: "Soroban events live on-chain forever but standard RPC serves ~7 days — what's the reliable source of truth for old events (archive RPC, custom indexer, how the explorer does it), and do event topics follow a standard (CAP-67, topic[0]=name)?"
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
  - { claim: "States that standard Stellar RPC getEvents has a limited retention window (the getEvents reference cites ~24h default, ~7-day max queryable; the unified HISTORY_RETENTION_WINDOW config default is ~7 days/120960 ledgers), so old events require prior ingestion, an indexer, Hubble/Galexie-style data, or an archive/data-lake-backed path where supported.", weight: 5 }
  - { claim: "Explains that RPC data-lake integration extends getLedgers, while other RPC endpoints still follow HISTORY_RETENTION_WINDOW; do not imply getEvents automatically backfills from genesis.", weight: 5 }
  - { claim: "Distinguishes event/history retention from Soroban state TTL/archival; expired Temporary entries cannot be restored and increasing retention does not recreate data never ingested.", weight: 4 }
  - { claim: "Gives an operational pattern: ingest getEvents continuously into your database or run/use an indexer/explorer data source for historical queries.", weight: 4 }
should_have:
  - { claim: "Mentions event topics are arrays of ScVals; CAP-67 (Unified Asset Events, Final in protocol 23) standardizes asset events (transfer/mint/burn/clawback/fee/set_authorized) with a leading symbol name in topic[0] across Classic and the SAC (SEP-41-compatible), but this is an asset-event standard — consumers of arbitrary custom contract events should rely on the emitting contract/spec, not assume topic[0]=name universally.", weight: 3 }
nice_to_have:
  - { claim: "Mentions RPC LedgerBackend/data-lake settings for custom ingestion infrastructure.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT imply Soroban state is never archived, that expired Temporary entries can be restored, that increasing retention backfills old data, or that getEvents has genesis history on a default RPC.", weight: 5 }
  - { claim: "Do NOT overstate CAP-67/topic[0] as a universal event-topic standard for every contract event (CAP-67 standardizes asset events, not all custom contract events).", weight: 4 }
must_cite:
  - "RPC event retention/data-lake docs and event ingestion docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/guides/events/ingest"
  - "https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk/developer_guide/ledgerbackends/rpcledgerbackend"
  - "https://developers.stellar.org/docs/data/apis/rpc/admin-guide/data-lake-integration"
  - "https://developers.stellar.org/docs/data/indexers"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: CAP-67 verified via stellar/stellar-protocol core/cap-0067.md — title 'Unified Asset Events', Status Final, Protocol version 23; standardizes transfer/mint/burn/clawback/fee/set_authorized events across Classic + SAC, SEP-41-compatible (leading event-name symbol in topic[0]) — but it is an ASSET-event standard, not a universal contract-event schema (rubric keeps the must_avoid against overstating topic[0]). Retention normalized: getEvents page says ~24h default/7-day max, unified HISTORY_RETENTION_WINDOW config default ~7 days/120960 ledgers — durable point is bounded window + need for ingestion/indexing. This file owns the archive/data-lake/TTL/CAP-67 lane; q-infra-rpc-event-retention owns the simple FAQ."
---

## Reference answer (gospel)

Do not rely on a default RPC for old Soroban events. RPC event history is a bounded recent window, not full history: the `getEvents` reference still reads "most recent 24 hours of events" by default with a maximum ~7-day queryable window, while the unified `HISTORY_RETENTION_WINDOW` config default is 120960 ledgers (~7 days) and governs transactions and events [1]. The RPC LedgerBackend docs tie accessible ledger range to that retention window unless data-lake settings extend available ledgers [2]. Even then, the data-lake admin guide says RPC v23 data-lake integration extends `getLedgers`; all other RPC endpoints still operate from `HISTORY_RETENTION_WINDOW` [3].

Reliable patterns are: ingest `getEvents` continuously into your own database; use a third-party indexer/explorer; or build on Galexie/Hubble/data-lake style infrastructure where it exposes the data shape you need [4]. Increasing retention later does not backfill events you never ingested from the default endpoint.

Event topics are contract-emitted ScVal topic arrays. CAP-67 (Unified Asset Events, Final in protocol 23) does standardize *asset* events — `transfer`, `mint`, `burn`, `clawback`, `fee`, `set_authorized` — emitted in both Classic and the Stellar Asset Contract with a leading symbolic event name in `topic[0]` and made SEP-41-compatible. But that is a standard for asset movement, not a universal schema: a consumer indexing arbitrary custom contracts should key off the specific contract/spec it is indexing instead of assuming `topic[0]` is globally standardized for every event.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for RPC/event retention and data-lake docs. `scout_research` is acceptable for ecosystem indexer/explorer discovery but should not replace primary retention semantics.

## Edge / traps

The traps are saying "events live forever, just call RPC" or conflating state TTL archival with historical event retention. Another trap is assuming archive/data-lake support on `getLedgers` means `getEvents` can query from genesis.
