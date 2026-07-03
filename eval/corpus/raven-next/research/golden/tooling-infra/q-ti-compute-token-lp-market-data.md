---
id: q-ti-compute-token-lp-market-data
q: "How do I compute 24h volume, fees, TVL, and price for a token or liquidity pool from chain data (Horizon/RPC/Hubble/BigQuery), matching what StellarX/Scopuly show?"
category: tooling-infra
subcategory: assets-balances
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Says there is no single canonical API that exactly reproduces every explorer/exchange's 24h volume, fees, TVL, and price; you must define methodology and data source.", weight: 5 }
  - { claim: "Separates classic SDEX/liquidity-pool market data from Soroban AMM/contract-token data; classic data can use Horizon resources/trades/effects, while Soroban data needs RPC events, Hubble, or an indexer.", weight: 5 }
  - { claim: "Recommends Hubble/BigQuery, Galexie, or a dedicated indexer for historical/bulk calculations rather than pulling full history from RPC.", weight: 5 }
  - { claim: "Provides formulas: 24h volume sums trades/swaps in quote/base units over a time window; fees derive from pool/protocol fee rules and swaps; TVL is current reserves times chosen reference prices; price is last trade, mid, VWAP, or oracle/route-derived depending on stated methodology.", weight: 4 }
  - { claim: "Mentions RPC history limitations and Horizon's legacy/no-new-features status when choosing APIs.", weight: 4 }
should_have:
  - { claim: "Cites official Horizon resources, Hubble/data analytics docs, and Horizon-to-RPC migration/indexer docs.", weight: 3 }
  - { claim: "Warns that matching StellarX/Scopuly requires matching their filters, quote asset, rounding, stale-pool handling, and spam/illiquid asset policy.", weight: 3 }
nice_to_have:
  - { claim: "Mentions StellarExpert API as a practical explorer/indexer source if the user needs an existing indexed feed rather than building their own.", weight: 1 }
must_avoid:
  - { claim: "Do NOT imply RPC alone can cheaply enumerate all historical trades/events for arbitrary 24h windows beyond its retention constraints.", weight: 5 }
  - { claim: "Do NOT claim one TVL/price number is canonical without defining quote asset and methodology.", weight: 5 }
must_cite:
  - "Official Stellar docs for Horizon resources or liquidity pools."
  - "Official Hubble/BigQuery or data/indexer docs."
  - "Official Horizon-to-RPC migration or RPC history docs for API boundaries."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/tools/lab/api-explorer/horizon-endpoint"
  - "https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools"
  - "https://developers.stellar.org/docs/data/analytics/hubble"
  - "https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified docs on 2026-06-29. Explorer-specific formulas for StellarX/Scopuly are not public-canonical and should remain a caveat."
---

## Reference answer (gospel)

You cannot exactly "match StellarX/Scopuly" unless you match their private methodology. Define your own methodology first: quote asset, time window, whether to include failed/stale/spam assets, how to treat path payments, rounding, and whether price is last trade, mid, VWAP, route-derived, or oracle-derived.

For classic Stellar liquidity pools/SDEX, Horizon still exposes resources such as assets, liquidity pools, offers, trades, effects, transactions, and trade aggregations in Lab's Horizon explorer docs (https://developers.stellar.org/docs/tools/lab/api-explorer/horizon-endpoint). The liquidity-pool guide shows that pool activity can be tracked through transactions, operations, and effects (https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools). For 24h volume, sum successful trades/swaps in the chosen quote over `[now-24h, now)`. For fees, apply the pool/protocol fee rules to included swaps. For TVL, read current reserves/balances and multiply by your chosen reference prices. For price, state whether you use last trade, VWAP, mid, or external oracle.

For bulk/history, prefer Hubble/BigQuery, Galexie, or an indexer. Hubble is the official analytics stack for BigQuery-style historical analysis (https://developers.stellar.org/docs/data/analytics/hubble). RPC/Horizon boundaries matter: the Horizon-to-RPC migration guide shows many classic resources have no direct RPC equivalent, so broad historical market analytics usually require an indexer or warehouse, not just a live RPC method (https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc).

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for official API and analytics docs. `scout_research` is acceptable for ecosystem/indexer discovery, but the core answer is about documented data-source fit.

## Edge / traps

The wrong answer is "call RPC and compute TVL" without acknowledging retention, classic-vs-Soroban data shape, or pricing methodology. Another wrong answer is treating an explorer's displayed TVL/volume as canonical rather than an indexed product decision.
