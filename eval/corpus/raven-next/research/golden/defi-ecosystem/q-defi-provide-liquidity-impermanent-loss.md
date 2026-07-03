---
id: q-defi-provide-liquidity-impermanent-loss
q: "As a retail user, how do I provide liquidity to Stellar AMM or DeFi pools, compare yields across protocols, and understand impermanent-loss and withdrawal risk?"
category: defi-ecosystem
subcategory: liquidity-provision
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_find_similar_projects_semantic, scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Explains LP returns are not guaranteed and depend on fees, incentives, utilization, token prices, liquidity depth, smart-contract/protocol risk, and impermanent loss.", weight: 5 }
  - { claim: "Distinguishes classic Stellar AMM pools from Soroban/DeFi protocols such as Blend, Aquarius, Soroswap, Phoenix, or Defindex where relevant.", weight: 4 }
  - { claim: "Requires current, dated protocol sources for yield/APY/TVL and withdrawal status rather than static numbers.", weight: 5 }
should_have:
  - { claim: "Explains withdrawal may depend on pool liquidity, protocol health, wallet support, lockups/incentive terms, and contract state.", weight: 3 }
  - { claim: "Mentions comparing net returns after fees, slippage, incentives, and asset price exposure.", weight: 3 }
nice_to_have:
  - { claim: "Mentions test with small amounts and verify contract/UI provenance.", weight: 1 }
must_avoid:
  - { claim: "Do NOT provide investment advice or promise specific returns.", weight: 5 }
  - { claim: "Do NOT use stale APY/TVL numbers as current without a date/source.", weight: 5 }
must_cite:
  - "Current protocol/project sources or Scout records for any named yield/liquidity claim."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools"
  - "https://stellarlight.xyz/project/soroswap"
  - "https://stellarlight.xyz/project/aquarius"
  - "https://stellarlight.xyz/project/phoenix"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Do not preserve any APY/TVL number without a date. Phase 3 should re-check protocol UIs/DeFiLlama if a numeric yield/TVL claim appears. REVIEWED 2026-06-29: re-verified named LP/swap venues live on Scout — Soroswap (first Soroban DEX/aggregator, Live), Aquarius (AMM/AQUA, Live), Phoenix (DeFi Hub AMM, PHO, Live); Soroswap aggregates Soroswap/Phoenix/Aquarius liquidity. No static APY/TVL numbers asserted in the gospel (risk-framed, source-gated) — kept that way. Stellar-docs SDEX/liquidity-pools source URL returns 200."
---

## Reference answer (gospel)

A retail LP answer must be risk-framed, not yield-promotional. LP returns depend on swap fees, incentives, utilization, token prices, pool depth, fees/slippage, smart-contract/protocol risk, oracle risk, and impermanent loss. Withdrawal can depend on remaining pool liquidity, wallet support, lockups/reward terms, protocol health, and current contract state.

Stellar has classic SDEX/orderbook liquidity and liquidity pools, plus Soroban DeFi venues. Scout currently lists live LP/swap venues including Soroswap, Aquarius, Phoenix, StellarBroker, Comet, and related yield/DeFi protocols. Any APY, TVL, withdrawal status, or reward program must be cited from current protocol/project sources with a date. A good answer compares net return after fees, slippage, incentives, and asset price exposure, and suggests small test transactions and contract/UI provenance checks.

## Why these cards (routing rationale)

`scout_projects` is expected because the answer needs current protocol discovery. Official docs are acceptable for base AMM/SDEX mechanics; live protocol/web sources are required for metrics.

## Edge / traps

Do not promise returns or present stale APY/TVL as current. Do not collapse classic Stellar AMM pools, SDEX orderbook offers, and Soroban protocol LP positions into one risk model.
