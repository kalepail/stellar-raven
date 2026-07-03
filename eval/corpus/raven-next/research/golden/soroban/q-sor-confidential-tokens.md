---
id: q-sor-confidential-tokens
q: "Does Stellar support confidential/private tokens, and how would an auditor verify a confidential multi-chain payment when a leaf is offline?"
category: soroban
subcategory: sac-token-interop
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Distinguishes current Stellar privacy/ZK primitives from a generally deployed private-token product: confidential tokens are described as in progress, not a blanket property of SAC or SEP-41 tokens.", weight: 5 }
  - { claim: "Explains confidential-token goals: hide amounts/balances while sender and receiver addresses remain visible, with selective auditability.", weight: 4 }
  - { claim: "Mentions Stellar's ZK building blocks (BLS12-381 and, for Protocol 25 targets, BN254/Poseidon host functions) as primitives for verifier contracts, not a complete turnkey privacy token standard by themselves.", weight: 4 }
  - { claim: "For offline-leaf auditability, requires off-chain evidence: commitment/Merkle inclusion path, public inputs, domain-separated proof statement, nonces/replay guards, and a verifier/policy contract or auditor tool that can verify without trusting the offline participant.", weight: 5 }
should_have:
  - { claim: "Cites the Confidential Token Association / Stellar privacy docs and CAP or ZK docs for protocol primitives.", weight: 3 }
  - { claim: "Warns to verify target network protocol/software version and SDK support before deploying BN254/Poseidon-dependent code.", weight: 3 }
nice_to_have:
  - { claim: "Frames privacy as confidentiality with compliance/audit disclosure, not anonymity of all graph metadata.", weight: 2 }
must_avoid:
  - { claim: "Do not claim ordinary Stellar assets, SAC balances, or SEP-41 transfers are confidential by default.", weight: 5 }
  - { claim: "Do not claim an offline leaf can be audited from chain data alone if the needed witness/proof data was never published or retained.", weight: 5 }
  - { claim: "Do not hardcode draft/protocol assumptions without checking current CAP/network status.", weight: 4 }
must_cite:
  - "Must cite Stellar privacy/ZK docs or CAPs for confidential-token and cryptographic primitive status."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/apps/privacy
  - https://developers.stellar.org/docs/build/apps/zk
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0059.md
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0075.md
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Phase 3 verified CAP-0059 is Final/Protocol 22 and CAP-0074/0075 are Final/Protocol 25 in stellar-protocol on 2026-06-29. Answers should still verify the target network protocol and SDK availability before promising deployability."
---

## Reference answer (gospel)

Do not answer "yes, Stellar tokens are private by default." Ordinary Stellar assets, SAC transfers,
and SEP-41-style contract tokens are public unless the application adds a privacy protocol. Stellar's
privacy docs describe **Confidential Tokens** as keeping token balances and transaction amounts
private while sender and receiver addresses remain visible, and say the standard/implementation on
Stellar is in progress (https://developers.stellar.org/docs/build/apps/privacy).

The current Raven-shaped answer is: Stellar has ZK/privacy building blocks, not a blanket turnkey
private-token guarantee for every asset. The ZK docs and CAPs are the right primitive layer:
CAP-0059 covers BLS12-381 host functions, CAP-0074 covers BN254 host functions, and CAP-0075 covers Poseidon/Poseidon2 primitives
(https://developers.stellar.org/docs/build/apps/zk,
https://github.com/stellar/stellar-protocol/blob/master/core/cap-0059.md,
https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md,
https://github.com/stellar/stellar-protocol/blob/master/core/cap-0075.md). These CAPs are final in the protocol repo, with BLS12-381 tied to Protocol 22 and BN254/Poseidon tied to Protocol 25; before designing against BN254/Poseidon, verify the target network protocol version and SDK release.

For "auditor verifies a confidential multi-chain payment while a leaf is offline," the answer is not
"read the hidden amount from chain." The auditor needs retained off-chain evidence: the encrypted
payload or disclosure key, commitment/Merkle inclusion path for the offline leaf, public inputs
binding the source chain, destination chain, asset, amount commitment, nonce, and policy, plus a proof
verified by a dedicated verifier/policy path. If the witness or disclosure material was never retained
or published, the offline leaf cannot be reconstructed trustlessly after the fact.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for official privacy/ZK status and CAP links. `scout_research` is
acceptable because Scout indexes dev docs, SEPs/CAPs, and can surface the same privacy/ZK sources; it
is useful for landscape context but not a substitute for protocol status.

## Edge / traps

The dangerous trap is saying "Stellar supports private tokens" without qualification. Another is
equating ZK host functions with a complete confidential token standard. A third is promising audit
recovery for an offline participant without retained proof/witness/disclosure data.
