---
id: q-tool-which-sdk-comparison
q: "Which Stellar SDKs are officially maintained by SDF versus community-maintained, and how should that affect which one I pick for a production app?"
category: tooling-infra
subcategory: sdks-comparison
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "SDF-maintained client/contract SDKs are JS (`@stellar/stellar-sdk`), Go (`go-stellar-sdk`), and the Rust crates (`soroban-sdk`, `stellar-xdr`, `stellar-strkey`, `rs-stellar-rpc-client`).", weight: 5 }
  - { claim: "Community-maintained SDKs include Python (StellarCN), Java (lightsail-network), Flutter/iOS/Kotlin/PHP (Soneso), and .NET (Beans-BV).", weight: 5 }
  - { claim: "Distinguishes contract SDKs (build Soroban Wasm) from client/XDR SDKs (talk to Horizon/RPC, sign, decode XDR).", weight: 3 }
should_have:
  - { claim: "Recommends defaulting to SDF-maintained SDKs for production/institutional workloads, treating community SDKs as best-effort.", weight: 3 }
nice_to_have:
  - { claim: "Notes community SDKs (e.g. Soneso) are high quality despite the lower support tier.", weight: 1 }
must_avoid:
  - { claim: "Do NOT label community SDKs (Python/Java/Flutter/.NET) as SDF-maintained or vice-versa.", weight: 5 }
  - { claim: "Do NOT claim there is only one SDK or that all SDKs are SDF-maintained.", weight: 3 }
must_cite:
  - "developers.stellar.org client-sdks and contract-sdks pages."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/sdks/client-sdks
  - https://developers.stellar.org/docs/tools/sdks/contract-sdks
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Comparison anchored on the maintainer tier table; the trap is mis-assigning the maintainer column."
---

## Reference answer (gospel)

First, the two families: **contract SDKs** build Soroban Wasm (Rust `soroban-sdk`); **client/XDR SDKs**
talk to Horizon/RPC, sign, and decode XDR.

- **SDF-maintained:** JS/TS (`@stellar/stellar-sdk`), Go (`go-stellar-sdk`), and the Rust crates
  (`soroban-sdk`, `stellar-xdr`, `stellar-strkey`, `rs-stellar-rpc-client`).
- **Community-maintained:** Python (StellarCN), Java (lightsail-network), Flutter/iOS/Kotlin/PHP
  (Soneso), and .NET (Beans-BV).

**Guidance:** for production/institutional workloads, default to the **SDF-maintained** SDKs and treat
community SDKs as **best-effort** (don't treat a community repo's issue tracker as an SLA). The community
SDKs (e.g. Soneso's) are **high quality** despite the lower support tier — fine for consumer products.

## Why these cards (routing rationale)

Multi-SDK comparison synthesizable from first-party docs → `stellar_docs_mcp`; `scout_repos`/`scout_research` acceptable corroboration. Deep-research/general-web are misses.

## Edge / traps

Mis-assigning maintainership (labeling community SDKs as SDF-maintained or vice-versa), or claiming there
is only one SDK / all are SDF-maintained.
