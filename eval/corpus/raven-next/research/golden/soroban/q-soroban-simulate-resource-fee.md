---
id: q-soroban-simulate-resource-fee
q: "How do I estimate the resource fee and required footprint for a Soroban contract invocation before submitting it?"
category: soroban
subcategory: fees-metering
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
  - { claim: "Use Stellar RPC's `simulateTransaction` (or `stellar tx simulate` in the CLI) to pre-flight the invocation.", weight: 5 }
  - { claim: "Simulation returns the resource fee and the read/write footprint (the SorobanTransactionData) to attach to the real transaction.", weight: 4 }
should_have:
  - { claim: "Simulation also returns the function's predicted return value without committing state.", weight: 2 }
  - { claim: "You should add some margin / re-simulate because resource usage can vary.", weight: 1 }
nice_to_have:
  - { claim: "SDKs offer helpers like `prepareTransaction`/`assembleTransaction` that fold the simulation result back in.", weight: 1 }
must_avoid:
  - { claim: "Do NOT recommend `eth_estimateGas` or describe an Ethereum gas-estimation flow.", weight: 4 }
  - { claim: "Do NOT claim you can/should hand-pick the footprint without simulating.", weight: 2 }
must_cite:
  - "The developers.stellar.org simulateTransaction / RPC documentation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/transaction-simulation
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/simulateTransaction
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections. eth_estimateGas is the EVM trap. Verified: RPC simulateTransaction / `stellar tx simulate` returns the resource fee + footprint (SorobanTransactionData) and the predicted return value."
---

## Reference answer (gospel)

**Pre-flight the invocation by simulating it.** Call Stellar RPC's **`simulateTransaction`** (or
**`stellar tx simulate`** in the CLI) on the unsigned invocation. Simulation returns:

- the **resource fee** estimate, and
- the **read/write footprint** plus resource usage (the **`SorobanTransactionData`**) to **attach to
  the real transaction**, and
- the function's **predicted return value**, without committing any state.

SDK helpers like **`prepareTransaction` / `assembleTransaction`** fold the simulation result back into
the transaction for you. Because actual usage can vary, **re-simulate / add a small margin** before
submitting.

Do **not** reach for **`eth_estimateGas`** or an Ethereum gas flow, and don't hand-pick the footprint
without simulating.

## Why these cards (routing rationale)

Simulation how-to → `stellar_docs_mcp`. `scout_research`/`scout_repos` acceptable.

## Edge / traps

`eth_estimateGas`; hand-specifying footprints without simulation.
