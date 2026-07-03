---
id: q-comp-sep8-number-lookup-no-deepresearch
q: "Which SEP number is the Stellar 'Regulated Assets' standard?"
category: compliance-rwa-payments
subcategory: sep8-regulated-assets
axes: [tool-targeted, edge-governance]
query_type: governance-negative
difficulty: easy
freshness_sensitive: false
freshness_horizon: null
expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: [lumenloop_request_research, lumenloop_research_result, parallel_extract]
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Answers SEP-8 is the Regulated Assets standard.", weight: 5 }
should_have:
  - { claim: "Keeps the answer to a direct one-line lookup without spinning up expensive multi-source research.", weight: 2 }
nice_to_have:
  - { claim: "Optionally names the approval-server concept in a clause.", weight: 1 }
must_avoid:
  - { claim: "Do NOT escalate this trivial lookup to a metered deep-research lane (lumenloop_request_research) or general-web deep research.", weight: 5 }
  - { claim: "Do NOT answer the wrong SEP number (e.g. SEP-12 or SEP-10).", weight: 5 }
must_cite:
  - "developers.stellar.org / SEP-0008 spec."
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Governance-negative: a one-fact lookup must NOT over-escalate to deep research / metered tiers. SEP-8 = Regulated Assets (verified vs SEP-0008). Trap: over-escalation + wrong SEP."
---

## Reference answer (gospel)

- **SEP-8 is the "Regulated Assets" standard** [1] — the issuer runs an approval server that co-signs
  compliant transfers.
- This is a **one-line lookup**: answer it directly from the SEP index/spec; do **not** spin up
  multi-source or metered research for a single-fact question.

Source: [1] SEP-0008 (Regulated Assets).

## Why these cards (routing rationale)

Trivial spec lookup → `stellar_docs_mcp` (or `scout_research`). Any deep-research / metered tier firing is a governance failure (over-escalation on a one-fact question).

## Edge / traps

Trap 1: over-escalation to deep-research. Trap 2: wrong SEP number.
