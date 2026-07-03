---
id: q-protocol-cap-vs-sep
q: "What's the difference between a CAP and a SEP on Stellar?"
category: protocol-core
subcategory: upgrade-governance
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States a CAP is a Core Advancement Proposal — a change to the core protocol (consensus, ledger, operations) activated by validator votes.", weight: 5 }
  - { claim: "States a SEP is a Stellar Ecosystem Proposal — a standard for ecosystem interoperability (e.g. anchors, wallets, stellar.toml) that does NOT change the protocol.", weight: 5 }
should_have:
  - { claim: "Notes both live in the github.com/stellar/stellar-protocol repo (core/ for CAPs, ecosystem/ for SEPs).", weight: 2 }
nice_to_have:
  - { claim: "Gives examples (CAP-0046 = Soroban; SEP-24 = interactive anchor deposit/withdraw).", weight: 1 }
must_avoid:
  - { claim: "Do NOT swap the definitions (calling a CAP an ecosystem proposal or a SEP a core/protocol change).", weight: 5 }
  - { claim: "Do NOT claim SEPs are activated by validator protocol votes.", weight: 3 }
must_cite:
  - "The stellar/stellar-protocol repo README (core/ and ecosystem/) and/or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol
  - https://developers.stellar.org/docs/learn/glossary
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "CAP=core protocol (validator vote); SEP=ecosystem standard (no protocol change). Trap is swapping them."
---

## Reference answer (gospel)

- A **CAP** (Core Advancement Proposal) is a change to the **core protocol** — consensus, ledger,
  operations — activated by **validator votes** [1][2].
- A **SEP** (Stellar Ecosystem Proposal) is a standard for **ecosystem interoperability** (anchors,
  wallets, `stellar.toml`) that does **NOT** change the protocol [1][2].
- Both live in the github.com/stellar/stellar-protocol repo (`core/` for CAPs, `ecosystem/` for
  SEPs) [1]. Examples: CAP-0046 = Soroban; SEP-24 = interactive anchor deposit/withdraw [1].

- [1] github.com/stellar/stellar-protocol
- [2] developers.stellar.org/docs/learn/glossary

## Why these cards (routing rationale)

Definitional comparison → `stellar_docs_mcp` + `scout_research`. `perplexity_search` acceptable. No deep-research.

## Edge / traps

Swapping the definitions (CAP=ecosystem / SEP=core) is the defining trap.
