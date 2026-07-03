---
id: q-protocol-state-archival-ttl
q: "How does Stellar's state archival and TTL model work for Soroban contract data, and why does it exist?"
category: protocol-core
subcategory: state-archival-ttl
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains Soroban contract storage entries have a TTL (time-to-live, in ledgers); when TTL expires the entry is archived rather than kept live, and must be restored before use.", weight: 5 }
  - { claim: "Explains the purpose: state archival bounds the size of live state so validators don't pay forever to host unused data (sustainable state growth / rent model).", weight: 4 }
should_have:
  - { claim: "Notes the storage durability tiers (Temporary vs Persistent vs Instance) behave differently — temporary entries are deleted on expiry, persistent/instance can be restored.", weight: 3 }
  - { claim: "Notes TTL can be extended (bumped) via host functions / extend-TTL operations (CAP-0053).", weight: 2 }
nice_to_have:
  - { claim: "Notes Protocol 23 (Whisk) introduced live-vs-archival state separation (CAP-0062) to support this at scale.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroban contract data lives forever for free with no TTL/rent.", weight: 4 }
  - { claim: "Do NOT claim expired persistent entries are permanently destroyed and unrecoverable (they are archived and restorable; only Temporary entries are deleted).", weight: 4 }
must_cite:
  - "The Soroban state archival / TTL docs on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "State archival/TTL subtopic. Traps: 'storage is free forever' and 'expired persistent data is destroyed' (it's archived/restorable)."
---

## Reference answer (gospel)

- Soroban contract storage entries have a **TTL (time-to-live, in ledgers)**; when the TTL expires the entry is **archived** rather than kept live and must be **restored before use** [1].
- Purpose: state archival bounds the size of live state so validators don't pay forever to host unused data (sustainable state growth / rent model) [1].
- Durability tiers behave differently: **Temporary** entries are **deleted** on expiry; **Persistent** and **Instance** entries can be **restored** [1].
- TTL can be extended (bumped) via host functions / extend-TTL operations (CAP-0053) [1].
- Protocol 23 (Whisk) introduced live-vs-archival state separation (CAP-0062) to support this at scale [1].

## Why these cards (routing rationale)

Soroban storage mechanics → `stellar_docs_mcp` (state archival docs) + `scout_research`. No deep-research.

## Edge / traps

Two traps: claiming storage is free/permanent, and claiming expired persistent entries are destroyed.
Persistent/Instance entries are archived and restorable; only Temporary entries are deleted on expiry.
