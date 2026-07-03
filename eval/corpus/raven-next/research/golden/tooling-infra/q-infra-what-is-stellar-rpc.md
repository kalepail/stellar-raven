---
id: q-infra-what-is-stellar-rpc
q: "What is Stellar RPC, and is it the same thing as Soroban RPC?"
category: tooling-infra
subcategory: rpc-horizon
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Stellar RPC is a JSON-RPC 2.0 server that surfaces Soroban smart-contract state and lets you simulate contract calls and submit transactions.", weight: 5 }
  - { claim: "Stellar RPC is the new name for what was previously called Soroban RPC (renamed in November 2024).", weight: 5 }
should_have:
  - { claim: "It is distinct from Horizon (Horizon is the REST/HAL API for classic Stellar data).", weight: 3 }
nice_to_have:
  - { claim: "Both return XDR-encoded values inside JSON, decodable by the SDKs.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar RPC and Soroban RPC are unrelated/different products, or that Soroban RPC still exists as a separate live service.", weight: 4 }
  - { claim: "Do NOT describe Stellar RPC as a REST API or conflate it with Horizon.", weight: 4 }
must_cite:
  - "developers.stellar.org RPC overview or the migrate-from-horizon-to-rpc page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/rpc
  - https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "The Soroban-RPC→Stellar-RPC rename (Nov 2024) is a documented naming trap agents get wrong."
---

## Reference answer (gospel)

**Stellar RPC** is a **JSON-RPC 2.0 server** that surfaces **Soroban smart-contract state** and lets you
**simulate contract calls (`simulateTransaction`) and submit transactions (`sendTransaction`)**, plus
read events, ledger entries, and network info. **It is the same product that was previously called
"Soroban RPC" — renamed to "Stellar RPC" in November 2024** to reflect that it reaches beyond
Soroban-only use. So "Soroban RPC" and "Stellar RPC" are **not two different services**; Soroban RPC no
longer exists as a separate live product. It is **distinct from Horizon** (Horizon is the REST/HAL API
for classic Stellar data). Both return XDR-encoded values inside JSON, decodable by the SDKs.

## Why these cards (routing rationale)

Definitional fact about a first-party API → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Treating Soroban RPC and Stellar RPC as separate/unrelated products, or describing Stellar RPC as a REST
API / conflating it with Horizon.
