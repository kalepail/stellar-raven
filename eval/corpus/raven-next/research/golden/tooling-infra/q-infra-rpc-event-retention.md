---
id: q-infra-rpc-event-retention
q: "How far back can I query contract events from Stellar RPC, and what do I do if I need older history?"
category: tooling-infra
subcategory: rpc-methods
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Stellar RPC `getEvents` retains only a limited recent window of events (default ~24 hours; the queryable range maxes out around ~7 days), NOT full history.", weight: 5 }
  - { claim: "For older/historical data you should use an indexer or Hubble (BigQuery), not RPC.", weight: 4 }
should_have:
  - { claim: "Hubble provides a complete historical record; third-party indexers (SubQuery, Goldsky Mirrors, OBSRVR) cover filtered historical queries.", weight: 2 }
nice_to_have:
  - { claim: "Notes the retention limit is why RPC is for live/hot reads and indexers are for historical scans.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim RPC retains the full event history indefinitely.", weight: 5 }
must_cite:
  - "developers.stellar.org getEvents method page and/or indexers/Hubble docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getEvents
  - https://developers.stellar.org/docs/data/analytics/hubble
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29 re-verified + retention phrasing normalized across tooling-infra: getEvents reference says ~24h default / 7-day max queryable; the unified HISTORY_RETENTION_WINDOW config default is 120960 ledgers (~7 days) for transactions and events. This file owns the simple FAQ lane (24h-default/7d-max + use indexer/Hubble); q-ti-historical-events-beyond-retention owns the archive-RPC/data-lake/TTL/CAP-67 lane. Durable fact = bounded window, not full history."
---

## Reference answer (gospel)

Stellar RPC's **`getEvents`** keeps only a **bounded recent window** — the getEvents reference says the
RPC retains the **most recent ~24 hours** of events by default, with the queryable range topping out at
roughly a **7-day** window of recent ledgers; it does **not** hold full event history
([getEvents docs](https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getEvents)).
(Retention is operator-configurable via `HISTORY_RETENTION_WINDOW`, whose unified config default is
120960 ledgers ≈ **7 days** for transactions and events, so a given provider may differ — the durable
fact is "bounded recent window, ~7-day max, not full history.")

For **older / historical** events, use:
- **Hubble** (BigQuery `crypto-stellar.crypto_stellar`) for a complete historical record
  ([Hubble](https://developers.stellar.org/docs/data/analytics/hubble)), or
- a **third-party indexer** (SubQuery, Goldsky Mirrors, OBSRVR) for filtered historical queries.

This is why RPC is for **live/hot reads** and indexers/Hubble are for **historical scans**.

## Why these cards (routing rationale)

Operational fact about RPC limits → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Claiming unlimited RPC history retention is the trap.
