---
id: q-defi-blend-repo
q: "Where is Blend's smart-contract code and how well-rated is the repo?"
category: defi-ecosystem
subcategory: lending
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_repos]
acceptable_cards: [lumenloop_get_project, lumenloop_find_content_about_project]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Identifies Blend's contracts repo under the blend-capital GitHub org — the Soroban lending implementation in Rust (e.g. blend-contracts / blend-contracts-v2).", weight: 5 }
should_have:
  - { claim: "Surfaces a repo rating/score or traction signal where available (e.g. Scout repoScore, stars), rather than asserting an unsourced number.", weight: 3 }
nice_to_have:
  - { claim: "Notes the independent blend-capital team (not SDF) maintains it, and that blend-contracts-v2 is the current contracts repo.", weight: 1 }
must_avoid:
  - { claim: "Do NOT point at blend.com or a non-Stellar 'blend' repo as the contract code.", weight: 5 }
  - { claim: "Do NOT invent a repo score or star/fork count not derived from the tool/source.", weight: 3 }
must_cite:
  - "The repo record (Scout repos / GitHub)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/blend-capital/blend-contracts-v2
  - https://stellarlight.xyz/project/blend
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Code-shaped query → scout_repos. Confusable blend.com trap. Grounded on Scout: the current contracts repo is blend-capital/blend-contracts-v2 (Rust, ~18 stars, repoScore 49 'medium', SCF-awarded); v1 blend-contracts also exists. Repo scores/stars are live and shift — surface from the tool, don't hard-code."
---

## Reference answer (gospel)

Blend's smart-contract code lives under the **`blend-capital`** GitHub org. The current contracts repo
is **`blend-capital/blend-contracts-v2`** (Rust / Soroban; "Soroban implementation of the Blend
Protocol v2"); the v1 **`blend-contracts`** repo also exists. On Scout it carries ~18 stars and a
**repoScore ~49 ("medium")**, and is SCF-awarded [Scout: stellarlight.xyz/project/blend ·
github.com/blend-capital/blend-contracts-v2]. Maintained by the independent blend-capital team, NOT
the SDF, and NOT related to blend.com (a US bank-lending company). Repo scores/star counts are live
and should be surfaced from the tool rather than asserted.

## Why these cards (routing rationale)

Code/repo lookup → `scout_repos`; project record acceptable.

## Edge / traps

blend-capital/blend-contracts(-v2), NOT blend.com. Don't invent a star/score number — surface the
live repoScore.
