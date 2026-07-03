---
id: q-soroban-zk-bls12-381
q: "Does Soroban have native host functions for BLS12-381, and which protocol version added them?"
category: soroban
subcategory: zk
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Yes: Soroban has native BLS12-381 host functions (G1/G2 add/mul, pairing check, hash-to-curve, etc.) usable from contracts.", weight: 5 }
  - { claim: "They were added by CAP-0059 in Protocol 22.", weight: 4 }
should_have:
  - { claim: "These enable on-chain verification (e.g., Groth16-style pairing checks) without an EVM-style precompile bridge.", weight: 3 }
nice_to_have:
  - { claim: "Notes BN254 + Poseidon were added later (Protocol 25 / X-Ray), distinct from BLS12-381.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroban lacks native pairing-friendly curve support / requires reimplementing BLS in pure Wasm.", weight: 4 }
  - { claim: "Do NOT attribute BLS12-381 to the wrong protocol (e.g., P25/P20) or conflate it with BN254.", weight: 3 }
must_cite:
  - "The Protocol 22 announcement or CAP-0059, or the developers.stellar.org ZK page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0059.md
  - https://stellar.org/blog/developers/announcing-protocol-22
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections; re-verified CAP-0059 header (Final, Protocol 22) and CAP-0074/0075 (Final, Protocol 25) via gh api. Trap: conflating BLS12-381 (P22) with BN254 (P25). Adds bls12_381_g1/g2 add/mul/msm, multi_pairing_check, hash_to_g1/g2, map_fp(2)_to_g(1/2), fr arithmetic."
---

## Reference answer (gospel)

**Yes.** Soroban has **native BLS12-381 host functions** callable from contracts, added by **CAP-0059
("Host functions for BLS12-381", Status: Final) in Protocol 22**. The set includes G1/G2 point
**add / mul / multi-scalar-mul (msm)**, **`bls12_381_multi_pairing_check`**, **hash-to-curve**
(`hash_to_g1`/`hash_to_g2`), field-to-curve maps, and **Fr scalar arithmetic** (add/sub/mul/pow/inv).

This means **pairing-friendly curve operations run natively** — you can do on-chain pairing checks
(e.g. **Groth16-style** verification, BLS signatures) **without** reimplementing BLS in pure Wasm or an
EVM-style precompile bridge.

Note these are **distinct** from **BN254 + Poseidon**, which were added **later** in **Protocol 25
("X-Ray")** via **CAP-0074 / CAP-0075** — don't conflate the two curves or their protocol versions.

## Why these cards (routing rationale)

Protocol-gated ZK primitive fact → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Claiming no native pairing curves; wrong protocol; conflating BLS12-381 with BN254.
