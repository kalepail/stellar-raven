---
id: q-soroban-sdk-macros
q: "What do the #[contract], #[contractimpl], and #[contracttype] macros do in the Soroban SDK?"
category: soroban
subcategory: sdk-macros
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "`#[contract]` marks the contract struct (type), and `#[contractimpl]` marks the impl block whose `pub` functions become the callable contract entrypoints / spec.", weight: 5 }
  - { claim: "`#[contracttype]` lets a custom struct/enum cross the host boundary by generating its SCVal/XDR encoding.", weight: 4 }
should_have:
  - { claim: "Contract functions take `&Env` (or `Env`) as their first argument.", weight: 3 }
  - { claim: "`#[contractimpl]` generates the contract spec used to produce client bindings.", weight: 2 }
nice_to_have:
  - { claim: "Mentions related macros like `#[contracterror]`, `#[contractevent]`, or `#[contractmeta]`.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Solidity constructs (e.g., `contract`/`function` keywords, `pragma solidity`) as the Soroban macros.", weight: 5 }
  - { claim: "Do NOT claim `#[contracttype]` marks the main contract or that `#[contract]` exposes functions (swap the roles).", weight: 3 }
must_cite:
  - "A developers.stellar.org or docs.rs/soroban-sdk page describing the macros."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world
  - https://docs.rs/soroban-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Macro-role confusion + Solidity confusion are the traps. Roles per the SDK docs and Hello World."
---

## Reference answer (gospel)

The three core `soroban_sdk` attribute macros:

- **`#[contract]`** — marks the **contract struct (type)**. One per contract. [hello-world]
- **`#[contractimpl]`** — marks the **impl block** whose `pub` functions become the contract's
  **callable entrypoints**, and generates the **contract spec** used to produce client bindings.
  Functions take `&Env` (or `Env`) as their first argument. [hello-world]
- **`#[contracttype]`** — lets a custom **struct/enum cross the host boundary** by generating its
  SCVal/XDR encode-decode. [docs.rs]

Related: `#[contracterror]` (error enums), `#[contractevent]` (typed events), `#[contractmeta]`
(Wasm metadata).

Traps: swapping the roles (`#[contracttype]` does NOT mark the main contract; `#[contract]` does not
itself expose functions), or describing Solidity constructs (`contract`/`function` keywords,
`pragma solidity`) instead of the Rust attribute macros.

## Why these cards (routing rationale)

SDK macro reference → `stellar_docs_mcp` (docs + docs.rs). `scout_repos` acceptable for source-level corroboration.

## Edge / traps

Swapping macro roles; describing Solidity syntax instead of the Rust attribute macros.
