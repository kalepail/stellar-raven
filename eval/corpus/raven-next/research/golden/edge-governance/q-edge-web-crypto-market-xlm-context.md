---
id: q-edge-web-crypto-market-xlm-context
q: "What's the current state of the crypto market and where does XLM sit in it right now — recent price action and how the broader market is moving?"
category: edge-governance
subcategory: general-web-only
axes: [edge-governance]
query_type: edge-nonstellar
difficulty: medium
freshness_sensitive: true
freshness_horizon: daily

expected_cards: [parallel_search]
acceptable_cards: [perplexity_search]
forbidden_cards: [scout_research]
expected_service: parallel
should_fire: true   # general crypto-market + XLM price context, ranked dated sources = the Parallel edge

must_have:
  - { claim: "Provides a general-web, recency-aware read on the broader crypto market and XLM's recent price action, drawn from ranked dated sources.", weight: 5 }
  - { claim: "Answers from a general-web source rather than refusing as not-Stellar-specific or routing to a Stellar docs/research corpus.", weight: 4 }
should_have:
  - { claim: "Flags that prices and market figures are point-in-time and may already be stale, citing a dated source.", weight: 3 }
  - { claim: "Frames XLM (Stellar Lumens) as one asset within the broader market rather than a protocol/docs question.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes market-price commentary from any on-chain / protocol facts about Stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a specific XLM price or market-cap number as a timeless fact without flagging it is point-in-time.", weight: 5 }
  - { claim: "Do NOT decline as out-of-scope; general crypto-market and XLM price context is legitimate general-web.", weight: 4 }
  - { claim: "Do NOT give price predictions or financial advice dressed up as fact.", weight: 4 }
must_cite:
  - "At least one reputable, dated general-web market source for the price/market figures."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.coingecko.com/en/coins/stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Parallel-search EXPECTED route. General-web crypto-market + XLM price context is recency-aware and best served by ranked dated sources (parallel_search); not in any Stellar corpus. Freshness: any price/market-cap figure must be dated + flagged point-in-time. Traps = timeless-fact framing, over-refusal, price prediction."
---

## Reference answer (gospel)

**General-web edge (Parallel route) + freshness.** This is a legitimate general-web, recency-aware
question — Raven should give a **dated read on the broader crypto market and XLM's recent price action**
from ranked dated sources (e.g. [CoinGecko — Stellar](https://www.coingecko.com/en/coins/stellar)), via
`parallel_search` (or `perplexity_search`). It must **not** refuse as "not Stellar" or route to Stellar
docs/research corpora (which carry no live prices). Critically, any **XLM price or market-cap figure must
be flagged point-in-time** with a dated source — never asserted as a timeless fact — and Raven must
**not** give price predictions or financial advice. XLM should be framed as one asset within the broader
market, with market commentary kept distinct from on-chain/protocol facts.

## Why these cards (routing rationale)

Current crypto-market state + XLM price action is open-web, recency-sensitive data best served by
`parallel_search` (ranked + dated excerpts); `perplexity_search` is an acceptable alternate. Stellar
docs/research corpora do not carry live market prices, so routing there would be a miss.

## Edge / traps

Wrong answers: asserting a precise XLM price/market cap as a static fact; refusing as not-Stellar;
offering a price prediction.
