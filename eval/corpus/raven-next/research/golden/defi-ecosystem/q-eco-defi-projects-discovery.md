---
id: q-eco-defi-projects-discovery
q: "Who is building DeFi on Stellar — give me a directory of the main DeFi projects."
category: defi-ecosystem
subcategory: discovery
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_content_semantic, scout_clusters, lumenloop_find_similar_projects_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns a directory of real Stellar DeFi projects spanning categories — e.g. Blend (lending), Soroswap/Aquarius/Phoenix (DEX/AMM), Reflector (oracle), Allbridge (bridge).", weight: 5 }
should_have:
  - { claim: "Each project carries a one-line category descriptor and a source.", weight: 3 }
nice_to_have:
  - { claim: "Notes the major institutional RWA issuers (BENJI/CRDT/USDY) as part of the DeFi-adjacent landscape.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent projects or mis-categorize them (e.g. labeling Reflector a DEX or Blend an AMM).", weight: 5 }
must_cite:
  - "Each listed project carries a directory source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
  - https://stellarlight.xyz/project/blend
  - https://stellarlight.xyz/project/reflector
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "FLAT directory-roster lane (who-is-building → scout_projects, each project + category + source) — DISTINCT from q-eco-defi-market-map (analytic crowded-vs-whitespace saturation → scout_clusters). Anchor case for the directory card. Re-verified 2026-06-29: anchor projects + categories grounded against the live Scout directory (each carries a project URL/category)."
---

## Reference answer (gospel)

A correct directory spans the real Stellar DeFi categories, each project with a one-line category +
source (all from the Scout directory, stellarlight.xyz):
- **Lending / money market:** **Blend** (canonical Soroban lender); **YieldBlox** (DAO money-market on
  Blend); **DeFindex** (PaltaLabs yield vaults).
- **DEX / AMM:** **Soroswap** (DEX + aggregator), **Aquarius** (AQUA AMM/liquidity layer), **Phoenix**
  (AMM DeFi Hub, PHO); plus **StellarX** (trading UI by Ultra Stellar).
- **Oracle:** **Reflector** (decentralized price-feed network).
- **Bridge:** **Allbridge** (cross-chain swaps via Allbridge Core).
- **CDP / RWA-adjacent:** **Orbit CDP** (CDP on Etherfuse bonds), **Etherfuse** (Stablebonds: CETES,
  US-Treasury USTRY).

Each project carries a Scout link + category descriptor; do not invent projects or mis-categorize
(Reflector is an oracle, NOT a DEX; Blend is lending, NOT an AMM). The institutional RWA issuers
(Franklin BENJI, WisdomTree CRDT, Ondo USDY) are part of the DeFi-adjacent landscape.

## Why these cards (routing rationale)

"Who is building DeFi / directory" → `scout_projects`; semantic/clusters acceptable.

## Edge / traps

Don't invent or mis-categorize projects (Reflector=oracle not DEX; Blend=lending not AMM).
