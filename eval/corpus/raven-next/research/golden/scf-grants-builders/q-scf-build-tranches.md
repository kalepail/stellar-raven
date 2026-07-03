---
id: q-scf-build-tranches
q: "How is an SCF Build Award disbursed across milestones under the current (v7.0) model?"
category: scf-grants-builders
subcategory: scf-mechanics
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
  - { claim: "Under SCF v7.0 the Build Award is disbursed in four tranches tied to milestones.", weight: 5 }
  - { claim: "The split is 10% on award acceptance, 20% at MVP, 30% at Testnet, 40% at Mainnet+UX.", weight: 5 }
should_have:
  - { claim: "This 4-tranche model replaced the prior v6.0 three-equal-disbursement structure.", weight: 2 }
nice_to_have:
  - { claim: "Funding is intended to cover roughly four months of development.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe a single upfront lump-sum payment or a 3-equal-tranche model as the current scheme.", weight: 4 }
  - { claim: "Do NOT invent milestone percentages that don't sum to the 10/20/30/40 schedule.", weight: 4 }
must_cite:
  - "The SCF v7 announcement or Build Award handbook describing the 10/20/30/40 tranches."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.org/blog/ecosystem/introducing-scf-v7"
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §2.4. Exact percentages are the defining facts."
---

## Reference answer (gospel)

- Under SCF v7.0 the Build Award is disbursed in **four tranches tied to milestones**, not a single lump sum ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- The split is **10% on award acceptance, 20% at MVP, 30% at Testnet, 40% at Mainnet + UX** ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- The SCF handbook confirms disbursement is **milestone-based and paid in tranches** generically, but the v7 blog is the source for the exact 10/20/30/40 percentages ([Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- This 4-tranche model is the **current (v7.0)** scheme, replacing the prior equal-disbursement structure ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).

## Why these cards (routing rationale)

Documented program mechanics → `scout_research` over the SCF handbook corpus is primary.

## Edge / traps

The trap is the older 3-equal-tranche (v6.0) model or a single upfront payment.
