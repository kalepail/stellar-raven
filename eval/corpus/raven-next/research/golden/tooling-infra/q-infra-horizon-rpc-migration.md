---
id: q-infra-horizon-rpc-migration
q: "I'm migrating an app off Horizon onto Stellar RPC — which of my Horizon endpoints have no direct RPC equivalent?"
category: tooling-infra
subcategory: rpc-horizon-migration
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
  - { claim: "There is an official 'Migrate from Horizon to RPC' guide with an endpoint-by-endpoint mapping table.", weight: 4 }
  - { claim: "Several Horizon endpoints have NO direct RPC equivalent — e.g. claimable_balances, liquidity_pools, offers (list), operations/{id}, and effects.", weight: 5 }
  - { claim: "Endpoints with no direct RPC equivalent must be served by Horizon or an indexer (e.g. Hubble, SubQuery/Goldsky/OBSRVR), not RPC.", weight: 4 }
should_have:
  - { claim: "Examples of endpoints that DO map: /transactions→getTransactions, /accounts/{address}→getLedgerEntries, /fee_stats→getFeeStats.", weight: 3 }
  - { claim: "Payments/effects flows can be reconstructed via getEvents + getTransactions rather than a 1:1 endpoint.", weight: 2 }
nice_to_have:
  - { claim: "Notes RPC event history is capped (~7 days), so older history needs an indexer.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim every Horizon endpoint maps cleanly to an RPC method.", weight: 5 }
  - { claim: "Do NOT recommend deprecated Horizon-only behavior as if it were now served by RPC, or invent RPC methods that don't exist.", weight: 4 }
must_cite:
  - "developers.stellar.org migrate-from-horizon-to-rpc guide."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Hard migration case; the trap is over-claiming parity. Verified against the official migration guide's mapping table (no-equivalent set: operations/{id}, accounts list, claimable_balances, liquidity_pools, offers list, payments/effects sub-resources)."
---

## Reference answer (gospel)

Stellar publishes an official **"Migrate from Horizon to RPC"** guide with an endpoint-by-endpoint
mapping table
([migrate-from-horizon-to-rpc](https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc)).
Roughly half of Horizon's REST surface has **no direct RPC equivalent** — Stellar RPC was scoped to
Soroban state + recent ledger history, not classic-Stellar list/index queries.

**No direct RPC equivalent** (serve via Horizon or an indexer):
- `/operations/{id}` and `/operations/{id}/effects`
- `/accounts` (list-all)
- `/claimable_balances` (+ `/{id}/operations`, `/{id}/transactions`)
- `/liquidity_pools` (+ `/{id}/effects`, `/{id}/trades`, `/{id}/transactions`)
- `/offers` (list-all) and `/offers/{id}/trades`
- `/transactions/{hash}/payments` and `/transactions/{hash}/effects`

**Endpoints that DO map:**
- `GET /transactions` → `getTransactions`
- `GET /accounts/{address}` → `getLedgerEntries`
- `GET /offers/{id}` → `getLedgerEntries`
- `GET /fee_stats` → `getFeeStats` (+ `simulateTransaction`)
- `POST /transactions` → `sendTransaction`
- `GET /ledgers` → `getLedgers`

Payments/effects flows are **reconstructed** via `getEvents` + `getTransactions`, not a 1:1 endpoint.
For the no-equivalent set the guide recommends partnering with an **indexer** (SubQuery, Goldsky
Mirrors, OBSRVR) or **Hubble** — RPC event history is also capped (default 24h, max ~7-day window), so
older history needs an indexer regardless.

## Why these cards (routing rationale)

A how-to grounded in a specific first-party migration guide → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Claiming clean parity or inventing RPC methods are the traps.
