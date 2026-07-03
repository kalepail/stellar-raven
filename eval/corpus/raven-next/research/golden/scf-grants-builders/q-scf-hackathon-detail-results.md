---
id: q-scf-hackathon-detail-results
q: "Give me the full results and winners of the Stellar Hacks: Agents hackathon — tracks, prize pools, and which projects placed."
category: scf-grants-builders
subcategory: hackathons
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_hackathon_detail]
acceptable_cards: [scout_hackathons]
forbidden_cards: [scout_hackathon_compare]
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns the single-hackathon detail record for the named hackathon (Stellar Hacks: Agents) — its tracks, prize pools, and winning/placing projects as recorded in the catalog.", weight: 5 }
  - { claim: "Sources the full results from the hackathon detail record rather than fabricating winners or general-web rumor.", weight: 4 }
should_have:
  - { claim: "Notes that a detail lookup needs the hackathon resolved first (the catalog supplies the slug/id the detail card expands on).", weight: 2 }
nice_to_have:
  - { claim: "Surfaces themes/sponsors and dates where the detail record carries them.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent winners, prize amounts, or tracks not present in the hackathon detail record.", weight: 5 }
  - { claim: "Do NOT route to the dormant scout_hackathon_compare card.", weight: 3 }
must_cite:
  - "The Stellar Light hackathon detail record (scout_hackathon_detail) for the named hackathon."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/hackathons
  - https://dorahacks.io/org/stellar
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "EXPANSION-LANE: scout_hackathon_detail is reached only after scout_hackathons surfaces the slug/id for 'Stellar Hacks: Agents' — so scout_hackathons is the acceptable upstream discovery card. Detail (winners/tracks/prizes) for one named hackathon is the detail card's lane; the catalog-list card alone wouldn't carry full per-event results. Compare card is dormant → forbidden. Reviewed 2026-06-29: replaced the named event 'Build On Stellar' (absent from the live /api/hackathons catalog) with 'Stellar Hacks: Agents', a catalog-confirmed completed DoraHacks event, so the detail-lookup target is real and verifiable."
---

## Reference answer (gospel)

- Full per-event results (tracks, prize pools, placing/winning projects) for one named hackathon → the single-hackathon detail record (`scout_hackathon_detail`) for "Stellar Hacks: Agents". Source: https://stellarlight.xyz/hackathons
- Expansion-aware routing: the detail lookup needs the hackathon resolved first — `scout_hackathons` (the catalog) supplies the slug/id that the detail card expands on. The catalog-list card alone does not carry full per-event results. Source: https://stellarlight.xyz/hackathons
- Source the tracks/prizes/winners strictly from the detail record (corroborated by the DoraHacks event page), not from general-web rumor. Source: https://dorahacks.io/org/stellar
- Surface themes/sponsors/dates where the detail record carries them.
- Honesty case — do NOT invent winners, prize amounts, or tracks not present in the detail record; the dormant `scout_hackathon_compare` card must not fire.

## Why these cards (routing rationale)

Full per-event results (winners, tracks, prizes) for one named hackathon → `scout_hackathon_detail`,
the bounded single-item detail-expansion lane. It is reached after `scout_hackathons` surfaces the
slug/id, so the catalog card is the acceptable upstream discovery card. `scout_hackathon_compare` is
dormant → forbidden; general-web is a miss.

## Edge / traps

Expansion-aware: needs a prior slug/id from the hackathon catalog. Traps: fabricating winners/prizes,
or firing the dormant compare card.
