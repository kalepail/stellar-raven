---
id: q-protocol-bn254-poseidon-xray
q: "What ZK-related cryptographic primitives did Stellar's Protocol 25 ('X-Ray') add, and what are they for?"
category: protocol-core
subcategory: cryptography-caps
axes: [tool-targeted, ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States Protocol 25 ('X-Ray', Mainnet vote ~2026-01-22) added BN254 curve host functions plus Poseidon and Poseidon2 hash/permutation host functions.", weight: 5 }
  - { claim: "Pairs BN254 with CAP-0074 and Poseidon/Poseidon2 with CAP-0075, both shipped in Protocol 25 ('X-Ray').", weight: 4 }
  - { claim: "Frames these as cryptographic groundwork for zero-knowledge / compliance-forward privacy applications, not on-by-default privacy.", weight: 4 }
should_have:
  - { claim: "Distinguishes these P25 additions from the earlier BLS12-381 host functions (CAP-0059, Protocol 22).", weight: 3 }
nice_to_have:
  - { claim: "Notes Poseidon is a ZK-friendly hash used in SNARK circuits / Merkle commitments.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute BN254/Poseidon to the wrong protocol (e.g. Protocol 22 or 23) or conflate them with BLS12-381 (CAP-0059, P22).", weight: 5 }
  - { claim: "Do NOT claim Stellar now ships on-by-default ZK privacy or confidential transactions (these are host-function building blocks).", weight: 4 }
  - { claim: "Do NOT mis-pair the CAP ids (BN254 is CAP-0074, Poseidon/Poseidon2 is CAP-0075) or attribute them to BLS12-381's CAP-0059.", weight: 3 }
must_cite:
  - "The Protocol 25 / X-Ray upgrade guide on stellar.org and/or the relevant CAP files in stellar/stellar-protocol."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0075.md
  - https://stellar.org/blog/developers/announcing-stellar-x-ray-protocol-25
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "VERIFIED against stellar/stellar-protocol: CAP-0074 'Host functions for BN254', Status Final, Protocol version 25; CAP-0075 'Cryptographic Primitives for Poseidon/Poseidon2 Hash Functions', Status Final, Protocol version 25. Both ship in Protocol 25 'X-Ray' (Mainnet vote ~2026-01-22). Rubric gates on P25 + primitives + the CAP-0074/0075 pairing. Confirmed exact CAP ids."
---

## Reference answer (gospel)

**Protocol 25 ("X-Ray")** (Mainnet vote ~2026-01-22) added two ZK-oriented cryptographic surfaces as
Soroban host functions:
- **BN254** curve host functions — **CAP-0074** ("Host functions for BN254", Status: Final, Protocol
  version 25): `bn254_g1_add`, `bn254_g1_mul`, `bn254_multi_pairing_check` [1]. BN254 is the
  pairing-friendly curve with native EVM precompile support (EIP-196/197), so this gives Soroban parity
  for apps already built on BN254 [1].
- **Poseidon / Poseidon2** permutation host functions — **CAP-0075** ("Cryptographic Primitives for
  Poseidon/Poseidon2 Hash Functions", Status: Final, Protocol version 25): `poseidon_permutation` and
  `poseidon2_permutation` over BLS12-381 Fr or BN254 Fr fields [2]. Poseidon is a ZK-friendly hash used in
  SNARK circuits and Merkle commitments [2].

These are **building blocks** for zero-knowledge / compliance-forward privacy apps — not on-by-default
privacy or confidential transactions [3]. They are distinct from the earlier **BLS12-381** host functions
(**CAP-0059, Protocol 22**).

Sources: [1] stellar/stellar-protocol `core/cap-0074.md`; [2] `core/cap-0075.md`; [3] stellar.org
"Announcing Stellar X-Ray, Protocol 25".

## Why these cards (routing rationale)

Recent crypto/CAP detail → `stellar_docs_mcp` + `scout_research`; general-web acceptable for the dated
X-Ray upgrade guide. Deep-research is over-escalation for a documented protocol change.

## Edge / traps

Two traps: (1) conflating BN254/Poseidon (CAP-0074/CAP-0075, P25) with BLS12-381 (CAP-0059, P22); (2)
claiming on-by-default ZK privacy. The rubric gates on the CAP-0074 (BN254) / CAP-0075 (Poseidon/Poseidon2)
pairing; Phase 2 cross-checks the exact ids against stellar/stellar-protocol.
