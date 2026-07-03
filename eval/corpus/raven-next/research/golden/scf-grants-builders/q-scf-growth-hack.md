---
id: q-scf-growth-hack
q: "What is the SCF Growth Hack program and what funding do cohort teams receive?"
category: scf-grants-builders
subcategory: scf-mechanics
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [lumenloop_search_content_semantic, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Growth Hack is a cohort/competition-style growth (GTM/PMF) program for mainnet Stellar projects.", weight: 4 }
  - { claim: "Teams receive a base award (~$20K) plus an up-to-$200K performance award.", weight: 5 }
should_have:
  - { claim: "It funds a cohort of ~10-15 teams per quarter.", weight: 3 }
nice_to_have:
  - { claim: "Growth Hack sits in the SCF v7.0 unified Growth track, post-launch on the funding ladder.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent Growth Hack amounts (e.g. quote the $150K Build cap or a single flat grant) not matching the $20K base + up-to-$200K performance structure.", weight: 4 }
  - { claim: "Do NOT describe Growth Hack as an idea-stage grant — it targets launched/mainnet projects.", weight: 3 }
must_cite:
  - "The SCF Growth Hack handbook page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/supporting-programs/growth-hack"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Dossier §2.2/§11. Two-part structure (base + performance) is the defining fact. Verified 2026-06-29 vs live handbook: 8-week quarterly GTM/PMF program for mainnet projects (4-week acquisition + 4-week retention), $20K base (in XLM) + up to $200K performance, 10-15 teams per cohort. Figures confirmed live."
---

## Reference answer (gospel)

- Growth Hack is a **cohort/competition-style GTM/PMF growth program** for **mainnet** Stellar projects (launched products, not idea-stage) ([SCF handbook — Growth Hack](https://stellar.gitbook.io/scf-handbook/supporting-programs/growth-hack)).
- Teams receive a **base award (~$20K) plus an up-to-$200K performance award** tied to growth outcomes ([Growth Hack](https://stellar.gitbook.io/scf-handbook/supporting-programs/growth-hack)).
- It funds a **cohort of ~10–15 teams per quarter** ([Growth Hack](https://stellar.gitbook.io/scf-handbook/supporting-programs/growth-hack)).
- Under SCF v7.0 it sits in the **unified Growth track**, post-launch on the funding ladder ([Growth Hack](https://stellar.gitbook.io/scf-handbook/supporting-programs/growth-hack)).
- (Figures verified against the live handbook 2026-06-29: 8-week quarterly program, $20K base + up to $200K performance, 10–15 teams.)

## Why these cards (routing rationale)

Documented SCF supporting program → `scout_research` over the SCF handbook.

## Edge / traps

Trap: collapsing the base+performance structure into a single flat grant or the Build cap.
