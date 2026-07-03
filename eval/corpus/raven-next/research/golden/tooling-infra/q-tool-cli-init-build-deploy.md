---
id: q-tool-cli-init-build-deploy
q: "What's the Stellar CLI command sequence to go from a new contract project to a deployed contract?"
category: tooling-infra
subcategory: cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The flow is roughly `stellar contract init` (scaffold) → `stellar contract build` (compile to Wasm) → `stellar contract deploy --wasm <path> --network <net>`.", weight: 5 }
  - { claim: "`stellar contract invoke --id <C...> ...` calls a deployed contract's function.", weight: 3 }
should_have:
  - { claim: "Deploy requires a configured network and a funded source identity (`stellar keys`).", weight: 3 }
  - { claim: "Deploy returns a contract ID (C... address).", weight: 2 }
nice_to_have:
  - { claim: "Notes `stellar network container start testnet` can boot a local Quickstart network for testing.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present `soroban deploy`/`soroban build` as the current commands without noting the CLI is now `stellar`.", weight: 4 }
  - { claim: "Do NOT invent CLI subcommands/flags that don't exist.", weight: 3 }
must_cite:
  - "developers.stellar.org Stellar CLI manual / getting-started pages."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/deploy-to-testnet
  - https://developers.stellar.org/docs/tools/cli/stellar-cli
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified against the deploy-to-testnet guide + CLI manual: stellar contract init → build → deploy --wasm <path> --source-account <id> --network testnet (returns a C... id) → invoke --id <C...>. Identity via `stellar keys generate <name> --network testnet --fund`. Trap = old `soroban` commands / invented flags."
---

## Reference answer (gospel)

The Stellar CLI (the `stellar` command) takes you from a new project to a deployed contract
([deploy-to-testnet](https://developers.stellar.org/docs/build/smart-contracts/getting-started/deploy-to-testnet),
[CLI manual](https://developers.stellar.org/docs/tools/cli/stellar-cli)):

1. `stellar contract init <project>` — scaffold a Cargo workspace Soroban project.
2. `stellar contract build` — compile to Wasm.
3. `stellar contract deploy --wasm <path> --source-account <id> --network testnet` — deploy;
   **returns the contract ID (starts with `C...`)**.
4. `stellar contract invoke --id <C...> --source-account <id> --network testnet -- <fn> <args>` —
   call a function.

You first need a **configured network** and a **funded source identity**, e.g.
`stellar keys generate alice --network testnet --fund`. Optionally `stellar network container start
testnet` boots a local Quickstart network for testing.

Note the CLI is now **`stellar`** (renamed from `soroban`); do not present `soroban build`/
`soroban deploy` as the current commands, and don't invent subcommands/flags.

## Why these cards (routing rationale)

Procedure → `stellar_docs_mcp`; `scout_repos` acceptable for example projects. Deep-research/general-web are misses.

## Edge / traps

Old `soroban` commands and invented flags are the traps.
