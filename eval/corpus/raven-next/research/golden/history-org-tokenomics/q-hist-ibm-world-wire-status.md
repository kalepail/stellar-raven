---
id: q-hist-ibm-world-wire-status
q: "Is IBM World Wire still operating on Stellar?"
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: "annual"

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "IBM World Wire was a real Stellar-based payments network, but its activity declined / it was effectively wound down in later years.", weight: 5 }
should_have:
  - { claim: "Flags that current operational status is uncertain and a recent source should confirm.", weight: 3 }
nice_to_have:
  - { claim: "Notes that Stellar's enterprise momentum shifted to newer partners (MoneyGram, Circle, Visa, etc.).", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert World Wire is a thriving, currently-expanding flagship with false confidence.", weight: 3 }
  - { claim: "Do NOT claim World Wire ran on Ripple/XRP.", weight: 3 }
must_cite:
  - "A reputable dated source on IBM World Wire's current/declining status."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/ecosystem/why-ibm-built-world-wire-on-stellar
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Freshness/honesty case. World Wire was real (on Stellar) but activity declined / it was effectively wound down; current status is uncertain (no live primary confirmation of ongoing operation). Reward flagging the decline/uncertainty over asserting it's a live flagship. Pairs with q-hist-ibm-world-wire. Verified 2026-06-29: stellar.org launch blog (2019) resolves and confirms it was built ON Stellar (not Ripple/XRP); IBM open-sourced the code in Oct 2021 and community/press (Reddit r/Stellar, TronWeekly on Jesse Lund/Stanley Yong departures) corroborate that it was effectively wound down with no current live operation. No live primary source confirms ongoing operation."
---

## Reference answer (gospel)

- **IBM World Wire was a real Stellar-based payments network**, but its **activity declined and it was effectively wound down** in later years; it is **not** a currently-expanding flagship [1].
- **Current operational status is uncertain** — confirm against a recent source rather than asserting it is thriving.
- Stellar's enterprise momentum since shifted to newer partners (MoneyGram, Circle, Visa, Mastercard, etc.).
- Traps to avoid: overstating World Wire as a live flagship, or claiming it ran on **Ripple/XRP** (it ran on **Stellar**) [1].

- [1] stellar.org/blog/ecosystem/why-ibm-built-world-wire-on-stellar

## Why these cards (routing rationale)

Current status of a years-old partner product → recency-aware `perplexity_search` / `parallel_search`.

## Edge / traps

Traps: overstating World Wire as a current flagship; attributing it to Ripple. Reward honesty about
its decline/uncertain status.
