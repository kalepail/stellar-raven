---
id: q-protocol-ledger-entry-types
q: "What does a Stellar ledger contain, and what are the entry types stored in ledger state?"
category: protocol-core
subcategory: ledger-data-structures
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
  - { claim: "States a ledger represents the state of the Stellar network at a point in time, shared across all core nodes.", weight: 4 }
  - { claim: "Lists ledger entry types including accounts, trustlines/balances, offers, claimable balances, liquidity pools, and contract data (Soroban storage).", weight: 5 }
should_have:
  - { claim: "Notes each ledger links to the previous ledger via its hash (genesis ledger sequence number is 1, N+1 references N).", weight: 3 }
  - { claim: "Mentions ledger state is summarized by a bucket list hash in the ledger header.", weight: 2 }
nice_to_have:
  - { claim: "Notes accounts are the central data structure holding balances, signers, and sequence numbers.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Stellar state as an EVM-style account-trie / Merkle Patricia trie (that is Ethereum).", weight: 4 }
  - { claim: "Do NOT claim Stellar stores state in UTXOs (that is Bitcoin).", weight: 4 }
must_cite:
  - "The ledgers / data-structures page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/ledgers
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "List-style. Liquidity pools (P18) and contract data (P20) are the modern additions; trap is UTXO/EVM model confusion."
---

## Reference answer (gospel)

A ledger represents the state of the Stellar network at a point in time, shared across all core
nodes [1]. Ledger **entry types** include [1]:

- **accounts** (the central data structure: balances, signers, sequence numbers)
- **trustlines / balances**, **offers**, **claimable balances**
- **liquidity pools** (added Protocol 18) and **contract data** (Soroban storage, added Protocol 20)

Each ledger links to the previous via its hash (genesis sequence = 1, N+1 references N), and the full
state is summarized by a **bucket-list hash** in the header [1]. Stellar is **not** an EVM
account-trie / Merkle Patricia trie (Ethereum) and **not** a UTXO model (Bitcoin) [1].

- [1] developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/ledgers

## Why these cards (routing rationale)

First-party data-structure reference → `stellar_docs_mcp`. `scout_research` acceptable corroboration.

## Edge / traps

Describing Stellar state as UTXOs (Bitcoin) or an EVM account-trie (Ethereum) is wrong; Stellar uses a
typed ledger-entry / bucket-list model.
