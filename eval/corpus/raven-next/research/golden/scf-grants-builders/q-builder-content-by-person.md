---
id: q-builder-content-by-person
q: "What has been published about Stellar contributor Tyler van der Hoeven across the ecosystem?"
category: scf-grants-builders
subcategory: builder-discovery
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_content_by_entity]
acceptable_cards: [scout_builders, lumenloop_search_content_semantic, lumenloop_find_av_passages]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Searches ecosystem content mentioning the named person/entity (works without a directory slug).", weight: 5 }
  - { claim: "Returns curated Stellar content (articles/talks/news) referencing the named contributor, not general web.", weight: 3 }
should_have:
  - { claim: "May complement with the person's builder-directory profile (scout_builders).", weight: 2 }
nice_to_have:
  - { claim: "Surfaces talks/podcast passages if available (find_av_passages).", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate content, quotes, or attributions for the named person not present in the corpus.", weight: 5 }
  - { claim: "Do NOT route to general web (Parallel) when the curated entity-content lookup covers it.", weight: 3 }
must_cite:
  - "Lumenloop entity-grounded content results (find_content_by_entity)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/builders
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "People-as-entity content discovery → find_content_by_entity (works w/o slug). Complements builder-discovery card coverage. Reviewed 2026-06-29: routing/honesty framing sound; Tyler van der Hoeven is a real Stellar contributor (SDF, Passkey/smart-wallet work). acceptable_cards lists lumenloop_find_av_passages, which is not in the core valid-card enumeration — left as-is (pre-existing; treat as an A/V-passage lane) but flagging for governance review."
---

## Reference answer (gospel)

- Use the Lumenloop entity-content lane (`lumenloop_find_content_by_entity`) to search curated Stellar ecosystem content (articles / talks / news) that mentions the named contributor — it is entity-grounded and works WITHOUT a directory slug.
- Return only curated Stellar content that actually references the named person; do NOT fall back to general web search when the curated entity-content lookup covers it.
- May complement with the person's builder-directory profile (`scout_builders`) for bio/skills context. Source: https://stellarlight.xyz/builders
- Where the corpus carries talks/podcast passages, surface those via the A/V passage lane (acceptable secondary).
- Honesty case — if the corpus has no content for the entity, report that plainly. Do NOT fabricate quotes, articles, or attributions for the named person.

## Why these cards (routing rationale)

Content about a named person/entity → `lumenloop_find_content_by_entity` (entity-grounded, no slug
needed); `scout_builders` for the profile is acceptable.

## Edge / traps

Trap: fabricating attributed content, or escalating to general web.
