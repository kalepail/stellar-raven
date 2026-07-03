---
id: q-sor-evm-to-soroban-porting
q: "I'm porting an EVM/Solidity contract to Soroban — how do I map ERC-20/1404/1410/3643 and gas/approvals/balances, is there a null/zero address, how do read-only (view/simulation) calls work, is there a Solidity→Soroban compiler, and what's the biggest footgun?"
category: soroban
subcategory: evm-porting
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Maps ERC-20-like fungible behavior to SAC/SEP-41 for Stellar assets or SEP-41 contract tokens, and maps regulated/RWA controls to SEP-57/ERC-3643 or explicit contract policy rather than assuming EVM inheritance.", weight: 5 }
  - { claim: "Explains that Soroban authorization uses explicit `Address` arguments plus `require_auth`/`require_auth_for_args`, not `msg.sender`; allowances are token-interface state with expiration ledgers.", weight: 5 }
  - { claim: "Explains balances/storage split: Stellar account balances/trustlines for account-held assets, contract data for contract-held SAC balances, and contract storage for custom tokens.", weight: 4 }
  - { claim: "Explains read-only behavior through simulation/RPC/SDK calls; Soroban does not use EVM `view`/free `eth_call` semantics, and writes require submitted transactions.", weight: 4 }
  - { claim: "Mentions Solang exists for Solidity-to-Stellar/Soroban but is not the default production migration path; Rust/Soroban SDK and audited libraries are preferred.", weight: 3 }
should_have:
  - { claim: "Warns that there is no universal zero/null address pattern; use explicit `Option`, sentinel state, or validation instead of `address(0)` mental models.", weight: 3 }
  - { claim: "Mentions OpenZeppelin Stellar modules for fungible, non-fungible, RWA/ERC-3643, allowlist/blocklist, pausable, access control, and upgradeability.", weight: 3 }
  - { claim: "Mentions gas/resource differences: simulate to estimate resources/fees; avoid EVM gas-refund assumptions.", weight: 2 }
nice_to_have:
  - { claim: "Mentions contract size/Wasm/no_std constraints as migration footguns.", weight: 1 }
must_avoid:
  - { claim: "Do not recommend blindly compiling Solidity and shipping without re-designing authorization/storage/resources.", weight: 5 }
  - { claim: "Do not map `msg.sender`, `address(0)`, ERC approvals, or gas directly one-to-one without Soroban caveats.", weight: 5 }
  - { claim: "Do not treat SAC, custom SEP-41 contract tokens, and Stellar classic assets as the same storage model.", weight: 4 }
must_cite:
  - "Official EVM migration docs and authorization docs."
  - "Official SAC/token overview or SEP-41 docs for token mapping."
  - "OpenZeppelin Stellar docs or repository when citing OZ modules."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/migrate/evm/solidity-and-rust-advanced-concepts"
  - "https://developers.stellar.org/docs/tokens/anatomy-of-an-asset"
  - "https://developers.stellar.org/docs/tokens/stellar-asset-contract"
  - "https://developers.stellar.org/docs/tools/openzeppelin-contracts"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Solang repository was live and active on 2026-06-29; answer still treats Rust/Soroban SDK as the default production route."
---

## Reference answer (gospel)

Port the design, not the inheritance tree. ERC-20-like behavior usually maps to either a Stellar Asset Contract for an issued Stellar asset or a SEP-41 contract token. Stellar's token overview distinguishes Stellar Assets with built-in SAC, SEP-41 contract tokens for custom logic, and SEP-57/ERC-3643 for regulated RWA controls. Source: https://developers.stellar.org/docs/tokens/anatomy-of-an-asset.

Soroban has no `msg.sender` equivalent. Pass the relevant `Address` explicitly and call `require_auth()` or `require_auth_for_args()`; the host verifies the address authorized the current invocation and handles replay protection. Token allowances are SEP-41 state with `approve(from, spender, amount, live_until_ledger)` and `transfer_from(spender, from, to, amount)`, not EVM approvals copied verbatim. Sources: https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization and https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md.

Balances differ by asset/account type. SAC transfers between Stellar accounts debit/credit account balances or trustlines; SAC balances for contracts live in contract data; custom SEP-41 tokens define their own contract storage. The SAC is a SEP-41-compatible API for a Stellar asset, not a bridge wrapper token. Source: https://developers.stellar.org/docs/tokens/stellar-asset-contract.

Read-only flows use RPC simulation and SDK/client calls to assemble/simulate contract invocations; submitted transactions are required for state changes. Do not import EVM `view`/`eth_call` and gas-refund assumptions. Simulate to discover resource fees and footprints. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction.

Solang exists and its repository describes itself as a Solidity compiler for Stellar/Soroban, but a production port should normally be reworked in Rust/Soroban SDK with audited libraries. OpenZeppelin Stellar provides audited fungible, non-fungible, RWA/ERC-3643, allowlist/blocklist, pausable, access-control, and upgrade utility modules. Source: https://developers.stellar.org/docs/tools/openzeppelin-contracts.

## Why these cards (routing rationale)

`stellar_docs_mcp` is the expected card because this asks for official migration semantics and token/account primitives. `scout_repos` is acceptable to verify Solang/OpenZeppelin repository status or find examples, but official docs should anchor the mapping.

## Edge / traps

The biggest footgun is preserving EVM mental models: ambient sender, zero address sentinels, gas refund assumptions, storage layout, and approval semantics. Soroban code should model identity, storage, and resources explicitly.
