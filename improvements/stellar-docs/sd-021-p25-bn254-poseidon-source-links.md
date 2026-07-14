---
id: sd-021
service: stellar-docs
status: verified
discovered: 2026-07-11
upstreamTitle: Fix the Protocol 25 BN254 CAP link and Poseidon API distinctions
evidence:
  - Software Versions P25 BN254 item links CAP-79 instead of CAP-74
  - ZK docs blur host permutation names with higher-level Poseidon hash APIs
  - pinned soroban-sdk 25 BN254 and hazmat Poseidon compile probes passed
  - live recheck 2026-07-14: both Mainnet and Testnet Protocol 25 sections still link BN254 Elliptic Curve Operations to CAP-79; zk.mdx still calls poseidon and poseidon2 host functions without distinguishing the raw hazmat permutation APIs
  - Solo scratchpad 575 GT-43 primary 3311 and blind 3320
  - P4 H2 recurrence 2026-07-11: the served ZK material still describes CAP-0074/CAP-0075 as proposed or gated after Protocol 25, while the official CAP index and v25 release notes mark the changes Final/shipped; solo://proj/49/scratchpad/super-corpus-rebuild--585
recurrences:
  - date: 2026-07-11
    evidence: H2 independently reproduced the stale P25 BN254/Poseidon status language and the resulting incorrect advice to wait for BN254 before using Noir or RISC Zero toolchains.
---

## Finding

Current official P25/ZK documentation links the wrong CAP for BN254 and does
not distinguish host permutation functions, feature-gated raw SDK APIs, and
the separate high-level `soroban-poseidon` hash crate. This helped create the
false claim that SDK v25 lacked BN254 wrappers.

## Evidence

The current Software Versions page links “BN254 Elliptic Curve Operations” to
CAP-79 in both Protocol 25 sections; the normative proposal is CAP-74. The
current ZK page labels `poseidon` and `poseidon2` as host functions, while the
raw SDK surface exposes feature-gated `poseidon_permutation` and
`poseidon2_permutation` APIs and higher-level hashing is a separate crate.

## Recommendation

Link P25 BN254 to CAP-0074, document the P25+ typed BN254 wrapper surface, name
raw `poseidon_permutation`/`poseidon2_permutation` behind `hazmat-crypto`, and
separately show higher-level hash APIs.
