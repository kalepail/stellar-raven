---
id: q-scf-funding-by-category
q: "How is SCF funding distributed across ecosystem categories — which categories get the most?"
category: scf-grants-builders
subcategory: funding-totals
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: "monthly"

expected_cards: [scout_analyze]
acceptable_cards: [scout_clusters, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns an ecosystem-analytics distribution of funding/projects across categories (the categories/funding dimension).", weight: 5 }
  - { claim: "Identifies which categories are most represented, grounded in the analytics snapshot.", weight: 4 }
should_have:
  - { claim: "Frames it as an aggregate distribution, not a per-project breakdown.", weight: 2 }
nice_to_have:
  - { claim: "Could complement with a market-map/saturation view (scout_clusters) of crowded vs whitespace areas.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate category percentages or dollar splits not in the analytics data.", weight: 4 }
  - { claim: "Do NOT answer with a per-project SCF history when the user asked for category-level distribution.", weight: 3 }
must_cite:
  - "Stellar Light analytics (scout_analyze categories/funding dimension)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellarlight.xyz"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2nd scout_analyze case; exercises the categories dimension ('projects per category'). Refreshed 2026-06-29 via /api/analyze?dimension=categories: User-Facing App 204/103/$9.19M, Tooling 108/42/$3.28M, Infrastructure 97/34/$3.01M, Protocol/Contract 86/44/$4.48M (totalProjects 500). Live dollar figures → flipped freshness_sensitive true; ranking headline (UFA leads count+dollars, then Tooling/Infra/Protocol) unchanged."
---

## Reference answer (gospel)

- The right source is Stellar Light's `scout_analyze` **categories dimension** — an aggregate distribution of projects/funding across ecosystem categories, not a per-project breakdown. [Stellar Light scout / stellarlight.xyz]
- **Time-sensitive snapshot (June 29, 2026 live analytics):** ranked by both representation and SCF funding —
  - **User-Facing App** — most represented and best-funded (~204 projects, ~103 SCF-funded, ~$9.19M)
  - **Tooling** (~108 projects, ~42 funded, ~$3.28M)
  - **Infrastructure** (~97 projects, ~34 funded, ~$3.01M)
  - **Protocol/Contract** (~86 projects, ~44 funded, ~$4.48M — note it concentrates dollars into fewer, larger awards). [scout_analyze `?dimension=categories`]
- **Headline:** User-Facing Apps lead on both count and dollars, then Tooling / Infrastructure / Protocol. Report these as a live snapshot that shifts each round — confirm against the live source.
- Frame the answer as an aggregate distribution; `scout_clusters` is the complementary market-map view of crowded vs whitespace areas. Do not drop to per-project SCF history, and do not fabricate percentages or splits not in the analytics data.

## Why these cards (routing rationale)

Category distribution of funding → `scout_analyze` (categories dimension). `scout_clusters` is a
complementary market-map view.

## Edge / traps

Trap: fabricating splits, or dropping to per-project detail when an aggregate was asked for.
