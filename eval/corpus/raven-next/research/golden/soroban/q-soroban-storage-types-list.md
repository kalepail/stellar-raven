---
id: q-soroban-storage-types-list
q: "List the Soroban contract storage types and what each is for — enumerate the storage durabilities a contract can use."
category: soroban
subcategory: storage
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names Instance storage (small contract-instance-scoped state, shares the instance's TTL).", weight: 5 }
  - { claim: "Names Persistent storage (long-lived per-key entries that can be archived and restored).", weight: 5 }
  - { claim: "Names Temporary storage (cheap, can expire permanently and is not restorable).", weight: 5 }
should_have:
  - { claim: "Notes each entry has a TTL and Persistent/Instance entries can be bumped/restored while Temporary cannot.", weight: 3 }
nice_to_have:
  - { claim: "Notes access via env.storage().instance()/persistent()/temporary() in the soroban-sdk.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent a fourth storage type or rename them (e.g. 'Session' / 'Global' storage) as canonical.", weight: 4 }
  - { claim: "Do NOT claim Temporary storage can be restored after it expires.", weight: 4 }
must_cite:
  - "A Soroban storage / state-archival page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/storage
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Axis-C list rebalance. Three durabilities + Temporary-not-restorable verified against the state-archival page. Trap = inventing a fourth type or claiming Temporary is restorable."
---

## Reference answer (gospel)

Soroban contracts have **exactly three** storage durabilities, accessed via
`env.storage().instance()` / `.persistent()` / `.temporary()`. [archival]

- **Instance** — small, contract-instance-scoped state (admin, config, metadata). Shares the
  contract instance's single TTL; one `extend_ttl` bumps all instance entries. Archived (with the
  instance) on expiry and auto-restored via `InvokeHostFunction`. [archival]
- **Persistent** — long-lived per-key entries (e.g., user balances). Independent per-entry TTL;
  archived on expiry and restorable (auto-restored via `InvokeHostFunction` / restore footprint).
  [archival]
- **Temporary** — cheapest, unlimited capacity, for recreatable/time-bounded data (oracle prices,
  signatures). When TTL reaches 0 it is **permanently deleted and CANNOT be restored**. [archival]

Every entry has a TTL (ledgers of remaining life); Persistent/Instance can be bumped and restored,
Temporary cannot be restored once expired. No "Session"/"Global" fourth type exists.

## Why these cards (routing rationale)

Enumerating the three storage durabilities (Instance/Persistent/Temporary) → `stellar_docs_mcp`;
`scout_research` acceptable. General-web/deep-research are misses.

## Edge / traps

Inventing a fourth storage type, or claiming Temporary storage is restorable after expiry.
