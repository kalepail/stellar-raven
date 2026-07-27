---
id: sd-022
service: stellar-docs
status: fixed-upstream
discovered: 2026-07-11
upstreamTitle: Clarify that Soroban contracts have no allocator by default
evidence:
  - Hello World describes contracts as having no allocator
  - current Rust-dialect/allocator material and soroban-sdk v27 alloc module make allocation optional
  - SDK v27 alloc and no-default-feature compile probes passed
  - Solo scratchpad 575 GT-46 primary 3326 and blind 3329
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2594
  - fixed upstream by https://github.com/stellar/stellar-docs/pull/2620 (merged 2026-07-16); issue https://github.com/stellar/stellar-docs/issues/2594 closed completed
  - live recheck 2026-07-27: the hello-world page reads "there is no allocator and no heap memory in Soroban contracts by default (the SDK does provide an opt-in allocator through its alloc feature - see the alloc example)"
---

## Finding

Current introductory wording turns the default no-allocator configuration into
an absolute platform restriction. Soroban contracts are no_std, but the SDK
alloc feature or a custom allocator can enable guest allocation at additional
CPU and code-size cost.

## Recommendation

Say "no allocator by default" in introductory material, link the allocator
caveat, and keep the stronger invariant focused on no_std, unsupported
floating point, and the preference for host-backed SDK types.
