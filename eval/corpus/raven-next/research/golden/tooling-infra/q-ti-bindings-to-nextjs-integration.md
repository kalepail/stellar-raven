---
id: q-ti-bindings-to-nextjs-integration
q: "I generated TypeScript contract bindings - how do I add them to my Next.js app (pnpm file:./packages), call a method, and sign+submit the resulting AssembledTransaction with Freighter (is its `fee` the inclusion fee or also the resource fee)?"
category: tooling-infra
subcategory: tooling-cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that `stellar contract bindings typescript` produces an npm package under `packages/<contract>` that can be consumed by a JS/Next.js app, commonly via a local `file:./packages/<contract>` dependency and normal package build/install steps.", weight: 5 }
  - { claim: "Shows the binding flow at the right level: instantiate the generated client with contract ID/network/RPC options, call a contract method to obtain/prepare an assembled transaction, sign the transaction XDR with Freighter, then submit/poll via Stellar RPC.", weight: 5 }
  - { claim: "Correctly states that for smart-contract transactions `Tx.fee` is the total of resource fee plus inclusion fee; resource fee is in `sorobanData.resourceFee`, and simulation/assembly is how the SDK obtains resource values.", weight: 5 }
  - { claim: "Distinguishes Freighter signing from server-side submission and does not ask the browser to hold secret keys.", weight: 4 }
should_have:
  - { claim: "Mentions current JS SDK/package drift and tells the user to verify generated binding README/types against the installed `@stellar/stellar-sdk` and binding output.", weight: 3 }
  - { claim: "Cites the generated bindings/frontend guide and the Stellar fee/resource-fee documentation.", weight: 3 }
nice_to_have:
  - { claim: "Mentions that generated bindings are JS-framework-neutral; Next.js only adds client/server boundary and package-workspace details.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say the `fee` on a Soroban transaction is only the inclusion fee.", weight: 5 }
  - { claim: "Do NOT skip simulation/assembly for a contract invocation that needs Soroban data, footprint, auth entries, and resource fee.", weight: 5 }
  - { claim: "Do NOT recommend putting a secret key in a Next.js client component.", weight: 5 }
must_cite:
  - "Primary Stellar docs for TypeScript bindings/frontend integration."
  - "Primary Stellar docs for Soroban resource fee and inclusion fee semantics."
  - "Freighter docs or repo for browser signing behavior."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world-frontend"
  - "https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering"
  - "https://developers.stellar.org/docs/build/guides/freighter/prompt-to-sign-tx"
  - "https://github.com/stellar/js-stellar-sdk/releases/tag/v16.0.1"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified docs and GitHub release URLs on 2026-06-29. The exact generated client method names can drift with CLI/bindings output, so keep code-level assertions tied to a freshly generated package/version."
---

## Reference answer (gospel)

Use the generated bindings as a local npm package. The official frontend guide describes `stellar contract bindings typescript` as producing a package under `packages/<contract>` and says these generated libraries are the suggested frontend interface because they hide XDR encoding details (https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world-frontend). In a pnpm workspace/Next.js app, add the generated package as a workspace or local dependency such as `file:./packages/hello_world`, build it if the generated README says to, then import the generated client from a client-side module.

The runtime flow is: create the generated client with the contract ID, network passphrase, and RPC URL; call the generated method; let the binding/SDK prepare or return an assembled transaction; convert it to XDR; prompt Freighter with `signTransaction`; submit the signed transaction through Stellar RPC and poll for the result. Freighter's docs identify `@stellar/freighter-api` and `signTransaction` as the browser signing path for Soroban XDRs (https://developers.stellar.org/docs/build/guides/freighter/prompt-to-sign-tx).

The `fee` on a Soroban assembled transaction is not just the inclusion fee. Stellar's fee docs define `Transaction Fee (Tx.fee) = Resource Fee (sorobanData.resourceFee) + Inclusion Fee`; non-contract transactions have resource fee zero, while contract transactions get resource values from `simulateTransaction`/assembly (https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering). Treat the user-facing fee as the total maximum fee and derive the inclusion component only by subtracting `sorobanData.resourceFee` when you need to explain the breakdown.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer depends on current official binding, Freighter, and fee semantics. `scout_research` is acceptable only as a supplementary corpus lookup; it should not replace the developer docs for command/API behavior.

## Edge / traps

The common wrong answer is to use old Soroban examples that sign with a server-held secret key or to treat `fee` like a classic-only base fee. Another trap is copying a generated-client method signature from an old binding package; the durable answer should point to the generated README/types in the user's own `packages/<contract>` directory and cite the current docs.
