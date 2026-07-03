---
id: q-infra-horizon-vs-rpc
q: "What's the difference between Horizon and Stellar RPC, and which one should I use for a new Soroban app?"
category: tooling-infra
subcategory: rpc-horizon
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
  - { claim: "Horizon is the REST/HAL API for classic Stellar data (accounts, transactions, operations, payments, offers, liquidity pools, claimable balances, effects).", weight: 5 }
  - { claim: "Stellar RPC is the JSON-RPC 2.0 API scoped to Soroban smart-contract state, simulation, and submission.", weight: 5 }
  - { claim: "For new Soroban-facing applications, build against Stellar RPC.", weight: 4 }
should_have:
  - { claim: "Roughly half of Horizon's endpoints have no direct RPC equivalent (e.g. claimable balances, offers, liquidity pools, operations/{id}, effects), so Horizon or an indexer is still needed for those.", weight: 3 }
  - { claim: "Both return XDR values inside JSON.", weight: 1 }
nice_to_have:
  - { claim: "Notes Horizon is not formally deprecated but RPC is positioned as the forward path for Soroban.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim RPC fully replaces Horizon / that all Horizon endpoints have a direct RPC equivalent.", weight: 5 }
  - { claim: "Do NOT swap the roles (calling Horizon the Soroban API or RPC the classic-data REST API).", weight: 5 }
must_cite:
  - "developers.stellar.org Horizon overview, RPC overview, and the migrate-from-horizon-to-rpc guide."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/horizon
  - https://developers.stellar.org/docs/data/apis/rpc
  - https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Core must_avoid: confusing Horizon/RPC roles + over-claiming a wholesale migration. This is the must_avoid the brief flagged."
---

## Reference answer (gospel)

- **Horizon** = the **REST/HAL API for classic Stellar data**: accounts, transactions, operations,
  payments, offers, liquidity pools, claimable balances, effects.
- **Stellar RPC** = the **JSON-RPC 2.0 API scoped to Soroban**: contract state (`getLedgerEntries`),
  simulation (`simulateTransaction`), submission (`sendTransaction`), events (`getEvents`).
- **For a new Soroban-facing app, build against Stellar RPC.** But **~half of Horizon's endpoints have
  no direct RPC equivalent** (claimable balances, offers, liquidity pools, `operations/{id}`, effects),
  so keep Horizon or add an indexer for those. Both APIs return **XDR values inside JSON**. Horizon is
  **not formally deprecated**; RPC is just the forward path for Soroban.

## Why these cards (routing rationale)

A vs B comparison fully answerable from first-party docs → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Swapping the two roles (calling Horizon the Soroban API, or RPC the classic-data REST API), or claiming
RPC fully replaces Horizon, are the load-bearing traps.
