---
id: q-soroban-fuzz-testing
q: "What options exist for fuzz or property-based testing of Soroban contracts?"
category: soroban
subcategory: testing
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
  - { claim: "Soroban contracts can be fuzzed/property-tested with Rust tooling such as `proptest`, `arbitrary`, and cargo-fuzz/libfuzzer against the in-process `Env` test host.", weight: 5 }
  - { claim: "Fuzzing targets input boundaries (e.g., unbounded `Vec`/`Map`, integer overflow) that are common Soroban audit findings.", weight: 3 }
should_have:
  - { claim: "Property tests assert invariants (e.g., conservation of balances) across randomized call sequences.", weight: 2 }
  - { claim: "Auditors (Certora et al.) reference fuzzers/static analyzers in the Soroban audit roadmap.", weight: 2 }
nice_to_have:
  - { claim: "Mentions named ecosystem fuzzers/static tools (e.g., OZ Soroban security detector / Scout).", weight: 1 }
must_avoid:
  - { claim: "Do NOT recommend Echidna/Foundry invariant testing as the Soroban tools (those are EVM/Solidity).", weight: 4 }
  - { claim: "Do NOT claim Soroban has no fuzzing/property-testing story.", weight: 3 }
must_cite:
  - "A Soroban testing guide, audit-roadmap, or a graded repo demonstrating fuzz/property tests."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/testing/fuzzing
  - https://www.certora.com/blog/roadmap-to-a-soroban-security-audit
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Targets scout_repos for code discovery. Echidna/Foundry is the EVM trap. Verified: Soroban fuzzing uses Rust tooling (proptest, arbitrary, cargo-fuzz/libfuzzer) against the in-process Env test host; audit roadmaps (Certora) reference fuzzers/static analyzers."
---

## Reference answer (gospel)

Soroban contracts are tested with **Rust** fuzz/property tooling run against the SDK's **in-process
`Env` test host** (`Env::default()`), so no live network is needed:

- **Property-based testing** with **`proptest`** — assert invariants (e.g. conservation of balances,
  monotonic supply) over randomized inputs / call sequences.
- **Coverage-guided fuzzing** with **`cargo-fuzz`/libfuzzer** plus **`arbitrary`** to generate
  structured inputs.

Fuzzing targets the Soroban-specific finding classes: **unbounded `Vec`/`Map` inputs**, integer
**overflow**, and storage/TTL edge cases. Auditors (e.g. **Certora**, Veridise) reference fuzzers +
static analyzers (OpenZeppelin's Soroban security detector, **Scout**) in their Soroban audit roadmaps.

Do **not** reach for **Echidna / Foundry invariant testing** — those are EVM/Solidity tools and don't
apply to Soroban's Rust/Wasm + `Env` model.

## Why these cards (routing rationale)

Code/tooling discovery → `scout_repos` (graded repos). Docs/research acceptable.

## Edge / traps

Recommending Echidna/Foundry invariants; claiming no fuzzing story exists.
