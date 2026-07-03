---
id: q-soroban-contractmeta-vs-contractevent
q: "What's the difference between #[contractmeta] and #[contractevent] in soroban-sdk?"
category: soroban
subcategory: sdk-macros
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "`#[contractmeta]` writes static key=value metadata into the Wasm custom section (e.g., version/description); it is not emitted at runtime.", weight: 5 }
  - { claim: "`#[contractevent]` defines a typed contract event whose topics/data are published at runtime via `env.events()`.", weight: 5 }
should_have:
  - { claim: "Contract events are recorded in transaction meta and are queryable off-chain (e.g., via RPC getEvents).", weight: 3 }
nice_to_have:
  - { claim: "Notes `#[contractmeta]` is build-time/static while events are per-invocation/dynamic.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim `#[contractmeta]` emits runtime events or that `#[contractevent]` only writes static Wasm metadata (swap of roles).", weight: 5 }
  - { claim: "Do NOT describe these as Solidity `event`/`emit` keywords.", weight: 2 }
must_cite:
  - "A docs.rs/soroban-sdk or developers.stellar.org reference for both macros."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://docs.rs/soroban-sdk/latest/soroban_sdk/macro.contractmeta.html
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/events
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Comparison; trap is conflating static metadata with runtime events. Verified: contractmeta writes to the Wasm contractmetav0 custom section (build-time); contractevent defines typed runtime events."
---

## Reference answer (gospel)

They operate at **different times** and serve different purposes:

- **`#[contractmeta]`** writes **static `key=value` metadata** into the Wasm **`contractmetav0`
  custom section** at **build time** (e.g. `version`, `description`, or build-verification keys like
  `source_repo`). It is **not** emitted at runtime; it is read by tooling inspecting the Wasm.
- **`#[contractevent]`** defines a **typed contract event** whose **topics + data are published at
  runtime** via `env.events()` during an invocation. Those events are recorded in the **transaction
  meta** and read off-chain (e.g. Stellar RPC `getEvents`); the leading topics are indexed for
  filtering.

In short: `contractmeta` = static, build-time Wasm metadata; `contractevent` = dynamic, per-invocation
runtime event. (Not Solidity `event`/`emit`.)

## Why these cards (routing rationale)

SDK macro comparison → `stellar_docs_mcp`. `scout_repos`/`scout_research` acceptable.

## Edge / traps

Conflating static Wasm metadata (`contractmeta`) with runtime event emission (`contractevent`).
