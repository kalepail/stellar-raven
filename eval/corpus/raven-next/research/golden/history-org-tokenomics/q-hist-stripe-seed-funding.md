---
id: q-hist-stripe-seed-funding
q: "Who provided the early seed funding for Stellar, and how much?"
category: history-org-tokenomics
subcategory: founding
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Stripe provided the early/seed funding for Stellar (led by Patrick Collison).", weight: 5 }
  - { claim: "The seed amount was approximately $3 million, in 2014.", weight: 4 }
should_have:
  - { claim: "Patrick Collison (Stripe co-founder/CEO) remained an advisor to Stellar/SDF.", weight: 2 }
nice_to_have:
  - { claim: "In return Stripe received an allocation of lumens (XLM).", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute the seed funding to the wrong backer (e.g. claim it came from Ripple, Coinbase, a16z, or IBM).", weight: 5 }
  - { claim: "Do NOT cite a wildly wrong figure (e.g. $30M or $300M) for the Stripe seed — it was ~$3M.", weight: 3 }
must_cite:
  - "A reputable source on the Stripe seed funding (e.g. MIT Sloan, founding coverage, or SDF history)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
  - https://en.wikipedia.org/wiki/Jed_McCaleb
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "General-web-targeted: the $3M Stripe seed is well-attested (Wikipedia). Precision trap on the funder identity and the ~$3M figure. Stripe received ~2B lumens (2%) in return. Verified 2026-06-22."
---

## Reference answer (gospel)

- **Stripe** provided Stellar's early seed funding — **~$3 million in 2014** — with Stripe CEO **Patrick Collison** helping create the Stellar Development Foundation [1][2].
- In return, **Stripe received ~2 billion lumens (about 2% of the initial 100B supply)** [1].
- Collison remained associated with Stellar as an advisor [1].
- Note: it was Stripe, **not** Ripple, Coinbase, a16z, or IBM; the figure was ~$3M, not tens or hundreds of millions [1].

- [1] en.wikipedia.org/wiki/Stellar_(payment_network)
- [2] en.wikipedia.org/wiki/Jed_McCaleb

## Why these cards (routing rationale)

A funding-history fact about a partner company (Stripe) → general-web edge, `perplexity_search` /
`parallel_search`. Not in Stellar's primary protocol corpora.

## Edge / traps

Trap: misattributing the backer or inflating the figure. It was Stripe, ~$3M, 2014.
