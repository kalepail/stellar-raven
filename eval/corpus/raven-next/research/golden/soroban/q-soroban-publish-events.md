---
id: q-soroban-publish-events
q: "How do I emit an event from a Soroban contract and how long can I read it back afterward?"
category: soroban
subcategory: events
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Emit events with `env.events().publish((topics...), data)` (optionally via the typed `#[contractevent]` macro).", weight: 5 }
  - { claim: "Events are written into the transaction meta and read off-chain via Stellar RPC `getEvents`.", weight: 4 }
should_have:
  - { claim: "RPC retains queryable events for a limited window (about 7 days); for older events you need an external indexer.", weight: 3 }
  - { claim: "The leading topics are indexed and used to filter event subscriptions.", weight: 2 }
nice_to_have:
  - { claim: "Notes events are dropped if the transaction reverts.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim events are stored on-ledger forever and freely queryable for all history from RPC.", weight: 4 }
  - { claim: "Do NOT describe Solidity `emit`/`event` syntax or `indexed` keyword as the Soroban mechanism.", weight: 3 }
must_cite:
  - "The developers.stellar.org events / RPC getEvents documentation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/events
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getEvents
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Retention (~7 days) is the key fact; 'forever queryable' is the trap. Verified: events published via env.events().publish, read via RPC getEvents with a bounded retention window (~7 days)."
---

## Reference answer (gospel)

Emit an event with **`env.events().publish((topic1, topic2, …), data)`** (optionally defined as a
typed event via the **`#[contractevent]`** macro). The leading topics are **indexed** and used to
filter subscriptions.

Events are written into the **transaction meta** (they are part of the transaction result, not
long-lived ledger state) and read **off-chain via Stellar RPC `getEvents`**. RPC only retains
queryable events for a **bounded window (on the order of ~7 days / a configured retention period)** —
for older history you must run/consult an **external indexer**. Events emitted by a transaction that
**reverts are dropped**.

So: not Solidity `emit`/`indexed`, and **not** stored on-ledger forever or freely queryable for all
history from RPC.

## Why these cards (routing rationale)

Events how-to + retention → `stellar_docs_mcp`. `scout_repos`/`scout_research` acceptable.

## Edge / traps

Claiming infinite RPC event history; Solidity `emit`/`indexed` syntax.
