---
id: q-edge-validators-reverse-tx-fork-detection
q: Can Stellar validators erase or reverse a confirmed transaction, could a chain be secretly hard-forked, and how would I detect a fork?
category: edge-governance
subcategory: conceptual-skeptic
axes:
  - edge-governance
  - ecosystem-spectrum
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null
expected_cards:
  - stellar_docs_mcp
acceptable_cards:
  - scout_research
forbidden_cards: []
expected_service: stellar_docs
should_fire: true
must_have:
  - claim: "Explains that Stellar consensus finalizes ledgers; validators do not have a normal mechanism to erase a confirmed transaction."
    weight: 5
  - claim: "Distinguishes protocol/network fork risks from custodial/exchange reversals or issuer clawback of certain assets."
    weight: 4
  - claim: "Mentions detection through comparing trusted Horizon/RPC/core nodes, ledger hashes, history archives, or validator/network status."
    weight: 4
should_have:
  - claim: "Explains quorum/intersection assumptions and why validator configuration matters."
    weight: 3
nice_to_have: []
must_avoid:
  - claim: "Do NOT say SDF or validators can casually reverse native XLM payments after confirmation."
    weight: 5
  - claim: "Do NOT claim forks are impossible without explaining trust/quorum assumptions."
    weight: 4
must_cite:
  - At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository.
must_not_use_tier: []
pass_threshold: 0.75
weight_profile: standard
sources:
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/transaction-lifecycle
  - https://stellar.org/learn/stellar-consensus-protocol
  - https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk/developer_guide/ledgerreaders
  - https://developers.stellar.org/docs/validators/admin-guide/prerequisites#buckets
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: high
notes: Verified 2026-06-29 against official transaction lifecycle, SCP, and history/archive documentation.
---

## Reference answer (gospel)

A confirmed Stellar transaction is included in a closed ledger through Stellar Core consensus; validators do not have a normal user-facing mechanism to erase or reverse it after confirmation. That differs from exchange/custodian account adjustments and from issuer-level controls such as clawback for certain issued assets. Native XLM payments should not be described as casually reversible by SDF or validators.

A fork or network split is a protocol/trust risk, not impossible by magic. It depends on quorum-slice configuration and quorum intersection assumptions under SCP. Detection means comparing independent trusted Horizon/RPC/Core nodes, ledger sequence and hashes, history archives/checkpoints, and validator/network status. Official ingest docs describe reading transaction sets and ledger changes from LedgerCloseMeta and reconstructing state from history archive checkpoints; validator docs describe bucket/history archive data used by Stellar Core.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because finality, transaction lifecycle, history archives, and validators are core protocol-docs topics. `scout_research` is acceptable for SCP background.

## Edge / traps

Avoid both extremes: it is wrong to say validators can casually reverse confirmed transactions, and also wrong to say forks are impossible without discussing quorum/trust assumptions and independent verification.
