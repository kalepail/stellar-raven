---
id: q-edge-web-stablecoin-macro-context
q: "What is the overall size and growth of the global stablecoin market right now?"
category: edge-governance
subcategory: general-web-only
axes: [edge-governance]
query_type: edge-nonstellar
difficulty: medium
freshness_sensitive: true
freshness_horizon: monthly

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true   # macro market context, recency-aware = the general-web edge

must_have:
  - { claim: "Provides a general-web, recency-aware answer on the overall stablecoin market size/growth (total market cap and trend).", weight: 5 }
  - { claim: "Answers from a general-web source rather than refusing as not-Stellar-specific.", weight: 4 }
should_have:
  - { claim: "Notes the figure is point-in-time and may be stale, citing a dated source.", weight: 3 }
  - { claim: "Names the dominant stablecoins (e.g. USDT, USDC) as market context.", weight: 2 }
nice_to_have:
  - { claim: "Mentions Stellar-relevant stablecoins (USDC, EURC) only as optional color.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a precise market-cap number as a timeless fact without flagging it is point-in-time.", weight: 5 }
  - { claim: "Do NOT decline as out-of-scope; macro stablecoin market context is legitimate general-web.", weight: 4 }
must_cite:
  - "At least one reputable, dated general-web source for the market-size figure."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://defillama.com/stablecoins
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "General-web edge + freshness: macro market sizing is recency-sensitive; reward citing a dated source and flagging point-in-time, not a confident timeless number."
---

## Reference answer (gospel)

**General-web edge (should answer) + freshness.** Overall stablecoin market size/growth is legitimate
general-web macro context — Raven should answer it (via `perplexity_search` / `parallel_search`,
e.g. [DefiLlama stablecoins](https://defillama.com/stablecoins)), not refuse as "not Stellar." It should
give the **total market cap and trend**, **name the dominant stablecoins (USDT, USDC)** as context, and
may mention Stellar-relevant stablecoins (USDC, EURC) as optional color. Critically, the figure must be
**flagged point-in-time with a dated source** — never asserted as a precise timeless number (the cap
moves continuously).

## Why these cards (routing rationale)

Overall stablecoin market sizing is open-web, recency-aware data — `perplexity_search` /
`parallel_search`. Not in any Stellar corpus.

## Edge / traps

Wrong answers: stating a precise cap as a static fact; refusing the question as not-Stellar.
