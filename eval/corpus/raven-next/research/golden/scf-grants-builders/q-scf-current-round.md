---
id: q-scf-current-round
q: "What is the current open SCF round and when is its submission deadline?"
category: scf-grants-builders
subcategory: rounds-rfps
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: "weekly"

expected_cards: [scout_rfps]
acceptable_cards: [scout_research, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Identifies the currently open/active SCF round (e.g. an SCF #NN) with its submission deadline.", weight: 5 }
  - { claim: "Flags that round/deadline info is time-sensitive and should be confirmed against communityfund.stellar.org.", weight: 3 }
should_have:
  - { claim: "States the SCF Build cadence is roughly every 6 weeks.", weight: 2 }
  - { claim: "Notes the standard $150K XLM Build cap for the round.", weight: 2 }
nice_to_have:
  - { claim: "As of the June 2026 dossier, SCF #45 had a July 26, 2026 deadline.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a specific round/deadline as definitively current without a freshness caveat (it rotates every ~6 weeks).", weight: 4 }
  - { claim: "Do NOT fabricate a round number or deadline date not grounded in a source.", weight: 4 }
must_cite:
  - "communityfund.stellar.org/awards (the live awards page) for the current round/deadline."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://communityfund.stellar.org/awards"
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: medium
notes: "Dossier §4. Freshness item — rotates every ~6 weeks; reward staleness-flagging. scout_rfps surfaces activeQuarter signal."
---

## Reference answer (gospel)

- **Time-sensitive figure (as of June 2026):** the open round is **SCF #45**, submission deadline **July 26, 2026**, standard **$150K-in-XLM** Build cap. Report this, but do not assert it as definitively current. [communityfund.stellar.org/awards]
- **Always flag freshness:** SCF Build rounds rotate on a roughly **6-week** cadence, so the current round number and deadline must be confirmed against the live source. [scout_rfps `activeQuarter` signal; communityfund.stellar.org/awards]
- The live awards page is the authority for the open round/deadline; `scout_rfps` surfaces the active quarter and open-vs-closed window as corroboration. [stellarlight.xyz scout]
- Round mechanics (stable): Build awards are up to **$150,000 worth of XLM**, budget set in USD, disbursed milestone-based in tranches. [SCF Build Award handbook]
- Don't fabricate a round number or deadline not grounded in the live feed.

## Why these cards (routing rationale)

A current-round/RFP-window question maps to `scout_rfps` (activeQuarter / open-vs-closed signal).
`scout_research` over the handbook is acceptable corroboration. Deep-research/general-web is over-escalation.

## Edge / traps

Trap: asserting a fixed round/deadline as current without flagging that rounds rotate every ~6 weeks.
