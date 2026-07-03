---
id: q-protocol-cap-process
q: "How does a Core Advancement Proposal (CAP) move from idea to activated protocol change on Stellar?"
category: protocol-core
subcategory: upgrade-governance
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains a CAP is a Core Advancement Proposal, submitted as a markdown file via PR to the stellar/stellar-protocol repo (core/ directory).", weight: 4 }
  - { claim: "Describes the CAP status lifecycle: Draft → Awaiting Decision → FCP (Final Comment Period) → Accepted → Implemented → Final.", weight: 5 }
  - { claim: "States validators ultimately activate the change by voting via SCP at a scheduled time, flipping the protocol version (a CAP becomes Final once accepted by a majority of validators).", weight: 4 }
should_have:
  - { claim: "Notes the CAP Core Team deliberates (up to ~3 meetings) before a ~1-week Final Comment Period.", weight: 3 }
  - { claim: "Distinguishes CAPs (Core/protocol) from SEPs (Stellar Ecosystem Proposals).", weight: 2 }
nice_to_have:
  - { claim: "Mentions the validator arming command (upgrades?mode=set&upgradetime=...&protocolversion=N) as the activation mechanism.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim CAPs are activated by an XLM token-holder / coin vote or by an SDF unilateral decision.", weight: 5 }
  - { claim: "Do NOT confuse CAPs with SEPs (ecosystem proposals) as the protocol-change vehicle.", weight: 3 }
must_cite:
  - "The CAP process docs: stellar/stellar-protocol core/README.md (and/or developers.stellar.org governance material)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/README.md
  - https://github.com/stellar/stellar-protocol
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Governance how-to. Trap is token-holder/coin voting (Stellar uses validator SCP voting) or CAP/SEP confusion."
---

## Reference answer (gospel)

A **CAP** (Core Advancement Proposal) is submitted as a markdown file via PR to the
`core/` directory of the stellar/stellar-protocol repo [1]. It moves through a status lifecycle:
**Draft → Awaiting Decision → FCP (Final Comment Period) → Accepted → Implemented → Final** [1]. The
CAP Core Team deliberates (up to ~3 meetings) before a ~1-week Final Comment Period [1]. Validators
ultimately activate the change by voting via SCP at a scheduled time, flipping the protocol version —
a CAP becomes Final once accepted by a majority of validators (the on-chain activation uses the
validator arming command `upgrades?mode=set&upgradetime=...&protocolversion=N`) [1]. CAPs
(core/protocol) are distinct from **SEPs** (Stellar Ecosystem Proposals) [2]. This is **not** a
token-holder/coin vote and **not** a unilateral SDF decision [1].

- [1] github.com/stellar/stellar-protocol/blob/master/core/README.md
- [2] github.com/stellar/stellar-protocol

## Why these cards (routing rationale)

Governance process → `stellar_docs_mcp` + `scout_research` (the CAP repo README). `perplexity_search`
acceptable. Deep-research is overkill.

## Edge / traps

The big trap is claiming token-holder/coin voting; protocol changes are activated by validator SCP votes.
The second trap is CAP↔SEP confusion.
