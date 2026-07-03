---
id: q-scf-award-tiers-list
q: "List the SCF award tiers and supporting programs under SCF v7.0 and what each one funds."
category: scf-grants-builders
subcategory: scf-mechanics
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "SCF Build is the main award (cap $150K XLM) for teams building apps/protocols on Stellar/Soroban.", weight: 5 }
  - { claim: "Instawards (up to $15K XLM per project) are recommended by local Ambassador chapters for early-stage builders.", weight: 4 }
  - { claim: "Audit Bank covers up to 100% of audit costs for SCF-funded projects.", weight: 3 }
should_have:
  - { claim: "Growth Hack funds a cohort of teams ($20K base + up to $200K performance).", weight: 3 }
  - { claim: "Public Goods Award is ~$50K XLM per proposal per quarter for ecosystem public goods.", weight: 2 }
  - { claim: "Stellar Liquidity Award exists for audited, mainnet-live financial protocols (invitation-only).", weight: 2 }
nice_to_have:
  - { claim: "Under v7.0, Instawards replaced the prior Kickstart Award.", weight: 1 }
must_avoid:
  - { claim: "Do NOT list the old Activation Award / Community Award (SCF 5.0) or Kickstart Award as current v7.0 tiers without noting they were superseded.", weight: 4 }
  - { claim: "Do NOT invent award tiers or amounts not in the SCF handbook.", weight: 4 }
  - { claim: "Do NOT list SDF-direct programs (Marketing Grant, Matching Fund, Enterprise Fund) as SCF award tiers — they are separate SDF instruments.", weight: 3 }
must_cite:
  - "The SCF handbook awards/supporting-programs pages."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/instawards"
  - "https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank"
  - "https://stellar.org/blog/ecosystem/introducing-scf-v7"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §2.2. Tier list churns across SCF versions — freshness-adjacent but the v7 structure is the current answer."
---

## Reference answer (gospel)

- **SCF Build** — the main award, up to **$150K in XLM**, for teams building apps/protocols on Stellar/Soroban (tracks: Open/Integration/RFP) ([SCF handbook — Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- **Instawards** — up to **$15K XLM per project**, recommended by a local Ambassador chapter (no open application); under v7.0 this **replaced the Kickstart Award** ([Instawards](https://stellar.gitbook.io/scf-handbook/scf-awards/instawards); [Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- **Audit Bank** — SDF-funded; covers **up to 100% of audit costs** for SCF-funded projects (small ~5% refundable co-pay) ([Audit Bank](https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank)).
- **Growth Hack** — cohort GTM/PMF program for mainnet projects; **~$20K base + up to $200K performance**, ~10–15 teams/quarter ([Growth Hack](https://stellar.gitbook.io/scf-handbook/supporting-programs/growth-hack)).
- **Public Goods Award** — up to **~$50K XLM per proposal per quarter** for ecosystem public goods, NQG-voted ([Public Goods Award](https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award)).
- **Stellar Liquidity Award** — **invitation-only** for audited, mainnet-live financial protocols (amount not publicly disclosed) ([Stellar Liquidity Award](https://stellar.gitbook.io/scf-handbook/supporting-programs/stellar-liquidity-award)).
- These are **SCF awards/supporting programs**; SDF-direct instruments (Marketing Grant, Matching Fund, Enterprise Fund) are **separate** and not SCF tiers ([stellar.org/grants-and-funding](https://stellar.org/grants-and-funding)).

## Why these cards (routing rationale)

An enumeration of a documented program structure → `scout_research` over the SCF-handbook corpus.
Docs MCP / Lumenloop semantic are acceptable. General-web or deep-research would be over-escalation.

## Edge / traps

The trap is listing superseded tiers (Activation/Community/Kickstart) as current, or mixing in
SDF-direct programs that are not SCF awards.
