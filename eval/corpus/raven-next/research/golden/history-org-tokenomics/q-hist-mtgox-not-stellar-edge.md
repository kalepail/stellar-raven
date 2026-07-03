---
id: q-hist-mtgox-not-stellar-edge
q: "What happened in the Mt. Gox collapse and how much Bitcoin was lost?"
category: history-org-tokenomics
subcategory: governance
axes: [edge-governance]
query_type: edge-nonstellar
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: [scout_research, lumenloop_search_content_semantic, stellar_docs_mcp]
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Answers the Mt. Gox question as a general (non-Stellar) topic — Mt. Gox was a Bitcoin exchange that collapsed in 2014 after a massive loss/theft of bitcoin.", weight: 5 }
should_have:
  - { claim: "Does not pretend Mt. Gox is a Stellar topic; at most notes the tangential link (Jed McCaleb created Mt. Gox before founding Stellar) if relevant.", weight: 2 }
nice_to_have:
  - { claim: "Roughly ~650,000-850,000 BTC were lost.", weight: 1 }
must_avoid:
  - { claim: "Do NOT route this to Stellar-specific corpora (Scout research / Lumenloop / Stellar docs) as if Mt. Gox were a Stellar subject.", weight: 4 }
  - { claim: "Do NOT claim Mt. Gox ran on Stellar or was a Stellar product.", weight: 4 }
must_cite:
  - "A reputable general-web source on the Mt. Gox collapse."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://en.wikipedia.org/wiki/Mt._Gox
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Near-edge non-Stellar case with a McCaleb tangent. The right route is general web (perplexity/parallel), NOT Stellar corpora. Tests that a McCaleb-adjacent name doesn't pull a non-Stellar topic into Stellar-specific tools. forbidden_cards lists the Stellar corpora to assert they did NOT fire. ~650K-850K BTC figure is the commonly-cited range. Reviewed 2026-06-29: facts (Mt. Gox = Tokyo BTC exchange, collapsed/bankrupt early 2014, ~650K-850K BTC lost, McCaleb created it before Ripple/Stellar) are well-established; routing-edge rubric unchanged."
---

## Reference answer (gospel)

- **Mt. Gox** was a Tokyo-based **Bitcoin exchange** that, at its peak, handled most global BTC trading. It **collapsed in early 2014**, filing for bankruptcy after the loss/theft of a massive amount of bitcoin [1].
- The loss is commonly cited at roughly **~650,000–850,000 BTC** [1].
- This is a **general crypto-history topic, not a Stellar subject**. The only tangential link: **Jed McCaleb created Mt. Gox** (and later sold it) before he co-founded Ripple and then Stellar — but Mt. Gox never ran on Stellar and is not a Stellar product [1].

- [1] en.wikipedia.org/wiki/Mt._Gox

## Why these cards (routing rationale)

Mt. Gox is a general crypto-history topic, not Stellar → general-web `perplexity_search` /
`parallel_search`. Stellar corpora should NOT fire just because McCaleb's name is adjacent.

## Edge / traps

The trap is mis-routing a non-Stellar topic into Stellar-specific tools on a tenuous name association.
