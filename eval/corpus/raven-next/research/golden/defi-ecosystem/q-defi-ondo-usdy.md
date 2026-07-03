---
id: q-defi-ondo-usdy
q: "What is Ondo's USDY on Stellar and who can hold it?"
category: defi-ecosystem
subcategory: rwa
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_content_by_entity]
acceptable_cards: [lumenloop_search_content_semantic, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "USDY is Ondo Finance's tokenized US-Treasuries-backed yieldcoin, launched on Stellar in September 2025.", weight: 5 }
  - { claim: "USDY is not offered/sold to US persons (non-US only).", weight: 4 }
should_have:
  - { claim: "Notes it carries a yield (around 5% APY at launch) backed by tokenized US Treasuries.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes USDY (yieldcoin) from BENJI (mutual-fund share) and CRDT (private credit).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim USDY is available to US persons or describe it as a money-market mutual fund (that's BENJI) or private credit (that's CRDT).", weight: 5 }
  - { claim: "Do NOT misattribute USDY to Franklin Templeton or WisdomTree.", weight: 4 }
must_cite:
  - "A dated source on Ondo USDY's Stellar launch."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/ondo-finance-launches-usdy-on-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "VERIFIED against the dossier's primary source (stellar.org Ondo USDY press release): Ondo Finance's institutional-grade yieldcoin backed by tokenized US Treasuries, launched on Stellar Sep 17 2025, ~5.3% APY at launch, available to non-US (global) individual + institutional investors only — 'not offered or sold to US persons.' Entity-grounded → find_content_by_entity. USDY=non-US yieldcoin; issuer/product precision trap (vs BENJI mutual-fund share, CRDT private credit)."
---

## Reference answer (gospel)

**USDY** is **Ondo Finance's** institutional-grade **yieldcoin backed by tokenized U.S. Treasuries**,
launched on **Stellar on September 17, 2025** at **~5.3% APY** at launch [1]. It targets **global
(non-US) individual and institutional investors** and is **not offered or sold to US persons** [1]. On
Stellar it enables uses like cost-effective DeFi collateral, on-chain savings, and treasury management.

Source: [1] stellar.org "Ondo Finance Launches USDY on Stellar."

## Why these cards (routing rationale)

Content about a named entity → `lumenloop_find_content_by_entity`; semantic/general-web acceptable.

## Edge / traps

USDY = **non-US yieldcoin (Ondo)** — NOT US-available, NOT a money-market mutual fund (that's BENJI),
NOT private credit (that's WisdomTree's CRDT). Don't misattribute it to Franklin Templeton/WisdomTree.
