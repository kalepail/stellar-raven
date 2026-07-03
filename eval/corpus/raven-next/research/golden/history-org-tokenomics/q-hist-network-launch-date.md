---
id: q-hist-network-launch-date
q: "When did the Stellar network go live?"
category: history-org-tokenomics
subcategory: founding
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "The Stellar network launched / went live in 2014 (July 31, 2014).", weight: 5 }
should_have:
  - { claim: "The network later adopted the redesigned Stellar Consensus Protocol in 2015.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes the 2014 network launch from the 2015 SCP upgrade.", weight: 1 }
must_avoid:
  - { claim: "Do NOT give a wrong launch year (e.g. 2015, 2017) — the network went live in 2014.", weight: 5 }
must_cite:
  - "A reputable source on the Stellar network launch date."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "General-web-targeted: July 31 2014 launch (Wikipedia 'Initial release'). Simple factual; the trap is confusing the 2014 launch with the 2015 SCP rewrite. Verified 2026-06-22."
---

## Reference answer (gospel)

- The Stellar network went live / had its initial release on **July 31, 2014** [1].
- It later adopted the redesigned **Stellar Consensus Protocol (SCP) in 2015** — that was a protocol upgrade, not the original launch [1].

- [1] en.wikipedia.org/wiki/Stellar_(payment_network)

## Why these cards (routing rationale)

A single date fact, third-party-sourced → `perplexity_search`; `scout_research` acceptable.

## Edge / traps

Trap: dating the network launch to 2015 (that was the SCP upgrade), not 2014.
