---
id: q-infra-hubble-vs-rpc-layer
q: "Should I read account balances and history from Stellar RPC or from Hubble/BigQuery? When does each make sense?"
category: tooling-infra
subcategory: analytics-vs-rpc
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Use RPC for live/current-state and hot reads (it is rate-limited and not built for large historical scans).", weight: 4 }
  - { claim: "Use Hubble (BigQuery) for bulk historical SQL analytics across the full network record.", weight: 4 }
should_have:
  - { claim: "An indexer covers the in-between window (filtered historical queries beyond RPC's limited event window — 24h default, ~7 days max).", weight: 3 }
  - { claim: "Choosing the wrong layer inflates cost — RPC for historical scans is rate-limited; BigQuery for low-latency reads is wasteful.", weight: 2 }
nice_to_have:
  - { claim: "Per-account current state can come from RPC `getLedgerEntries` or Horizon /accounts/{address}.", weight: 1 }
must_avoid:
  - { claim: "Do NOT recommend RPC for bulk historical scans or Hubble/BigQuery for low-latency single-account live reads.", weight: 4 }
must_cite:
  - "developers.stellar.org RPC, Hubble, and/or indexers docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/rpc
  - https://developers.stellar.org/docs/data/analytics/hubble
  - https://developers.stellar.org/docs/data/indexers
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Three-layer (RPC / indexer / Hubble) decision; the trap is using the wrong layer for the workload. RPC event window is 24h default / ~7 days max (not a flat 7d)."
---

## Reference answer (gospel)

Pick the layer by workload, not by habit:

- **Stellar RPC** — **live/current-state and hot reads** (per-account current state via
  `getLedgerEntries`, recent contract events via `getEvents`). RPC is **rate-limited and not built for
  large historical scans**; its event window is short (**24h default, ~7 days max**).
- **Hubble (BigQuery, `crypto-stellar.crypto_stellar`)** — **bulk historical SQL analytics** across the
  full network record (e.g. `accounts_current`). Wrong for low-latency single-account reads.
- **An indexer** (SubQuery, Goldsky Mirrors, OBSRVR, Mercury) — the **in-between window**: filtered
  historical queries beyond RPC's event window but not a full BigQuery scan.

Choosing the wrong layer inflates cost — RPC for historical scans gets rate-limited; BigQuery for
low-latency live reads is wasteful.

## Why these cards (routing rationale)

Layer-selection comparison from first-party docs → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Recommending RPC for bulk historical scans, or Hubble/BigQuery for low-latency single-account live reads.
