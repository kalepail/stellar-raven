---
id: q-soroban-factory-pattern
q: "How do I implement a factory contract that deploys other contracts on Soroban?"
category: soroban
subcategory: factories-upgradeable
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
  - { claim: "A factory deploys child contracts on-chain using `env.deployer()` (e.g., `deploy_v2` / `with_current_contract` / `with_address`) from an already-uploaded Wasm hash and a salt.", weight: 5 }
  - { claim: "The child's contract ID/address is deterministic from the network ID plus the deployer address/preimage and salt; the Wasm hash selects the executable code but is not part of the contract ID derivation.", weight: 3 }
should_have:
  - { claim: "The Wasm of the child must be uploaded first; the factory references it by hash rather than re-embedding bytecode each deploy.", weight: 3 }
  - { claim: "A constructor (`__constructor`) can initialize each child atomically at deploy time.", weight: 2 }
nice_to_have:
  - { claim: "References the soroban-examples deployer/factory example.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Solidity `new Contract()` / CREATE2 opcode as the Soroban mechanism.", weight: 4 }
  - { claim: "Do NOT claim contracts can only be deployed off-chain via the CLI and never from another contract.", weight: 3 }
  - { claim: "Do NOT claim the Wasm hash is part of the child contract ID/address derivation.", weight: 4 }
must_cite:
  - "A developers.stellar.org deployer/factory guide or soroban-examples deployer example."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/deployer
  - https://github.com/stellar/soroban-examples/tree/main/deployer
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Trap: Solidity new/CREATE2; claiming no on-chain deploy; claiming Wasm hash is part of contract ID/address derivation. scout_repos acceptable. Verified: on-chain deploy is via env.deployer() from an uploaded Wasm hash + salt; contract ID/address is deterministic from network ID + deployer address/preimage + salt; __constructor can init atomically."
---

## Reference answer (gospel)

A **factory contract deploys child contracts on-chain** using the **`env.deployer()`** API — Soroban
contracts can deploy other contracts, no off-chain CLI step required. The flow:

1. **Upload the child Wasm once** (`stellar contract upload`, or an upload host call) to get its
   **Wasm hash**; the factory references the child **by hash**, not by re-embedding bytecode each
   deploy.
2. The factory calls `env.deployer().with_address(deployer_addr, salt)` /
   `with_current_contract(salt)` then `.deploy_v2(wasm_hash, constructor_args)` to instantiate a
   child.

The child's **contract ID/address is deterministic** from the network ID plus the deployer
address/preimage and **salt**, so the factory can pre-compute and control child addresses for a given
deployer/salt pair. The **Wasm hash selects the executable code** used for the deployment; it is not
part of the contract ID/address derivation. A child **`__constructor`** can initialize each instance
atomically at deploy time.

This is **not** Solidity `new Contract()` / `CREATE2` — it is the native `env.deployer()` mechanism.
See the soroban-examples **`deployer`** example.

## Why these cards (routing rationale)

Factory how-to → `stellar_docs_mcp`; `scout_repos` acceptable for examples.

## Edge / traps

Solidity `new`/CREATE2 framing; claiming contracts can't deploy other contracts; claiming the Wasm
hash is part of the contract ID/address derivation.
