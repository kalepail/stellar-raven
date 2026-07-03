---
id: q-soroban-audit-bank
q: "Is there a program that funds security audits for Soroban projects, and how do I get an audit?"
category: soroban
subcategory: security
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "The SDF runs a Soroban Security Audit Bank that subsidizes/funds professional audits for Soroban projects.", weight: 5 }
  - { claim: "Projects apply per the Audit Bank's official rules (part of the SCF / community-fund programs) to get matched with an approved auditor.", weight: 3 }
should_have:
  - { claim: "As of 2025 the program had funded tens of audits (40+) with several million dollars ($3M+) deployed.", weight: 2 }
nice_to_have:
  - { claim: "Notes complementary tooling (OpenZeppelin Soroban security detector, fuzzers) to run before requesting an audit.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim there is no audit-funding program for Soroban.", weight: 3 }
  - { claim: "Do NOT confuse the Audit Bank with a generic SCF build grant (it is a dedicated security program).", weight: 2 }
must_cite:
  - "The SDF Audit Bank blog/announcement or the SCF handbook Audit Bank rules."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/soroban-security-audit-bank-raising-the-standard-for-smart-contract-security
  - https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank/official-rules
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "SDF-run Soroban Security Audit Bank; 40+ audits and >$3M deployed (since launch, per the SDF blog). Apply via SCF/Audit Bank official rules; matched to an audit firm typically within ~2 weeks. Verified against the SDF announcement."
---

## Reference answer (gospel)

Yes. The **Stellar Development Foundation runs the Soroban Security Audit Bank**, which funds/subsidizes
professional security audits for Soroban projects before they launch. [sdf]

- **How to get one** — it is a dedicated **SCF supporting program**: eligible (typically
  SCF-funded/criteria-meeting) projects request an audit per the **Audit Bank official rules** and are
  **matched with a reputable audit firm (typically within ~2 weeks)**; contact
  `communityfund@stellar.org`. [sdf][rules]
- **Scale** — the program has funded **40+ audits** with **over $3M deployed** since launch; 2025 added
  a small refundable co-payment, subsidized tooling, and follow-up audits at TVL milestones. [sdf]
- **Before requesting an audit**, run complementary tooling (OpenZeppelin's Soroban security detector,
  fuzzers like proptest/arbitrary) to shake out the obvious issues.

Traps: claiming there is **no** audit-funding program for Soroban; or conflating the Audit Bank with a
generic SCF **build grant** — it is a dedicated security program.

## Why these cards (routing rationale)

Program discovery over the SCF/security corpus → `scout_research`. Docs acceptable.

## Edge / traps

Claiming no program exists; conflating with a generic build grant.
