---
id: q-scf-nqg-voting
q: "How does SCF community voting work — what is Neural Quorum Governance and who can vote?"
category: scf-grants-builders
subcategory: governance-voting
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
  - { claim: "SCF community voting uses Neural Quorum Governance (NQG), a reputation-weighted voting mechanism.", weight: 5 }
  - { claim: "Only SCF Verified Members can vote in the community vote.", weight: 4 }
  - { claim: "NQG combines neural governance (reputation-weighted voting power) with quorum delegation (delegating to trusted quorums).", weight: 3 }
should_have:
  - { claim: "NQG was adopted by SCF in October 2023 and was co-developed with BlockScience.", weight: 2 }
  - { claim: "The community vote applies to the Build Open Track (and the Public Goods Award).", weight: 2 }
nice_to_have:
  - { claim: "Delegate selection cutoff is roughly 1/40 of total NQG voting weight for a track.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe SCF voting as one-token-one-vote / XLM-balance-weighted or open to anyone holding XLM.", weight: 5 }
  - { claim: "Do NOT claim NQG is a token or coin, or that it is the same as Stellar's protocol validator quorum sets (SCP).", weight: 4 }
must_cite:
  - "The SCF handbook Neural Quorum Governance / Verified Members pages."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance"
  - "https://stellar.gitbook.io/scf-handbook/governance/verified-members"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §3. Key trap: NQG (SCF grant governance) vs SCP quorum sets (protocol consensus) — different things despite both saying 'quorum'."
---

## Reference answer (gospel)

- SCF community voting uses **Neural Quorum Governance (NQG)**, a reputation-based (not token-based) voting mechanism powering the Community Vote phase of SCF Build. (https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance)
- NQG combines two parts: **Neural Governance** (modular attribution of voting power from reputation/contribution signals) and **Quorum Delegation** (delegate your vote to a quorum without having to trust any single delegate). (https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance)
- **Only SCF-Verified Members can vote** in the community vote; voting weight is derived from earned reputation, not XLM holdings. (https://stellar.gitbook.io/scf-handbook/governance/verified-members)
- NQG was **ideated, specified, and implemented jointly by BlockScience and SDF**, and has been used for the Community Vote **since October 2023**. (https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance)
- The community vote applies to the **Build Open Track** (brand-new builds — the only Build track with a community vote) and the **Public Goods Award**; Integration and RFP tracks are panel-only. (https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- NQG is **not a token or coin**, and it is **distinct from Stellar's protocol-level SCP quorum sets** (network consensus) despite both using the word "quorum." (https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance)

## Why these cards (routing rationale)

Documented governance mechanics → `scout_research` over the SCF handbook corpus.

## Edge / traps

Traps: token-weighted-voting assumption; or confusing NQG (grant voting) with SCP/quorum-sets
(Stellar consensus). The must_avoid encodes both.
