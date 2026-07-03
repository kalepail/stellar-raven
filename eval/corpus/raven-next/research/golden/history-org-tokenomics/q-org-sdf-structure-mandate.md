---
id: q-org-sdf-structure-mandate
q: "What is the Stellar Development Foundation, what is its legal structure, and what is its mandate?"
category: history-org-tokenomics
subcategory: sdf-org
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "The Stellar Development Foundation (SDF) is a nonprofit organization that supports the Stellar network.", weight: 5 }
  - { claim: "Its mission is to create equitable access to the global financial system using blockchain technology.", weight: 3 }
should_have:
  - { claim: "SDF is a non-stock, nonprofit corporation organized under Delaware law.", weight: 3 }
  - { claim: "SDF is self-funded, in part by selling/holding XLM (lumens), and is not a for-profit company.", weight: 2 }
nice_to_have:
  - { claim: "SDF holds a large reserve of lumens (~30 billion) used to fund ecosystem growth.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe SDF as a for-profit company or as Ripple/Ripple Labs.", weight: 5 }
  - { claim: "Do NOT claim SDF runs/owns the network unilaterally — Stellar is a decentralized public network with independent validators.", weight: 3 }
must_cite:
  - "The SDF foundation/mandate page on stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/foundation/mandate
  - https://stellar.org/foundation
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Stellar-own: mandate/structure from stellar.org/foundation + Mandate page. SDF is a non-stock Delaware nonprofit (note: not 501(c)(3) tax-exempt per Wikipedia — it pays US taxes), self-funded via XLM. The 'not for-profit / not Ripple' trap is important. Verified 2026-06-22."
---

## Reference answer (gospel)

- The **Stellar Development Foundation (SDF)** is a **nonprofit** organization that supports the Stellar network [1][2].
- Its mission: **create equitable access to the global financial system** using blockchain technology [1].
- Legal structure: a **non-stock, nonprofit corporation organized under Delaware law**; it is **self-funded** (in part by holding/selling XLM) and has **no shareholders** (it is not a for-profit company; it pays US taxes) [1].
- SDF holds a large reserve of lumens (~30 billion) used to fund ecosystem growth per its mandate [1].
- Note: SDF is **not** Ripple/Ripple Labs, and it does **not** run the network unilaterally — Stellar is a public network with independent validators [1].

- [1] stellar.org/foundation/mandate
- [2] stellar.org/foundation

## Why these cards (routing rationale)

SDF structure/mandate is published on stellar.org (Stellar-own) → `scout_research` /
`stellar_docs_mcp`. `perplexity_search` acceptable.

## Edge / traps

Trap: calling SDF a for-profit or conflating it with Ripple Labs.
