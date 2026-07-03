---
id: q-soroban-restore-archived-entry
q: "My contract's Persistent storage entry got archived. How do I restore it so I can use the contract again?"
category: soroban
subcategory: storage-ttl
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Archived Persistent/Instance entries are restored using a restore operation (`RestoreFootprintOp`) and/or the CLI `stellar contract restore`.", weight: 5 }
  - { claim: "The entry to restore must be named in the transaction's restore footprint.", weight: 3 }
should_have:
  - { claim: "Since CAP-0066 (Protocol 23), `InvokeHostFunction` can auto-restore archived entries listed in its restore footprint within the same transaction.", weight: 3 }
  - { claim: "After restoring, you should extend the entry's TTL (`extend_ttl()`) to keep it live.", weight: 2 }
nice_to_have:
  - { claim: "Notes restoring costs a fee proportional to the entry size.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say archived Persistent data is gone forever / unrecoverable.", weight: 5 }
  - { claim: "Do NOT advise re-deploying the whole contract as the only way to recover archived state.", weight: 3 }
  - { claim: "Do NOT confuse this with Temporary entries (which are not restorable).", weight: 3 }
must_cite:
  - "The developers.stellar.org state-archival / restore guide (and CLI restore reference)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
  - https://developers.stellar.org/docs/tools/cli/stellar-cli
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Freshness: auto-restore is CAP-0066/P23-gated. VERIFIED against state-archival docs (2026-06): archived Persistent/Instance entries are restorable; since Protocol 23 InvokeHostFunction auto-restores entries in the restore footprint (populated by RPC simulation), so RestoreFootprintOp is 'for the most part no longer needed'; Temporary is NOT restorable."
---

## Reference answer (gospel)

Archived **Persistent** (and **Instance**) entries are **not deleted — they are recoverable**:

- **Auto-restore (Protocol 23+):** the simplest path. **`InvokeHostFunction`** automatically restores
  archived entries that appear in the transaction's **restore footprint** (normally populated by **RPC
  simulation** of your call), so you often just **re-simulate and re-invoke** and the restore happens
  in the same transaction. As a result, a manual restore op is *for the most part no longer needed*.
- **Manual restore:** **`RestoreFootprintOp`** (or the CLI **`stellar contract restore`**) restores the
  named entries in the read-write footprint — useful for edge cases / managing restore fees separately.

Either way the entry must be **named in the restore footprint**, and restoring **costs a fee
proportional to entry size**. After restoring, **extend the TTL** (`extend_ttl()` / `stellar contract
extend`) so it stays live.

Do **not** say archived Persistent data is gone forever, advise re-deploying the whole contract, or
confuse this with **Temporary** entries (which are permanently deleted and **cannot** be restored).

## Why these cards (routing rationale)

Operational state-archival how-to → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Claiming archived data is unrecoverable; suggesting full re-deploy; confusing with non-restorable Temporary.
