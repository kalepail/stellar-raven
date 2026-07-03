---
id: q-defi-reflector-related-projects
q: "Which Stellar projects depend on or relate to Reflector?"
category: defi-ecosystem
subcategory: oracle
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_related_projects]
acceptable_cards: [lumenloop_find_similar_projects_semantic, lumenloop_search_directory]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Surfaces projects related to / depending on Reflector via a reverse-dependency lookup — e.g. Blend, Laina, Slender (and Orbit CDP, EquitX, DeFindex) — from the source data, not a content-article dump.", weight: 5 }
  - { claim: "Frames these as oracle CONSUMERS of Reflector (lending/CDP/yield protocols pricing collateral off its feeds), not competitors.", weight: 4 }
should_have:
  - { claim: "Notes Reflector is the leading / most-integrated oracle these consumers rely on (without claiming it is the only one — Band, RedStone, DIA, Lightecho are also live).", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes this reverse-dependency / who-depends-on-X view from a 'find all content about Reflector' news-search request.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate a related/consuming project not present in the source data.", weight: 5 }
  - { claim: "Do NOT answer this 'who depends on Reflector' reverse-dependency query by dumping news/content articles about Reflector.", weight: 3 }
must_cite:
  - "The related-projects / reverse-lookup source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/reflector
  - https://reflector.network/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "DIFFERENTIATED 2026-06-29: re-pointed from lumenloop_find_content_about_project (shared with q-defi-reflector-content) to lumenloop_get_related_projects — the reverse-dependency / who-depends-on-X lane, distinct from 'find all content about Reflector'. Grounded on Scout: Reflector powers DeFi protocols such as Blend, Laina, and Slender; dossier adds Orbit CDP, EquitX, DeFindex. These are oracle CONSUMERS, not competitors. Reflector is the LEADING / most-integrated oracle these consumers rely on, but NOT the only Stellar oracle — Band, RedStone, DIA, Lightecho are also live on mainnet; avoid 'single/only price-feed network' framing."
---

## Reference answer (gospel)

Projects that **depend on / consume Reflector** (the leading Stellar oracle) include **Blend, Laina,
and Slender** per Scout, plus **Orbit CDP, EquitX, and DeFindex** per the ecosystem dossier [Scout:
stellarlight.xyz/project/reflector; reflector.network]. These are **oracle consumers** — lending /
CDP / yield protocols that price collateral off Reflector feeds — **not competitors** to Reflector,
which is the **leading / most-integrated** price-feed network these protocols rely on (though **not
the only** Stellar oracle — Band and RedStone are also live on mainnet, alongside DIA, Lightecho and
Orally). Surface the consumers from the source data with provenance; do not fabricate a consuming
project.

## Why these cards (routing rationale)

"Which projects depend on / relate to X" is a **reverse-dependency** query → `lumenloop_get_related_projects`
(the id-gated reverse-lookup card), with `lumenloop_find_similar_projects_semantic` /
`lumenloop_search_directory` acceptable for enumerating the consuming protocols. This is a DIFFERENT lane
from "find all the content about Reflector" (`q-defi-reflector-content` → `lumenloop_find_content_about_project`),
which is a news/article corpus search, not a dependency graph.

## Edge / traps

Don't fabricate consumers; don't answer a who-depends-on-X reverse-dependency query by dumping content
articles about Reflector.
