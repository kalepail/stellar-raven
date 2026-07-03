---
id: q-defi-phoenix-what-is
q: "What is Phoenix on Stellar and what is the $PHO token?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [lumenloop_find_content_about_project, scout_projects, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Phoenix is a DeFi Hub on Soroban whose foundational layer is an AMM DEX (positions itself as a suite of synergistic DeFi products).", weight: 5 }
should_have:
  - { claim: "$PHO is Phoenix's token; the AMM DEX is described as the first of several planned products.", weight: 3 }
  - { claim: "Built by the Phoenix Protocol Group (phoenix-hub.io).", weight: 2 }
nice_to_have:
  - { claim: "Notes it is integrated into Soroswap's aggregation routing.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Phoenix as a lending protocol, an oracle, or a bridge.", weight: 4 }
  - { claim: "Do NOT invent a specific Phoenix TVL figure not present in the source data.", weight: 4 }
must_cite:
  - "A source identifying Phoenix as the Soroban DeFi-Hub / AMM DEX."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/phoenix
  - https://phoenix-hub.io/
  - https://github.com/Phoenix-Protocol-Group
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Per-project identity → lumenloop_get_project. Phoenix TVL not in corpus — anti-fabrication. Grounded on Scout: Phoenix DeFi Hub = SCF-funded AMM-based DEX on Soroban (PHO token); constant-product + stableswap pools, a Factory for pool creation, multi-hop routing; one of the AMM liquidity sources aggregated by Soroswap. Built by Phoenix-Protocol-Group; scfTotalAwardedUSD ≈ $394,500."
---

## Reference answer (gospel)

**Phoenix** ("Phoenix DeFi Hub") is an **SCF-funded AMM-based DEX on Stellar/Soroban** whose
foundational layer is an automated market maker. It runs **constant-product and stableswap liquidity
pools** (LPs add liquidity to earn fees + staking rewards), with a **Factory** for creating pools and
**multi-hop routing** for on-chain swaps; it is **one of the AMM liquidity sources aggregated by
Soroswap** [Scout: stellarlight.xyz/project/phoenix]. **$PHO** is its token. Built by the
**Phoenix-Protocol-Group** (phoenix-hub.io; github.com/Phoenix-Protocol-Group); SCF-awarded (~$394.5K).
It is a DEX/AMM — **not** a lending protocol, oracle, or bridge — and no specific Phoenix TVL figure is
in the corpus, so don't invent one.

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`.

## Edge / traps

No TVL figure in corpus; don't invent one. Don't miscategorize as lending.
