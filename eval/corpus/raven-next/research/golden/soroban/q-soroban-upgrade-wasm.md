---
id: q-soroban-upgrade-wasm
q: "How do I upgrade a deployed Soroban contract's code without changing its contract address?"
category: soroban
subcategory: deploy-upgrade
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Soroban supports in-place Wasm replacement: upload the new Wasm, then have the contract call `env.deployer().update_current_contract_wasm(new_wasm_hash)` to swap its code while keeping the same address and storage.", weight: 5 }
  - { claim: "The upgrade entrypoint must be gated by authorization (e.g., an admin `require_auth`) so only an authorized party can upgrade.", weight: 4 }
should_have:
  - { claim: "Storage/state persists across the upgrade, so the new code must keep storage-key layout compatible.", weight: 3 }
  - { claim: "The new Wasm must first be uploaded (`stellar contract upload`) to get its hash.", weight: 2 }
nice_to_have:
  - { claim: "Notes a proxy/data-vs-impl split is an alternative pattern, but native Wasm replacement is the canonical Soroban way (no separate proxy needed).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim you must redeploy to a new address (losing state) to change a contract's code.", weight: 5 }
  - { claim: "Do NOT prescribe an EVM proxy pattern (delegatecall/UUPS/transparent proxy) as the required Soroban mechanism.", weight: 4 }
  - { claim: "Do NOT omit that the upgrade must be access-controlled.", weight: 3 }
must_cite:
  - "A developers.stellar.org upgrading-contracts guide (or OpenZeppelin Upgradeable for Stellar)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/upgrading-contracts
  - https://docs.openzeppelin.com/stellar-contracts/upgradeable
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). EVM proxy pattern is the trap; native update_current_contract_wasm is the Soroban way. Verified: in-place Wasm replacement via env.deployer().update_current_contract_wasm(hash), admin-gated, address+storage preserved."
---

## Reference answer (gospel)

Soroban supports **in-place Wasm replacement** — the contract **keeps its same address and storage**:

1. **Upload** the new Wasm (`stellar contract upload`) to get its **Wasm hash**.
2. Inside an **admin-gated `upgrade` function** (protected with `require_auth`), call
   **`env.deployer().update_current_contract_wasm(new_wasm_hash)`** to swap the contract's code.

Because the **address and persistent storage survive** the swap, the new code must keep the
**storage-key layout compatible**. The upgrade entrypoint **must be access-controlled** so only an
authorized party can invoke it.

This is the **canonical Soroban upgrade path** — no separate proxy is required (a data-vs-impl proxy
split is a possible alternative, not the norm). It is **not** an EVM proxy/`delegatecall`/UUPS pattern,
and you do **not** need to redeploy to a new address (which would lose state). OpenZeppelin's
**Upgradeable** module for Stellar wraps this pattern.

## Why these cards (routing rationale)

Upgrade how-to → `stellar_docs_mcp`. `scout_repos`/`scout_research` acceptable (OZ Upgradeable).

## Edge / traps

Claiming redeploy-to-new-address is required; prescribing an EVM proxy; omitting access control.
