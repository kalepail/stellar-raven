---
id: q-hist-moneygram-partnership
q: "What is the relationship between MoneyGram and Stellar, and did SDF invest in MoneyGram?"
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "MoneyGram partnered with Stellar/SDF to enable cash-to-crypto on/off ramps using USDC on Stellar (MoneyGram Access / Ramps).", weight: 5 }
  - { claim: "The integration lets users convert physical cash to digital dollars (USDC) and back, across many countries.", weight: 3 }
should_have:
  - { claim: "SDF made an equity investment in MoneyGram (becoming a minority investor) from its cash treasury.", weight: 2 }
nice_to_have:
  - { claim: "The MoneyGram take-private deal (Madison Dearborn) closed around 2023.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the MoneyGram integration runs on Ripple/XRP or a non-Stellar chain.", weight: 5 }
  - { claim: "Do NOT claim SDF acquired/owns MoneyGram outright — SDF was a minority investor.", weight: 3 }
must_cite:
  - "A reputable dated source on the MoneyGram x Stellar partnership (stellar.org or news)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/products-and-tools/moneygram
  - https://stellar.org/blog/foundation-news/sdfs-investment-in-moneygram-international
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "MoneyGram Access/Ramps + the minority SDF investment from cash treasury on stellar.org. Take-private deal (Madison Dearborn, $1.8B, closed Aug 15 2023) general-web. The Ripple-confusion and 'SDF acquired MoneyGram' traps both matter. Verified 2026-06-22."
---

## Reference answer (gospel)

- MoneyGram partnered with **Stellar/SDF** to enable **cash-to-crypto on/off ramps using USDC on Stellar** (MoneyGram Access, now **MoneyGram Ramps**) [1].
- Users can **convert physical cash to digital dollars (USDC) and back**, across **170+ countries** — even without a bank account [1].
- **SDF made a minority equity investment in MoneyGram** (becoming a minority investor), funded from **SDF's own cash treasury** (not the Enterprise Fund), and received a MoneyGram board seat [2].
- The MoneyGram take-private deal (Madison Dearborn Partners, ~$1.8B) closed around **2023** [2].
- Traps to avoid: claiming the integration runs on Ripple/XRP (it runs on **Stellar**), or that SDF **acquired/owns** MoneyGram (it was a **minority** investor) [1][2].

- [1] stellar.org/products-and-tools/moneygram
- [2] stellar.org/blog/foundation-news/sdfs-investment-in-moneygram-international

## Why these cards (routing rationale)

Mostly partner-news; recency-aware `perplexity_search` primary, `scout_research` acceptable for the
stellar.org case study.

## Edge / traps

Traps: Ripple confusion; overstating the SDF stake (minority, not acquisition).
