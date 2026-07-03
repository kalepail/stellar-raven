---
id: q-soroban-wasm-language
q: "What language are Soroban smart contracts written in, and what do they compile to?"
category: soroban
subcategory: execution-model
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
  - { claim: "Soroban contracts are written in Rust using the soroban-sdk.", weight: 5 }
  - { claim: "Contracts compile to WebAssembly (Wasm), targeting `wasm32v1-none`.", weight: 5 }
should_have:
  - { claim: "Contracts are `#![no_std]` Rust library crates (no standard library / no allocator).", weight: 3 }
  - { claim: "Floating-point types are not supported; integer types like i128/u128/i64/u64/i32/u32 are.", weight: 2 }
nice_to_have:
  - { claim: "Notes the 64 KB compiled-Wasm size limit.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say Soroban contracts are written in Solidity or compiled to EVM bytecode.", weight: 5 }
  - { claim: "Do NOT claim contracts run on a custom non-Wasm VM or are written in Move/Go/JavaScript.", weight: 4 }
  - { claim: "Do NOT say floating-point arithmetic is supported in contracts.", weight: 2 }
must_cite:
  - "At least one primary developers.stellar.org docs page (contract fundamentals / getting-started)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/contracts
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Defining execution-model fact; Solidity/EVM is the canonical trap. Verified against the Hello World getting-started page and the contracts data-structures page."
---

## Reference answer (gospel)

Soroban smart contracts are **Rust** library crates compiled to **WebAssembly (Wasm)**, targeting
`wasm32v1-none`. The contracts data-structures page states they are "programs written in the Rust
language and compiled as WebAssembly (Wasm) for deployment."

- **Language / SDK** — Rust with the `soroban-sdk` crate. [hello-world]
- **Compile target** — `wasm32v1-none` (built via `stellar contract build`). [hello-world]
- **`#![no_std]`** — contracts are no-std crates with no allocator; SDK types (`Vec`, `Map`, `Bytes`,
  `Symbol`) replace std collections. [hello-world]
- **No floats** — floating point is unsupported; use integer types (`i128`/`u128`/`i64`/`u64`/`i32`/
  `u32`). [hello-world]
- **64 KB** compiled-Wasm size cap. [hello-world]

NOT Solidity/EVM bytecode, not a custom non-Wasm VM, not Move/Go/JavaScript.

## Why these cards (routing rationale)

Primary-source fact about the contract execution model → `stellar_docs_mcp`. `scout_research` is acceptable corroboration. General-web/deep-research would be a routing miss.

## Edge / traps

The plausible-wrong answer is the EVM/Solidity mental model. Soroban is Rust→Wasm (`wasm32v1-none`), `#![no_std]`, no floats.
