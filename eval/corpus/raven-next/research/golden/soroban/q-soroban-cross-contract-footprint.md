---
id: q-soroban-cross-contract-footprint
q: "My cross-contract call fails with a footprint/HostError at runtime even though it simulates the logic correctly. Why?"
category: soroban
subcategory: cross-contract
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
  - { claim: "Every storage entry read/written across the whole call chain must be declared in the transaction footprint; a missing entry causes a runtime HostError.", weight: 5 }
  - { claim: "The footprint is normally computed by simulating the transaction (RPC `simulateTransaction` / `stellar tx simulate`), which discovers the entries the inner calls touch.", weight: 4 }
should_have:
  - { claim: "Soroban uses deterministic, explicitly-declared footprints (read-only + read-write sets) so validators can parallelize.", weight: 2 }
nice_to_have:
  - { claim: "Notes that auth entries for inner-contract `require_auth` must also be provided/authorized.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroban auto-discovers all touched state at execution time with no footprint needed.", weight: 4 }
  - { claim: "Do NOT attribute this to gas-limit/out-of-gas when it is a footprint declaration issue.", weight: 2 }
must_cite:
  - "A developers.stellar.org page on footprints / simulation / cross-contract."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/transaction-simulation
  - https://developers.stellar.org/docs/build/guides/conventions/cross-contract
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections. Multi-hop: cross-contract + footprint + simulation. Trap: thinking footprints are auto-discovered at exec. Verified: Soroban requires an explicitly-declared read/write footprint covering the whole call chain; simulation (simulateTransaction / stellar tx simulate) computes it."
---

## Reference answer (gospel)

Soroban transactions carry an **explicitly-declared footprint** — the read-only and read-write sets of
ledger keys the transaction may touch. The host **enforces** this footprint at execution: **every
storage entry read or written anywhere in the call chain — including inner cross-contract calls — must
be declared**, or the host raises a **`HostError`** at runtime even though your contract logic is
correct. Soroban does **not** auto-discover state at execution time; the declared footprint is what
enables validators to schedule non-overlapping transactions in parallel.

The fix: compute the footprint by **simulating** the transaction (RPC **`simulateTransaction`** /
`stellar tx simulate`), which discovers the entries the inner calls touch, and attach the resulting
`SorobanTransactionData` to the real transaction. (Also ensure inner-contract `require_auth` calls have
their auth entries provided.) This is a footprint-declaration problem, **not** an out-of-gas/instruction
issue.

## Why these cards (routing rationale)

Debugging footprint semantics → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Assuming no footprint is needed; blaming out-of-gas instead of a missing footprint entry.
