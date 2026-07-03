---
id: q-protocol-quorum-slice-vs-quorum
q: "In Stellar's SCP, what is the difference between a quorum slice and a quorum, and what is a quorum set?"
category: protocol-core
subcategory: consensus-scp
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
  - { claim: "Defines a quorum set as the set of other nodes a given node chooses to trust (its configured trust list).", weight: 5 }
  - { claim: "Defines a quorum slice as a threshold-sized subset of a node's quorum set sufficient to convince that node to agree.", weight: 5 }
  - { claim: "Defines a quorum as a set of nodes sufficient to reach network agreement, where each node has a quorum slice in the set.", weight: 4 }
should_have:
  - { claim: "Mentions the threshold (minimum number of trusted nodes that must agree) as part of a quorum set's configuration.", weight: 3 }
  - { claim: "Notes quorums are reached through nodes' overlapping/intersecting slices, enabling open membership.", weight: 2 }
nice_to_have:
  - { claim: "Mentions a node blocking set (a subset that can prevent agreement).", weight: 1 }
must_avoid:
  - { claim: "Do NOT define a quorum slice as the global set of all validators or a fixed network-wide committee.", weight: 4 }
  - { claim: "Do NOT conflate quorum/slice with staking weight or PoS-style voting power.", weight: 4 }
  - { claim: "Do NOT claim quorum sets are assigned by a central authority (each node configures its own).", weight: 3 }
must_cite:
  - "The SCP overview / quorum concepts page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Multi-term definitional question. Trap is swapping slice/quorum definitions or implying a central committee."
---

## Reference answer (gospel)

- **Quorum set**: the set of other nodes a given node chooses to trust — its configured trust list, with a **threshold** (the minimum number of those trusted nodes that must agree) [1].
- **Quorum slice**: a threshold-sized **subset** of a node's quorum set that is sufficient to convince *that* node to agree [1].
- **Quorum**: a set of nodes sufficient to reach **network-wide** agreement, where each node in the set has at least one of its quorum slices contained in the set [1].
- Quorums form through nodes' **overlapping / intersecting slices**, which enables open membership — each node configures its own quorum set, with **no central authority** assigning it [1].
- A **blocking set** is a subset of nodes that can prevent the network from reaching agreement [1].

## Why these cards (routing rationale)

Definitional protocol concept → `stellar_docs_mcp` primary; `scout_research` acceptable. No general-web.

## Edge / traps

Swapping the slice vs quorum definitions, or implying a central/fixed validator committee, is the trap.
Each node configures its own quorum set; the network has open membership.
