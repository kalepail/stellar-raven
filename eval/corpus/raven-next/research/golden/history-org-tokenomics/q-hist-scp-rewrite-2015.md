---
id: q-hist-scp-rewrite-2015
q: "What was the 2015 Stellar Consensus Protocol rewrite, who authored it, and why did Stellar replace its original consensus?"
category: history-org-tokenomics
subcategory: scp-rewrite
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "In 2015 Stellar adopted the Stellar Consensus Protocol (SCP), authored by David Mazières.", weight: 5 }
  - { claim: "SCP introduced Federated Byzantine Agreement (FBA), where each node chooses its own quorum slices.", weight: 4 }
should_have:
  - { claim: "The SCP whitepaper ('A Federated Model for Internet-Level Consensus') was published in April 2015.", weight: 3 }
  - { claim: "The rewrite replaced Stellar's earlier (Ripple-derived) consensus, which had had a fork/ledger-divergence problem.", weight: 2 }
nice_to_have:
  - { claim: "The redesigned SCP-based network went live around November 2015.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute SCP to the wrong author (e.g. Jed McCaleb alone, or Satoshi/Buterin) — it was David Mazières.", weight: 4 }
  - { claim: "Do NOT describe SCP as Proof-of-Work or Proof-of-Stake — it is Federated Byzantine Agreement, not PoW/PoS.", weight: 5 }
  - { claim: "Do NOT give a wrong year for the SCP paper (e.g. 2014 or 2017) — it was 2015.", weight: 3 }
must_cite:
  - "The SCP whitepaper or developers.stellar.org consensus docs."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/learn/stellar-consensus-protocol
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Mixed-sourced: SCP paper is Stellar-own (stellar.org/learn/stellar-consensus-protocol); the April-2015 paper / Nov-2015 live timeline is Wikipedia. Mazières is SDF Chief Scientist. Verified 2026-06-22."
---

## Reference answer (gospel)

- In **2015** Stellar replaced its original consensus with the **Stellar Consensus Protocol (SCP)**, authored by **David Mazières** [1][2].
- SCP introduced **Federated Byzantine Agreement (FBA)** — each node chooses its own quorum slices (open membership), rather than a closed/voted validator set [1].
- The rewrite was prompted because Stellar's earlier consensus (derived from the Ripple protocol) had suffered a **ledger-fork / divergence problem** [2].
- The SCP whitepaper ("A Federated Model for Internet-Level Consensus") appeared in **April 2015**; the redesigned SCP-based network went live around **November 2015** [2].
- SCP is **not** Proof-of-Work or Proof-of-Stake — it is FBA [1].

- [1] stellar.org/learn/stellar-consensus-protocol
- [2] en.wikipedia.org/wiki/Stellar_(payment_network)

## Why these cards (routing rationale)

The SCP paper and consensus design are first-party Stellar knowledge → `scout_research` (research/
papers corpus) and `stellar_docs_mcp`. `perplexity_search` is acceptable for the dated timeline.

## Edge / traps

Traps: wrong author, calling SCP PoW/PoS (it is FBA), or the wrong year (2015).
