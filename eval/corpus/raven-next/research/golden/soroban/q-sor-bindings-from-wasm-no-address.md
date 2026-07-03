---
id: q-sor-bindings-from-wasm-no-address
q: "How do I generate TypeScript bindings from a `.wasm` / a contract-id with no deployed address yet, discover the contract's functions and constructor params from them, and deploy passing constructor args via the JS SDK?"
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
  - { claim: "States that `stellar contract bindings typescript` can generate a typed NPM package from `--wasm`, `--wasm-hash`, or `--contract-id`; no deployed address is required when using a local Wasm artifact.", weight: 5 }
  - { claim: "Explains that the Wasm contains the contract specification/interface types, so generated bindings expose callable functions and constructor argument shapes.", weight: 5 }
  - { claim: "Shows deploy constructor arguments belong after the CLI `--` as `--arg-name value`, and for JS SDK deployment the user must upload/build Wasm, create/deploy with hash/salt/constructor args, simulate/assemble, sign, and submit.", weight: 4 }
  - { claim: "Distinguishes generated bindings / dynamic `contract.Client` from raw XDR construction and recommends generated bindings for normal frontend work.", weight: 3 }
should_have:
  - { claim: "Mentions `stellar contract deploy --wasm ... --source ... --network ... -- --constructor_arg value` as the CLI sanity check before raw JS SDK deployment.", weight: 3 }
  - { claim: "Calls out version drift around exact JS SDK helper names and advises checking the generated package README/types for the contract-specific constructor signature.", weight: 2 }
nice_to_have:
  - { claim: "Notes that a contract alias can stand in for a contract id after deployment when generating or using bindings.", weight: 1 }
must_avoid:
  - { claim: "Do not say a deployed `C...` address is required to inspect a local contract's interface.", weight: 5 }
  - { claim: "Do not recommend obsolete `soroban` CLI commands or the old `wasm32-unknown-unknown` target for current new contracts.", weight: 4 }
  - { claim: "Do not answer with EVM ABI/ethers.js assumptions.", weight: 5 }
must_cite:
  - "Must cite official Stellar docs for TypeScript bindings or fully typed contracts."
  - "Must cite official Stellar docs or CLI evidence for deploy constructor argument syntax."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/types/fully-typed-contracts
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world-frontend
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world
  - https://developers.stellar.org/docs/build/guides/transactions/invoke-contract-tx-sdk
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Verified against Stellar Docs MCP and local `stellar 25.2.0` help. Raw JS SDK deployment helper names are version-sensitive; Phase 3 should check current `@stellar/stellar-sdk` types if it wants to lock `createCustomContract` constructor-arg syntax exactly."
---

## Reference answer (gospel)

Use the contract spec embedded in the Wasm. Current CLI help confirms:
`stellar contract bindings typescript --wasm <file> --output-dir <dir>` is valid, alongside
`--wasm-hash` and `--contract-id`. The official docs describe the generated package as the suggested
frontend path because it hides the XDR encoding details and exposes a fully typed contract API
(https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world-frontend,
https://developers.stellar.org/docs/learn/fundamentals/contract-development/types/fully-typed-contracts).

A local `.wasm` is enough to discover the public functions and argument types because the built Wasm
contains the contract specification/interface types; the Hello World docs explicitly say that the
Wasm is the artifact needed to deploy, share the interface, or integration-test against the contract
(https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world).

For deployment, first prove the constructor shape with the CLI:

```sh
stellar contract deploy \
  --wasm target/wasm32v1-none/release/my_contract.wasm \
  --source alice \
  --network testnet \
  -- \
  --admin alice \
  --initial_value 100
```

Local `stellar contract deploy --help` verifies constructor args are passed after `--` as
`--arg-name value`. In raw JS, the same flow is: upload/build Wasm, create/deploy from Wasm hash plus
salt and constructor args, simulate, assemble/prep the transaction, sign, submit, then use the
generated package or `contract.Client` for calls. The Stellar SDK transaction guide is the primary
source for JS Wasm upload/invocation flow (https://developers.stellar.org/docs/build/guides/transactions/invoke-contract-tx-sdk).

## Why these cards (routing rationale)

`stellar_docs_mcp` is the right primary card because the answer hinges on current CLI/docs behavior:
bindings input modes, generated TypeScript packages, and deploy constructor args. `scout_research`
and `scout_repos` are acceptable expansion cards if the user needs examples from indexed repos, but
they are not needed before official docs.

## Edge / traps

The common wrong answer is to tell the user they need a deployed `C...` address before they can
inspect the contract API. They do not: local Wasm is enough for bindings. Another trap is importing
EVM ABI mental models; Soroban uses embedded contract specs and ScVal/XDR encoding, not Ethereum ABI
JSON. A final trap is giving stale target/CLI output paths from older Soroban-era examples.
