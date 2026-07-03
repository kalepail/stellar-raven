---
id: q-token-xlm-vs-xrp
q: "What's the difference between XLM and XRP?"
category: history-org-tokenomics
subcategory: tokenomics
axes: [ecosystem-spectrum, edge-governance]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "XLM (lumens) is the native asset of the Stellar network; XRP is the native asset of the XRP Ledger / Ripple ecosystem — they are different tokens on different networks.", weight: 5 }
  - { claim: "Stellar (XLM) and Ripple (XRP) are run by different organizations (SDF vs Ripple) and use different consensus.", weight: 4 }
should_have:
  - { claim: "Stellar uses the Stellar Consensus Protocol (FBA); the XRP Ledger uses its own (Ripple) consensus protocol.", weight: 2 }
  - { claim: "The shared history is founder Jed McCaleb (co-founded Ripple, then Stellar) — not shared code.", weight: 2 }
nice_to_have:
  - { claim: "Stellar emphasizes financial inclusion / anchors; Ripple emphasizes bank/ODL cross-border settlement.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim XLM and XRP are the same token or that Stellar is a Ripple product.", weight: 5 }
  - { claim: "Do NOT claim Stellar is a code fork of Ripple's ledger.", weight: 3 }
must_cite:
  - "A reputable source distinguishing Stellar/XLM from Ripple/XRP."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
  - https://en.wikipedia.org/wiki/Jed_McCaleb
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "The canonical XLM-vs-XRP confusion test. CoinMarketCap's own XLM page states XLM is 'a separate project with different founding principles, technology, and governance than Ripple/XRP.' Single most important conflation trap for the category. Verified 2026-06-22."
---

## Reference answer (gospel)

- **XLM (lumens)** is the native asset of the **Stellar network**; **XRP** is the native asset of the **XRP Ledger / Ripple ecosystem**. They are **different tokens on different networks** [1].
- Different organizations steward them: **Stellar Development Foundation (SDF)** vs **Ripple** [1].
- Different consensus: Stellar uses the **Stellar Consensus Protocol (SCP / Federated Byzantine Agreement)** since 2015; the XRP Ledger uses its own Ripple consensus [1].
- The shared history is **founder Jed McCaleb** (co-founded Ripple, then Stellar) — **not shared code** (Stellar rewrote to SCP) [1][2].
- Trap to avoid: treating XLM and XRP as the same token, or calling Stellar a Ripple product/fork [1].

- [1] en.wikipedia.org/wiki/Stellar_(payment_network)
- [2] en.wikipedia.org/wiki/Jed_McCaleb

## Why these cards (routing rationale)

A comparison spanning two ecosystems (one non-Stellar) → general-web `perplexity_search`;
`scout_research` acceptable for the Stellar side.

## Edge / traps

The defining trap is treating XLM and XRP as the same, or Stellar as a Ripple product/fork.
