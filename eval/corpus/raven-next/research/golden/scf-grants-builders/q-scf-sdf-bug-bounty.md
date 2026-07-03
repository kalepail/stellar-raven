---
id: q-scf-sdf-bug-bounty
q: "What does the SDF Bug Bounty pay for a Stellar protocol vulnerability versus a Soroban smart-contract exploit?"
category: scf-grants-builders
subcategory: sdf-grants
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Protocol / core-repository vulnerabilities can pay up to $250,000 in XLM.", weight: 5 }
  - { claim: "Soroban smart-contract exploits pay up to $50,000 (in USD).", weight: 5 }
should_have:
  - { claim: "The Bug Bounty is an SDF-direct program (stellar.org/grants-and-funding), separate from the SCF.", weight: 2 }
nice_to_have:
  - { claim: "Protocol-level bugs pay in XLM at the higher cap; application-level Soroban exploits pay in USD at the lower cap.", weight: 1 }
must_avoid:
  - { claim: "Do NOT swap the two tiers (e.g. claim Soroban exploits pay $250K or protocol bugs pay $50K).", weight: 5 }
  - { claim: "Do NOT confuse the Bug Bounty with the SCF Audit Bank (which pays for audits, not exploit reports).", weight: 4 }
must_cite:
  - "stellar.org/grants-and-funding bug-bounty section."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.org/grants-and-funding"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §5.4. Trap: swapping the $250K-XLM / $50K-USD tiers, or confusing with Audit Bank."
---

## Reference answer (gospel)

- **Protocol / core-repository vulnerabilities** can pay **up to $250,000 in XLM**. (https://stellar.org/grants-and-funding)
- **Soroban smart-contract exploits** pay **up to $50,000, in USD**. (https://stellar.org/grants-and-funding)
- So the higher cap ($250K XLM) is the **protocol/core tier**; the lower cap ($50K USD) is the **application-level Soroban tier** — do not swap them. (https://stellar.org/grants-and-funding)
- The Bug Bounty is an **SDF-direct program** (stellar.org/grants-and-funding), separate from the SCF — and distinct from the **SCF Audit Bank**, which funds audits rather than exploit reports. (https://stellar.org/grants-and-funding)

## Why these cards (routing rationale)

Documented SDF program fact → `scout_research` (or Docs MCP) over Stellar corpora.

## Edge / traps

Trap: swapping the two bounty tiers, or confusing Bug Bounty with Audit Bank.
