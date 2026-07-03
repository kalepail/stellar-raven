---
id: q-sor-deploy-invoke-from-js-sdk
q: "How do I deploy and invoke a Soroban contract from the JS SDK (createCustomContract with wasmHash/salt/constructorArgs, assembleTransaction vs prepareTransaction) and decode the simulated return value with scValToNative?"
category: soroban
subcategory: tooling-cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Describes the JS SDK invocation flow: build transaction with a contract call/host function, simulate with Stellar RPC, assemble/prep resource footprint and fees, sign, submit, then poll result if needed.", weight: 5 }
  - { claim: "Distinguishes `assembleTransaction(tx, simulation)` from RPC `prepareTransaction`: both fold simulation/resource data back into a transaction, but exact helper choice depends on SDK version and whether the user already ran simulation.", weight: 4 }
  - { claim: "For deployment, identifies the host functions involved: upload Wasm, create contract from Wasm hash plus address/salt or asset preimage, and pass constructor args where the current SDK/CLI supports them.", weight: 4 }
  - { claim: "Explains `scValToNative` should decode the simulation/result return SCVal only after checking the simulation/result is successful and the expected type matches the contract spec.", weight: 4 }
should_have:
  - { claim: "Recommends generated TypeScript bindings or `contract.Client` for most apps before raw XDR helpers.", weight: 3 }
  - { claim: "Mentions Horizon is not the simulation/invocation API for Soroban; use Stellar RPC.", weight: 2 }
nice_to_have:
  - { claim: "Mentions current published `@stellar/stellar-sdk` exposes `contract.Client.deploy`/`AssembledTransaction` ergonomics around `Operation.createCustomContract`, so raw helper examples should be checked against installed types.", weight: 1 }
must_avoid:
  - { claim: "Do not submit the original unsimulated Soroban transaction when resources/footprint/auth need to be assembled.", weight: 5 }
  - { claim: "Do not decode simulation errors as return values with `scValToNative`.", weight: 4 }
  - { claim: "Do not use Horizon or EVM gas/ABI flows for Soroban invocation.", weight: 4 }
must_cite:
  - "Must cite official Stellar SDK transaction guide and/or fully typed contracts docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/invoke-contract-tx-sdk
  - https://developers.stellar.org/docs/build/guides/transactions/signing-soroban-invocations
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/types/fully-typed-contracts
  - https://www.npmjs.com/package/@stellar/stellar-sdk
  - https://github.com/stellar/js-stellar-sdk
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Official docs verify the transaction phases and typed-client recommendation. Phase 3 checked the current npm package/repo: @stellar/stellar-sdk 16.0.1 includes `Operation.createCustomContract` usage inside `contract.Client.deploy` with wasmHash/salt/constructorArgs, but raw helper examples remain package-version-sensitive."
---

## Reference answer (gospel)

For invocation from JS, the canonical flow is: build a transaction with an InvokeHostFunction operation
or `Contract.call(...)`, simulate it through Stellar RPC, fold the returned Soroban transaction data
and resource fee/auth data back into the transaction, sign, submit, then poll for final result as
needed. Stellar's SDK guide covers JS Wasm upload and contract invocation
(https://developers.stellar.org/docs/build/guides/transactions/invoke-contract-tx-sdk), and the
signing guide describes the simulate -> sign -> submit flow
(https://developers.stellar.org/docs/build/guides/transactions/signing-soroban-invocations).

`assembleTransaction(tx, simulation)` is the lower-level pattern when you already called
`simulateTransaction`. `prepareTransaction` is the RPC-client convenience path that simulates and
returns an updated transaction. Both are meant to avoid submitting the original unprepared Soroban
transaction. Use the helper that exists in your installed SDK version and check the generated typings.

For deployment, the underlying XDR path is upload Wasm, then create a contract from the uploaded Wasm
hash and a contract-id preimage such as address+salt; constructors are part of the create/deploy path
when the contract defines `__constructor`. The current `@stellar/stellar-sdk` package exposes this
through `contract.Client.deploy`, which builds an `Operation.createCustomContract` with `wasmHash`,
optional `salt`, and `constructorArgs`; lower-level code can still use raw operations, but examples
should be checked against the installed package types (https://www.npmjs.com/package/@stellar/stellar-sdk,
https://github.com/stellar/js-stellar-sdk). The transaction XDR docs identify the host functions for
upload, create, and invoke, and explain contract ids are derived from preimage plus network id
(https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction).

Decode return values only after a successful simulation/result and only against the expected spec:
`scValToNative(sim.result.retval)`-style decoding is for an actual SCVal return. If the simulation
returned an error or the return is a different XDR union variant than expected, decoding can fail or
produce misleading values. For most apps, generated TypeScript bindings or dynamic `contract.Client`
are safer because they are generated from the contract spec
(https://developers.stellar.org/docs/learn/fundamentals/contract-development/types/fully-typed-contracts).

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a current SDK/RPC transaction-flow question. Scout can
surface examples, and general search can help with package-version API drift, but primary behavior is
in official docs.

## Edge / traps

The common bad answer is to build and sign a transaction once, skip simulation/assembly, then wonder
why resources or auth are missing. Another is trying to decode an error object with `scValToNative`.
The final trap is treating `assembleTransaction` and `prepareTransaction` as mutually exclusive
protocol features; they are SDK ergonomics around the same simulation requirement.
