---
id: q-defi-blend-what-is
q: "What is Blend on Stellar and who builds it?"
category: defi-ecosystem
subcategory: lending
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [lumenloop_find_content_about_project, scout_projects, scout_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Blend is a lending / money-market protocol on Soroban (a universal liquidity protocol primitive for permissionless lending pools).", weight: 5 }
  - { claim: "Built by an independent team (blend-capital), not by the Stellar Development Foundation.", weight: 4 }
should_have:
  - { claim: "Lending pools let users deposit assets to earn interest or post collateral to borrow.", weight: 3 }
  - { claim: "It is the canonical / dominant Soroban lending primitive (the 'Aave-equivalent' substrate on Stellar).", weight: 2 }
nice_to_have:
  - { claim: "References the blend-capital GitHub org / contracts repo (e.g. blend-contracts or blend-contracts-v2, Rust/Soroban).", weight: 1 }
must_avoid:
  - { claim: "Do NOT conflate Stellar's Blend with blend.com (a US bank lending/origination company) — they are unrelated.", weight: 5 }
  - { claim: "Do NOT describe Blend as a DEX/AMM, an oracle, or an SDF-built product.", weight: 4 }
must_cite:
  - "At least one source identifying Blend as the Soroban lending protocol (Lumenloop project record, blend-capital GitHub, or Stellar ecosystem source)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/blend
  - https://blend.capital/
  - https://github.com/blend-capital
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Per-project IDENTITY (who-builds-it) → lumenloop_get_project — DISTINCT lane from q-defi-blend-content (lumenloop_find_content_about_project; corpus of news/research/talks). Confusable trap: blend.com vs Stellar Blend. Grounded on Scout (re-verified 2026-06-29): Blend = lending/borrowing money market on Soroban by blend-capital, Live, site blend.capital, GitHub github.com/blend-capital."
---

## Reference answer (gospel)

**Blend** is a **lending / borrowing (money-market) protocol on Stellar Soroban**, built by the
independent **`blend-capital`** team (not the SDF). Anyone can deploy **permissionless, isolated
lending pools** where suppliers earn yield by depositing assets (USDC, XLM, EURC) and borrowers take
**over-collateralized** loans. It is the **base lending/yield primitive** other Stellar DeFi apps
build on (e.g. DeFindex vaults route into Blend; YieldBlox is built on Blend) [Scout:
stellarlight.xyz/project/blend]. Site: **blend.capital**; code: **github.com/blend-capital** (e.g.
`blend-contracts-v2`, Rust).

## Why these cards (routing rationale)

A single named project's identity record routes to `lumenloop_get_project` (resolve→call); `lumenloop_find_content_about_project` and `scout_projects` are acceptable alternates. Deep-research tiers must not fire on a simple identity lookup.

## Edge / traps

The plausible wrong answer pulls in blend.com (a US bank lending company) or labels Blend a DEX. Both are must_avoid.
