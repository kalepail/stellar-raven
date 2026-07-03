---
id: q-protocol-scp-consensus-algorithm
q: "What consensus algorithm does Stellar use, and how is it different from Proof-of-Work or Proof-of-Stake?"
category: protocol-core
subcategory: consensus-scp
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
  - { claim: "Names the Stellar Consensus Protocol (SCP) as Stellar's consensus mechanism.", weight: 5 }
  - { claim: "States SCP is a construction of Federated Byzantine Agreement (FBA).", weight: 5 }
  - { claim: "Explains FBA reaches agreement via user-defined quorum sets / trusted nodes, NOT mining hashpower (PoW) or staked capital (PoS).", weight: 4 }
should_have:
  - { claim: "Notes there are no monetary/block rewards for running a Stellar validator.", weight: 3 }
  - { claim: "Notes SCP prioritizes safety/fault-tolerance and can halt (favor safety over liveness) rather than fork.", weight: 2 }
nice_to_have:
  - { claim: "Mentions SCP was authored by David Mazières / has an academic whitepaper basis.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar uses Proof-of-Work or mining.", weight: 5 }
  - { claim: "Do NOT claim Stellar uses Proof-of-Stake / staking with validator rewards.", weight: 5 }
  - { claim: "Do NOT call the consensus mechanism 'PBFT', 'Tendermint', 'DPoS', or any non-SCP/non-FBA name.", weight: 4 }
must_cite:
  - "The SCP overview on developers.stellar.org (or the SCP whitepaper / stellar.org SCP page)."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol
  - https://stellar.org/learn/stellar-consensus-protocol
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Foundational fact. The trap is conflating SCP with PoW/PoS or naming a different BFT family."
---

## Reference answer (gospel)

- Stellar uses the **Stellar Consensus Protocol (SCP)**, a construction of **Federated Byzantine Agreement (FBA)** [1][2].
- Unlike Proof-of-Work (mining hashpower) or Proof-of-Stake (staked capital), FBA reaches agreement through **user-defined quorum sets** — each node chooses which other nodes it trusts [1].
- There are **no monetary or block rewards** for running a Stellar validator; participation is not incentivized by staking or mining [1][2].
- SCP favors **safety over liveness**: rather than fork, the network can **halt** until agreement is restored [1].
- SCP was authored by **David Mazières** and is grounded in an academic whitepaper [2].

## Why these cards (routing rationale)

Canonical protocol-concept question → `stellar_docs_mcp` (developers.stellar.org SCP overview) is the
primary source. `scout_research` (which indexes dev-docs + papers) is acceptable corroboration.
General-web / deep-research tiers are wrong on a first-party documented concept.

## Edge / traps

The defining trap is conflating SCP/FBA with Proof-of-Work or Proof-of-Stake, or naming an unrelated
BFT protocol. Validator rewards do not exist on Stellar — an answer asserting staking rewards is wrong.
