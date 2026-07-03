---
id: q-scf-audit-bank
q: "What is the SCF Audit Bank and how much of a project's security audit does it cover?"
category: scf-grants-builders
subcategory: scf-mechanics
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "The Audit Bank is an SDF-funded program that covers up to 100% of audit costs for SCF-funded projects.", weight: 5 }
  - { claim: "It is aimed at getting Soroban/smart-contract projects audited before mainnet launch.", weight: 3 }
should_have:
  - { claim: "Priority categories include financial protocols, infrastructure contracts, and yield-bearing protocols.", weight: 2 }
  - { claim: "There is a small (~5%) upfront, refundable co-payment.", weight: 2 }
nice_to_have:
  - { claim: "Eligibility typically requires being an SCF-awarded, KYC-passed, testnet-stage project.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe the Audit Bank as a cash grant or as the SDF Bug Bounty — it pays for third-party audits, not vulnerability rewards.", weight: 4 }
  - { claim: "Do NOT invent a fixed dollar cap (e.g. \"$50K audit grant\") — coverage is up to 100% of audit costs.", weight: 3 }
must_cite:
  - "The SCF Audit Bank handbook / official rules page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §2.2/§11. Trap: confusing Audit Bank with the Bug Bounty."
---

## Reference answer (gospel)

- The Audit Bank is an **SDF-funded program that covers up to 100% of audit costs** for SCF-funded projects — it pays for third-party security audits, not vulnerability rewards ([SCF handbook — Audit Bank](https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank)).
- It is aimed at getting **Soroban/smart-contract projects audited before mainnet launch** ([Audit Bank](https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank)).
- **Priority categories**: financial protocols, infrastructure contracts, and yield-bearing protocols ([Audit Bank](https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank)).
- There is a **small (~5%) upfront, refundable co-payment** ([Audit Bank](https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank)).
- It is **not a cash grant and not the SDF Bug Bounty** — coverage is expressed as up to 100% of audit cost, not a fixed dollar cap ([Audit Bank](https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank)).

## Why these cards (routing rationale)

Documented SCF supporting-program fact → `scout_research` over the SCF handbook.

## Edge / traps

Trap: conflating Audit Bank (pays for audits) with Bug Bounty (pays researchers for exploits).
