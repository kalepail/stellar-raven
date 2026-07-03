---
id: q-infra-query-contract-events-rpc-howto
q: "How do I query the events emitted by a Soroban contract via Stellar RPC?"
category: tooling-infra
subcategory: rpc
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Uses the Stellar RPC `getEvents` JSON-RPC method to query contract events.", weight: 5 }
  - { claim: "Specifies a ledger range (startLedger/endLedger) and filters by event type, contract id, and/or event topics.", weight: 4 }
should_have:
  - { claim: "Notes events are only retained for a bounded recent window on RPC (default ~24h, max ~7-day query window), so older events need an indexer/archive.", weight: 3 }
  - { claim: "Mentions pagination via the returned cursor (and a limit) for large result sets.", weight: 2 }
nice_to_have:
  - { claim: "Notes events are emitted by contracts via the soroban-sdk events API and are diagnostic/contract-event typed.", weight: 1 }
must_avoid:
  - { claim: "Do NOT tell the user to query contract events from Horizon — Horizon does not serve Soroban contract events; use Stellar RPC getEvents.", weight: 5 }
  - { claim: "Do NOT invent a non-existent RPC method name (e.g. `getContractEvents`) as the canonical call.", weight: 3 }
must_cite:
  - "The Stellar RPC getEvents method page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getEvents
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Axis-C how-to. Procedure → stellar_docs_mcp. Verified getEvents params (startLedger/endLedger, up-to-5 filters w/ type+contract ids+topics, pagination cursor+limit). Retention: default 24h, max 7-day window. Distinct from q-infra-rpc-event-retention and q-soroban-event-indexing-design. Trap = Horizon or inventing getContractEvents."
---

## Reference answer (gospel)

To query a Soroban contract's events, call the **Stellar RPC `getEvents`** JSON-RPC method
([getEvents method](https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getEvents)).
Horizon does **not** serve Soroban contract events.

- Specify a **ledger range** (`startLedger` inclusive / `endLedger` exclusive) and one or more
  **`filters`** (up to 5), each matching by **event type** (`contract` / `system` / `diagnostic`),
  **contract IDs** (up to 5), and **topic** matchers (1–4 segments).
- **Paginate** large result sets via the returned **`cursor`** plus a `limit` (1–10,000, default 100);
  when a cursor is supplied, omit `startLedger`/`endLedger`.
- Events are retained only for a **recent window** (default ~24h, max ~7-day query range), so events
  older than that must be sourced from an **indexer** (SubQuery/Goldsky/OBSRVR) or **Hubble**, not RPC.

The method is literally `getEvents` — there is no `getContractEvents` method.

## Why these cards (routing rationale)

Procedure to query contract events via RPC → `stellar_docs_mcp` (getEvents method page);
`scout_research` acceptable. General-web/deep-research are misses.

## Edge / traps

Pointing to Horizon (it doesn't serve Soroban events — use RPC getEvents), or inventing a
`getContractEvents` method.
