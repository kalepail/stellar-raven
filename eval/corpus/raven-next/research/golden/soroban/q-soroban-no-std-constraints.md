---
id: q-soroban-no-std-constraints
q: "Why can't I use Rust's standard library, HashMap, or floating-point math inside a Soroban contract?"
category: soroban
subcategory: execution-model
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Soroban contracts compile as `#![no_std]` with no heap allocator, so `std` collections (e.g., `std::collections::HashMap`, `Vec` from std) are unavailable.", weight: 5 }
  - { claim: "Use the SDK-provided host types instead: `soroban_sdk::Vec`, `Map`, `Bytes`, `BytesN`, `Symbol`, `String`.", weight: 4 }
should_have:
  - { claim: "Floating point is disallowed because execution must be deterministic across validators.", weight: 3 }
  - { claim: "Determinism is required for consensus; non-deterministic ops would break agreement.", weight: 2 }
nice_to_have:
  - { claim: "Notes supported scalar integer types (i128/u128/i64/u64/i32/u32/bool).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim you can freely use `std`, `std::collections`, or `f64`/`f32` floats in a contract.", weight: 5 }
  - { claim: "Do NOT attribute the restriction to gas costs alone rather than determinism + no-allocator/no_std.", weight: 2 }
must_cite:
  - "A developers.stellar.org contract-development page covering types/no_std constraints."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/types/built-in-types
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Determinism + no_std are the real reasons; the trap is 'std/floats are fine'. Verified: contracts are #![no_std], no allocator, SDK host types replace std collections, no floating point for determinism."
---

## Reference answer (gospel)

Soroban contracts compile with **`#![no_std]`** and **no heap allocator**, so Rust's **standard
library and its collections are unavailable** — you can't use `std::collections::HashMap` or `std`'s
`Vec`. Instead use the **SDK-provided host types**: `soroban_sdk::Vec`, `Map`, `Bytes`, `BytesN`,
`Symbol`, and `String` (these are backed by the host, not the guest heap).

**Floating point (`f32`/`f64`) is disallowed** because contract execution must be **deterministic**
across all validators — float results can vary by platform, which would break consensus. For the same
reason there is no system clock/RNG you control directly. Supported scalars are the integer types
`i128`/`u128`/`i64`/`u64`/`i32`/`u32` (and `bool`).

So the real reasons are **determinism + the no_std/no-allocator environment**, not merely gas costs.

## Why these cards (routing rationale)

SDK constraint explanation → `stellar_docs_mcp`; `scout_repos`/`scout_research` acceptable.

## Edge / traps

Assuming standard Rust applies; using std collections or floats; attributing the limit to fees instead of determinism.
