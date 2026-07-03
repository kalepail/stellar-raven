---
id: q-protocol-bls12-381-cap59
q: "Does Stellar support BLS12-381, and in which protocol version and CAP did it land?"
category: protocol-core
subcategory: cryptography-caps
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States BLS12-381 host functions landed in Protocol 22 via CAP-0059.", weight: 5 }
  - { claim: "Notes these are host functions usable from Soroban contracts (e.g. pairing / curve operations enabling BLS signatures and Groth16-style verification).", weight: 3 }
should_have:
  - { claim: "Notes Protocol 22 activated on Mainnet around 2024-12-05.", weight: 2 }
  - { claim: "Distinguishes BLS12-381 (CAP-0059, P22, available) from the later BN254/Poseidon additions (Protocol 25 'X-Ray').", weight: 2 }
nice_to_have:
  - { claim: "Notes BLS12-381 enables ZK-verifier / Groth16 use cases on Soroban.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute BLS12-381 to the wrong CAP number (e.g. CAP-0046, CAP-0051, CAP-0063) or wrong protocol (P20, P21, P25).", weight: 5 }
  - { claim: "Do NOT confuse BLS12-381 (CAP-0059, P22) with BN254/Poseidon (Protocol 25).", weight: 4 }
must_cite:
  - "The Protocol 22 upgrade guide and/or CAP-0059 in stellar/stellar-protocol."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/protocol-22-upgrade-guide
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0059.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "BLS12-381 = CAP-0059 = Protocol 22. Strong trap: wrong CAP number or confusing with BN254/Poseidon (P25)."
---

## Reference answer (gospel)

- BLS12-381 host functions landed in **Protocol 22 via CAP-0059** [1][2].
- These are **host functions usable from Soroban contracts** (pairing / curve operations enabling BLS signatures and Groth16-style verification) [2].
- Protocol 22 activated on Mainnet around **2024-12-05** [1].
- Distinct from the later **BN254/Poseidon** additions (Protocol 25 "X-Ray", CAP-0074/CAP-0075) [1].
- BLS12-381 enables ZK-verifier / Groth16 use cases on Soroban [2].

## Why these cards (routing rationale)

Crypto/CAP fact → `stellar_docs_mcp` + `scout_research`. `perplexity_search` acceptable for the dated
upgrade guide. Deep-research overkill.

## Edge / traps

The defining trap is wrong CAP/version: BLS12-381 is CAP-0059 in Protocol 22, distinct from BN254/Poseidon
in Protocol 25. Mixing these is the classic error.
