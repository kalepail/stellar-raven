---
id: q-pc-bucketlist-vs-merkle-inclusion-proof
q: "Stellar uses a Bucket List, not a classic Merkle tree. How do I cryptographically prove a transaction is in a ledger, and what are tx_set_hash and tx-set-result-hash?"
category: protocol-core
subcategory: ledger-history-proofs
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains Bucket List is for ledger state/history structure and is not the same as an Ethereum-style Merkle Patricia proof for arbitrary transaction inclusion.", weight: 5 }
  - { claim: "Explains transaction inclusion is tied to ledger header hashes such as tx_set_hash and transaction result hash plus archived ledger data.", weight: 5 }
  - { claim: "Points to Stellar history archives/ledger headers/XDR for verification rather than claiming a simple Merkle proof API.", weight: 4 }
should_have:
  - { claim: "Mentions limitations of light-client proof support if applicable after verification.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT claim Stellar has classic per-transaction Merkle proofs identical to Bitcoin/Ethereum.", weight: 5 }
  - { claim: "Do NOT confuse ledger-entry state proofs with transaction inclusion proofs.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/ledgers
  - https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk/developer_guide/ledgerbackends#ledgerclosemeta-structure
  - https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk/developer_guide/ledgerreaders
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Verified ledger-header/hash fields against official docs. Phase 3 should scrutinize whether any current light-client or archive tooling exposes a concise transaction-inclusion proof API; Phase 2 found official docs for history/archive verification, not a simple Ethereum-style Merkle proof endpoint."
---

## Reference answer (gospel)

Stellar's Bucket List is the authenticated structure for ledger state snapshots, reflected in the ledger header's `bucketListHash`; it is not an Ethereum-style API for arbitrary per-transaction Merkle Patricia proofs [1]. Transaction inclusion is anchored through ledger data: the ledger header stores the SCP value, `txSetHash` (hash of the transaction set applied to the previous ledger), and `txSetResultHash` (hash of applying that transaction set) [1]. Indexers/validators read `LedgerCloseMeta`, which includes the ledger header, transaction set, transaction-processing results, upgrades, SCP info, and evicted keys [2]. So the defensible answer is: verify against signed/archived Stellar ledger history, ledger headers, transaction set/result XDR, and Horizon/RPC/indexer records; do not promise a one-call Bitcoin/Ethereum-style Merkle transaction proof unless a specific proof system/tool is named and cited.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because official ledger-structure and ingest/history docs define the fields. Scout is acceptable for protocol background, but official docs should carry the hash-field semantics.

## Edge / traps

The trap is conflating state authentication (`bucketListHash`) with a transaction-inclusion Merkle branch. Another trap is saying `txSetHash` alone proves a transaction succeeded; result verification also depends on result/meta data such as `txSetResultHash` and archived transaction processing records.
