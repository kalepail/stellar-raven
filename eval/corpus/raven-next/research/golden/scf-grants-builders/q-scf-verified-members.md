---
id: q-scf-verified-members
q: "What does it mean to be an 'SCF Verified Member' and why does it matter for voting?"
category: scf-grants-builders
subcategory: governance-voting
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
  - { claim: "SCF Verified Member status is earned through sustained ecosystem contribution (reputation-based), not bought.", weight: 4 }
  - { claim: "Verified Members are the ones eligible to vote in the SCF community vote (Open Track / Public Goods Award).", weight: 4 }
should_have:
  - { claim: "Verified status feeds into NQG voting weight and the ability to be nominated to Track Delegate Panels.", weight: 2 }
nice_to_have:
  - { claim: "The community is structured into tiers of verified membership.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim verification is purchased, granted by holding XLM, or automatic for anyone who applies.", weight: 4 }
  - { claim: "Do NOT confuse SCF Verified Member status with KYC/KYB identity verification required to receive award payouts.", weight: 3 }
must_cite:
  - "The SCF handbook Verified Members page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/governance/verified-members"
  - "https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Dossier §3.4. Trap: verified-membership (voting reputation) vs KYC/KYB (payout compliance). Verified 2026-06-29 vs live handbook: status is earned/dynamic/influence-based (proven expertise + governance participation + community trust); four tiers (Verified, Pathfinder, Navigator, Pilot) with tier-gated voting/delegation rights — corroborates the tiered-membership nice_to_have."
---

## Reference answer (gospel)

- **SCF Verified Member** status is **earned through sustained ecosystem contribution** (reputation-based) — it is not bought, not granted by holding XLM, and not automatic on application. (https://stellar.gitbook.io/scf-handbook/governance/verified-members)
- Verified Members are the participants **eligible to vote in the SCF community vote** (Build Open Track and the Public Goods Award). (https://stellar.gitbook.io/scf-handbook/governance/verified-members)
- Verified status **feeds into NQG voting weight** and into eligibility to be **nominated to Track Delegate Panels**. (https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance)
- Verified membership is a **reputation/governance role**, separate and distinct from the **KYC/KYB identity verification** an awardee must complete to receive award payouts. (https://stellar.gitbook.io/scf-handbook/governance/verified-members)

## Why these cards (routing rationale)

Documented governance concept → `scout_research` over the SCF handbook.

## Edge / traps

Trap: conflating reputation-earned Verified status with the separate KYC/KYB payout step.
