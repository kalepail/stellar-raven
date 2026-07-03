---
id: q-ti-run-tune-own-horizon
q: "How do I run and tune my own Horizon (reingestion with parallel workers, Postgres tuning, asset/pool ingestion whitelist, Captive Core vs standalone), and what changed in v24 that removed non-history data?"
category: tooling-infra
subcategory: rpc-horizon
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains Horizon deployment roles: API service, ingestion process, PostgreSQL, and Stellar Core/Captive Core connectivity for network data.", weight: 5 }
  - { claim: "Covers historical reingestion and parallel ingestion workers as Horizon admin-guide topics for replaying ranges faster, with storage/DB capacity caveats.", weight: 4 }
  - { claim: "Explains ingestion filtering as an account/asset whitelist for historical data, not retroactive backfill or a liquidity-pool-only filter; changed rules require new historical ingestion for prior data.", weight: 5 }
  - { claim: "Mentions monitoring/Postgres tuning via Horizon metrics, DB pool/query metrics, hardware/storage sizing, and retention settings rather than one universal config.", weight: 4 }
should_have:
  - { claim: "For v24/non-history change, requires a dated release note or upstream Horizon source before asserting exact behavior; answer should state the caveat if not verified.", weight: 4 }
  - { claim: "Distinguishes Horizon REST classic-data APIs from Stellar RPC JSON-RPC and recommends RPC/indexers where appropriate.", weight: 3 }
  - { claim: "Mentions Captive Core as the normal embedded ingestion path and standalone Core as a specialized ops choice.", weight: 2 }
nice_to_have:
  - { claim: "Mentions Hubble or other indexers as lower-ops alternatives for historical analytics.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar RPC fully replaces every Horizon endpoint or swap their roles.", weight: 5 }
  - { claim: "Do NOT claim whitelist changes retroactively purge/backfill old history.", weight: 5 }
  - { claim: "Do NOT assert the Horizon v24 non-history-data change without a dated primary source.", weight: 5 }
must_cite:
  - "Primary Horizon admin-guide docs, plus a dated release/source URL for any Horizon v24-specific claim."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/apis/horizon/admin-guide/ingestion"
  - "https://developers.stellar.org/docs/data/apis/horizon/admin-guide/ingestion-filtering"
  - "https://developers.stellar.org/docs/data/apis/horizon/admin-guide/monitoring"
  - "https://developers.stellar.org/docs/data/apis/horizon/admin-guide/prerequisites"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "The general Horizon ops/filtering guidance is verified from current docs. The specific 'v24 removed non-history data' phrasing was not verified from a primary release note in Phase 3, so it remains a caveated should-level expectation rather than a hard gate."
---

## Reference answer (gospel)

Running Horizon is an operations project, not a single command. You need a Horizon API process, a PostgreSQL database, and an ingestion role that receives network data through Captive Core or a connected Stellar Core setup. Current admin docs emphasize network access, storage sizing, database health, and metrics; hardware and Postgres settings depend on retention, traffic, and whether you ingest full history.

For reingestion, use Horizon's historical ingestion/range mechanisms and parallel ingestion workers when replaying ranges. Parallelism can improve catch-up, but it also increases database and storage pressure, so watch Horizon's admin metrics, `horizon_ingest_*`, `horizon_db_*`, HTTP latency, and host process metrics. Ingestion filtering is a whitelist for historical ingestion by account id and canonical asset id. It does not retroactively backfill newly whitelisted entities, and removing rules does not retroactively purge already stored rows; run a new historical ingestion range when you need prior history for a newly added account/asset.

Captive Core is usually the easier ingestion path because Horizon manages a Core subprocess for network data. A standalone Core may be appropriate when your ops model already runs Core separately. Horizon remains the REST/HAL API for classic Stellar data; Stellar RPC is the JSON-RPC surface for Soroban, simulation, transactions/events, and newer data-lake integrations. Do not treat RPC as a drop-in replacement for every Horizon endpoint.

The v24-specific claim that "non-history data" was removed needs a dated upstream release note or source citation before it should be hard-gated. A good Raven answer should either cite that release note directly or say the change could not be verified and fall back to current admin-guide behavior.

## Why these cards (routing rationale)

`stellar_docs_mcp` is expected because Horizon prerequisites, ingestion, filtering, and monitoring are all official admin-guide pages. `parallel_search` is acceptable for dated release notes when the user asks what changed in a specific version. `scout_research` may help find ecosystem/operator commentary but should not replace primary Horizon docs.

## Edge / traps

Do not say filtering is a magic storage fix that rewrites old data. Do not promise a universal Postgres tuning recipe. Do not answer this as an RPC setup question; Horizon and RPC have different APIs and operational shapes.
