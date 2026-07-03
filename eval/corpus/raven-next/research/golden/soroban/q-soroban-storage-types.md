---
id: q-soroban-storage-types
q: "What are the three Soroban storage types and when should I use each?"
category: soroban
subcategory: storage-ttl
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
  - { claim: "The three storage types are Instance, Persistent, and Temporary (accessed via `env.storage()`).", weight: 5 }
  - { claim: "Persistent is for long-lived data like balances/ownership; Temporary is for cheap short-lived data; Instance is for per-contract config/admin data tied to the contract instance.", weight: 4 }
should_have:
  - { claim: "Instance storage is loaded on every contract invocation (so keep it small).", weight: 3 }
  - { claim: "Temporary is the cheapest tier.", weight: 2 }
nice_to_have:
  - { claim: "Notes Instance data shares its TTL with the contract instance entry.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent storage types not in Soroban (e.g., only 'storage'/'memory'/'calldata' as in Solidity).", weight: 5 }
  - { claim: "Do NOT say Temporary data is restorable after expiry, or that Persistent data is permanently deleted on expiry (those are swapped).", weight: 5 }
must_cite:
  - "The developers.stellar.org 'choosing the right storage' or state-archival guide."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/storage/choosing-the-right-storage
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Storage-semantics swap is the headline trap; Solidity storage/memory/calldata is the cross-chain trap. Verified against 'choosing the right storage' + state-archival docs."
---

## Reference answer (gospel)

Soroban exposes **three storage types** via `env.storage()`:

- **Persistent** — long-lived data (balances, allowances, ownership). On TTL expiry it is **archived,
  not deleted, and can be restored**.
- **Temporary** — cheap, short-lived data (ephemeral allowances, pricing snapshots). It is the
  **cheapest** tier, and on TTL expiry it is **permanently deleted** (not restorable).
- **Instance** — small per-contract config/admin data tied to the contract instance entry. It is
  **loaded on every contract invocation** (so keep it small) and shares its **TTL with the contract
  instance**.

Rule of thumb: balances/ownership → Persistent; ephemeral/derivable data → Temporary; admin/config
flags → Instance.

(These are Soroban's tiers — not Solidity's `storage`/`memory`/`calldata`. And don't swap the
semantics: Temporary is **not** restorable; Persistent is **not** permanently deleted on expiry.)

## Why these cards (routing rationale)

Core storage-model fact → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Swapping Temporary/Persistent semantics; importing Solidity's storage/memory/calldata model.
