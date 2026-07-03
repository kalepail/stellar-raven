---
id: q-soroban-ttl-expiry-behavior
q: "What happens to Persistent vs Temporary storage entries when their TTL runs out?"
category: soroban
subcategory: storage-ttl
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
  - { claim: "When a Persistent (or Instance) entry's TTL expires it is archived, NOT deleted, and can be restored later.", weight: 5 }
  - { claim: "When a Temporary entry's TTL expires it is permanently deleted and cannot be restored.", weight: 5 }
should_have:
  - { claim: "TTL is the number of ledgers until `liveUntilLedger`; you extend it with `extend_ttl()`.", weight: 3 }
  - { claim: "Archived Persistent/Instance entries are restored via a restore footprint / RestoreFootprintOp (auto-restore available since CAP-0066 / Protocol 23).", weight: 2 }
nice_to_have:
  - { claim: "Notes you should proactively extend TTL on critical entries to avoid eviction.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Temporary data can be restored after expiry.", weight: 5 }
  - { claim: "Do NOT claim Persistent data is permanently deleted (lost) when TTL hits zero.", weight: 5 }
  - { claim: "Do NOT describe TTL as a wall-clock timer rather than a ledger count.", weight: 2 }
must_cite:
  - "The developers.stellar.org state-archival documentation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
  - https://developers.stellar.org/docs/build/guides/storage/choosing-the-right-storage
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). The defining TTL-behavior trap: restorable vs permanently-deleted by tier. VERIFIED against state-archival docs: Temporary is permanently deleted/non-restorable on expiry; Persistent & Instance are archived & restorable; auto-restore since P23/CAP-0066. TTL is in ledgers (liveUntilLedger)."
---

## Reference answer (gospel)

The behavior **differs by tier**:

- **Persistent (and Instance):** when TTL expires the entry is **archived, not deleted**, and can be
  **restored** later (named in a restore footprint / `RestoreFootprintOp`; **auto-restored** by
  `InvokeHostFunction` since **CAP-0066 / Protocol 23**).
- **Temporary:** when TTL expires the entry is **permanently deleted** and **cannot be restored**.

**TTL** is the number of **ledgers** remaining until the entry's **`liveUntilLedger`** (it's a ledger
count, **not** a wall-clock timer); the entry becomes inaccessible once `current_ledger >
liveUntilLedger`. Extend it with **`extend_ttl()`**, and proactively extend critical entries to avoid
eviction.

Don't swap the semantics: Temporary is **not** restorable; Persistent is **not** permanently lost.

## Why these cards (routing rationale)

State-archival/TTL semantics → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Saying Temporary is restorable or Persistent is permanently lost; treating TTL as wall-clock.
