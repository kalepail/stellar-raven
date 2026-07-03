---
id: q-scf-how-to-apply
q: "How do I apply for an SCF Build Award — what is the step-by-step application process?"
category: scf-grants-builders
subcategory: eligibility-apply
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Applicants start by submitting an interest form on communityfund.stellar.org.", weight: 5 }
  - { claim: "Eligible applicants are invited to submit a full proposal to a specific track (Open/Integration/RFP).", weight: 4 }
  - { claim: "Awardees must complete KYC/KYB before receiving (tranche) payments.", weight: 3 }
should_have:
  - { claim: "The proposal requires a technical roadmap, milestone plan, budget breakdown, traction, and team info.", weight: 3 }
  - { claim: "There is a prescreen + panel review (Track Delegate Panels), and an Open-Track community vote.", weight: 2 }
nice_to_have:
  - { claim: "Rejected applicants may resubmit only after meaningful improvements.", weight: 1 }
must_avoid:
  - { claim: "Do NOT tell the user to apply to the SDF Enterprise Fund — it has no open application; SCF is the open path.", weight: 4 }
  - { claim: "Do NOT invent a generic '/apply' email or claim there is no application (the interest-form → invitation → proposal flow is real).", weight: 3 }
must_cite:
  - "The SCF Build Award handbook application-flow page or communityfund.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
  - "https://communityfund.stellar.org/awards"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §2.5. Trap: pointing applicants at the application-less Enterprise Fund."
---

## Reference answer (gospel)

- Start by **submitting an interest form on communityfund.stellar.org**; eligible applicants are then invited to submit a full proposal. (https://communityfund.stellar.org/awards)
- The full proposal is submitted to a **specific Build track — Open, Integration, or RFP** (Open = brand-new builds with a community vote; Integration and RFP are panel-only). (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- The proposal should include a **technical roadmap, milestone plan, budget breakdown, traction, and team info**; projects run **3–6 months**. (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- Review involves a **prescreen plus panel review (Track Delegate Panels)**, and for the Open Track a **community (NQG) vote**. (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- Awardees must **complete KYC/KYB before receiving milestone-based tranche payments** (up to $150K worth of XLM). (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- **Do not apply to the SDF Enterprise Fund** for this — it has no open application; **SCF is the open path** for builders. (https://communityfund.stellar.org/awards)

## Why these cards (routing rationale)

Process how-to over documented SCF program → `scout_research` over the handbook; Docs MCP acceptable.

## Edge / traps

Trap: directing a builder to the Enterprise Fund (outreach-only) instead of the SCF open interest form.
