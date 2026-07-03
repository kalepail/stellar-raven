---
id: q-sor-doc-timestamping-manage-data
q: "How do I anchor a document's SHA-256 hash on Stellar for tamper-proof timestamping (Manage Data op + its size/reserve limits, or a Soroban contract, optionally with IPFS) while keeping the file off-chain?"
category: soroban
subcategory: soroban-development
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Recommends storing only a hash/commitment on Stellar and keeping the full file off-chain, optionally with IPFS/content-addressed storage.", weight: 5 }
  - { claim: "Explains Manage Data can store a key/value on an account, with data name up to 64 bytes and value up to 64 bytes, enough for a 32-byte SHA-256 digest or digest plus compact metadata.", weight: 5 }
  - { claim: "Mentions each Manage Data entry is an account subentry, increases minimum balance by one base reserve, and accounts have a subentry limit.", weight: 4 }
  - { claim: "Explains verification: later hash the file bytes the same way, compare to the on-chain value, and use ledger/transaction close time as the timestamp evidence.", weight: 4 }
  - { claim: "Contrasts when to use Soroban instead: multiple documents, access control, events, revocation/versioning, or richer attestations; do not put large file bytes in contract storage.", weight: 4 }
should_have:
  - { claim: "Mentions memo hash is another 32-byte transaction-level option but not persistent account data like Manage Data.", weight: 2 }
  - { claim: "Warns to canonicalize file bytes and metadata before hashing.", weight: 2 }
nice_to_have:
  - { claim: "Mentions deleting a Manage Data entry removes it but historical ledger archives still show the past transaction if archived/indexed.", weight: 1 }
must_avoid:
  - { claim: "Do not store the full document on-chain.", weight: 5 }
  - { claim: "Do not claim Manage Data values can exceed 64 bytes.", weight: 5 }
  - { claim: "Do not ignore the reserve/subentry cost of adding account data.", weight: 4 }
must_cite:
  - "Must cite official Manage Data operation docs and account reserve/subentry docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#manage-data
  - https://developers.stellar.org/docs/tools/cli/cookbook/tx-new#manage-data
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts#subentries
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions#memo
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified with Stellar Docs MCP. This is categorized under soroban by the batch, but the primary answer is classic Manage Data; Soroban is the richer optional design."
---

## Reference answer (gospel)

Keep the file off-chain. Hash the exact file bytes with SHA-256 and store only the digest, plus any
small metadata needed to find the off-chain file (for example an IPFS CID elsewhere, or a compact
pointer if it fits). Manage Data is a good simple anchor because Stellar docs specify a data entry name
up to 64 bytes and a value up to 64 bytes
(https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#manage-data,
https://developers.stellar.org/docs/tools/cli/cookbook/tx-new#manage-data). A raw SHA-256 digest is
32 bytes, so it fits comfortably.

Remember the reserve model: account data entries are subentries, each new subentry increases the
account minimum balance by one base reserve, and accounts have a 1,000-subentry limit
(https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts#subentries).
If the account lacks reserve, Manage Data can fail with a low-reserve result.

Verification later is deterministic: fetch the on-chain data entry or historical transaction, hash the
candidate document bytes the same way, compare the digest, and use the transaction/ledger close time
as the timestamp evidence. A `MEMO_HASH` is another 32-byte transaction-level anchor, but it is not a
persistent named account data entry
(https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions#memo).

Use a Soroban contract instead when you need a registry for many documents, access control, update or
revocation logic, emitted events, fees, or richer attestations. Even then, store hashes/pointers, not
large document bytes.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is primarily an official operations/reserve-limit answer.
Scout/repo search is acceptable for examples or ecosystem tooling, but the hard limits come from
Stellar docs.

## Edge / traps

Do not put full files on-chain. Do not claim Manage Data can hold arbitrary JSON; both name and value
are capped at 64 bytes. Do not omit reserve/subentry effects, because a timestamping design that adds
one data entry per document can run into minimum-balance and subentry limits quickly.
