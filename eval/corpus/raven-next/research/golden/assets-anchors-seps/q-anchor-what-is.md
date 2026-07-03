---
id: q-anchor-what-is
q: "What is an anchor on Stellar?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "An anchor is an on/off-ramp bridging the Stellar network to traditional financial rails (fiat).", weight: 5 }
  - { claim: "Anchors accept fiat deposits and issue equivalent Stellar tokens, and redeem tokens back to real-world value.", weight: 4 }
should_have:
  - { claim: "Anchors are typically financial institutions or fintech companies.", weight: 2 }
  - { claim: "They implement standard SEPs so any compliant wallet can interoperate with them.", weight: 2 }
nice_to_have:
  - { claim: "Gives an example anchor (e.g. MoneyGram Ramps).", weight: 1 }
must_avoid:
  - { claim: "Do NOT define an anchor as a validator, a smart contract, or a consensus node.", weight: 4 }
must_cite:
  - "The Learn About Anchors page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/anchors
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §5.1. Definition verified against the Learn About Anchors page."
---

## Reference answer (gospel)

- An **anchor** is the Stellar term for an **on/off-ramp** that connects the Stellar network to traditional financial rails (fiat) [1].
- Anchors **accept fiat deposits and issue equivalent tokens** on Stellar, and **redeem** those tokens back to real-world value (fiat) [1].
- They are typically **financial institutions or fintech companies**, and they implement standard **SEPs** (SEP-6/10/12/24/31/38) so any compliant wallet can interoperate with them [1].
- Example: **MoneyGram Ramps** is an anchor providing cash in/out [1].

## Why these cards (routing rationale)

Definitional Stellar concept → `stellar_docs_mcp`. No general-web/deep-research.

## Edge / traps

Confusing an 'anchor' with a **validator**, a **smart contract**, or a **consensus node** — an anchor is a fiat bridge, not infrastructure.
