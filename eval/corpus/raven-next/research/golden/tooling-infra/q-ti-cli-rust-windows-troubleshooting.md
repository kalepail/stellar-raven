---
id: q-ti-cli-rust-windows-troubleshooting
q: "My Stellar CLI / Rust build is failing - wasm file 'No such file or directory', missing wasm32v1-none target, 'alias already exists', rustup/link.exe not recognized (Windows/MSVC/WSL), 'Unable to fund account', no `stellar account` subcommand to check balance, 'Invalid URL - Bring Your Own' on mainnet. How do I diagnose and fix these?"
category: tooling-infra
subcategory: tooling-cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Uses the current Stellar smart-contract Rust target: Rust 1.84+ and `wasm32v1-none`, not only older `wasm32-unknown-unknown` advice.", weight: 5 }
  - { claim: "Explains `wasm file No such file or directory` as usually a build/output-path problem: run the contract build from the right workspace and point deploy/bindings commands at the actual generated wasm path.", weight: 4 }
  - { claim: "Handles Windows separately: install Rust/rustup and MSVC Build Tools or use WSL; `rustup`/`link.exe` not recognized is a PATH/toolchain problem before it is a Stellar problem.", weight: 4 }
  - { claim: "Explains alias/key issues: `alias already exists` means the CLI identity/network alias is already configured; inspect/remove/reuse rather than creating duplicates.", weight: 3 }
  - { claim: "Explains funding/mainnet: Friendbot/test funding is for testnet/futurenet/local flows; mainnet requires real funds and, in Lab/RPC flows, a valid selected or BYO RPC provider URL.", weight: 4 }
  - { claim: "Corrects obsolete command assumptions such as expecting a generic `stellar account` balance subcommand when current docs point users to CLI tx/payment/contract helpers, Horizon/RPC, or Lab for balances.", weight: 3 }
should_have:
  - { claim: "Cites official setup, CLI, Lab, and RPC/provider docs; uses dated source for current versions where possible.", weight: 3 }
nice_to_have:
  - { claim: "Suggests `stellar --help`, `stellar keys --help`, `stellar contract --help`, and checking generated paths before reinstalling everything.", weight: 1 }
must_avoid:
  - { claim: "Do NOT tell users to install only `wasm32-unknown-unknown` as the current target for Stellar contracts.", weight: 5 }
  - { claim: "Do NOT suggest using mainnet Friendbot or fake funding.", weight: 5 }
  - { claim: "Do NOT hide Windows/MSVC prerequisites behind generic npm troubleshooting.", weight: 4 }
must_cite:
  - "Official Stellar setup docs for Rust/target requirements."
  - "Official Stellar CLI/Lab docs for current command and network/provider behavior."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup"
  - "https://developers.stellar.org/docs/tools/cli"
  - "https://developers.stellar.org/docs/tools/lab"
  - "https://developers.stellar.org/docs/tools/cli/cookbook/payments-and-assets"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Official docs verify Rust/target and Lab/CLI direction. Several quoted error strings are environment-specific and should be empirically reproduced by Phase 3 on Windows/WSL if exact remediation commands are required."
---

## Reference answer (gospel)

Triage the toolchain first. Current Stellar smart-contract setup requires Rust 1.84.0 or higher because the supported target is `wasm32v1-none`; the setup guide says to install that target and reinstall it after Rust toolchain updates (https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup). If the build says the wasm file does not exist, confirm that `stellar contract build` succeeded, that you are in the correct workspace/package, and that your deploy/bindings command points at the actual generated `target/.../*.wasm` path.

On Windows, `rustup` not recognized means Rust is missing from PATH; `link.exe` not recognized usually means the MSVC linker/build tools are missing or the shell is not a Visual Studio developer shell. Either fix the native MSVC toolchain or use WSL consistently. Do not mix WSL paths with Windows shells unless you know exactly which Rust toolchain is building.

For CLI identity/config errors, treat aliases as named local configuration. `alias already exists` means you already have that key/network alias; list/reuse/remove it instead of creating another with the same name. For funding, distinguish networks: testnet/futurenet/local can use Friendbot or Lab funding, while mainnet cannot. Stellar Lab documents account creation/funding for testnet/futurenet and custom RPC provider support (https://developers.stellar.org/docs/tools/lab). The CLI docs are the source of current command names; use `stellar --help` and the CLI docs before assuming a deprecated `stellar account` command exists (https://developers.stellar.org/docs/tools/cli). For checking balances without a CLI shortcut, use Horizon/RPC/Lab or token/SAC helper flows such as the CLI payments-and-assets cookbook (https://developers.stellar.org/docs/tools/cli/cookbook/payments-and-assets).

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer is command/toolchain-current. `parallel_search` is acceptable only for Windows/MSVC environment troubleshooting that lives outside Stellar docs.

## Edge / traps

The main trap is stale Soroban advice: older docs and blog posts mention `wasm32-unknown-unknown`, while current setup requires `wasm32v1-none`. Another trap is treating all funding errors as CLI bugs; mainnet requires real funds and valid provider configuration.
