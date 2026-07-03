---
id: q-soroban-zk-groth16-verifier
q: "Are there example Soroban contracts or repos that implement a Groth16 / ZK proof verifier on Stellar?"
category: soroban
subcategory: zk
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_repos]
acceptable_cards: [stellar_docs_mcp, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "There are Soroban/Stellar repos and examples implementing ZK proof verification (e.g., Groth16 pairing-check verifiers) using the native BLS12-381 / BN254 host functions.", weight: 5 }
  - { claim: "A Groth16 verifier reduces to pairing/curve checks, which map onto the native host functions rather than requiring a Solidity precompile bridge.", weight: 3 }
should_have:
  - { claim: "Surfaces concrete repos/examples (the answer should name candidate repos rather than say none exist), e.g., Noir/Circom→Stellar verifier projects.", weight: 3 }
  - { claim: "Notes the developers.stellar.org ZK proofs page as a starting reference.", weight: 2 }
nice_to_have:
  - { claim: "Mentions proving-stack options (Noir, RISC Zero) that pair with on-chain Stellar verification.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim there are no ZK-verifier implementations on Soroban.", weight: 4 }
  - { claim: "Do NOT point to a Solidity Groth16 verifier (e.g., snarkjs-generated `Verifier.sol`) as a Soroban implementation.", weight: 3 }
must_cite:
  - "A graded GitHub repo implementing a Soroban ZK verifier, or the developers.stellar.org ZK page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/apps/zk
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0059.md
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Targets scout_repos for code discovery. Trap: citing a Solidity Verifier.sol. VERIFIED: developers.stellar.org/docs/build/apps/zk references native BN254/Poseidon (P25) plus Noir/RISC Zero tooling and a 'Noir Ultrahonk Soroban Verifier Contract' + P25-preview verifier examples; BLS12-381 (CAP-0059/P22) underpins pairing-based Groth16 verification natively. Concrete repo names shift — gate on 'name real Soroban verifier repos/examples', not a fixed URL."
---

## Reference answer (gospel)

**Yes — ZK verifiers exist on Soroban as native Rust/Wasm contracts**, not Solidity precompile bridges.
A **Groth16** (or PLONK/Honk) verifier reduces to **pairing / curve checks**, which map directly onto
Soroban's native crypto host functions: **BLS12-381** (CAP-0059, Protocol 22) and **BN254 + Poseidon**
(CAP-0074/0075, Protocol 25 "X-Ray").

Starting points and examples:

- The **developers.stellar.org ZK proofs page** (`/docs/build/apps/zk`) is the reference; it covers the
  BN254/Poseidon primitives and points at example verifier contracts (e.g. a **Noir Ultrahonk Soroban
  Verifier Contract** and **Protocol-25 preview** examples).
- Proving stacks that pair with on-chain Stellar verification include **Noir** and **RISC Zero**.

The answer should **name concrete Soroban repos/examples**, not claim none exist — and must **not**
point to a Solidity `Verifier.sol` (e.g. snarkjs output) as a Soroban implementation.

## Why these cards (routing rationale)

Code discovery for ZK verifiers → `scout_repos`. Docs/research acceptable.

## Edge / traps

Claiming none exist; citing a Solidity `Verifier.sol` instead of a Soroban impl.
