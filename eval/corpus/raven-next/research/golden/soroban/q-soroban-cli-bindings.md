---
id: q-soroban-cli-bindings
q: "How do I generate a typed TypeScript or Rust client for a deployed contract or a local Wasm artifact with the Stellar CLI?"
category: soroban
subcategory: tooling-cli
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
  - { claim: "Use `stellar contract bindings <typescript|rust|...>` to generate a typed client from the contract's spec.", weight: 5 }
  - { claim: "The client is generated from the contract spec embedded in the Wasm / on-chain contract, so it stays in sync with the deployed interface.", weight: 3 }
should_have:
  - { claim: "You can target a deployed contract id or a local .wasm to produce the bindings.", weight: 2 }
  - { claim: "In Rust, the `contractimport!` macro is the in-code equivalent for typed cross-contract clients.", weight: 2 }
nice_to_have:
  - { claim: "Notes generated TS bindings are consumable from a dapp/frontend.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe an ABI-JSON + ethers.js/web3.js flow as the Soroban mechanism.", weight: 4 }
  - { claim: "Do NOT invent a `stellar contract abi` command (it is `bindings`).", weight: 2 }
must_cite:
  - "The developers.stellar.org Stellar CLI bindings documentation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/cli/stellar-cli
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Command + targets (--wasm / --wasm-hash / --contract-id) and language list verified against the Stellar CLI manual. 2026-06-29 differentiation: this file is the simple CLI bindings how-to (deployed contract OR local Wasm); the no-address→discover-functions/constructor→deploy-with-constructor-args JS-SDK flow is owned by q-sor-bindings-from-wasm-no-address. Fixed q to name the local-Wasm target."
---

## Reference answer (gospel)

Use **`stellar contract bindings <language>`** to generate a typed client from the contract's spec.
[cli]

- **Languages** include **typescript**, **rust**, **python**, **java**, **swift**, **php**, **flutter**.
  [cli]
- **Targets**: a deployed contract id (`--contract-id`), an on-chain Wasm hash (`--wasm-hash`), or a
  local `--wasm` file. [cli]
- The client is generated **from the contract spec embedded in the Wasm**, so it stays in sync with the
  deployed interface; TS bindings are consumable directly from a dapp/frontend.
- **In Rust**, the in-code equivalent for a typed cross-contract client is the **`contractimport!`**
  macro.

Traps: describing an ABI-JSON + ethers.js/web3.js flow as the Soroban mechanism, or inventing a
`stellar contract abi` command (it is `bindings`).

## Why these cards (routing rationale)

Bindings how-to → `stellar_docs_mcp`. `scout_repos` acceptable.

## Edge / traps

ABI-JSON + ethers.js framing; inventing `stellar contract abi`.
