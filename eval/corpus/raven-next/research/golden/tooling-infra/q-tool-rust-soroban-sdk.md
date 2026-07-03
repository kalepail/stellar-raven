---
id: q-tool-rust-soroban-sdk
q: "Which Rust crate do I add to Cargo.toml to write Soroban smart contracts?"
category: tooling-infra
subcategory: sdks-rust
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The crate is `soroban-sdk` (from crates.io), maintained by SDF.", weight: 5 }
  - { claim: "Soroban contracts are written in Rust and compiled to a Wasm target (wasm32 / wasm32v1-none).", weight: 4 }
should_have:
  - { claim: "Off-chain Rust client work uses separate crates like `stellar-xdr`, `stellar-strkey`, `rs-stellar-rpc-client`.", weight: 2 }
nice_to_have:
  - { claim: "Mentions OpenZeppelin Stellar contract crates as audited building blocks.", weight: 1 }
must_avoid:
  - { claim: "Do NOT name `stellar-sdk` (the JS client) or a non-existent crate as the contract SDK.", weight: 4 }
  - { claim: "Do NOT say Soroban contracts are written in Solidity/compiled to EVM bytecode.", weight: 5 }
must_cite:
  - "At least one developers.stellar.org contract-sdks page or the stellar/rs-soroban-sdk repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/sdks/contract-sdks
  - https://github.com/stellar/rs-soroban-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Contract SDK (soroban-sdk) vs client SDK (stellar-sdk) is the core distinction; conflating them is the trap."
---

## Reference answer (gospel)

Add **`soroban-sdk`** (from crates.io), **maintained by SDF** — it's the single canonical crate for
writing Soroban smart contracts. Soroban contracts are **written in Rust** and **compiled to a Wasm
target** (`wasm32`/`wasm32v1-none`), **not** Solidity/EVM bytecode. Note the distinction: `soroban-sdk`
is the **contract** SDK; **off-chain Rust client** work uses separate crates like **`stellar-xdr`,
`stellar-strkey`, `rs-stellar-rpc-client`**. **OpenZeppelin's Stellar contract crates** provide audited
building blocks on top.

## Why these cards (routing rationale)

Canonical primary-source fact → `stellar_docs_mcp`. `scout_repos` acceptable (ranks rs-soroban-sdk). Deep-research/general-web are misses.

## Edge / traps

Naming `stellar-sdk` (the JS client) as the contract SDK, or asserting Soroban contracts are written in
Solidity/compiled to EVM bytecode.
