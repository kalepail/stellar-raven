---
id: q-token-initial-supply-distribution
q: "How was the initial supply of XLM created and distributed at launch?"
category: history-org-tokenomics
subcategory: tokenomics
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [perplexity_search, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "At the 2014 launch the network generated 100 billion lumens (XLM).", weight: 5 }
  - { claim: "There was a built-in ~1% annual inflation rate at launch (later disabled in 2019).", weight: 3 }
should_have:
  - { claim: "A portion (~20%) of the initial lumens was earmarked to be given away to bitcoin and XRP holders.", weight: 2 }
  - { claim: "XLM is a pre-mined token (not mined via Proof-of-Work).", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes the original 100B launch supply from today's ~50B (post-2019 burn) supply.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim XLM was created via mining / Proof-of-Work — the full 100B was generated at launch.", weight: 4 }
  - { claim: "Do NOT give a wrong initial supply (e.g. 50B or 21M) — it was 100 billion at launch.", weight: 4 }
must_cite:
  - "The stellar.org lumens page or developer docs on XLM supply."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/learn/lumens
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Mostly Stellar-own: 100B created at launch + ~1% annual (stellar.org/learn/lumens, which explicitly says lumens 'aren't mined'). The original giveaway split has varying framings — Wikipedia: 25% to nonprofits + Stripe 2B; the dossier's 2017-mandate framing was '19% BTC / 1% XRP' for a ~20% holder giveaway. Kept the holder-giveaway claim soft. PoW trap matters. Verified 2026-06-22."
---

## Reference answer (gospel)

- At the **2014 launch the network generated 100 billion lumens (XLM)** all at once — lumens **are not mined** and were **not** created via Proof-of-Work [1][2].
- There was a built-in **~1% annual inflation** rate at launch, later **disabled by community vote in 2019** [1].
- A portion of the initial supply was earmarked for **free distribution / financial-inclusion giveaways**, including to Bitcoin and Ripple/XRP holders (~20% to holders in the original plan); Stripe received ~2B lumens for its seed investment [1][2].
- The original **100B launch supply** is distinct from today's **~50B** supply (after the 2019 burn) [1].

- [1] stellar.org/learn/lumens
- [2] en.wikipedia.org/wiki/Stellar_(payment_network)

## Why these cards (routing rationale)

Initial supply/distribution is documented on stellar.org (Stellar-own) → `scout_research` /
`stellar_docs_mcp`; perplexity acceptable.

## Edge / traps

Traps: claiming XLM was mined (it was pre-generated), or a wrong initial supply (it was 100B).
