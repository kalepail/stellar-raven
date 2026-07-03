---
id: q-org-mazieres-chief-scientist
q: "Who is David Mazières and what is his role at the Stellar Development Foundation?"
category: history-org-tokenomics
subcategory: sdf-org
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [perplexity_search, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "David Mazières is the lead author of the Stellar Consensus Protocol (SCP) paper (2015).", weight: 5 }
  - { claim: "He serves as Chief Scientist at the Stellar Development Foundation.", weight: 4 }
should_have:
  - { claim: "He is a Stanford computer-science professor (distributed systems / security).", weight: 2 }
nice_to_have:
  - { claim: "SCP introduced Federated Byzantine Agreement (FBA).", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Mazières as the founder/CEO of Stellar (the founders are McCaleb and Kim; the CEO is Denelle Dixon).", weight: 4 }
must_cite:
  - "The SDF foundation/leadership page or the SCP paper authorship."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/learn/stellar-consensus-protocol
  - https://stellar.org/foundation/mandate
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Mostly Stellar-own (SDF mandate/leadership page lists Mazières as Chief Scientist; SCP page credits him). Stanford CS professor (distributed systems/security). Verified 2026-06-22."
---

## Reference answer (gospel)

- **David Mazières** is the **lead author of the Stellar Consensus Protocol (SCP) paper (2015)** [1].
- He serves as **Chief Scientist** at the Stellar Development Foundation [2].
- He is a **Stanford computer-science professor** (distributed systems / security) [1].
- SCP introduced **Federated Byzantine Agreement (FBA)** [1].
- Note: Mazières is **not** Stellar's founder or CEO — founders are **McCaleb and Kim**; CEO is **Denelle Dixon** [2].

- [1] stellar.org/learn/stellar-consensus-protocol
- [2] stellar.org/foundation/mandate

## Why these cards (routing rationale)

Mazières's SDF role is listed on the SDF leadership page (Stellar-own) → `scout_research` /
`stellar_docs_mcp`; `perplexity_search` acceptable for the academic bio.

## Edge / traps

Trap: confusing his Chief Scientist role with founder/CEO. Founders = McCaleb/Kim; CEO = Dixon.
