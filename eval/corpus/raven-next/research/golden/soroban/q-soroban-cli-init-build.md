---
id: q-soroban-cli-init-build
q: "What's the Stellar CLI workflow to scaffold a new contract project and build it to Wasm?"
category: soroban
subcategory: tooling-cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Scaffold with `stellar contract init <name>` and build with `stellar contract build`.", weight: 5 }
  - { claim: "The official CLI binary is `stellar` (formerly `soroban`); `soroban-cli` was renamed/merged into `stellar-cli`.", weight: 4 }
should_have:
  - { claim: "`stellar contract build` compiles for the `wasm32v1-none` target in release mode; `--optimize` runs wasm-opt.", weight: 3 }
nice_to_have:
  - { claim: "Notes you can list keys/networks (`stellar keys`, `stellar network`) as part of project setup.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present `soroban contract init`/`soroban contract build` as the current command without noting the rename to `stellar`.", weight: 3 }
  - { claim: "Do NOT use Foundry/Hardhat/`forge`/`truffle` commands for a Soroban project.", weight: 4 }
must_cite:
  - "The developers.stellar.org Stellar CLI manual / getting-started."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup
  - https://developers.stellar.org/docs/tools/cli/stellar-cli
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections. Foundry/Hardhat is the EVM-tooling trap; soroban→stellar rename is the deprecation trap. Verified: build target is wasm32v1-none; binary is `stellar` (formerly soroban-cli)."
---

## Reference answer (gospel)

Use the **`stellar` CLI** (a single Rust binary; the former **`soroban-cli`** was renamed/merged into
**`stellar-cli`**):

1. **Scaffold:** `stellar contract init <project-name>` — creates a Cargo workspace with a sample
   contract.
2. **Build:** `stellar contract build` — compiles the contract to the **`wasm32v1-none`** target in
   release mode (output under `target/wasm32v1-none/release/*.wasm`); add **`--optimize`** to run
   `wasm-opt`.

Project setup also commonly involves `stellar keys generate`/`stellar keys` (identities) and
`stellar network` (network config). The old `soroban contract …` commands are deprecated in favor of
`stellar contract …`.

## Why these cards (routing rationale)

CLI how-to → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

EVM tooling (Foundry/Hardhat); old `soroban` command without the `stellar` rename note.
