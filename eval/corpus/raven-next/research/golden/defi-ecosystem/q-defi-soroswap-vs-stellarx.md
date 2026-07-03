---
id: q-defi-soroswap-vs-stellarx
q: "What's the difference between Soroswap and StellarX — are they the same kind of thing?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project, lumenloop_find_similar_projects_semantic]
acceptable_cards: [scout_projects, lumenloop_search_content_semantic, scout_clusters]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Soroswap is a DEX aggregator (routing across multiple liquidity sources) with a REST API and Earn product.", weight: 5 }
  - { claim: "StellarX is a decentralized trading platform / UI that gives access to the Stellar DEX and AMM pools — a front-end / UI wrapper, NOT an aggregator.", weight: 5 }
should_have:
  - { claim: "Notes they are different categories: aggregation/routing vs a trading UI over Classic + AMM.", weight: 3 }
nice_to_have:
  - { claim: "Notes StellarX retail activity has been comparatively quiet/declining vs direct Aquarius access since ~2024.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroswap and StellarX are the same type of product, or that StellarX is a DEX aggregator.", weight: 5 }
  - { claim: "Do NOT claim StellarX is shut down (no source confirms a shutdown).", weight: 3 }
must_cite:
  - "Sources distinguishing Soroswap (aggregator) from StellarX (trading UI)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/soroswap
  - https://stellarlight.xyz/project/stellarx
  - https://www.stellarx.com/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Confusable-project trap encoded directly. Comparison across two project records. Grounded on Scout: Soroswap = first DEX + DEX AGGREGATOR on Soroban routing across AMMs + SDEX with a Route API (PaltaLabs). StellarX = a decentralized TRADING PLATFORM/UI on Stellar (with AMM access), built by Ultra Stellar (same team as LOBSTR/StellarTerm) — NOT an aggregator, NOT SDF."
---

## Reference answer (gospel)

They are **different kinds of thing**:
- **Soroswap** — the first **DEX and DEX aggregator** on Stellar Soroban. It is an AMM plus an
  **aggregator** that routes trades across Soroban AMMs (Soroswap, Phoenix, Aquarius) and the Stellar
  classic DEX (SDEX) via a **swap Route API**; built by **PaltaLabs** [Scout: .../soroswap].
- **StellarX** — a **decentralized trading platform / front-end (UI)** on Stellar that lets users trade
  assets directly from their wallets, with access to AMM pools. It is a **trading interface, NOT an
  aggregator**; built by **Ultra Stellar** (the team behind LOBSTR / StellarTerm) [Scout: .../stellarx;
  stellarx.com].

So: aggregation/routing engine + API (Soroswap) vs a trading UI over the Stellar DEX + AMMs (StellarX).
Neither is shut down.

## Why these cards (routing rationale)

A two-project comparison resolves each via `lumenloop_get_project`; `find_similar_projects_semantic`/clusters support the category framing.

## Edge / traps

Core trap: treating both as the same, or calling StellarX an aggregator. Soroswap = aggregator + API;
StellarX = trading/AMM UI (Ultra Stellar). Don't assert a StellarX shutdown.
