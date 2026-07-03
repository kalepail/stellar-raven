---
id: q-infra-disbursement-platform
q: "What's the Stellar Disbursement Platform for, and how does it differ from the Anchor Platform?"
category: tooling-infra
subcategory: disbursement-platform
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Stellar Disbursement Platform (SDP) is an SDF tool for making bulk payments to many recipients (aid, payroll, airdrops), e.g. by uploading a list of receivers.", weight: 5 }
  - { claim: "SDP is for bulk payouts; the Anchor Platform is for building SEP-aligned anchors/on-off ramps — they are distinct products.", weight: 4 }
should_have:
  - { claim: "SDP routes payments through an anchor and registers/KYCs receivers; it can batch large numbers of payments.", weight: 2 }
nice_to_have:
  - { claim: "SDP is an open-source backend (github.com/stellar/stellar-disbursement-platform-backend).", weight: 1 }
must_avoid:
  - { claim: "Do NOT conflate SDP with the Anchor Platform or describe SDP as a wallet/RPC node.", weight: 4 }
must_cite:
  - "developers.stellar.org Disbursement Platform docs or the SDP backend repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/platforms/stellar-disbursement-platform
  - https://github.com/stellar/stellar-disbursement-platform-backend
  - https://developers.stellar.org/docs/platforms/anchor-platform
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "SDP vs Anchor Platform is the load-bearing distinction. Pairs with q-infra-anchor-platform."
---

## Reference answer (gospel)

The **Stellar Disbursement Platform (SDP)** is an SDF open-source tool for making **bulk payments to a
group of recipients** — upload a list of receivers (CSV) and disburse to all of them (use cases: aid,
payroll, airdrops, gig payouts; SDF advertises up to ~10,000 payments per batch). It registers/KYCs
receivers and routes payouts **through an anchor**. Source:
`github.com/stellar/stellar-disbursement-platform-backend`.

The **Anchor Platform** is a different product: the SEP-aligned **Java SDK anchors use to build
on/off-ramps** (implements SEP-1, SEP-10, SEP-12, SEP-24, SEP-31). It is the server an anchor runs; SDP
is the payout orchestrator that *sits on top of* an anchor. They are **distinct, complementary products** —
not the same thing, and neither is a wallet or an RPC node.

## Why these cards (routing rationale)

Product comparison from first-party docs → `stellar_docs_mcp`; `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Conflating SDP with the Anchor Platform, or describing SDP as a wallet/RPC node, is the trap.
