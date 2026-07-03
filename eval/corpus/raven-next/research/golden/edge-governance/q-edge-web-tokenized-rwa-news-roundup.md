---
id: q-edge-web-tokenized-rwa-news-roundup
q: "Give me a recent general-web news roundup on the tokenized real-world-assets (RWA) trend across the broader market — who's launching what lately?"
category: edge-governance
subcategory: general-web-only
axes: [edge-governance]
query_type: edge-nonstellar
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [parallel_search]
acceptable_cards: [perplexity_search]
forbidden_cards: [scout_research]
expected_service: parallel
should_fire: true   # recent general-web news roundup on a Stellar-adjacent macro topic (RWA) = the Parallel edge

must_have:
  - { claim: "Returns a recent, general-web news roundup on the broader tokenized-RWA trend with ranked dated sources.", weight: 5 }
  - { claim: "Answers from general-web news rather than refusing as not-Stellar-specific or routing to a Stellar-only corpus.", weight: 4 }
should_have:
  - { claim: "Flags that the roundup is point-in-time and recency-sensitive, citing dated sources.", weight: 3 }
  - { claim: "Covers the macro trend across chains/issuers, not only Stellar-specific RWA projects.", weight: 2 }
nice_to_have:
  - { claim: "May note Stellar-relevant RWA examples (e.g. Franklin Templeton BENJI, WisdomTree) as optional context, not the whole answer.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present a recent news roundup as a static, timeless picture without flagging point-in-time.", weight: 5 }
  - { claim: "Do NOT decline as out-of-scope; the broader RWA market is legitimate general-web macro context.", weight: 4 }
  - { claim: "Do NOT fabricate launches, figures, or partnerships not present in the cited sources.", weight: 4 }
must_cite:
  - "At least two reputable, dated general-web news sources for the roundup."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.rwa.xyz
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Parallel-search EXPECTED route. Recent general-web news roundup on a Stellar-adjacent macro topic (tokenized RWA across the broader market); ranked dated multi-source excerpts are exactly parallel_search's lane. NOT a deep-research case (a roundup, not an exhaustive report). Traps = static framing, over-refusal, fabrication, over-escalation."
---

## Reference answer (gospel)

**General-web edge (Parallel route) + freshness.** A recent, multi-source news roundup on the broader
tokenized-RWA trend is `parallel_search`'s sweet spot (ranked dated excerpts; `perplexity_search`
acceptable) — e.g. trackers like [rwa.xyz](https://www.rwa.xyz) plus dated press. Raven should answer from
general-web news, **not** refuse as "not Stellar" or route to a Stellar-only corpus, and should cover the
macro trend **across chains/issuers**, not only Stellar RWA. It may note Stellar-relevant examples
(Franklin Templeton BENJI, WisdomTree) as optional color. It must **flag the roundup as point-in-time**
with dated sources, must **not** fabricate launches/figures/partnerships, and — since a "roundup" is an
ordinary query, not the exhaustive deep-research lane — must **not** over-escalate to a deep-research
tier.

## Why these cards (routing rationale)

A recent, multi-source news roundup on a macro topic is `parallel_search`'s sweet spot (ranked dated
excerpts across sources); `perplexity_search` is acceptable. This is general-web macro context, not a
Stellar-corpus lookup, and a "roundup" is an ordinary query — not the banned exhaustive deep-research
lane.

## Edge / traps

Wrong answers: presenting the roundup as a timeless picture; refusing as not-Stellar; over-escalating
to a deep-research tier; fabricating launches.
