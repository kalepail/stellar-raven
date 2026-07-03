---
id: q-org-sdf-ceo-denelle-dixon
q: "Who is the CEO of the Stellar Development Foundation and where did she come from?"
category: history-org-tokenomics
subcategory: sdf-org
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: easy
freshness_sensitive: true
freshness_horizon: "leadership-change"

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Denelle Dixon is the CEO and Executive Director of the Stellar Development Foundation.", weight: 5 }
  - { claim: "She came to SDF from Mozilla, where she had served as Chief Operating Officer.", weight: 3 }
should_have:
  - { claim: "She was named CEO/Executive Director in March 2019.", weight: 2 }
nice_to_have:
  - { claim: "Flags that leadership can change and a current source should be checked.", weight: 1 }
must_avoid:
  - { claim: "Do NOT name Jed McCaleb as the current SDF CEO (McCaleb is a founder and board member, not CEO).", weight: 4 }
  - { claim: "Do NOT invent a different CEO name not supported by a current source.", weight: 4 }
must_cite:
  - "A reputable dated source for current SDF leadership (stellar.org press or recent coverage)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/sdf-appoints-denelle-dixon-as-executive-director-and-ceo
  - https://stellar.org/foundation/mandate
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Leadership is freshness-sensitive (can change). Verified: Dixon named CEO/Executive Director March 14, 2019, from Mozilla (COO); still listed as SDF leader as of 2026. Reward flagging that leadership can change. Verified 2026-06-22."
---

## Reference answer (gospel)

- **Denelle Dixon** is the **CEO and Executive Director** of the Stellar Development Foundation [1][2].
- She joined SDF from **Mozilla**, where she had served as **Chief Operating Officer** [1].
- She was named CEO/Executive Director in **March 2019** (March 14, 2019) [1].
- Note: **Jed McCaleb** is a **co-founder and board member**, not the CEO [2].

Freshness caveat: leadership can change — confirm against a current SDF source.

- [1] stellar.org/press/sdf-appoints-denelle-dixon-as-executive-director-and-ceo
- [2] stellar.org/foundation/mandate

## Why these cards (routing rationale)

Current-leadership facts are freshness-sensitive → recency-aware `perplexity_search` primary;
`scout_research` acceptable if the SDF leadership page is indexed.

## Edge / traps

Trap: naming McCaleb (founder/board) or a stale/invented CEO. Reward flagging that this can change.
