---
id: q-soroban-oz-upgradeable-macro
q: "How does OpenZeppelin's Upgradeable module for Stellar make a Soroban contract upgradeable?"
category: soroban
subcategory: openzeppelin
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "OpenZeppelin's Upgradeable module provides derive macros (e.g., `Upgradeable` / `UpgradeableMigratable`) that wire up an admin-gated `upgrade` entrypoint over native Wasm replacement (`update_current_contract_wasm`).", weight: 5 }
  - { claim: "It uses Soroban's in-place Wasm-replacement model (same address/state preserved), NOT an EVM-style proxy/delegatecall.", weight: 4 }
should_have:
  - { claim: "Upgrades must be access-controlled (only an authorized admin/role can call upgrade).", weight: 3 }
  - { claim: "Storage-key layout must remain compatible across the upgrade; a migrate hook handles state changes atomically.", weight: 2 }
nice_to_have:
  - { claim: "References an Upgrader contract pattern for atomic upgrade-and-migrate.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe a transparent/UUPS proxy with delegatecall as the OZ-for-Stellar mechanism.", weight: 4 }
  - { claim: "Do NOT claim the upgrade changes the contract address or wipes storage.", weight: 4 }
must_cite:
  - "OpenZeppelin Stellar docs (Upgradeable module) or developers.stellar.org upgrade guide."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://docs.openzeppelin.com/stellar-contracts/utils/upgradeable
  - https://developers.stellar.org/docs/build/guides/conventions/upgrading-contracts
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "OZ provides #[derive(Upgradeable)] / #[derive(UpgradeableMigratable)] over Soroban's native update_current_contract_wasm; access control left to implementor; Upgrader contract for atomic upgrade+migrate. Verified against OZ utils/upgradeable + the SDF upgrading-contracts guide."
---

## Reference answer (gospel)

OpenZeppelin's Upgradeable module wraps **Soroban's native, protocol-level upgrade mechanism** — a
contract replacing its own Wasm via **`env.deployer().update_current_contract_wasm(new_wasm_hash)`** —
in ergonomic derive macros; it is **not** an EVM proxy/delegatecall. [oz][sdf]

- **`#[derive(Upgradeable)]`** — for plain bytecode replacement; **`#[derive(UpgradeableMigratable)]`** —
  when storage entries must be migrated as part of the upgrade. The macros sequence operations so
  migration can only run after a successful upgrade. [oz]
- **Access control is the implementor's responsibility**: you implement `UpgradeableInternal` /
  `UpgradeableMigratableInternal` to `require_auth` an admin/role before upgrading. [oz]
- The **contract address and storage are preserved** across the upgrade; only the executable changes.
  [sdf]
- Because the new implementation only takes effect **after the current call completes**, OZ documents
  an auxiliary **`Upgrader` contract** that wraps upgrade + migrate into one **atomic** transaction.
  Storage-key layout must stay compatible (no automatic compatibility checking). [oz]

Traps: describing a transparent/UUPS proxy with delegatecall as the OZ-for-Stellar mechanism; or
claiming the upgrade changes the contract address or wipes storage.

## Why these cards (routing rationale)

Upgrade pattern how-to → `stellar_docs_mcp` / OZ docs; `scout_repos` acceptable.

## Edge / traps

UUPS/transparent-proxy delegatecall framing; claiming address change / storage wipe.
