---
id: q-tool-official-sdks-list
q: "List the official Stellar SDKs by language — which languages have a maintained Stellar/Soroban SDK?"
category: tooling-infra
subcategory: sdks
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Enumerates the Stellar SDKs by language, including the JavaScript/TypeScript SDK and the Rust soroban-sdk.", weight: 5 }
  - { claim: "Includes the other maintained language SDKs (e.g. Python, Go, Java/Kotlin, Flutter/Dart).", weight: 4 }
should_have:
  - { claim: "Distinguishes the Soroban contract SDK (Rust, soroban-sdk) from the client/transaction SDKs in other languages.", weight: 3 }
nice_to_have:
  - { claim: "Notes which are SDF-maintained vs community-maintained where relevant.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent a non-existent official SDK language (e.g. a 'Stellar C# SDK' presented as canonical without basis).", weight: 4 }
  - { claim: "Do NOT claim Soroban contracts are written with the JavaScript SDK — contracts use the Rust soroban-sdk.", weight: 4 }
must_cite:
  - "An SDK/tools listing page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/sdks/client-sdks
  - https://developers.stellar.org/docs/tools/sdks/contract-sdks
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Axis-C list rebalance. Enumeration of official SDKs by language → stellar_docs_mcp. Trap = inventing an SDK or conflating contract SDK (Rust) with client SDKs."
---

## Reference answer (gospel)

Two SDK families. **Contract SDK** (build Soroban Wasm): **Rust `soroban-sdk`** (SDF) — this is what
smart contracts are written with. **Client/XDR SDKs** (talk to Horizon/RPC, sign, decode XDR), by
language:

- **JavaScript/TypeScript** — `@stellar/stellar-sdk` (SDF)
- **Go** — `go-stellar-sdk` (SDF)
- **Rust client crates** — `stellar-xdr`, `stellar-strkey`, `rs-stellar-rpc-client` (SDF)
- **Python** — `py-stellar-base` (community, StellarCN)
- **Java** — `java-stellar-sdk` (community, lightsail-network)
- **Flutter/Dart, iOS/macOS, Kotlin Multiplatform, PHP** — (community, Soneso)
- **.NET / C#** — (community, Beans-BV)

JS, Go, and the Rust crates are **SDF-maintained**; the rest are **community-maintained**.

## Why these cards (routing rationale)

Enumerating the official SDKs is a docs/tooling listing → `stellar_docs_mcp`; `scout_research`/
`scout_repos` acceptable. General-web/deep-research are misses.

## Edge / traps

Inventing a non-existent SDK, or claiming Soroban contracts are written with the JS SDK (contracts use
the Rust `soroban-sdk`).
