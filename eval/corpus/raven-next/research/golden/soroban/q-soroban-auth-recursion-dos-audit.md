---
id: q-soroban-auth-recursion-dos-audit
q: "Did Soroban's core auth ever have a critical authorization-recursion DoS finding in an audit, and was it actually exploitable?"
category: soroban
subcategory: security
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, parallel_extract]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Identifies the Veridise Stellar Soroban Core audit as the source.", weight: 5 }
  - { claim: "Names the finding as Denial of Service During Authorization / authorization-recursion involving `check_auth`, `require_auth`, and `require_auth_enforcing()`.", weight: 5 }
  - { claim: "Reports the listed severity as Critical and status as Investigated.", weight: 4 }
  - { claim: "Explains the invalid/not-worthwhile nuance: recursive authorization attempts are finite/linear or costly, so this should not be presented as a confirmed exploitable live reentrancy hole.", weight: 5 }
should_have:
  - { claim: "Connects the finding to Soroban's contract-auth model rather than generic EVM reentrancy.", weight: 2 }
nice_to_have:
  - { claim: "Mentions the V2.1 report moved intended behavior / invalid issues into an appendix.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroban has a confirmed exploitable critical reentrancy bug from this finding.", weight: 5 }
  - { claim: "Do NOT omit the invalid/not-exploitable rationale after naming the Critical severity.", weight: 5 }
  - { claim: "Do NOT name the wrong auditor or fabricate a CVE.", weight: 4 }
must_cite:
  - "The Veridise Stellar Soroban Core audit record from Soroban Security Portal / Scout research."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://sorobansecurity.com/report/28
  - https://sorobansecurity.com/report/42
status: answered
authored: { phase1: 2026-06-25, phase2: 2026-06-25, reviewed: null }
confidence: high
notes: "Added from theboycoder/StellarLight data-layer intake. Verified 2026-06-25 via Scout research audit corpus: Veridise Stellar Soroban Core report V-SOR-VUL-002 / Denial of Service During Authorization, severity Critical, file rs-soroban-env/src/auth.rs, location require_auth_enforcing(), status Investigated; V2.1 report explains why invalid: Err propagation makes iterations linear in trackers and many trackers are costly."
---

## Reference answer (gospel)

Yes, but the important nuance is that it should **not** be reported as a confirmed exploitable
Soroban reentrancy hole.

The source is the **Veridise Stellar Soroban Core** audit. It lists **V-SOR-VUL-002: Denial of
Service During Authorization** with **Severity: Critical**, **Type: Denial of Service**, **Status:
Investigated**, file `rs-soroban-env/src/auth.rs`, location `require_auth_enforcing()`. [1]

The issue concerns a contract-auth pattern where a contract's `check_auth` calls `require_auth` on
its own address, causing repeated `require_auth_enforcing()` authorization checks. The V2.1 report's
"Why Invalid" explanation says failed `require_auth` calls propagate an `Err`, making the number of
iterations linear in the number of trackers; constructing many trackers is costly, so the attack is
not worthwhile in practice. [2]

The correct answer therefore says: **Veridise found and investigated a Critical authorization-recursion
DoS concern, but the finding was treated as invalid / not a practical exploit**, and it is not evidence
that Soroban has Ethereum-style exploitable reentrancy.

Sources: [1] Veridise Stellar Soroban Core report; [2] Veridise Soroban Core V2.1 report appendix.

## Why these cards (routing rationale)

This is a security-audit-corpus lookup. `scout_research` is primary because Scout indexes Soroban
Security Portal audit records. `parallel_extract` is acceptable if the report URL must be deep-read.

## Edge / traps

The trap is stopping at "Critical" and omitting that Veridise marked the issue invalid/not practical.
