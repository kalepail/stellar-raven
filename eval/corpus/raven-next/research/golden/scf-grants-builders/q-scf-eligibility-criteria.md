---
id: q-scf-eligibility-criteria
q: "What makes a project eligible for SCF Build, and what gets proposals rejected at prescreen?"
category: scf-grants-builders
subcategory: eligibility-apply
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Eligible projects are teams building apps/protocols on Stellar or Soroban.", weight: 4 }
  - { claim: "Proposals are evaluated on ecosystem value, technical feasibility, roadmap clarity, and team capability.", weight: 4 }
should_have:
  - { claim: "Projects lacking traction or clear Stellar ecosystem fit are likely rejected at prescreen.", weight: 3 }
  - { claim: "Selected projects must pass KYC/KYB and meet participant eligibility requirements.", weight: 2 }
nice_to_have:
  - { claim: "Alignment with Stellar's DeFi/RWA/Payments themes strengthens an application.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent hard eligibility gates not in the handbook (e.g. a required minimum TVL, mandatory token launch, or US-only restriction).", weight: 4 }
  - { claim: "Do NOT claim only registered companies (no individuals/teams) are eligible.", weight: 3 }
must_cite:
  - "The SCF Build Award handbook eligibility/evaluation criteria."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
  - "https://communityfund.stellar.org/awards"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Dossier §2.5/§12. Soft criteria; must_avoid guards against invented hard gates. Verified 2026-06-29 vs live SCF Build Award handbook: evaluation = ecosystem value / technical feasibility / roadmap clarity + team capability; KYC/KYB mandatory per individual contributor; no published hard gate (TVL/token/geo); $150K-in-XLM milestone-tranche cap. Eligibility is described by track (Open/Integration/RFP), not entity-restricted."
---

## Reference answer (gospel)

- Eligible applicants are **teams building apps or protocols on Stellar or Soroban** — individuals and teams qualify, not only registered companies. (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- Proposals are evaluated on **ecosystem value, technical feasibility, roadmap clarity, and team capability**. (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- Proposals **lacking traction or a clear Stellar ecosystem fit** are likely rejected at prescreen. (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- Selected projects must **pass KYC/KYB** and meet participant eligibility requirements before payout. (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- Alignment with Stellar's **DeFi / RWA / Payments** themes strengthens an application. (https://communityfund.stellar.org/awards)
- The handbook imposes **no published hard gate** such as a minimum TVL, mandatory token launch, or geographic (US-only) restriction — do not assume one. (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)

## Why these cards (routing rationale)

Documented eligibility/evaluation → `scout_research` over the SCF handbook.

## Edge / traps

Trap: fabricating hard quantitative eligibility gates that the handbook does not impose.
