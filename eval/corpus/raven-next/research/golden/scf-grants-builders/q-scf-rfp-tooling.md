---
id: q-scf-rfp-tooling
q: "Is there an open SCF RFP for developer tooling or indexing infrastructure I could build against?"
category: scf-grants-builders
subcategory: rounds-rfps
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: "weekly"

expected_cards: [scout_rfps]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Searches the open SCF RFP briefs for ones matching developer-tooling / infrastructure scope.", weight: 5 }
  - { claim: "Notes RFPs are funded through the SCF Build RFP Track (panel-only).", weight: 3 }
should_have:
  - { claim: "Flags that the matching RFP set is quarter-dependent and may change.", weight: 2 }
nice_to_have:
  - { claim: "Tooling/SDK/explorer/testing-infra work is exactly what the RFP Track is designed to funnel.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim there are no SCF RFPs at all, or that tooling is ineligible — the RFP Track exists for tooling.", weight: 3 }
  - { claim: "Do NOT fabricate a tooling RFP that isn't currently open.", weight: 4 }
must_cite:
  - "The live SCF RFPs feed / RFP Track handbook page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellarlight.xyz"
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Dossier §4.2/§6.4. scout_rfps idea→RFP matching. Freshness item (3rd freshness case) — confidence stays medium (set rotates). Re-verified live 2026-06-29 (/api/rfps?status=open): matching open tooling/infra briefs = Passkey UI Kit (developer-tooling), Contract Source Verification Service (infrastructure), OZ Accounts Policy Builder (developer-tooling). Rubric gates on the freshness caveat, not the exact list."
---

## Reference answer (gospel)

- Search the open SCF RFP briefs with `scout_rfps`, filtering on developer-tooling / infrastructure scope (its `technicalRequirements` + category matching). [Stellar Light scout / stellarlight.xyz]
- **Yes — tooling/infra is exactly what the RFP Track funnels.** As of the 2026-06-29 live feed
  (`activeQuarter q2-2026`), matching open developer-tooling/infra briefs include **Passkey UI Kit**,
  **Contract Source Verification Service**, and **OZ Accounts Policy Builder**. Report as a dated live
  snapshot. [scout_rfps `/api/rfps`]
- **Always flag freshness:** the matching RFP set is quarter-dependent and rotates, so confirm against the live RFP feed. [stellarlight.xyz scout]
- RFPs are funded through the **SCF Build RFP Track** — panel-only review (no community vote), build-and-ship-fast, under the standard **$150K-in-XLM** Build cap. [SCF Build Award handbook]
- Do not claim there are no SCF RFPs or that tooling is ineligible (the RFP Track exists for it), and do not fabricate a tooling RFP that isn't currently open.

## Why these cards (routing rationale)

Idea→RFP matching is a core `scout_rfps` use (its good_at: technicalRequirements + category filtering).

## Edge / traps

Trap: fabricating a matching RFP, claiming tooling is ineligible, or presenting closed Q1 2026 tooling
briefs such as **Prices API & Indexing Service** or **AI-Focused WebIDE** as currently open.
