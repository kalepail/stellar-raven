---
id: q-ti-scaffold-stellar
q: "What is Scaffold Stellar (`stellar scaffold`) — how do I init a project, plug in my own frontend+contracts, configure environments.toml, generate bindings, and deploy/run on a local network?"
category: tooling-infra
subcategory: tooling-cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Defines Scaffold Stellar as a developer toolkit/CLI plugin for full-stack Stellar dApps with contracts, frontend, templates, registry, and TypeScript client generation.", weight: 5 }
  - { claim: "Gives current command shape: install the `stellar-scaffold-cli` plugin, run `stellar scaffold init`, use `build` to build contracts/generate clients, and `watch` for local dev.", weight: 5 }
  - { claim: "Explains that existing contracts can be copied into the project's `contracts/` folder or an existing workspace can be upgraded, then clients/bindings are generated from built contracts.", weight: 4 }
  - { claim: "Explains that `environments.toml` controls environment/network/deployment configuration and local dev expects Docker/local Stellar network support.", weight: 4 }
should_have:
  - { claim: "Mentions `stellar registry` for publishing/deploying/managing Wasm/contracts when relevant.", weight: 2 }
  - { claim: "Mentions the empirical CLI help confirms `init`, `build`, `generate`, `upgrade`, `update-env`, and `watch` commands in installed CLI 25.2.0.", weight: 2 }
nice_to_have:
  - { claim: "Mentions OpenZeppelin Wizard can export a Scaffold Stellar package.", weight: 1 }
must_avoid:
  - { claim: "Do NOT confuse Scaffold Stellar with the base `stellar contract init` low-level contract-only flow.", weight: 4 }
  - { claim: "Do NOT invent obsolete Soroban CLI command names or old wasm target assumptions.", weight: 5 }
must_cite:
  - "Primary Scaffold Stellar docs and/or CLI plugin docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/tools/scaffold-stellar"
  - "https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world-frontend#using-scaffold-stellar-to-rapidly-develop-dapps"
  - "https://developers.stellar.org/docs/tools/cli/plugins-list#stellar-scaffoldcli"
  - "https://github.com/stellar-scaffold/cli"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Empirical check used local `stellar 25.2.0`; command set may drift with plugin releases."
---

## Reference answer (gospel)

Scaffold Stellar is the full-stack dApp scaffold on top of the Stellar CLI: it bundles contract templates, frontend integration, environment management, a registry flow, and generated TypeScript clients. It is exposed as the `stellar scaffold` plugin, not just the lower-level `stellar contract init` flow.

Typical flow: install the Scaffold Stellar CLI plugin (`cargo install --locked stellar-scaffold-cli` per docs), run `stellar scaffold init <path>` to create a project, install Node dependencies, then use `stellar scaffold build` to build contracts and generate frontend packages/clients. `stellar scaffold watch --build-clients` is the local dev loop described in the frontend tutorial: it watches contracts and `environments.toml`, builds clients, deploys/configures against the local Stellar chain, and runs alongside the frontend dev server. Existing contracts can be copied into the project's `contracts/` folder, or an existing Soroban workspace can be upgraded with the plugin's `upgrade` command.

`environments.toml` is the project-level network/deployment configuration for development, testing, staging, production, local contracts, and deployed contracts. For publishing/deployment management beyond local dev, the docs point to `stellar registry`. A local empirical check with `stellar 25.2.0` showed `init`, `build`, `generate`, `upgrade`, `update-env`, and `watch` under `stellar scaffold`.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the official docs include a Scaffold Stellar tool page, a frontend tutorial, and a CLI plugins list. `scout_research` is acceptable for ecosystem/project metadata, but command details should come from docs or the CLI itself.

## Edge / traps

Do not answer with only `stellar contract init`; that omits frontend integration, `environments.toml`, and generated clients. Do not invent old `soroban` command names; current docs and the installed CLI use the `stellar` command family.
