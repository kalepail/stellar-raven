---
id: q-soroban-upgradeable-storage-compat
q: "When upgrading a Soroban contract, what do I have to keep compatible so I don't corrupt existing state?"
category: soroban
subcategory: factories-upgradeable
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Because storage survives an upgrade, the new code must keep the same storage keys and value types/layout for existing entries (or migrate them explicitly).", weight: 5 }
  - { claim: "Changing a storage key's name/type without migration leaves the old data stranded / mis-decoded.", weight: 4 }
should_have:
  - { claim: "Use a migration function (run atomically with the upgrade, e.g., an Upgrader/migrate hook) to transform state to the new layout.", weight: 3 }
  - { claim: "The contract address is preserved across the upgrade, so external callers/integrations keep working.", weight: 2 }
nice_to_have:
  - { claim: "Notes versioning the storage schema (a stored version flag) helps gate migrations.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim upgrading wipes storage / starts state fresh.", weight: 4 }
  - { claim: "Do NOT describe EVM proxy storage-slot collision (delegatecall slot layout) as the Soroban concern (Soroban uses named keys, not slots).", weight: 3 }
must_cite:
  - "A developers.stellar.org or OpenZeppelin Stellar upgrade/migration guide."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/conventions/upgrading-contracts
  - https://docs.openzeppelin.com/stellar-contracts/utils/upgradeable
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Storage survives the Wasm replacement; keys/types must stay compatible or be migrated. Soroban uses named keys (not EVM slots). Verified against the SDF upgrade guide + OZ migration patterns."
---

## Reference answer (gospel)

A Soroban upgrade **replaces the Wasm but keeps all existing storage** (and the same contract address).
So the new code must remain compatible with the data already on the ledger: [sdf]

- **Keep the same storage keys and value types/layout** for existing entries. The host deserializes
  stored values using the **new** code's type definitions, so renaming a key or changing a value's type
  without migration leaves old data **stranded or mis-decoded (a trap)**. [oz]
- **Migrate explicitly** when the schema changes. OZ documents three patterns: eager `migrate()` for
  bounded instance data (guarded by a stored **schema-version** flag), **lazy/versioned** conversion on
  read for unbounded persistent data, and a **plan-ahead enum wrapper**. Run migration atomically with
  the upgrade via an **`Upgrader`** contract (the new impl only takes effect after the current call).
  [oz]
- The **contract address is preserved**, so external callers/integrations keep working. [sdf]

Traps: claiming the upgrade wipes storage / starts state fresh; or importing the EVM proxy
**storage-slot-collision** model — Soroban addresses storage by **named keys**, not slot indices.

## Why these cards (routing rationale)

Upgrade-safety fact → `stellar_docs_mcp`. `scout_research`/`scout_repos` acceptable.

## Edge / traps

Claiming storage wipes on upgrade; importing EVM proxy slot-collision model.
