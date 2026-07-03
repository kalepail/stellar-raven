---
id: q-scf-category-funded-ratio
q: "Which Stellar ecosystem category has the highest share of SCF-funded projects, not just the most funded projects in absolute count?"
category: scf-grants-builders
subcategory: funding-totals
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: "monthly"

expected_cards: [scout_analyze]
acceptable_cards: [scout_clusters, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Computes or compares SCF-funded ratio by category, not only absolute funded-project count.", weight: 5 }
  - { claim: "Identifies Protocol/Contract as the highest funded-ratio major category in the June 25, 2026 analytics snapshot (47 funded of 78 projects, roughly 60%).", weight: 4 }
  - { claim: "Distinguishes this from User-Facing App, which has the most funded projects in absolute count but a lower funded ratio.", weight: 4 }
should_have:
  - { claim: "Provides dated/tolerant category counts because Scout analytics are a live snapshot.", weight: 3 }
nice_to_have:
  - { claim: "Mentions Tooling and Infrastructure ratios as supporting context.", weight: 1 }
must_avoid:
  - { claim: "Do NOT answer only User-Facing App because it has the most funded projects; that ignores the ratio asked for.", weight: 5 }
  - { claim: "Do NOT fabricate exact percentages or treat live category counts as permanent.", weight: 4 }
must_cite:
  - "Stellar Light analytics categories/funding snapshot."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz
status: reviewed
authored: { phase1: 2026-06-25, phase2: 2026-06-25, reviewed: 2026-06-29 }
confidence: medium
notes: "Added from theboycoder/StellarLight data-layer intake. Verified 2026-06-25 via /api/analyze?dimension=categories: User-Facing App 110/202, Tooling 45/109, Infrastructure 37/106, Protocol/Contract 47/78, Asset 0/3, Partner Integration 0/1, Anchor 0/1. Re-verified 2026-06-29 (counts drift): Protocol/Contract 44/86≈51%, User-Facing App 103/204≈50%, Tooling 42/108≈39%, Infrastructure 34/97≈35% — Protocol/Contract REMAINS the highest funded ratio among major categories, so the load-bearing claim holds; only the exact percentages move. Freshness-sensitive analytics snapshot; gate ratio reasoning, not permanent exact counts."
---

## Reference answer (gospel)

Use the **categories** analytics snapshot and calculate funded share, not just absolute count.

In the June 25, 2026 Scout analytics snapshot, **Protocol/Contract** has the highest funded ratio
among the major categories: **47 SCF-funded projects out of 78 total**, roughly **60%**. [1]

That is different from the absolute-count answer. **User-Facing App** has the most SCF-funded
projects in raw count (**110 funded of 202 total**) but a lower funded share, roughly **54%**. Tooling
is **45/109** and Infrastructure is **37/106** in the same snapshot. [1]

Report these as dated/tolerant live analytics. Do not hard-code them as permanent category facts.

Source: [1] Stellar Light `analyze?dimension=categories` snapshot, generated June 25, 2026.

## Why these cards (routing rationale)

This is aggregate ecosystem analytics. `scout_analyze` is primary; `scout_clusters` can complement
with market-map/saturation context.

## Edge / traps

The trap is answering "User-Facing App" because it has the most funded projects, while the user asked
for funded **ratio**.
