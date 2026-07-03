---
id: q-soroban-wasm-size-limit
q: "Is there a maximum size for a deployed Soroban contract's Wasm, and what should I do if my contract is too big?"
category: soroban
subcategory: execution-model
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "There is a contract Wasm size cap (on the order of 64 KB compiled output) enforced as a network/consensus limit.", weight: 5 }
  - { claim: "Oversized logic should be split across multiple contracts composed via cross-contract calls, not packed into one binary.", weight: 3 }
should_have:
  - { claim: "Building with optimization (`stellar contract build --optimize`, wasm-opt) reduces binary size.", weight: 3 }
  - { claim: "Spec/dead-code shaking and `#![no_std]` keep the binary small.", weight: 2 }
nice_to_have:
  - { claim: "Notes the size limit is a tunable network config setting that can change across protocol upgrades.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim there is no size limit on Soroban contract Wasm.", weight: 4 }
  - { claim: "Do NOT cite an EVM contract size limit (e.g., 24 KB EIP-170) as the Soroban limit.", weight: 4 }
  - { claim: "Do NOT recommend `stellar contract optimize` as a current standalone command (it is deprecated in favor of `build --optimize`).", weight: 2 }
must_cite:
  - "A developers.stellar.org page on contract limits / build optimization."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
  - https://developers.stellar.org/docs/tools/cli/stellar-cli
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections. The 24KB EVM limit (EIP-170) is the cross-chain confusion trap. VERIFIED: the per-ledger-entry size limit is 64 KB (a network config setting) — this caps the contract-code (Wasm) entry and instance storage. It is tunable by validator vote, so the rubric gates on the durable fact (~64 KB ledger-entry cap, config-set) rather than a hard byte constant; kept medium because the exact byte value can drift."
---

## Reference answer (gospel)

**Yes, there is a cap.** A deployed contract's Wasm lives in a ledger entry, and Soroban enforces a
**maximum ledger-entry size of ~64 KB** (a **network configuration setting**, currently 65,536 bytes),
which bounds the contract-code entry (and, separately, the per-entry size of instance/persistent
storage). Because it's a config setting, it can be **adjusted by validator vote / protocol upgrade**, so
treat the exact byte figure as current-but-tunable.

If your contract is too big:

- **Build optimized:** `stellar contract build --optimize` (runs `wasm-opt`) — note the standalone
  `stellar contract optimize` is deprecated in favor of `build --optimize`.
- **`#![no_std]` + spec/dead-code shaking** keep the binary small.
- **Split logic across multiple contracts** composed via **cross-contract calls** rather than one fat
  binary.

Don't claim there's no limit, and **don't cite the EVM 24 KB (EIP-170) limit** as Soroban's.

## Why these cards (routing rationale)

Limits + build-optimization how-to → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Confusing the EVM 24 KB limit with Soroban's ~64 KB cap; claiming no limit; recommending the deprecated standalone `optimize` command.
