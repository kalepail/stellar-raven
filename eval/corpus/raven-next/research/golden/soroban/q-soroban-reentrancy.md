---
id: q-soroban-reentrancy
q: "Is reentrancy a concern in Soroban smart contracts the way it is on Ethereum?"
category: soroban
subcategory: security
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, scout_repos]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Classic single-contract reentrancy is largely prevented by the Soroban host: a contract cannot be re-entered while it is mid-execution (the host disallows reentry into an executing contract).", weight: 5 }
  - { claim: "Therefore the dominant Soroban risks are different (storage-growth DoS, auth/footprint mistakes, oracle/replay), not Ethereum-style reentrancy.", weight: 3 }
should_have:
  - { claim: "You should still reason about cross-contract call ordering and state assumptions (checks-effects-interactions-style discipline) for composed flows.", weight: 2 }
nice_to_have:
  - { claim: "Notes you generally do not need a Solidity-style ReentrancyGuard/nonReentrant modifier on Soroban.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroban needs a Solidity-style `nonReentrant`/ReentrancyGuard as the primary defense because reentrancy works the same as on Ethereum.", weight: 4 }
  - { claim: "Do NOT claim Soroban has zero call-ordering / composition risks whatsoever.", weight: 2 }
must_cite:
  - "A Soroban security source (Veridise/Inferara/SDF) on the reentrancy/host model."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://veridise.com/blog/audit-insights/building-on-stellar-soroban-grab-this-security-checklist-to-avoid-vulnerabilities/
  - https://github.com/stellar/rs-soroban-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Soroban host disallows re-entering a contract already on the call stack, so classic single-contract reentrancy is structurally prevented; dominant risks are storage-growth DoS / auth / oracle. Trap: asserting EVM-identical reentrancy and prescribing nonReentrant."
---

## Reference answer (gospel)

Not in the Ethereum sense. The **Soroban host disallows re-entering a contract that is already on the
current call stack** — a contract cannot be called back into while it is mid-execution — so classic
**single-contract reentrancy is structurally prevented** and you generally **do not need a
Solidity-style `ReentrancyGuard` / `nonReentrant`** modifier.

- Because of that, the **dominant Soroban risk classes are different**: unbounded/Instance-storage
  growth DoS, authorization/footprint mistakes, and oracle/replay issues — not reentrancy. [veridise]
- You should **still** reason about **cross-contract call ordering and state assumptions** for composed
  flows (checks-effects-interactions discipline): Soroban removes the classic reentrancy footgun but
  not all composition/call-ordering risk.

Traps: asserting reentrancy works the same as on Ethereum and prescribing `nonReentrant` as the primary
defense; or claiming Soroban has zero call-ordering/composition risk whatsoever.

## Why these cards (routing rationale)

Security model fact → `scout_research`. Docs/repos acceptable.

## Edge / traps

Asserting EVM-identical reentrancy; prescribing a ReentrancyGuard as primary defense.
