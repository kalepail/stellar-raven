---
id: q-soroban-vuln-classes
q: "What are the most common vulnerability classes auditors find in Soroban smart contracts?"
category: soroban
subcategory: security
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, scout_repos]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Common Soroban vuln classes include unbounded storage growth / Instance-storage DoS, unbounded `Vec`/`Map` input handling, TTL-eviction issues, oracle/replay issues, integer overflow, and missing/incorrect authorization.", weight: 5 }
  - { claim: "These are sourced from Soroban-specific audit checklists (e.g., Veridise) and curated portals (e.g., the Inferara Soroban Security Portal), not generic EVM lists.", weight: 3 }
should_have:
  - { claim: "Notes that classic Ethereum-style reentrancy is largely mitigated by Soroban's host model (no reentry into the same contract).", weight: 3 }
nice_to_have:
  - { claim: "References the SDF Soroban Security Audit Bank as a funding source for audits.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present the Ethereum/Solidity vuln top-list (reentrancy, tx.origin phishing, delegatecall storage collision) as the primary Soroban classes.", weight: 4 }
  - { claim: "Do NOT claim Soroban contracts are immune to all vulnerabilities because they are Rust/Wasm.", weight: 3 }
must_cite:
  - "A Soroban security checklist/portal (Veridise blog, Inferara portal) or SDF security docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://veridise.com/blog/audit-insights/building-on-stellar-soroban-grab-this-security-checklist-to-avoid-vulnerabilities/
  - https://github.com/Inferara/soroban-security-portal
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Routes to scout_research (audit corpus). Trap: pasting the EVM vuln list. Verified against Veridise Soroban checklist + Inferara Soroban Security Portal; reentrancy into the same contract is disallowed by the host."
---

## Reference answer (gospel)

The recurring Soroban-specific audit findings (per Soroban audit checklists, **not** generic EVM lists):

- **Unbounded storage growth / Instance-storage DoS** — Instance storage loads on every call, so an
  unbounded map there can brick the contract once the ledger-entry size limit is hit.
- **Unbounded `Vec`/`Map` input handling** — large/malformed inputs cause conversion failures or DoS;
  validate lengths/types at entry.
- **TTL-eviction issues** — entries expiring/archiving unexpectedly; front-running restores.
- **Oracle / replay issues** — stale or manipulable price feeds, signature/auth reuse.
- **Integer overflow** — use checked arithmetic.
- **Missing / incorrect authorization** — wrong or absent `require_auth` / auth-context confusion.

These come from Soroban-specific compendia like the **Veridise** checklist and the **Inferara Soroban
Security Portal** (and audits funded via the SDF **Soroban Security Audit Bank**).

Note: classic Ethereum-style **reentrancy is largely mitigated** — the host **disallows re-entering the
same contract**. So don't paste the EVM top-list (reentrancy/`tx.origin`/`delegatecall` collisions) as
the primary Soroban classes, and don't claim Rust/Wasm makes contracts immune.

## Why these cards (routing rationale)

Security-corpus discovery → `scout_research`. Docs/repos acceptable secondary.

## Edge / traps

Pasting EVM's reentrancy/tx.origin/delegatecall list; claiming Rust/Wasm = immune.
