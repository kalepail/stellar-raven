---
id: q-infra-simulate-transaction-howto
q: "How do I simulate a Soroban contract invocation to get the resource footprint and fees before submitting?"
category: tooling-infra
subcategory: rpc-simulate
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Use the Stellar RPC `simulateTransaction` method to dry-run a contract call and obtain the footprint/resource fees before submitting.", weight: 5 }
  - { claim: "Simulation results (footprint, auth, soroban resources) are then applied to the transaction before `sendTransaction`.", weight: 3 }
should_have:
  - { claim: "The SDKs (e.g. @stellar/stellar-sdk) and the Stellar CLI wrap simulation as part of building/invoking contract transactions.", weight: 2 }
nice_to_have:
  - { claim: "The Stellar Lab can also simulate transactions in the browser.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim you simulate via a Horizon endpoint, or invent a non-existent RPC simulate method name.", weight: 4 }
must_cite:
  - "developers.stellar.org simulateTransaction guide / RPC methods reference."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/simulateTransaction-Deep-Dive
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/simulateTransaction
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "simulateTransaction (RPC) is the answer; Horizon-based simulation is the trap."
---

## Reference answer (gospel)

Call the **Stellar RPC `simulateTransaction`** method on the built (but unsigned) contract-invocation
transaction. It **dry-runs the call without submitting** and returns the **resource footprint
(read/write ledger keys), required auth entries, and the Soroban resource fees**. You then **apply those
simulation results to the transaction** (set the footprint/resource fees, attach auth) **before
`sendTransaction`**. In practice the SDKs (e.g. `@stellar/stellar-sdk`'s `rpc.Server.simulateTransaction`
/ `prepareTransaction`) and the **Stellar CLI** wrap simulation as part of building/invoking, and the
**Stellar Lab** can simulate in the browser. Simulation is a **Stellar RPC** capability — there is no
Horizon simulate endpoint.

## Why these cards (routing rationale)

RPC how-to → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Claiming you simulate via a Horizon endpoint, or inventing a non-existent RPC simulate method name.
