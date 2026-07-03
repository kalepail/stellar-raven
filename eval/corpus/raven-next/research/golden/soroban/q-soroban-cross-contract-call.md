---
id: q-soroban-cross-contract-call
q: "How does one Soroban contract call a function on another deployed contract?"
category: soroban
subcategory: cross-contract
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "A contract invokes another by its contract address, either via a generated client (from `contractimport!`/`stellar contract bindings`) or via `env.invoke_contract(...)`.", weight: 5 }
  - { claim: "The generated typed-client approach is preferred so the callee's spec is type-checked at build time.", weight: 3 }
should_have:
  - { claim: "Cross-contract calls run within the same instruction/memory budget as the outer invocation.", weight: 2 }
  - { claim: "Authorization (`require_auth`) is enforced at each contract boundary, not inherited implicitly.", weight: 2 }
nice_to_have:
  - { claim: "References the soroban-examples cross-contract example.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Solidity `interface`/`.call()`/`delegatecall` as the Soroban mechanism.", weight: 4 }
  - { claim: "Do NOT claim cross-contract calls require deploying via a special proxy or are impossible.", weight: 3 }
must_cite:
  - "The developers.stellar.org cross-contract calls guide."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/conventions/cross-contract
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/cross-contract-call
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "delegatecall is the EVM trap; scout_repos acceptable for code."
---

## Reference answer (gospel)

A Soroban contract calls another **deployed contract by its contract address** in one of two ways:
[xcontract]

- **Generated typed client (preferred)** — import the callee's spec with the **`contractimport!`**
  macro (or `stellar contract bindings`) and call its methods through the generated client, so the
  callee's interface is **type-checked at build time**. [xcontract]
- **`env.invoke_contract::<Ret>(&contract_id, &symbol_short!("fn"), args)`** — the low-level call with
  a typed return.

Key semantics:
- The inner call runs **within the same instruction/memory budget** as the outer invocation. [example]
- **Authorization is enforced at each contract boundary** (`require_auth` on the inner contract is not
  implicitly inherited from the outer call).

Trap: importing Solidity `interface` / `.call()` / `delegatecall` semantics, or claiming
cross-contract calls need a special proxy / are impossible.

## Why these cards (routing rationale)

Cross-contract how-to → `stellar_docs_mcp`; `scout_repos` acceptable for examples.

## Edge / traps

Importing Solidity `.call`/`delegatecall`/`interface` semantics.
