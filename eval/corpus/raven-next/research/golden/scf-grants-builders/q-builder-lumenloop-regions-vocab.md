---
id: q-builder-lumenloop-regions-vocab
q: "What regions or countries does the Stellar ecosystem directory cover — give me the controlled list of region values it uses to classify projects and builders."
category: scf-grants-builders
subcategory: directory-vocabulary
axes: [tool-targeted]
query_type: list
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_regions]
acceptable_cards: []
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Returns the controlled list of regions/countries the directory uses to classify projects and builders (the region vocabulary), not a free-text guess.", weight: 5 }
  - { claim: "Treats this as a vocabulary enumeration because the user explicitly asked what regions exist.", weight: 4 }
should_have:
  - { claim: "Distinguishes the directory's controlled region vocabulary from categories / tags.", weight: 2 }
nice_to_have:
  - { claim: "Notes these region values are the canonical filter terms usable against the directory.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent region values not in the directory's controlled vocabulary.", weight: 5 }
  - { claim: "Do NOT answer from a general-web search or a semantic content search — this is a vocabulary lookup.", weight: 3 }
must_cite:
  - "The Lumenloop regions vocabulary (lumenloop_get_regions)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/builders
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "VOCAB card: lumenloop_get_regions is cited ONLY when the user explicitly asks 'what regions/countries exist'. acceptable_cards empty by design (vocab is the unique correct lane). A directory project search or general-web here would be a routing miss. Reviewed 2026-06-29: removed the hard-coded 'India is a known region' example — the cited builders source returns 0 India profiles and the directory's location field is free-text and LatAm-heavy (Brazil/Chile/Colombia/Costa Rica/Kenya); could not enumerate the live lumenloop_get_regions controlled vocabulary with available tools, so concrete region values must come from the card at answer time, not be hard-coded here."
---

## Reference answer (gospel)

- The directory exposes a CONTROLLED region/country vocabulary used to classify and filter projects and builders; enumerate the answer from the `lumenloop_get_regions` vocabulary card, not a free-text guess.
- Treat this as a vocabulary enumeration because the user explicitly asked which regions exist — return the canonical region values, which double as the filter terms usable against the directory.
- This controlled region vocabulary is distinct from the directory's categories and tags vocabularies (separate controlled lists).
- Enumerate the concrete region values FROM the live `lumenloop_get_regions` card at answer time — do not hard-code a fixed example list here, since the vocabulary can change. (Directory location data is real and concentrated in regions like Latin America — e.g. Brazil, Chile, Colombia — but those free-text location strings are not the controlled region vocabulary itself.) Source: https://stellarlight.xyz/builders
- Honesty case — do NOT invent region values not in the controlled vocabulary, and do NOT answer from a general-web or semantic-content search; this is a vocab lookup with a single correct lane.

## Why these cards (routing rationale)

"What regions/countries does the directory cover" is an explicit vocabulary enumeration →
`lumenloop_get_regions`, the unique correct lane (no alternate), so `acceptable_cards` is empty. A
project/builder search or general-web would be a routing miss.

## Edge / traps

Trap: fabricating region values, or treating the explicit "what exists" question as a free-text
directory search.
