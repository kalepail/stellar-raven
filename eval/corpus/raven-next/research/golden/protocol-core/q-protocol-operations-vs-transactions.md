---
id: q-protocol-operations-vs-transactions
q: "What is the relationship between operations and transactions on Stellar?"
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
  - { claim: "States operations are individual commands that modify the ledger (e.g. payment, create account, invoke contract, manage offer).", weight: 5 }
  - { claim: "States a transaction bundles one or more operations and is the signed unit submitted to the network.", weight: 5 }
should_have:
  - { claim: "Notes a transaction carries a source account, sequence number, and fee, and operations execute atomically (all-or-nothing).", weight: 3 }
  - { claim: "Mentions the per-transaction operation limit / that operations share the transaction's authorization.", weight: 2 }
nice_to_have:
  - { claim: "Notes each operation can optionally have its own source account.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invert the relationship (claim a transaction is a single operation type or that operations contain transactions).", weight: 4 }
  - { claim: "Do NOT claim operations are independently signed/submitted units rather than being bundled in a transaction.", weight: 3 }
must_cite:
  - "The operations-and-transactions page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Foundational fundamentals fact. Trap is inverting the containment relationship."
---

## Reference answer (gospel)

**Operations** are individual commands that modify the ledger (payment, create account, invoke
contract, manage offer) [1]. A **transaction** bundles one or more operations and is the **signed unit**
submitted to the network [1]. The transaction carries a source account, sequence number, and fee, and
its operations execute **atomically** (all-or-nothing) [1]. There is a per-transaction operation limit,
and operations share the transaction's authorization, though each operation can optionally have its own
source account [1]. The containment is **operations ⊂ transaction** — operations are not independently
signed/submitted units [1].

- [1] developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions

## Why these cards (routing rationale)

Fundamentals concept → `stellar_docs_mcp` primary; `scout_research` acceptable.

## Edge / traps

Inverting operations ⊂ transaction (claiming a transaction is one operation, or operations contain
transactions) is the trap. Operations execute atomically within their transaction.
