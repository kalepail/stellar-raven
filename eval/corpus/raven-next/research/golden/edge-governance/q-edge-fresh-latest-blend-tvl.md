---
id: q-edge-fresh-latest-blend-tvl
q: "What's Blend's TVL today and how has it trended this quarter?"
category: edge-governance
subcategory: freshness-staleness
axes: [edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [lumenloop_find_content_about_project, scout_analyze]
acceptable_cards: [perplexity_search, scout_projects]
forbidden_cards: []
expected_service: lumenloop
should_fire: true   # answerable approximately; reward dating + staleness flag

must_have:
  - { claim: "Treats Blend's TVL as time-sensitive: gives a dated/sourced figure and flags it as point-in-time, OR points to a live dashboard.", weight: 5 }
  - { claim: "Does NOT assert a current TVL figure as exact and up-to-the-moment without a dated source or staleness caveat.", weight: 4 }
should_have:
  - { claim: "Confirms Blend is a Stellar/Soroban lending protocol so the TVL is correctly attributed.", weight: 2 }
  - { claim: "Suggests a live source (DefiLlama-style dashboard) for current TVL.", weight: 2 }
nice_to_have:
  - { claim: "Gives a dated trend direction rather than a precise quarter-over-quarter number.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a precise current TVL as exact/live with no source and no staleness flag.", weight: 5 }
  - { claim: "Do NOT fabricate a quarter-over-quarter trend figure without a dated source.", weight: 4 }
must_cite:
  - "Any TVL/trend figure must carry a dated source."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://defillama.com/protocol/blend
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Freshness honesty: per-project TVL/trend is volatile. Reward dated+flagged figure and a live-source pointer over a confident current number. Gate on the behavior, not a frozen TVL number."
---

## Reference answer (gospel)

**Freshness-honesty case — gate the behavior, not the number.** Blend's TVL is **time-sensitive**, so
Raven should give a **dated/sourced figure and flag it point-in-time**, OR point to a **live dashboard**
(e.g. [DefiLlama — Blend](https://defillama.com/protocol/blend)). It should confirm **Blend is a
Stellar/Soroban lending protocol** so the TVL is correctly attributed, and may give a dated trend
*direction* rather than a precise quarter-over-quarter number. It must **not** assert a precise current
TVL as exact/live with no source/staleness flag, nor fabricate a quarterly trend figure. The rubric gates
the dated+flagged behavior, not a frozen figure.

## Why these cards (routing rationale)

`lumenloop_find_content_about_project` / `scout_analyze` surface Blend info; the rubric rewards dating
the TVL and flagging it point-in-time, plus a live-dashboard pointer.

## Edge / traps

Wrong answers: a precise 'live' TVL with no source; a fabricated quarterly trend.
