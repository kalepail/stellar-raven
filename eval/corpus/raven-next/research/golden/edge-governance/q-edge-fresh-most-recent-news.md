---
id: q-edge-fresh-most-recent-news
q: "What's the most recent big news in the Stellar ecosystem this week?"
category: edge-governance
subcategory: freshness-staleness
axes: [edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [lumenloop_search_content_semantic, perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true   # answerable but inherently 'this week'; reward dating + staleness honesty

must_have:
  - { claim: "Returns recent, dated Stellar news items from a sourced lookup and is honest about the recency window (cannot guarantee it is the absolute latest as of the user's exact moment).", weight: 5 }
  - { claim: "Does NOT present undated or stale items as definitively 'this week's' news.", weight: 4 }
should_have:
  - { claim: "Each news item carries a date and a source.", weight: 3 }
nice_to_have:
  - { claim: "Suggests a live news source for the very latest.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate recent news events or attribute undated items to 'this week'.", weight: 5 }
must_cite:
  - "Each news item must carry a dated source (Lumenloop content / reputable dated outlet)."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/blog
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Freshness honesty: 'this week' news is the canonical recency case. Reward dated, sourced items + honesty about the recency window; trap is fabricated or undated 'recent' news. Gate on the behavior, not specific stories."
---

## Reference answer (gospel)

**Freshness-honesty case — gate the behavior, not specific stories.** "This week's biggest Stellar news"
is inherently time-bound, so Raven should return **recent, dated, sourced news items** (via
`lumenloop_search_content_semantic` curated dated content + `perplexity_search` recency-aware web; e.g.
the [Stellar blog](https://stellar.org/blog)) and be **honest about the recency window** — it cannot
guarantee these are the absolute latest as of the user's exact moment. **Each item must carry a date and
a source**, and it may suggest a live news source for the very latest. It must **not** fabricate recent
events or attribute undated/stale items to "this week." The rubric gates the dated-and-honest behavior,
not any particular headline.

## Why these cards (routing rationale)

`lumenloop_search_content_semantic` (curated dated Stellar content) + `perplexity_search` (recency-aware
web) are the right route for 'this week' news. Reward dated items and recency honesty.

## Edge / traps

Wrong answers: undated/stale items labeled 'this week'; fabricated recent events.
