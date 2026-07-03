---
id: q-protocol-ledger-header-fields
q: "What fields are in a Stellar ledger header?"
category: protocol-core
subcategory: ledger-data-structures
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Lists core ledger-header fields including the protocol version, the previous-ledger hash, the ledger sequence number, the SCP value, the transaction-set hash, the bucket-list hash, the close time, and the total coins (lumen supply).", weight: 5 }
should_have:
  - { claim: "Notes the Upgrades field carries network-wide parameter/protocol-version changes voted via SCP.", weight: 3 }
  - { claim: "Notes the bucket-list hash summarizes all ledger state objects.", weight: 2 }
nice_to_have:
  - { claim: "Notes the previous-ledger hash is what chains ledger N+1 back to ledger N (genesis = sequence 1).", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent EVM-style header fields (gas limit, miner/coinbase, difficulty, nonce, state root as a Patricia trie).", weight: 4 }
  - { claim: "Do NOT claim the header stores full account balances inline (state is referenced via the bucket-list hash).", weight: 3 }
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
notes: "List of header fields. Trap is importing EVM/PoW header fields (gas, difficulty, nonce, coinbase)."
---

## Reference answer (gospel)

A Stellar ledger header carries [1]:

- **protocol version**, **previous-ledger hash**, **ledger sequence number**
- **SCP value**, **transaction-set hash**, **bucket-list hash**
- **close time**, **total coins** (lumen supply)
- the **Upgrades field** (network-wide parameter / protocol-version changes voted via SCP)

The bucket-list hash summarizes all ledger state objects, and the previous-ledger hash chains ledger
N+1 back to N (genesis = sequence 1) [1]. There are **no** EVM/PoW fields (gas limit, miner/coinbase,
difficulty, nonce, Patricia-trie state root), and full account balances are **not** stored inline —
state is referenced via the bucket-list hash [1].

- [1] developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/ledgers

## Why these cards (routing rationale)

Data-structure reference → `stellar_docs_mcp`; `scout_research` acceptable. No general-web.

## Edge / traps

Importing EVM/PoW header fields (gas limit, difficulty, nonce, coinbase) is the trap; Stellar headers
carry SCP value, bucket-list hash, close time, total coins, and the Upgrades field.
