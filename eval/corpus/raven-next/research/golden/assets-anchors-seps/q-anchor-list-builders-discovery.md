---
id: q-anchor-list-builders-discovery
q: "Which projects in the Stellar ecosystem operate as anchors or build anchor infrastructure?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_directory, lumenloop_find_similar_projects_semantic, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Surfaces named anchor / on-off-ramp projects from the ecosystem directory rather than generic prose.", weight: 4 }
should_have:
  - { claim: "Includes recognizable anchor implementations (e.g. MoneyGram Ramps and/or other directory-listed anchors).", weight: 3 }
  - { claim: "Distinguishes anchor operators from anchor tooling (e.g. SDF's Anchor Platform).", weight: 2 }
nice_to_have:
  - { claim: "Flags that the anchor roster shifts over time (freshness caveat).", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate anchor names that are not in the corpus/directory.", weight: 5 }
must_cite:
  - "The Stellar Light / Scout project directory."
must_not_use_tier: []

pass_threshold: 0.65
weight_profile: standard

sources:
  - https://stellar.org/use-cases/ramps
  - https://developers.stellar.org/docs/learn/fundamentals/anchors
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Discovery → scout_projects. Freshness-sensitive (anchor roster shifts). The 'answer' is correct routing + a directory-grounded list, not a fixed roster. Source list anchors the routing/grounding requirement; named operators must come from the live directory, not be invented. Verified 2026-06-29: stellar.org/use-cases/ramps and developers.stellar.org/docs/learn/fundamentals/anchors both resolve and describe Ramps/MoneyGram + Anchor Platform tooling."
---

## Reference answer (gospel)

This is a **directory-discovery** question: the correct behavior is to **surface named anchor /
on-off-ramp projects from the ecosystem directory** (Scout / Lumenloop), not to emit generic prose
or a docs paragraph. A grounded answer should:

- Return **actual directory-listed anchor implementations** — e.g. **MoneyGram Ramps** (which runs
  on the Stellar "Ramps" standard) and other directory-listed on/off-ramp operators [1].
- **Distinguish operators from tooling**: anchor *operators* (run fiat ramps) vs. anchor
  *infrastructure* (SDF's **Anchor Platform** / **Wallet SDK** / **SDP**), which are tooling, not
  anchors themselves.
- **Flag freshness** — the anchor roster shifts over time, so the list should be presented as a
  point-in-time directory snapshot.

The defining failure is **fabricating anchor names** not in the corpus. (Names beyond MoneyGram
should be sourced live from the directory rather than asserted from memory.)

Sources: [1] stellar.org Ramps / MoneyGram; the Scout / Lumenloop ecosystem project directory.

## Why these cards (routing rationale)

"Which projects do X" → directory discovery (`scout_projects` / Lumenloop directory), NOT a docs lookup.

## Edge / traps

Fabricating anchor names; conflating tooling with operators.
