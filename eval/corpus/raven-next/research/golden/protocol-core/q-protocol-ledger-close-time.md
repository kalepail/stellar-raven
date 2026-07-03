---
id: q-protocol-ledger-close-time
q: "How often does the Stellar network close a ledger?"
category: protocol-core
subcategory: ledger-data-structures
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
  - { claim: "States Stellar closes a new ledger approximately every 3-5 seconds (roughly 5 seconds on average).", weight: 5 }
should_have:
  - { claim: "Notes the close time is set by the proposing validator and recorded in the ledger header, and that SCP determines the agreed close time.", weight: 2 }
nice_to_have:
  - { claim: "Notes ledger timing config became dynamically adjustable in recent protocols (e.g. CAP-0070 in Whisk).", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a wildly wrong close time (e.g. '10 minutes' like Bitcoin or '12 seconds' like Ethereum or 'sub-second').", weight: 5 }
must_cite:
  - "The validators / fundamentals docs on developers.stellar.org (or the network dashboard)."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/validators
  - https://dashboard.stellar.org/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "~3-5s ledger close. Trap is importing Bitcoin (10 min) or Ethereum (12s) block times."
---

## Reference answer (gospel)

- Stellar closes a new ledger approximately **every 3-5 seconds (~5 seconds on average)** [1][2].
- The close time is set by the proposing validator and recorded in the ledger header; SCP determines the agreed close time [1].
- Ledger timing config became dynamically adjustable in recent protocols (CAP-0070 in Whisk/P23) [1].

## Why these cards (routing rationale)

Simple network fact → `stellar_docs_mcp`; `scout_research` acceptable. No general-web/deep-research.

## Edge / traps

Importing another chain's block time (Bitcoin 10 min, Ethereum 12s) is the trap. Stellar is ~3-5 seconds.
