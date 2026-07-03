---
id: q-scf-vs-sdf-enterprise-fund
q: "What is the difference between the Stellar Community Fund and the SDF Enterprise Fund — which should a startup apply to?"
category: scf-grants-builders
subcategory: sdf-grants
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [lumenloop_search_content_semantic, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "The SCF is a community-driven, open-application grant program (public voting + panel) on communityfund.stellar.org.", weight: 5 }
  - { claim: "The SDF Enterprise Fund is an SDF investment/funding line with NO open application — it is sourced by SDF outbound.", weight: 5 }
  - { claim: "A startup seeking to apply should go to the SCF (or SDF Matching/Marketing grants), not the Enterprise Fund.", weight: 4 }
should_have:
  - { claim: "The SCF Build cap is $150K XLM; SDF-direct lines (Matching/Marketing) reach ~$500K with different mechanisms.", weight: 2 }
nice_to_have:
  - { claim: "The Matching Fund (investment track) is the closest open analog to the Enterprise Fund.", weight: 1 }
must_avoid:
  - { claim: "Do NOT tell the user to 'apply to the Enterprise Fund' — it has no open application process.", weight: 5 }
  - { claim: "Do NOT describe the SCF and the Enterprise Fund as the same program or run by the same process.", weight: 4 }
must_cite:
  - "stellar.org/grants-and-funding (SDF programs) and the SCF handbook."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://stellar.org/grants-and-funding"
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
  - "https://communityfund.stellar.org/awards"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §1/§5/§10. THE category-defining trap: confusing SCF (open, community-voted) with the SDF Enterprise Fund (outreach-only). Higher threshold."
---

## Reference answer (gospel)

- The **Stellar Community Fund (SCF)** is a **community-driven, open-application grant program** — public NQG voting plus panel review on **communityfund.stellar.org**, Build cap **up to $150K worth of XLM**. (https://communityfund.stellar.org/awards) (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- The **SDF Enterprise Fund** is an **SDF investment/funding line with NO open application** — it is sourced by **SDF outbound/outreach only** (no public cap). (https://stellar.org/grants-and-funding)
- **A startup that wants to apply should go to the SCF** (or to SDF-direct grants like **Matching** or **Marketing**) — **never tell a founder to "apply to the Enterprise Fund," because there is no application to it.** (https://stellar.org/grants-and-funding)
- SDF-direct lines reach larger amounts with different mechanisms: **Matching Fund up to ~$500K USD** (investment track, pre-seed to Series B) and **Marketing Grants up to ~$500K** — the **Matching Fund is the closest open analog to the Enterprise Fund**. (https://stellar.org/grants-and-funding)
- The SCF and the Enterprise Fund are **distinct programs run by different processes** — community-voted open grants vs. SDF-sourced investment — and must not be described as the same thing. (https://stellar.org/grants-and-funding)

## Why these cards (routing rationale)

A comparison of two documented Stellar funding programs → `scout_research` over the SCF/SDF corpora.
General web/deep research is over-escalation.

## Edge / traps

THE category trap: the Enterprise Fund is outreach-only with no application; SCF is the open path.
The must_avoid forbids telling a user to apply to the Enterprise Fund.
