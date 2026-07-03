---
id: q-protocol-stellar-core-what-is
q: "What is stellar-core, what language is it written in, and how does its version relate to the protocol version?"
category: protocol-core
subcategory: stellar-core
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States stellar-core is the reference C++ implementation of SCP and the Stellar protocol that validators run to reach consensus and apply ledgers.", weight: 5 }
should_have:
  - { claim: "Notes the stellar-core repo is github.com/stellar/stellar-core (open source).", weight: 3 }
  - { claim: "Notes the major release number tracks the protocol version it supports (e.g. stellar-core v26.x → Protocol 26, v27.x → Protocol 27).", weight: 3 }
nice_to_have:
  - { claim: "Notes operators install the matching release (Docker image / .deb) ahead of an upgrade vote.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim stellar-core is written in Rust, Go, or JavaScript (it is C++).", weight: 4 }
  - { claim: "Do NOT confuse stellar-core (the consensus node) with Horizon (the REST API) or Stellar RPC.", weight: 4 }
must_cite:
  - "The stellar-core repo (github.com/stellar/stellar-core) and/or the validators/software-versions docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-core
  - https://developers.stellar.org/docs/networks/software-versions
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "stellar-core = C++ consensus node; version tracks protocol. Trap is wrong language or confusing with Horizon/RPC."
---

## Reference answer (gospel)

stellar-core is the reference **C++** implementation of the Stellar Consensus Protocol (SCP) and the
Stellar protocol — the node software validators run to reach consensus and apply ledgers [1]. It is
open source at github.com/stellar/stellar-core [1]. Its major release number tracks the protocol
version it supports (stellar-core v26.x → Protocol 26, v27.x → Protocol 27) [2]. Operators install the
matching release (Docker image / `.deb`) ahead of an upgrade vote [2]. It is **not** Rust/Go/JS, and is
distinct from Horizon (the REST API) and Stellar RPC [1][2].

- [1] github.com/stellar/stellar-core
- [2] developers.stellar.org/docs/networks/software-versions

## Why these cards (routing rationale)

Implementation fact → `stellar_docs_mcp` + `scout_research` (repo + docs). `perplexity_search` acceptable.

## Edge / traps

Wrong language (it's C++, not Rust/Go) or confusing stellar-core with Horizon/RPC are the traps.
