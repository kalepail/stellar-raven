---
id: q-hist-soroban-launch-protocol20
q: "When did smart contracts (Soroban) launch on Stellar mainnet, and was there a funding program?"
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Soroban (Stellar's smart-contract platform) launched on mainnet in early 2024, with Protocol 20.", weight: 5 }
should_have:
  - { claim: "The mainnet launch was around February 2024 (Protocol 20).", weight: 2 }
  - { claim: "SDF backed adoption with a Soroban adoption fund of about $100 million.", weight: 3 }
nice_to_have:
  - { claim: "Soroban contracts are written in Rust (compiled to Wasm), not Solidity.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroban launched on mainnet years earlier (e.g. 2021 or 2022) — mainnet was 2024 (Protocol 20).", weight: 4 }
  - { claim: "Do NOT claim Soroban contracts are written in Solidity / run on the EVM.", weight: 3 }
must_cite:
  - "stellar.org press / developer docs on the Soroban mainnet launch and Protocol 20."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/smart-contracts-launch-on-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Stellar-own: Soroban mainnet ~Feb 2024 with Protocol 20; $100M Soroban adoption fund (stellar.org press, ~March 19 2024). Soroban contracts are Rust→Wasm, not Solidity/EVM. Verified 2026-06-22."
---

## Reference answer (gospel)

- **Soroban** (Stellar's smart-contract platform) launched on **mainnet in early 2024**, with **Protocol 20** (~**February 2024**) [1].
- SDF backed adoption with a **~$100 million Soroban adoption fund** [1].
- Soroban contracts are written in **Rust** and compiled to **Wasm** — **not Solidity**, and they do **not** run on the EVM [1].
- Trap to avoid: claiming Soroban launched on mainnet years earlier (2021/2022) — mainnet was **2024 (Protocol 20)** [1].

- [1] stellar.org/press/smart-contracts-launch-on-stellar

## Why these cards (routing rationale)

Soroban launch + Protocol 20 + the adoption fund are first-party-documented → `scout_research` /
`stellar_docs_mcp`.

## Edge / traps

Traps: wrong launch year, or claiming Solidity/EVM (Soroban is Rust/Wasm).
