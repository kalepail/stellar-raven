---
id: q-sor-x-ray-bn254-sdk-gap
q: "Is Protocol 25 (X-Ray) live, and given the BN254 host functions exist at the protocol level but soroban-sdk (e.g. v23.4.0/v25) doesn't expose them, how do I actually verify a BN254 proof / use Poseidon on testnet today (exact g1_add/g1_mul/pairing_check signatures, byte layout, endianness, EIP-197 compat)?"
category: soroban
subcategory: zk-privacy
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States the dated/current status: Protocol 25/X-Ray introduced BN254 and Poseidon/Poseidon2 host functions; cite current docs/CAPs and avoid claiming support on a network without checking its protocol version.", weight: 5 }
  - { claim: "Names CAP-0074 BN254 host functions and exact protocol-level signatures: `bn254_g1_add(BytesObject, BytesObject) -> BytesObject`, `bn254_g1_mul(BytesObject, U256Val) -> BytesObject`, `bn254_multi_pairing_check(VecObject, VecObject) -> Bool`.", weight: 5 }
  - { claim: "Specifies byte layout/endian: G1 is 64 bytes `be(X)||be(Y)`, G2 is 128 bytes `be(X_c1)||be(X_c0)||be(Y_c1)||be(Y_c0)`, point-at-infinity `(0,0)`, uncompressed/no flag bits.", weight: 5 }
  - { claim: "Explains EIP-196/197 compatibility goal and warns that exact guest API availability is SDK-version-sensitive; current docs expose BN254/Poseidon SDK resources, but older v23-era SDKs and some examples may lack stable high-level helpers.", weight: 4 }
  - { claim: "For Poseidon, names CAP-0075 `poseidon_permutation`/`poseidon2_permutation` and explains callers must supply field, state size, rounds, matrices/constants; these are permutations, not turnkey hash functions.", weight: 4 }
should_have:
  - { claim: "Mentions validating proof tooling test vectors and network protocol support before mainnet/testnet deployment.", weight: 3 }
nice_to_have:
  - { claim: "Mentions BLS12-381 was earlier CAP-0059 and should not be confused with BN254.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assume every installed SDK exposes BN254/Poseidon high-level helpers; qualify SDK-version support and cite current docs or package types.", weight: 5 }
  - { claim: "Do NOT use little-endian or compressed point encodings for CAP-0074.", weight: 5 }
  - { claim: "Do NOT imply BN254 primitives alone provide end-to-end private payments.", weight: 4 }
must_cite:
  - "Official ZK/X-Ray docs."
  - "CAP-0074 and CAP-0075."
  - "A dated/current source for network/protocol activation if asserting live status."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/apps/zk
  - https://developers.stellar.org/docs/networks/software-versions
  - https://developers.stellar.org/docs/build/apps/privacy
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0075.md
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Verified CAP status/signatures, current docs, and software-versions page on 2026-06-29. Developer docs list Protocol 25 Mainnet on 2026-01-22 and show SDK docs/resources for BN254/Poseidon; exact imported guest APIs remain SDK-version-sensitive."
---

## Reference answer (gospel)

Protocol 25/X-Ray introduced native ZK host functions for BN254 and Poseidon/Poseidon2. A correct answer must still check the target network's current protocol version and the exact `soroban-sdk`/environment version before telling a developer it works in their deployment environment.

CAP-0074 defines the BN254 host functions:

- `bn254_g1_add(point1: BytesObject, point2: BytesObject) -> BytesObject`
- `bn254_g1_mul(point: BytesObject, scalar: U256Val) -> BytesObject`
- `bn254_multi_pairing_check(vp1: VecObject, vp2: VecObject) -> Bool`

The byte format is uncompressed, big-endian. G1 is `be(X) || be(Y)` for 64 bytes. G2 is `be(X_c1) || be(X_c0) || be(Y_c1) || be(Y_c0)` for 128 bytes. Infinity is encoded as `(0,0)`, and compressed/flag-bit encodings are invalid. The CAP explicitly targets parity with Ethereum EIP-196/197 precompiles, but that does not mean every older SDK has high-level guest wrappers.

Stellar's current ZK docs link SDK resources for BN254 and Poseidon, but exact guest API names remain
version-sensitive. Use the SDK helpers your installed `soroban-sdk` documents; if the version you are
on lacks them, do not fake the API. Pin or upgrade to a compatible SDK/environment, or use only an
official preview/example path that imports host functions against the right protocol. For Poseidon,
CAP-0075 exposes `poseidon_permutation` and `poseidon2_permutation`; callers supply field selector,
`t`, `d`, round counts, matrices/diagonals, and round constants. These are permutation primitives,
not complete application-level privacy protocols.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the key facts are official docs and CAPs. `parallel_search` is acceptable only for dated activation/freshness corroboration.

## Edge / traps

The main trap is overstating SDK support. Protocol-level host functions can exist before a convenient stable SDK wrapper exists in the version the user is using. Another trap is using compressed or little-endian EVM library encodings without mapping them to CAP-0074's exact byte layout.
