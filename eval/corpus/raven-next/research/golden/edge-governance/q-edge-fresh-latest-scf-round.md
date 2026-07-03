---
id: q-edge-fresh-latest-scf-round
q: "Which SCF round is currently open for submissions and when does it close?"
category: edge-governance
subcategory: freshness-staleness
axes: [edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_rfps, lumenloop_search_content_semantic]
acceptable_cards: [perplexity_search, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true   # answerable but highly time-sensitive; reward flagging staleness

must_have:
  - { claim: "Treats the current/open SCF round as time-sensitive: gives a dated/sourced answer and flags it may have changed, OR points to the live SCF source to confirm.", weight: 5 }
  - { claim: "Does NOT assert a specific open round and deadline as definitively current without a dated source or staleness caveat.", weight: 4 }
should_have:
  - { claim: "Directs the user to communityfund.stellar.org (or the live SCF dashboard) for the current round status.", weight: 3 }
nice_to_have:
  - { claim: "Briefly notes SCF runs in rounds with submission/voting windows.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a specific open round + close date as definitively current with no source and no staleness flag.", weight: 5 }
must_cite:
  - "Cite the live SCF source (communityfund.stellar.org / SCF dashboard) and date the claim."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://communityfund.stellar.org
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Freshness honesty (weekly horizon): open SCF round + deadline changes fast. Reward a dated answer + pointer to the live source over a stale confident claim. Gate on the behavior, not a frozen round/deadline."
---

## Reference answer (gospel)

**Freshness-honesty case — gate the behavior, not the round.** The currently-open SCF round and its
close date change fast (weekly horizon), so Raven should give a **dated/sourced answer and flag it may
have changed**, OR point to the **live source** to confirm — **communityfund.stellar.org** (the SCF
dashboard) ([communityfund.stellar.org](https://communityfund.stellar.org)). It may briefly note SCF runs
in rounds with submission/voting windows. It must **not** assert a specific open round + close date as
definitively current with no source/staleness flag. The rubric gates the dated+live-source behavior, not
a frozen round number.

## Why these cards (routing rationale)

`scout_rfps` / `lumenloop_search_content_semantic` surface SCF round info; the rubric rewards dating it
and pointing to the live source rather than asserting a fixed deadline.

## Edge / traps

Wrong answer: a confident 'Round N is open, closes DATE' with no source/caveat.
