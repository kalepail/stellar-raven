---
id: q-scf-public-goods-award
q: "What is the SCF Public Goods Award and who is eligible for it?"
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
  - { claim: "The Public Goods Award funds community-maintained ecosystem public goods at up to ~$50,000 XLM per proposal per quarter.", weight: 5 }
  - { claim: "It is aimed at SCF Verified Members maintaining public goods, and is NQG/governance-voted (Soroban Governor).", weight: 3 }
should_have:
  - { claim: "It is invitation/governance-driven rather than a general open application.", weight: 2 }
nice_to_have:
  - { claim: "It is one of the few SCF awards (besides Build Open Track) that uses NQG voting.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a wrong cap (e.g. $150K) or claim it is a standard open Build application.", weight: 4 }
  - { claim: "Do NOT confuse the Public Goods Award with general public-goods funding outside Stellar (e.g. Gitcoin).", weight: 3 }
must_cite:
  - "The SCF Public Goods Award handbook page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Dossier §2.2/§11. Connects to NQG governance (voted via Soroban Governor). Verified 2026-06-29 vs live handbook: up to $50K in XLM per proposal per quarter, invitation-only, managed via Soroban Governor with NQG-weighted voting by SCF verified members."
---

## Reference answer (gospel)

- The Public Goods Award funds **community-maintained ecosystem public goods** at **up to ~$50,000 XLM per proposal per quarter** ([SCF handbook — Public Goods Award](https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award)).
- It is aimed at **SCF Verified Members maintaining public goods**, and is **NQG/governance-voted via a Soroban Governor** contract ([Public Goods Award](https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award)).
- It is **governance/invitation-driven**, not a standard open Build application ([Public Goods Award](https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award)).
- It is one of the **few SCF awards (besides Build Open Track) that uses NQG voting** ([Public Goods Award](https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award)).
- (Cap verified against the live handbook 2026-06-29: up to $50K in XLM per proposal per quarter, invitation-only.)

## Why these cards (routing rationale)

Documented SCF supporting program → `scout_research` over the SCF handbook.

## Edge / traps

Trap: a wrong cap, or conflating with non-Stellar public-goods funding mechanisms.
