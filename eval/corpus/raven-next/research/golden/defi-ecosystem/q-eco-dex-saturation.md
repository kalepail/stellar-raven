---
id: q-eco-dex-saturation
q: "How saturated is the Stellar DEX/AMM space — how many serious players are there?"
category: defi-ecosystem
subcategory: market-map
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_clusters]
acceptable_cards: [scout_projects, lumenloop_find_similar_projects_semantic, scout_leaderboard, lumenloop_request_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Reports the Stellar DEX/AMM space is converging on a small set of anchors: Soroswap (aggregator), Aquarius (largest single AMM by TVL), and Phoenix (DeFi-Hub DEX).", weight: 5 }
should_have:
  - { claim: "Notes StellarX is a trading UI (not an aggregator) and Comet is a reference/research implementation, not a high-traffic DEX.", weight: 3 }
  - { claim: "Notes new AMM entrants tend to be absorbed into Soroswap's aggregation routing.", weight: 2 }
nice_to_have:
  - { claim: "Notes Aquarius is roughly the largest DEX by TVL (~20% of listed Stellar TVL).", weight: 1 }
must_avoid:
  - { claim: "Do NOT lump StellarX and Comet in as equal-weight live DEX competitors to Soroswap/Aquarius/Phoenix.", weight: 4 }
  - { claim: "Do NOT invent additional DEX projects not present in the source data.", weight: 4 }
must_cite:
  - "Sources for the DEX/AMM landscape composition."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/soroswap
  - https://stellarlight.xyz/project/aquarius
  - https://stellarlight.xyz/project/phoenix
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Saturation → scout_clusters. Reinforces aggregator-capture + StellarX/Comet caveats. Grounded on Scout: serious AMM/DEX players = Soroswap (aggregator), Aquarius (AQUA AMM), Phoenix (AMM hub). Soroswap's aggregator routes across Soroswap/Phoenix/Aquarius + SDEX. StellarX (Ultra Stellar) = trading UI; Comet = Balancer-style reference impl; WOWMAX = an expanding multi-chain aggregator. Small field — converging on a few anchors."
---

## Reference answer (gospel)

The Stellar DEX/AMM space is **small and converging on a few anchors**, not saturated:
- **Soroswap** — the **DEX aggregator** (also an AMM), routing across Soroban AMMs (Soroswap, Phoenix,
  Aquarius) + the classic DEX (SDEX) via a Route API [Scout: .../soroswap].
- **Aquarius (AQUA)** — the largest single-AMM liquidity layer (stable/volatile pools) [Scout: .../aquarius].
- **Phoenix** — an AMM-based **DeFi Hub** DEX (constant-product + stableswap), itself a Soroswap
  liquidity source [Scout: .../phoenix].

Caveats: **StellarX** is a **trading UI** (Ultra Stellar), not an aggregator; **Comet** is a
Balancer-style **reference implementation**, not a high-traffic live DEX. New AMM entrants tend to be
**absorbed into Soroswap's aggregation routing** (and aggregators like WOWMAX are expanding in). So
serious live players number roughly **three** (Soroswap / Aquarius / Phoenix), with a UI and a
reference impl on the long tail.

## Why these cards (routing rationale)

Saturation/market-structure → `scout_clusters`; similar-projects/leaderboard acceptable.

## Edge / traps

Don't overcount: StellarX = UI, Comet = reference; don't invent extra DEXes.
