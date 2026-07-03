---
id: q-scf-build-tracks
q: "What are the three SCF Build tracks (Open, Integration, RFP) and how do they differ?"
category: scf-grants-builders
subcategory: scf-mechanics
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "SCF Build (v7.0) has three tracks: Open, Integration, and RFP.", weight: 5 }
  - { claim: "Open Track is the only track with a community vote (NQG); Integration and RFP are panel-only.", weight: 4 }
should_have:
  - { claim: "Open Track is for brand-new builds; Integration Track is for integrating existing Stellar building blocks / projects with traction.", weight: 3 }
  - { claim: "RFP Track is for tooling/SDKs/APIs/explorers aligned with published SCF RFPs.", weight: 3 }
nice_to_have:
  - { claim: "All three tracks share the $150K XLM cap; there is also a Resubmission path.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim every track is community-voted (only Open Track is) or that all are panel-only.", weight: 4 }
  - { claim: "Do NOT invent additional Build tracks beyond Open/Integration/RFP (+Resubmission).", weight: 3 }
must_cite:
  - "The SCF Build Award handbook tracks page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §2.3/§3.5. Defining fact: only Open Track is community-voted."
---

## Reference answer (gospel)

- SCF Build (v7.0) has **three tracks: Open, Integration, and RFP** (plus a Resubmission path) ([SCF handbook — Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- **Open Track** is for brand-new builds and is the **only track with a community (NQG) vote**; Integration and RFP are **panel-only** (no community vote) ([Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- **Integration Track** is for integrating existing Stellar building blocks or for teams with significant traction ([Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- **RFP Track** is for tooling/services that match open SCF RFPs (build-and-ship-fast) ([Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- All three tracks share the **same $150K-in-XLM cap** and run **3–6 month** projects ([Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).

## Why these cards (routing rationale)

Comparison over documented program structure → `scout_research` over the SCF handbook.

## Edge / traps

Trap: claiming all tracks are community-voted; only Open Track is NQG-voted.
