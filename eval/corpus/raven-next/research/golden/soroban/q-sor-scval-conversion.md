---
id: q-sor-scval-conversion
q: "How do I convert between native JS/Rust values and Soroban ScVal — i128/u64, BytesN<32>, contract-ID hex vs StrKey C-addresses, enum/union UDTs, stroops vs display amounts — in the current SDK?"
category: soroban
subcategory: encoding-diagnostics
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that Soroban invocation arguments are `SCVal` XDR values; Rust uses `IntoVal`/`FromVal` and generated clients, while JS should use generated contract clients/spec helpers or explicit SDK ScVal helpers.", weight: 5 }
  - { claim: "Distinguishes signed `i128`/`u64`/`u128` integer ScVals from JS `number`; large values should use BigInt/string-safe paths.", weight: 4 }
  - { claim: "Explains that `BytesN<32>` is exactly 32 raw bytes, while a StrKey `C...` contract id is a user-facing encoding of a 32-byte contract hash/address, not the same as hex text bytes.", weight: 5 }
  - { claim: "Explains that UDT enums/unions must be encoded according to the contract spec arm and fields; raw strings or arrays are not enough if the contract expects a tagged enum.", weight: 4 }
  - { claim: "Warns that token amounts in SAC/SEP-41 calls are integer stroops/base units, not display decimals; use the token decimals separately for UI conversion.", weight: 4 }
should_have:
  - { claim: "Mentions `scValToNative`/humanizing helpers for decoding results and diagnostic/event ScVals.", weight: 2 }
nice_to_have:
  - { claim: "Recommends regenerating bindings when a spec changes or after contract upgrade.", weight: 1 }
must_avoid:
  - { claim: "Do NOT encode a `C...` address as UTF-8 bytes for a `BytesN<32>` argument.", weight: 5 }
  - { claim: "Do NOT use JS floating point numbers for i128 token amounts.", weight: 5 }
  - { claim: "Do NOT flatten contract UDT enum arms into untagged JSON unless the generated client specifically accepts that shape.", weight: 4 }
must_cite:
  - "Official Stellar XDR/SCVal or transaction docs."
  - "Official contract specs/client docs or JS SDK docs/source for helper behavior."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/data-format/xdr
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
  - https://developers.stellar.org/docs/build/guides/dapps/working-with-contract-specs
  - https://github.com/stellar/js-stellar-sdk
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Phase 3 should verify exact current JS helper names against the installed/current @stellar/stellar-sdk version because this repo does not vendor node_modules."
---

## Reference answer (gospel)

Soroban contract calls take `SCVal` XDR arguments. In Rust, prefer generated clients and `IntoVal`/`FromVal`. In JS, prefer generated contract clients/spec helpers; if you build calls manually, construct each `ScVal` with the JS SDK/XDR helpers that match the contract spec.

Important boundaries: use BigInt/string-safe paths for `i128`, `u128`, and `u64` values; do not round through JS `number`. `BytesN<32>` is exactly 32 raw bytes. A `C...` contract id is a StrKey address encoding of a 32-byte contract hash/address; it is not the same thing as the UTF-8 bytes of the `C...` string or a random hex string. UDT enums/unions must be tagged as the contract spec defines; for example, an enum arm like `Asset::Stellar(Address)` is not interchangeable with `"USDC:G..."`.

For token amounts, SAC/SEP-41 methods take integer base units (`i128`). Convert UI display amounts using token `decimals()` outside the call. Decode return values/events with SDK ScVal-to-native/humanizing helpers, but keep exact integer values as BigInt/string when precision matters.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is official SDK/XDR/spec behavior. `scout_repos` is acceptable for current SDK source lookup, especially if helper names drift between JS SDK versions.

## Edge / traps

Most failures come from using display-oriented representations at the protocol boundary: `C...` as bytes, JS floats for token amounts, untagged JSON for enum arms, or stale generated specs after changing a contract.
