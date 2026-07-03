---
id: q-soroban-instance-storage-dos
q: "Why is storing a growing per-user map in Instance storage a denial-of-service risk in Soroban?"
category: soroban
subcategory: storage-ttl
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, scout_repos]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Instance storage is deserialized/loaded on EVERY contract invocation, so an unbounded-growing Instance map makes every call more expensive until it hits the ledger-entry size limit and bricks the contract.", weight: 5 }
  - { claim: "The fix is to put per-user/unbounded data in Persistent storage keyed per-user, reserving Instance for small fixed config.", weight: 4 }
should_have:
  - { claim: "This is a recognized Soroban vulnerability class (Instance-storage DoS / unbounded storage growth) in audit checklists.", weight: 3 }
nice_to_have:
  - { claim: "Notes a single Persistent key accumulating unbounded array entries has a similar blowup risk and should be sharded.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Instance storage is loaded lazily/only-when-accessed like Persistent (it is loaded every call).", weight: 5 }
  - { claim: "Do NOT frame this primarily as a reentrancy bug (it is a storage-growth/DoS class).", weight: 3 }
must_cite:
  - "A Soroban security checklist (e.g., Veridise) or developers.stellar.org storage guidance."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
  - https://veridise.com/blog/audit-insights/building-on-stellar-soroban-grab-this-security-checklist-to-avoid-vulnerabilities/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Routes to scout_research (security corpus). Instance = whole instance entry loaded per call; verified against the storage/state-archival semantics. Trap: thinking Instance loads lazily."
---

## Reference answer (gospel)

Instance storage is bundled into the **contract-instance ledger entry**, which the host
**loads/deserializes on every single invocation** of the contract (it shares the instance's TTL and
travels with it). A per-user map that grows without bound therefore:

1. Makes **every call** progressively more expensive (more bytes read + deserialized each invocation).
2. Eventually pushes the instance entry past the **ledger-entry size limit**, at which point the
   contract can no longer be invoked at all — a **permanent DoS / brick**. [archival]

**Fix:** keep Instance for small, fixed config only; put unbounded/per-user data in **Persistent**
storage keyed per user (loaded on demand per footprint, not every call). A single Persistent key
accumulating unbounded array entries has the same blowup risk and should be sharded. This is a
recognized Soroban audit vulnerability class (unbounded/Instance-storage growth). [veridise]

Traps: believing Instance loads lazily like Persistent (it does not), or misclassifying this as a
reentrancy bug — it is a storage-growth/DoS class.

## Why these cards (routing rationale)

Security/vuln-class question grounded in the audit corpus → `scout_research`. Docs/repos acceptable secondary.

## Edge / traps

Believing Instance loads lazily; misclassifying as reentrancy instead of storage-growth DoS.
