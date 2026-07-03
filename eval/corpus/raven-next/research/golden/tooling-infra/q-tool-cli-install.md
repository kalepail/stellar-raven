---
id: q-tool-cli-install
q: "How do I install the Stellar CLI?"
category: tooling-infra
subcategory: cli
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
  - { claim: "The CLI binary is `stellar` (the Stellar CLI), installable via multiple channels: cargo (`cargo install stellar-cli`), Homebrew (`brew install stellar-cli`), apt, AUR, or Docker.", weight: 5 }
should_have:
  - { claim: "It is the command-line multi-tool for running and deploying Stellar/Soroban contracts.", weight: 2 }
  - { claim: "Notes the soroban-cli was renamed/merged into the `stellar` CLI.", weight: 2 }
nice_to_have:
  - { claim: "Mentions `stellar completion` for shell tab-completion.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present `soroban` as the current canonical CLI binary without noting it is now `stellar`.", weight: 4 }
  - { claim: "Do NOT invent an install method that doesn't exist.", weight: 2 }
must_cite:
  - "developers.stellar.org install-cli page or the stellar/stellar-cli repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/cli/install-cli
  - https://github.com/stellar/stellar-cli
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "The soroban→stellar CLI rename is the trap; install channels are the must_have. Verified install methods: install script, Homebrew (stellar-cli), winget, cargo (--locked stellar-cli), GitHub Actions."
---

## Reference answer (gospel)

The binary is **`stellar`** (the Stellar CLI) — the command-line multi-tool for building, running, and
deploying Stellar/Soroban contracts. It is the **unified successor to `soroban-cli`** (the old `soroban`
binary was renamed/merged into `stellar`). Documented install channels:

- **Install script** (macOS/Linux/WSL): `curl -fsSL https://github.com/stellar/stellar-cli/raw/main/install.sh | sh`
- **Homebrew**: `brew install stellar-cli`
- **Cargo** (from source): `cargo install --locked stellar-cli`
- **Winget** (Windows): `winget install --id Stellar.StellarCLI`
- Also available via **apt / AUR (`stellar-cli`) / Docker** and **GitHub Actions** (`stellar/stellar-cli@vX`).

Enable shell completion with `stellar completion --shell <shell>`.

## Why these cards (routing rationale)

Install how-to → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Presenting `soroban` as the current canonical binary (it's now `stellar`), or inventing an install
method that doesn't exist.
