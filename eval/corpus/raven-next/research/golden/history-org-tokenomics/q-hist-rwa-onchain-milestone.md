---
id: q-hist-rwa-onchain-milestone
q: "How much real-world-asset value is tokenized on Stellar, and what are the main RWAs?"
category: history-org-tokenomics
subcategory: deployments
axes: [ecosystem-spectrum, edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "On-chain RWA value on Stellar is in the multi-billion-dollar range — it crossed $1B in early Jan 2026, ~$2B in Q1 2026, and ~$3B by mid-2026 — give a dated figure.", weight: 4 }
  - { claim: "Major Stellar RWAs include tokenized funds like Franklin Templeton's BENJI, plus issuers such as Spiko, Ondo, and WisdomTree.", weight: 4 }
should_have:
  - { claim: "Flags that the RWA total is freshness-sensitive and gives a date / points to a tracker.", weight: 3 }
nice_to_have:
  - { claim: "Notes RWAs are typically tokenized money-market / Treasury funds, settled with stablecoins.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a precise RWA TVL figure with false confidence and no date / source.", weight: 3 }
  - { claim: "Do NOT name a non-Stellar RWA (e.g. BlackRock BUIDL on Ethereum) as a Stellar RWA.", weight: 3 }
must_cite:
  - "A dated source for Stellar RWA value (SDF report, RWA tracker, or news)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/foundation-news/2025-year-in-review
  - https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Freshness item. Verified 2026-06-29 against SDF reports + press: on-chain RWAs ~$785M at end of 2025, crossed $1B first week of Jan 2026, crossed ~$2B shortly after Q1 2026 quarter-end (SDF 'Q1 2026: Execution at network scale' blog; ~April 11-14), and surpassed ~$3B by ~June 25, 2026 (press coverage). Main RWAs now: Spiko (now largest, >$1B), Franklin Templeton BENJI (~$654M), Ondo USDY (~$529M), plus WisdomTree and Figure. Updated the stale '$1-2B' figure to the multi-billion range and added Spiko/Ondo to the major-issuer list. Reward dating/caveating. BlackRock BUIDL is Ethereum (wrong-chain trap)."
---

## Reference answer (gospel)

- On-chain **RWA value on Stellar grew rapidly**: **~$785M** at end of 2025, **crossed $1B** in the first week of **January 2026**, **crossed ~$2B** shortly after Q1 2026 quarter-end, and **surpassed ~$3B by mid-2026** [1][2].
- Major Stellar RWAs are **tokenized money-market / Treasury / credit products**: **Franklin Templeton's BENJI**, plus **Spiko** (now the largest issuer on the network), **Ondo** (USDY), **WisdomTree** digital funds, and **Figure** [1][2].
- They settle with stablecoins (USDC) and use Stellar's native asset/compliance controls.
- Freshness caveat: RWA totals move fast — **cite a dated source** (SDF reports or an RWA tracker), don't assert a stale precise number.
- Trap to avoid: naming a non-Stellar RWA (e.g. **BlackRock BUIDL**, which is on **Ethereum**) as a Stellar RWA [1].

- [1] stellar.org/blog/foundation-news/2025-year-in-review
- [2] stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale

## Why these cards (routing rationale)

A freshness-sensitive RWA-TVL figure → recency-aware `perplexity_search`; `scout_research` acceptable
for the SDF year-in-review.

## Edge / traps

Traps: a stale precise TVL with no date; naming an Ethereum-only RWA (e.g. BUIDL) as a Stellar RWA.
