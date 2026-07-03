---
id: q-builder-by-region-latam
q: "Find Stellar builders based in Latin America who work on payments or DeFi."
category: scf-grants-builders
subcategory: builder-discovery
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_builders]
acceptable_cards: [scout_projects]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns builder profiles filtered by location (Latin America) and domain (payments/DeFi).", weight: 5 }
  - { claim: "Uses the curated builder directory rather than general web search.", weight: 3 }
should_have:
  - { claim: "Surfaces region/location and skill attributes per profile.", weight: 2 }
nice_to_have:
  - { claim: "Notes regional Ambassador chapters as a complementary way to reach local builders.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate builder names or claim a region has builders without directory evidence.", weight: 5 }
  - { claim: "Do NOT route to general web (Perplexity/Parallel) for a curated builder-directory query.", weight: 3 }
must_cite:
  - "Stellar Light's builder directory (scout_builders) profiles."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/builders
  - https://discord.gg/stellardev
  - https://stellar.gitbook.io/ambassador-program
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2nd builder-discovery case; exercises the location filter. No-match returns the structured filter-miss advisory, not invented names. Verified 2026-06-29 via /api/builders: directory total = 110 profiles (matches ~110), exposes a location filter; LatAm is well-represented (Brazil, Chile, Colombia, Costa Rica, Kenya appear in location data), so this query should yield real profiles, not a miss. Note: the location field is free-text, so filtering on the literal 'Latin America' may need country-level terms (Brazil/Chile/...)."
---

## Reference answer (gospel)

- Query the curated Stellar Light builder directory with the `location` filter (Latin America) plus the domain skill (payments / DeFi); it indexes ~110 profiles filterable by `q` / `location` / `scfTier` / `featured`. Source: https://stellarlight.xyz/builders
- Return matching builder profiles with region/location and skill attributes; use the curated directory, not general web search. Source: https://stellarlight.xyz/builders
- Honesty case — if the location/domain filter yields no match, the directory returns its STRUCTURED filter-miss advisory (110 profiles; broaden filters; pointer to the Stellar Discord "Looking for Collaborators" channel). Report that rather than fabricating LatAm builder names. Source: https://discord.gg/stellardev
- Complementary, not a substitute: regional Ambassador chapters are a way to reach local builders (events/meetups); they do not replace the directory query. Source: https://stellar.gitbook.io/ambassador-program

## Why these cards (routing rationale)

Builders-by-location/skill → `scout_builders`. General web would be a routing miss.

## Edge / traps

Trap: fabricating names; or escalating to general web for a curated directory.
