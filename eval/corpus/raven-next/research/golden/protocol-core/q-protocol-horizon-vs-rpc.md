---
id: q-protocol-horizon-vs-rpc
q: "At the protocol-data layer, what does Horizon expose versus what Stellar RPC exposes — i.e. historical/classic ledger data (accounts, transactions, ledgers, the classic DEX) versus live Soroban contract state, events, and simulation — and why does that split exist?"
category: protocol-core
subcategory: data-apis
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
  - { claim: "States Horizon is the REST-like API returning JSON (HAL), oriented at historical/classic data (accounts, transactions, ledgers, DEX).", weight: 5 }
  - { claim: "States Stellar RPC is a JSON-RPC 2.0 server oriented at Soroban — real-time state, transaction simulation (simulateTransaction), and contract events (getEvents).", weight: 5 }
should_have:
  - { claim: "Explains the data split: Horizon aggregates and serves historical/classic ledger data, while RPC exposes near-head ledger state, contract events, and footprint/fee simulation — RPC keeps only a short window of recent ledgers, so deep history requires Horizon or an indexer.", weight: 3 }
  - { claim: "Notes some rich historical queries (e.g. full account/payment history) are a Horizon strength and need an indexer when building on RPC alone.", weight: 2 }
nice_to_have:
  - { claim: "Mentions example RPC methods like getLedgers / getEvents / simulateTransaction that expose the protocol-data surface.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Horizon uses JSON-RPC or that Stellar RPC is a REST/HAL API (the transports are swapped).", weight: 4 }
  - { claim: "Do NOT claim Stellar RPC serves full historical ledger data the way Horizon does (RPC keeps only a recent window).", weight: 3 }
must_cite:
  - "The 'Migrate from Horizon to RPC' docs on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Refocused onto the protocol-data-layer angle (what ledger data each surface exposes + the history-window split) to stay distinct from the tooling-infra q-infra-horizon-vs-rpc 'which should I use for a new app' comparison. Trap is swapping the transports or claiming RPC serves full history."
---

## Reference answer (gospel)

- **Horizon** is a **REST-like API returning JSON (HAL)**, oriented at **historical / classic** ledger data — accounts, transactions, ledgers, and the classic DEX [1].
- **Stellar RPC** is a **JSON-RPC 2.0** server oriented at **Soroban** — real-time state, transaction simulation (`simulateTransaction`), and contract events (`getEvents`) [1].
- **The split**: Horizon aggregates and serves deep historical/classic data, while RPC exposes **near-head ledger state**, contract events, and footprint/fee simulation. RPC keeps only a **short window** of recent ledgers, so deep history (e.g. full account/payment history) needs Horizon or an indexer [1].
- Example RPC methods on the protocol-data surface: `getLedgers`, `getEvents`, `simulateTransaction` [1]. Do **not** swap the transports (Horizon is not JSON-RPC; RPC is not REST/HAL).

## Why these cards (routing rationale)

API comparison → `stellar_docs_mcp` (migration guide). `scout_research` acceptable. No general-web.

## Edge / traps

Swapping the transports (Horizon=JSON-RPC, RPC=REST) or recommending Horizon as the new-app default are
the traps.
