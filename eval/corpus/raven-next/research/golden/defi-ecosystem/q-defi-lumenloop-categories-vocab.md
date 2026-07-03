---
id: q-defi-lumenloop-categories-vocab
q: "What project categories does the Stellar ecosystem directory actually track — give me the controlled list of category values it uses."
category: defi-ecosystem
subcategory: directory-vocabulary
axes: [tool-targeted]
query_type: list
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_categories]
acceptable_cards: []
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Returns the controlled list of project categories the directory tracks (the category vocabulary), not a free-text guess at what categories might exist.", weight: 5 }
  - { claim: "Treats this as a vocabulary enumeration because the user explicitly asked what categories exist.", weight: 4 }
should_have:
  - { claim: "Distinguishes the directory's controlled category vocabulary from project tags / regions.", weight: 2 }
nice_to_have:
  - { claim: "Notes these category values are the canonical filter terms usable against the directory.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent category names not in the directory's controlled vocabulary.", weight: 5 }
  - { claim: "Do NOT answer from a general-web search or a semantic content search — this is a vocabulary lookup.", weight: 3 }
must_cite:
  - "The Lumenloop categories vocabulary (lumenloop_get_categories)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "VOCAB / routing-behavior card: lumenloop_get_categories is the unique correct lane when the user explicitly asks 'what categories exist'; acceptable_cards empty by design; semantic content search or general-web here is a routing miss. The exact returned vocabulary is whatever the live directory enumerates (it is the controlled list, not a guess). For reference, Scout's analyze (/api/analyze?dimension=categories) enumerates 7 top-level category values — User-Facing App, Tooling, Infrastructure, Protocol/Contract, Asset, Partner Integration, Anchor — illustrating that the directory has a small, controlled category vocabulary; the Lumenloop get_categories list is the authoritative one to return and may differ in exact labels. The gate is on enumerating the CONTROLLED list, not on a specific label set. REVIEWED 2026-06-29: re-ran /api/analyze?dimension=categories live — exactly those 7 controlled category values returned (over 500 projects), confirming the small-controlled-vocab nature. Routing assertion (get_categories unique lane, empty acceptable_cards) holds."
---

## Reference answer (gospel)

This is an explicit **vocabulary enumeration**: the correct behavior is to return the directory's
**controlled list of project category values** (the canonical filter terms), not a free-text guess at
what categories might exist. Whatever `lumenloop_get_categories` returns IS the answer — a small,
controlled set, distinct from project tags or regions.

For reference, the Stellar Light directory enumerates a small controlled category vocabulary — e.g.
Scout's analyze surface lists top-level values like **User-Facing App, Tooling, Infrastructure,
Protocol/Contract, Asset, Partner Integration, Anchor** [1] — illustrating the controlled nature of the
list. Return the authoritative vocabulary from the categories card; do not invent labels.

Source: [1] stellarlight.xyz directory category analysis (Scout, 2026-06-22).

## Why these cards (routing rationale)

"What categories does the directory track" is an explicit vocabulary enumeration →
`lumenloop_get_categories`. This card is the unique correct lane (no alternate), so `acceptable_cards`
is empty; semantic content search or general-web would be a routing miss.

## Edge / traps

Trap: fabricating category names, or treating the explicit "what exists" question as a free-text
content search.
