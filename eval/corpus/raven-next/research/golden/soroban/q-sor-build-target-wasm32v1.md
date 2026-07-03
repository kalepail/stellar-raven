---
id: q-sor-build-target-wasm32v1
q: "Which Wasm target does the current Stellar CLI build to (wasm32v1- none vs wasm32-unknown-unknown), what's the difference between `cargo build` and `stellar contract build`, and how do I fix 'can't find crate for core' / 'target not supported' build errors?"
category: soroban
subcategory: tooling-cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Corrects the spelling to `wasm32v1-none` and states current new Soroban contracts should build with Rust 1.84+ and that target.", weight: 5 }
  - { claim: "Explains `stellar contract build` is a wrapper around Cargo that selects `wasm32v1-none`, release profile, and Stellar contract build settings automatically.", weight: 5 }
  - { claim: "Explains why `wasm32-unknown-unknown` is wrong for Rust 1.82+ Soroban builds: it enables Wasm features unsupported by the Soroban runtime.", weight: 4 }
  - { claim: "Fixes `can't find crate for core` by installing/reinstalling the target with `rustup target add wasm32v1-none` for the active Rust toolchain.", weight: 4 }
should_have:
  - { claim: "Mentions output path `target/wasm32v1-none/release/<contract>.wasm`.", weight: 2 }
  - { claim: "Notes target installation is per toolchain, so after Rust upgrades the target may need reinstalling.", weight: 2 }
nice_to_have:
  - { claim: "Mentions `stellar contract build --print-commands-only` as a way to inspect the underlying command.", weight: 1 }
must_avoid:
  - { claim: "Do not use the misspelled target `wasm32v1- none` or old `wasm32-unknown-unknown` guidance as the final answer.", weight: 5 }
  - { claim: "Do not tell users to hand-edit generated Wasm or bypass the CLI without explaining the target and release profile.", weight: 3 }
must_cite:
  - "Must cite current Stellar setup/Hello World or Rust dialect docs for `wasm32v1-none`."
  - "Freshness-sensitive answer should cite a dated/current official docs source or local CLI evidence."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/rust-dialect
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup
  - https://github.com/OpenZeppelin/stellar-contracts
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified with Stellar Docs MCP and local `stellar contract build --help` from CLI 25.2.0. The dossier mentions newer protocol/SDK releases, but the target guidance is stable in current docs."
---

## Reference answer (gospel)

The target is **`wasm32v1-none`**. The typo `wasm32v1- none` is just a typo, and
`wasm32-unknown-unknown` is not the current target for new Soroban contracts. Stellar's Rust dialect
docs say new contracts should use Rust 1.84.0+ and `wasm32v1-none`; they also explain that
`wasm32-unknown-unknown` is unsupported for Soroban builds on Rust 1.82+ because it enables Wasm
features the Soroban runtime does not support
(https://developers.stellar.org/docs/learn/fundamentals/contract-development/rust-dialect).

Use:

```sh
rustup target add wasm32v1-none
stellar contract build
```

The Hello World docs state that `stellar contract build` is a small wrapper around Cargo that sets the
target to `wasm32v1-none` and the profile to release, and emits Wasm under
`target/wasm32v1-none/release/` (https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world).
OpenZeppelin's Stellar setup guidance matches this: build with `stellar contract build`, which is a
shortcut for `cargo build --target wasm32v1-none --release`
(https://github.com/OpenZeppelin/stellar-contracts).

For `can't find crate for 'core'`, install the target for the active Rust toolchain. The setup docs
explicitly note the target is installed per toolchain, so after a Rust upgrade you may need to run
`rustup target add wasm32v1-none` again
(https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup). If someone insists
on raw Cargo, make it equivalent to the CLI target/release settings; otherwise prefer
`stellar contract build` and use `--print-commands-only` to inspect what it will run.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a current CLI/toolchain question and the answer lives
in official setup, Hello World, and Rust dialect docs. Scout/repo search can help find examples, but
the pass/fail fact is official build-target behavior.

## Edge / traps

The main trap is copying older `wasm32-unknown-unknown` snippets from pre-`wasm32v1-none` tutorials.
Another is installing the target for one Rust toolchain and then building under another. A third is
treating `cargo build` as equivalent without target/profile/contract metadata context; the CLI exists
to select the Stellar-safe defaults.
