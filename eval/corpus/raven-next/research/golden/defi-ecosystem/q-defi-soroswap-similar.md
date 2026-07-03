---
id: q-defi-soroswap-similar
q: "What projects are similar to Soroswap on Stellar?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_similar_projects_semantic]
acceptable_cards: [scout_projects, scout_clusters, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Surfaces DEX/AMM peers to Soroswap — e.g. Aquarius and Phoenix — as the comparable liquidity venues.", weight: 5 }
should_have:
  - { claim: "Clarifies Soroswap is uniquely an aggregator (routing across Aquarius/Phoenix/its AMM/Classic DEX) so 'similar' peers are the underlying AMMs it routes to.", weight: 3 }
nice_to_have:
  - { claim: "Notes StellarX (UI) and Comet (reference) as adjacent but different in kind.", weight: 1 }
must_avoid:
  - { claim: "Do NOT name a lender (Blend), oracle (Reflector), or bridge (Allbridge) as a Soroswap peer.", weight: 4 }
  - { claim: "Do NOT invent a DEX/AMM project not in the source data.", weight: 4 }
must_cite:
  - "Sources for the named peers."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "GROUNDED 2026-06-22: live Scout (q=Aquarius/Phoenix DEX lane) confirms the DEX/AMM peers — Aquarius (AMM), Phoenix (DeFi-Hub AMM), and also StellarBroker (a non-custodial swap router/aggregator that splits across Soroswap/Aquarius) as an aggregator peer. 'Projects like X' → find_similar_projects_semantic. Category-correctness trap."
---

## Reference answer (gospel)

Soroswap's peers are the other **Stellar DEX/AMM** venues it routes across [1]:
- **Aquarius** — AMM / liquidity layer (stable + volatile pools).
- **Phoenix** — DeFi-Hub AMM DEX ($PHO).
- **StellarBroker** — a non-custodial swap router/aggregator (splits trades across Soroswap, Aquarius,
  Classic DEX) — the closest *aggregator* peer.
- Adjacent but different in kind: **StellarX** (Classic/AMM trading UI) and **Comet** (weighted-AMM
  reference). Note Soroswap is itself the aggregator, so its underlying AMMs (Aquarius, Phoenix) are
  the natural "similar" set.

Source: [1] stellarlight.xyz directory (Scout, 2026-06-22).

## Why these cards (routing rationale)

"Similar to Soroswap" → `lumenloop_find_similar_projects_semantic`; clusters/directory acceptable.

## Edge / traps

Peers are DEX/AMM, not lender (Blend) / oracle (Reflector) / bridge (Allbridge).
