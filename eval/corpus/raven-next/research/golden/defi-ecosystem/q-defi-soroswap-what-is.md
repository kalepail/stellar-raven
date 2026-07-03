---
id: q-defi-soroswap-what-is
q: "What is Soroswap and what makes it different from other Stellar DEXes?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [lumenloop_find_content_about_project, scout_projects]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Soroswap is a DEX aggregator on Stellar (brands itself 'the first DEX aggregator on Stellar') with a routing engine.", weight: 5 }
  - { claim: "Its routing pulls liquidity from multiple sources (e.g. Aquarius, Phoenix, its own Soroswap AMM, and the Stellar Classic DEX).", weight: 4 }
should_have:
  - { claim: "Built by Palta Labs; product surface includes a swap App, a Soroswap REST API, and Soroswap Earn (yield via Defindex).", weight: 3 }
nice_to_have:
  - { claim: "Notes mainnet live status, gasless trustlines, and cross-chain bridging (Rozo Pay).", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Soroswap as a lending protocol, an oracle, or merely a trading UI wrapper like StellarX — it is an aggregator/AMM with routing + API.", weight: 5 }
  - { claim: "Do NOT invent specific TVL or volume figures for Soroswap that are not in the source data.", weight: 4 }
must_cite:
  - "A source identifying Soroswap as the Stellar DEX aggregator (Lumenloop record, soroswap.finance, or Stellar ecosystem source)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/soroswap
  - https://soroswap.finance/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "GROUNDED 2026-06-22 (re-verified 2026-06-29): live Scout confirms Soroswap (Live, DEX, SCF $346,750, by Palta Labs, soroswap.finance): 'the first DEX and DEX aggregator on Stellar Soroban... routes trades across Soroban AMMs (Soroswap, Phoenix, Aquarius)... Route API returns quotes and optimal routing across Stellar DEXs including the Stellar classic DEX (SDEX).' This is the IDENTITY + differentiation lane → lumenloop_get_project — DISTINCT from q-defi-soroswap-resolve (lumenloop_search_directory; strict website+category field lookup). Confusable trap: Soroswap (aggregator) vs StellarX (UI)."
---

## Reference answer (gospel)

**Soroswap** is the **first DEX and DEX aggregator on Stellar Soroban** (live on mainnet), built by
**Palta Labs** [1][2]. It is an open-source **AMM** for swapping and providing liquidity, plus an
**aggregator** whose **Route API** returns quotes and optimal routing across Soroban AMMs (its own
Soroswap AMM, **Phoenix**, **Aquarius**) and the **Stellar Classic DEX (SDEX)** [1]. Product surface:
a swap **App**, the **Route/REST API**, and **Soroswap Earn** (yield via Defindex). What makes it
different: it is the **routing/aggregation layer** other AMMs get pulled into — not just another pool.

Sources: [1] stellarlight.xyz Soroswap record (Scout); [2] soroswap.finance.

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`. Content/directory cards are acceptable alternates.

## Edge / traps

Soroswap vs StellarX confusable: Soroswap is the aggregator with routing + REST API; StellarX is a
Classic/AMM trading UI wrapper. Don't call it a lender/oracle or invent TVL/volume figures.
