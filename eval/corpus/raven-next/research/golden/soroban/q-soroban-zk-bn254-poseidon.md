---
id: q-soroban-zk-bn254-poseidon
q: "Can I verify BN254-based proofs and use Poseidon hashing natively on Soroban yet?"
category: soroban
subcategory: zk
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Native BN254 host functions (G1 add/mul, multi-pairing check, encode/decode, on-curve checks) and Poseidon/Poseidon2 hashing were added in Protocol 25 ('X-Ray').", weight: 5 }
  - { claim: "BN254 came via CAP-0074 and Poseidon via CAP-0075.", weight: 3 }
should_have:
  - { claim: "Answer should flag the activation timing (X-Ray mainnet ~January 22, 2026) and that the contract needs an SDK/CLI version exposing these host functions.", weight: 3 }
  - { claim: "These are distinct from the earlier BLS12-381 functions (Protocol 22 / CAP-0059).", weight: 2 }
nice_to_have:
  - { claim: "Notes this enables verifying Noir/Circom/Groth16-style proofs on-chain without EVM precompiles.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim BN254/Poseidon have always been available or were added at the same time as BLS12-381.", weight: 4 }
  - { claim: "Do NOT assert they are unavailable on Soroban entirely (they are, since P25).", weight: 3 }
must_cite:
  - "The Protocol 25 / X-Ray announcement or CAP-0074 / CAP-0075, or developers.stellar.org ZK page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/announcing-stellar-x-ray-protocol-25
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Re-verified CAP-0074/CAP-0075 headers via gh api on 2026-06-29 (both Final, Protocol version 25). Distinct from BLS12-381 (P22/CAP-0059). Differentiation: this file is the pure availability/status probe (is it usable yet — protocol + SDK status, symmetric with q-soroban-zk-bls12-381); the exact host-fn signatures, byte layout/endianness, and EIP-196/197 parity are owned by q-sor-x-ray-bn254-sdk-gap and are intentionally NOT scored here."
---

## Reference answer (gospel)

Yes — natively, since **Protocol 25 "X-Ray"** (mainnet vote **January 22, 2026**). [xray]

- **BN254 host functions** via **CAP-0074** — `bn254_g1_add`, `bn254_g1_mul`,
  `bn254_multi_pairing_check` (plus encode/decode, on-curve checks), enabling efficient **on-chain
  zk-SNARK proof verification**. [xray][cap0074]
- **Poseidon / Poseidon2** ZK-friendly hashing via **CAP-0075**. [xray]
- These are **distinct from the earlier BLS12-381** host functions (Protocol 22 / CAP-0059); X-Ray
  *adds* BN254 alongside BLS12-381 (BN254 being the most widely used ZK curve). [xray]
- Your contract needs an **SDK/CLI version that exposes these host functions**, and the **target
  network must be on P25+** — flag the activation timing since this is protocol-gated. [xray]

This lets you verify **Groth16 / Noir / Circom**-style proofs on-chain **without EVM precompiles**.

Traps: claiming BN254/Poseidon were always available or arrived with BLS12-381; or asserting they are
unavailable on Soroban at all (they are, since P25).

## Why these cards (routing rationale)

Protocol-gated ZK feature with timing → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Claiming always-available; conflating with BLS12-381's earlier P22 introduction.
