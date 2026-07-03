---
id: q-defi-soroswap-content
q: "Find everything Stellar coverage has on Soroswap — news, talks, research."
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_content_about_project]
acceptable_cards: [lumenloop_search_content_semantic, lumenloop_find_content_by_entity]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Returns curated content (news/research/talks/SCF) specifically about Soroswap, the Stellar DEX aggregator.", weight: 5 }
should_have:
  - { claim: "Frames Soroswap as the aggregator/AMM with REST API and Earn when surfacing coverage.", weight: 2 }
nice_to_have:
  - { claim: "Surfaces its liquidity-source integrations (Aquarius/Phoenix/Soroswap AMM/Classic DEX) if present.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate articles, talks, or partnerships not present in the corpus.", weight: 5 }
must_cite:
  - "Each surfaced item carries its source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/soroswap
  - https://soroswap.finance/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "All-content-for-one-project → lumenloop_find_content_about_project. Grounded on Scout: Soroswap = first DEX + DEX aggregator on Soroban, live mainnet; open-source AMM + an aggregator routing across Soroban AMMs (Soroswap, Phoenix, Aquarius) and the Stellar classic DEX (SDEX) via a swap Route API. SCF-awarded ~$346,750; repos under github.com/soroswap (core/aggregator/frontend)."
---

## Reference answer (gospel)

Curated content about **Soroswap** should frame it as **the first DEX and DEX aggregator on Stellar
Soroban** (live on mainnet): an open-source AMM for swaps/liquidity plus an **aggregator** that routes
trades across Soroban AMMs (**Soroswap, Phoenix, Aquarius**) and the **Stellar classic DEX (SDEX)** for
best on-chain execution, exposed via a **swap Route API** [Scout: stellarlight.xyz/project/soroswap;
soroswap.finance]. It is **SCF-awarded (~$346.7K)** with repos under **github.com/soroswap**
(core/aggregator/frontend). Surface news/research/talks/SCF items each with their source; don't
fabricate articles, talks, or partnerships not in the corpus.

## Why these cards (routing rationale)

All-content-for-one-project → `lumenloop_find_content_about_project` (resolve→call).

## Edge / traps

Fabricating coverage is the trap.
