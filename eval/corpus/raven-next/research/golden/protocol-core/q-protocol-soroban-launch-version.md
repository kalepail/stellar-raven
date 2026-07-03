---
id: q-protocol-soroban-launch-version
q: "Which protocol version brought Soroban smart contracts to Stellar Mainnet, and how were they specified in the CAP process?"
category: protocol-core
subcategory: protocol-version-history
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
  - { claim: "States Soroban went live on Mainnet with Protocol 20 (activated 2024-02-20).", weight: 5 }
  - { claim: "States Soroban was specified as the multi-part CAP-0046 series (CAP-0046-01 through CAP-0046-12), not a single CAP.", weight: 4 }
should_have:
  - { claim: "Notes the series spanned Wasm smart contracts, host functions, asset interop, fee/resource metering, the authorization framework, and the state-archival interface.", weight: 3 }
nice_to_have:
  - { claim: "Notes the phased rollout (Testnet → Futurenet → Mainnet vote).", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute Soroban's launch to Protocol 19, 21, 22, or 23.", weight: 5 }
  - { claim: "Do NOT claim Soroban was a single CAP or attribute it to CAP-0059 / CAP-0063.", weight: 4 }
  - { claim: "Do NOT claim Soroban contracts are EVM/Solidity-based (they are Wasm).", weight: 3 }
must_cite:
  - "The Protocol 20 upgrade material and/or the CAP-0046 series in stellar/stellar-protocol."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/protocol-20-and-smart-contracts-are-live-on-mainnet
  - https://stellar.org/blog/developers/protocol-21-upgrade-guide
  - https://github.com/stellar/stellar-protocol/tree/master/core
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "VERIFIED: P20 Mainnet vote 2024-02-20 17:00 UTC (stellar.org 'Protocol 20 and smart contracts are live on mainnet' + P21 upgrade guide). 2024-03-19 is a SEPARATE event — Soroban 'opened for business' (capacity raised for general deployment per SDF Q1-2024 report), NOT the activation. The dossier table's '2024-03-19 network vote' is wrong; use 2024-02-20. Trap is wrong version or single-CAP / EVM claim."
---

## Reference answer (gospel)

Soroban smart contracts went live on Stellar **Mainnet with Protocol 20**, activated by a validator
vote on **2024-02-20 (17:00 UTC)** [1][2]. Soroban was not a single CAP: it was specified as the
multi-part **CAP-0046 series**, CAP-0046-01 through CAP-0046-12 [3] — covering Wasm smart contracts
(46-01), contract structure/host functions, built-in token + classic-asset interop (46-06), the
contract fee mechanism (46-07), contract metadata (46-08), network config (46-09), resource metering
(46-10), the authorization framework (46-11), and the state-archival interface (46-12) [3]. Soroban
contracts are **Wasm**-based (Rust-first), not EVM/Solidity [3].

A later date, **2024-03-19**, is sometimes cited — that is when Soroban "opened for business" (capacity
raised so anyone could deploy in the phased rollout), a separate event from the 2024-02-20 activation.

Sources: [1] stellar.org "Protocol 20 and smart contracts are live on mainnet"; [2] stellar.org Protocol
21 Upgrade Guide; [3] stellar/stellar-protocol `core/` (CAP-0046-01…-12).

## Why these cards (routing rationale)

Protocol-history fact → `stellar_docs_mcp` + `scout_research`. `perplexity_search` acceptable for dated
announcement. No deep-research.

## Edge / traps

Wrong protocol version (P19/21/22/23), claiming a single CAP instead of the CAP-0046 series, or EVM/
Solidity framing are the traps. Do not conflate the 2024-03-19 "open for business" date with the
2024-02-20 activation vote.
