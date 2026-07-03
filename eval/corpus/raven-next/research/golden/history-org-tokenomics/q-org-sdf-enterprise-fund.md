---
id: q-org-sdf-enterprise-fund
q: "What is the SDF Enterprise Fund and roughly how much has it invested?"
category: history-org-tokenomics
subcategory: sdf-org
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "The SDF Enterprise Fund is a venture investment vehicle SDF uses to invest in companies building on Stellar.", weight: 5 }
should_have:
  - { claim: "Cumulative Enterprise Fund investment is on the order of $100 million+.", weight: 3 }
  - { claim: "Names at least one investee (e.g. SatoshiPay, NetXD, Puntored, Tala, Wyre, etc.).", weight: 2 }
nice_to_have:
  - { claim: "Notes that the MoneyGram investment was made from SDF's cash treasury, NOT from the Enterprise Fund.", weight: 2 }
must_avoid:
  - { claim: "Do NOT claim the MoneyGram stake came from the Enterprise Fund — it came from SDF's own cash treasury.", weight: 3 }
  - { claim: "Do NOT fabricate a specific cumulative figure unsupported by a source (e.g. assert an exact billions-scale number).", weight: 3 }
must_cite:
  - "The stellar.org Enterprise Fund page or SDF press releases."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/enterprise-fund
  - https://stellar.org/blog/foundation-news/sdfs-investment-in-moneygram-international
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Freshness-sensitive (cumulative total grows). Dossier: 'over $100m' cumulative (stellar.org/enterprise-fund); SatoshiPay $550K (2020), NetXD $10M (Oct 2022), Puntored $2M (Sep 2024). MoneyGram-from-cash-treasury-not-Enterprise-Fund distinction confirmed on the SDF blog. Re-verified 2026-06-29: cumulative 'over $100M', investee figures, and the MoneyGram-stake-came-from-SDF-cash-treasury (not the Enterprise Fund) distinction all hold; both frontmatter source URLs support their claims."
---

## Reference answer (gospel)

- The **SDF Enterprise Fund** is a **venture-investment vehicle** SDF uses to invest in companies building on Stellar [1].
- **Cumulative investment is on the order of $100 million+** [1].
- Example investees: **SatoshiPay** (~$550K, 2020), **NetXD** ($10M, Oct 2022), **Puntored** ($2M, Sep 2024), among others [1].
- Important distinction: the **MoneyGram** investment was made from **SDF's own cash treasury, NOT from the Enterprise Fund** [2].
- Trap to avoid: attributing the MoneyGram stake to the Enterprise Fund, or inventing a precise cumulative figure [2].

- [1] stellar.org/enterprise-fund
- [2] stellar.org/blog/foundation-news/sdfs-investment-in-moneygram-international

## Why these cards (routing rationale)

Enterprise Fund details are published on stellar.org (Stellar-own) → `scout_research` /
`stellar_docs_mcp`; perplexity acceptable for the latest cumulative figure.

## Edge / traps

Trap: attributing the MoneyGram investment to the Enterprise Fund (it came from SDF's cash treasury),
or inventing a precise cumulative number.
