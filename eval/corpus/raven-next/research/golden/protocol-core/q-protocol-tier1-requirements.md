---
id: q-protocol-tier1-requirements
q: "What does it take to become a Tier 1 organization on Stellar — how many validators, what uptime, and how do you actually get in?"
category: protocol-core
subcategory: validators-topology
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States a Tier 1 organization must run three (3) geographically dispersed Full Validators, each publishing a separate history archive.", weight: 5 }
  - { claim: "States Tier 1 status is earned by other Tier 1 orgs including you in their quorum sets (trust/invitation), not granted by application.", weight: 5 }
should_have:
  - { claim: "Mentions the ~99.9%+ uptime target with 24/7 monitoring.", weight: 3 }
  - { claim: "Mentions SEP-1 (stellar.toml) and SEP-20 self-verification as requirements.", weight: 3 }
  - { claim: "Explains the 'why three': 2-of-3 of your nodes can still vote on your behalf during maintenance/failure.", weight: 2 }
nice_to_have:
  - { claim: "Notes the process takes months (measured in months, not weeks) and starting with a single validator builds experience.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Tier 1 requires staking a minimum amount of XLM or paying a fee.", weight: 5 }
  - { claim: "Do NOT claim Tier 1 status is assigned by the Stellar Development Foundation by application/approval.", weight: 4 }
  - { claim: "Do NOT state the wrong validator count (e.g. one, two, or five validators).", weight: 4 }
must_cite:
  - "The Tier 1 Organizations page on developers.stellar.org/docs/validators/tier-1-orgs."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/validators/tier-1-orgs
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Three full validators + quorum-set trust are defining. Trap is staking/application framing or wrong count."
---

## Reference answer (gospel)

- A Tier 1 org must run **three (3) geographically dispersed Full Validators**, each publishing a **separate history archive** [1].
- Tier 1 status is **earned** by other Tier 1 orgs including you in their **quorum sets** (trust / invitation) — **not** granted by application to SDF, and **not** by staking XLM or paying a fee [1].
- Targets **~99.9%+ uptime** with 24/7 monitoring [1], and requires **SEP-1** (`stellar.toml`) and **SEP-20** self-verification [1].
- **Why three**: if one node is down for maintenance/failure, **2-of-3** of your nodes can still vote on your behalf [1].
- The process takes **months, not weeks**; starting with a single validator builds experience first [1].

## Why these cards (routing rationale)

Validator operations how-to → `stellar_docs_mcp` (Tier 1 page). `scout_research` acceptable.

## Edge / traps

Tier 1 is trust-by-quorum-inclusion, not staking and not an SDF application. The 3-validator count and
99.9% uptime are the concrete, citable facts.
