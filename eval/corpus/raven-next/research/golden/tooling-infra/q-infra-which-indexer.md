---
id: q-infra-which-indexer
q: "Which third-party indexers support Stellar, and which should I pick if I need historical cross-account filtering?"
category: tooling-infra
subcategory: indexers
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Stellar-supporting indexers include SubQuery, Goldsky (Mirrors), OnFinality, OBSRVR, and Mercury; The Graph supports Stellar via Substreams only.", weight: 5 }
  - { claim: "Indexers are needed (rather than RPC) for filtered historical queries because RPC event history is limited (~7 days) and Horizon lacks filtered indexes.", weight: 4 }
should_have:
  - { claim: "SubQuery is a safe default (multi-chain, dedicated Stellar starter); OBSRVR is the most Stellar-native; Goldsky Mirrors fit teams already on Goldsky for EVM.", weight: 3 }
  - { claim: "Some providers (e.g. Alchemy, Allium) are launching/expanding Stellar support around 2026 (freshness-sensitive).", weight: 2 }
nice_to_have:
  - { claim: "References the official Indexers Overview page as the canonical list.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim The Graph offers full Subgraph/Token API support for Stellar (it is Substreams-only).", weight: 4 }
  - { claim: "Do NOT recommend RPC alone for historical cross-account filtering.", weight: 3 }
must_cite:
  - "developers.stellar.org Indexers Overview page."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/indexers
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Re-verified 2026-06-29 against the Indexers Overview: SubQuery, Goldsky (Mirrors), OnFinality, OBSRVR, Mercury support Stellar; The Graph quote confirmed exactly: 'offers Stellar support for Substreams, with no current plans to expand Subgraph or Token API support to Stellar.' Added Space and Time (Q4 2025); Allium (Q1 2026); Alchemy (H1 2026) — freshness-sensitive, retention phrasing matches normalized ~24h default/~7d max. Reward flagging staleness."
---

## Reference answer (gospel)

You need an **indexer** (not RPC) for **historical cross-account filtering** because RPC event history
is bounded (default ~24h, max ~7-day window) and Horizon lacks filtered indexes
([Indexers Overview](https://developers.stellar.org/docs/data/indexers)).

Stellar-supporting indexers:
- **SubQuery** — multi-chain, dedicated Stellar starter repo. Safe default.
- **OBSRVR** — the most **Stellar-native** option (real-time data to a warehouse).
- **Goldsky** — Stellar via **Mirrors/Pipelines** (good fit if you already run Goldsky on EVM).
- **OnFinality** — data hosting for SubQuery.
- **Mercury** — Retroshades for Soroban + GraphQL over Stellar history.
- **The Graph** — Stellar via **Substreams only** (no Subgraph / Token API on Stellar).

For deep historical SQL you can also use **Hubble** (BigQuery). Other providers are
launching/expanding Stellar support around **2025–2026** — **Space and Time** (launched Q4 2025),
**Allium** (Q1 2026), **Alchemy** (targeted H1 2026) — freshness-sensitive; verify timing.

Traps: claiming The Graph offers full Subgraph/Token-API support for Stellar (it's Substreams-only), or
recommending **RPC alone** for historical cross-account filtering.

## Why these cards (routing rationale)

Indexer comparison grounded in the first-party Indexers Overview → `stellar_docs_mcp`; `scout_research`/`scout_repos` acceptable. Deep-research/general-web are misses even though it's freshness-sensitive — the canonical list lives in docs.

## Edge / traps

Overstating The Graph's Stellar support and recommending RPC-only for history are the traps.
