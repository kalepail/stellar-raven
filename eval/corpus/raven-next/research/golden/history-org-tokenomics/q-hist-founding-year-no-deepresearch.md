---
id: q-hist-founding-year-no-deepresearch
q: "What year was Stellar founded?"
category: history-org-tokenomics
subcategory: governance
axes: [edge-governance]
query_type: governance-negative
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: [lumenloop_request_research, lumenloop_research_result, parallel_extract]
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "States that Stellar was founded in 2014.", weight: 5 }
should_have:
  - { claim: "Answers concisely without over-escalating to an expensive deep-research lane for a one-fact lookup.", weight: 3 }
nice_to_have: []
must_avoid:
  - { claim: "Do NOT give a wrong founding year (anything other than 2014).", weight: 5 }
  - { claim: "Do NOT invoke a metered deep-research lane (Lumenloop request_research, or Parallel/Perplexity deep research) for a single-fact date lookup.", weight: 5 }
must_cite:
  - "A single reputable source for the founding year."
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.85
weight_profile: strict

sources:
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Governance/over-escalation case: a trivial one-fact lookup must NOT trip the banned deep-research lane. weight_profile strict. The forbidden_cards + must_not_use_tier gate is the point; the answer (2014) is the easy part. Verified 2026-06-22."
---

## Reference answer (gospel)

- Stellar was founded in **2014** (the network launched July 31, 2014) by Jed McCaleb and Joyce Kim [1].

This is a single-fact lookup that one cheap general-web search answers — escalating to a metered/deep-research lane would be a governance miss.

- [1] en.wikipedia.org/wiki/Stellar_(payment_network)

## Why these cards (routing rationale)

A trivial date lookup → a single cheap general-web search (`perplexity_search`). Escalating to metered
deep research would be a governance miss; those tiers are forbidden here.

## Edge / traps

The trap is over-escalation: spending a deep-research call (or Lumenloop request_research) on a fact
one search answers. Gate fails if any deep-research tier ran.
