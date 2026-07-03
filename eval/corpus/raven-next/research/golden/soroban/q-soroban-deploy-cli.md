---
id: q-soroban-deploy-cli
q: "How do I deploy a Soroban smart contract to Stellar testnet using the Stellar CLI?"
category: soroban
subcategory: tooling-cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Contracts are built to a Wasm artifact first (`stellar contract build`, a `cargo`/Rust build).", weight: 4 }
  - { claim: "Deployment uses the Stellar CLI `stellar contract deploy` command (with the built .wasm).", weight: 5 }
  - { claim: "A network must be specified/targeted as testnet (e.g. `--network testnet`) and a funded source identity/account used.", weight: 4 }
should_have:
  - { claim: "Deploy returns a contract ID (C... address) used for subsequent `stellar contract invoke`.", weight: 3 }
  - { claim: "A testnet account can be funded via Friendbot before deploying.", weight: 2 }
nice_to_have:
  - { claim: "Mentions `stellar keys`/identity setup or `stellar network` config.", weight: 1 }
  - { claim: "Notes `stellar contract install`/upload vs deploy distinction.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say Soroban contracts are written in Solidity or compiled to EVM bytecode.", weight: 5 }
  - { claim: "Do NOT present `soroban deploy` as the current canonical command without noting the CLI is now `stellar` (the soroban-cli was renamed/merged into stellar-cli).", weight: 3 }
  - { claim: "Do NOT invent flags/commands that are not in the Stellar CLI.", weight: 3 }
must_cite:
  - "At least one primary developers.stellar.org docs page (getting-started / deploy guide)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/deploy-to-testnet
  - https://developers.stellar.org/docs/tools/cli
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Exemplar (Phase-1 hand-authored). VERIFIED against the live 'Deploy to Testnet' docs (2026-06): binary is `stellar`; canonical command is `stellar contract deploy --wasm target/wasm32v1-none/release/<name>.wasm --source-account <id> --network testnet --alias <name>`; returns a C... contract id. Build target is wasm32v1-none."
---

## Reference answer (gospel)

Soroban contracts are written in **Rust** (the `soroban-sdk`) and compiled to a **Wasm** artifact,
then deployed with the **Stellar CLI** (`stellar`, formerly `soroban-cli`). Canonical testnet flow:

1. `stellar contract build` — compiles the contract to `target/wasm32-...` `.wasm`.
2. Have a funded testnet identity (`stellar keys generate ...` then fund via **Friendbot**) and/or
   `stellar network` configured for testnet.
3. `stellar contract deploy --wasm <path>.wasm --source <identity> --network testnet` — uploads the
   Wasm and instantiates the contract, returning a **contract ID** (`C…`).
4. Invoke with `stellar contract invoke --id <C…> --source <identity> --network testnet -- <fn> ...`.

Source of truth: developers.stellar.org "Deploy to Testnet" getting-started guide + the CLI reference.

## Why these cards (routing rationale)

This is a primary-source how-to → **`stellar_docs_mcp`** (official docs, canonical URL + anchor) is
the right surface. `scout_research`/`scout_repos` are acceptable secondary corroboration. Firing a
**general-web** card (Perplexity/Parallel) for a question fully answered by first-party docs is a
routing miss, and any **deep-research** tier is governance-forbidden for a simple lookup.

## Edge / traps

The plausible-wrong answers: (a) describing an EVM/Solidity flow (wrong chain model); (b) using the
old `soroban deploy` command without noting the CLI consolidated into `stellar`; (c) hallucinated
flags. The rubric's `must_avoid` encodes each.
