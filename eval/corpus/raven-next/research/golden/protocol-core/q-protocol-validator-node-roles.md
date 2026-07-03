---
id: q-protocol-validator-node-roles
q: "What are the different node roles you can run on the Stellar network, and what is the difference between a Basic Validator and a Full Validator?"
category: protocol-core
subcategory: validators-topology
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Distinguishes a Watcher (reads the network, does not vote) from a Validator (votes on / signs ledgers).", weight: 4 }
  - { claim: "States the key difference: a Full Validator additionally publishes a public history archive, whereas a Basic Validator does not.", weight: 5 }
should_have:
  - { claim: "Mentions non-consensus node roles such as a Stellar RPC node (state queries / tx simulation) and a Galexie node (bulk ledger data for analytics).", weight: 3 }
  - { claim: "Notes the history archive lets other nodes catch up on history / supports network resilience.", weight: 2 }
nice_to_have:
  - { claim: "Notes running a single Basic or Full Validator is a meaningful decentralization contribution before attempting Tier 1.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Basic and Full Validators differ by staking amount or that validators earn block rewards.", weight: 4 }
  - { claim: "Do NOT claim a Watcher participates in consensus voting.", weight: 3 }
must_cite:
  - "The validators overview on developers.stellar.org/docs/validators."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/validators
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "The Full-vs-Basic distinction is the publish-history-archive bit. Trap is staking/reward framing."
---

## Reference answer (gospel)

- **Watcher**: reads the network but does **not** vote in consensus [1].
- **Validator**: votes on / signs ledgers [1]. The key Basic-vs-Full distinction: a **Full Validator additionally publishes a public history archive**; a **Basic Validator does not** [1].
- The history archive lets other nodes **catch up** on history and supports network **resilience** [1].
- **Non-consensus roles**: a **Stellar RPC node** (state queries / tx simulation) and a **Galexie node** (bulk ledger data for analytics) [1].
- Running even a single Basic or Full Validator is a meaningful **decentralization contribution** before attempting Tier 1. There is **no staking and no block rewards** — Basic vs Full is not a stake-size difference [1].

## Why these cards (routing rationale)

Operational docs question → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

The defining distinction is the public history archive (Full publishes, Basic does not), NOT a staking
amount or rewards. Watchers do not vote.
