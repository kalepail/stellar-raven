---
id: q-infra-anchor-platform
q: "Is there an official SEP-aligned framework for building a Stellar anchor / on-off ramp?"
category: tooling-infra
subcategory: anchor-platform
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Anchor Platform is SDF's SEP-aligned framework/SDK (Java) for building and managing Stellar on/off-ramps.", weight: 5 }
  - { claim: "It implements the core anchor SEPs — SEP-1 (stellar.toml), SEP-10 (Web Auth), SEP-12 (KYC), SEP-24 (Hosted Deposit/Withdrawal), and SEP-31 (Cross-border).", weight: 4 }
should_have:
  - { claim: "Adopting/forking the Anchor Platform inherits SEP conformance rather than re-implementing the protocols.", weight: 2 }
  - { claim: "It also covers further SEPs (e.g. SEP-6 programmatic deposit/withdrawal, SEP-38 quotes).", weight: 1 }
nice_to_have:
  - { claim: "It is distributed as source (github.com/stellar/java-stellar-anchor-sdk) and a Docker image (stellar/anchor-platform).", weight: 1 }
must_avoid:
  - { claim: "Do NOT confuse the Anchor Platform with the Stellar Disbursement Platform (SDP) — they are different products.", weight: 4 }
  - { claim: "Do NOT misattribute the wrong SEP numbers to the anchor flow.", weight: 3 }
must_cite:
  - "developers.stellar.org Anchor Platform docs or the stellar/anchor-platform repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/platforms/anchor-platform
  - https://github.com/stellar/java-stellar-anchor-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Anchor Platform vs SDP confusion is the trap; SEP set is the must_have. Verified: repo is stellar/java-stellar-anchor-sdk; covers SEP-1/6/10/12/24/31/38."
---

## Reference answer (gospel)

The **Anchor Platform** is SDF's official, SEP-aligned framework (a **Java** SDK + set of APIs) for
building and running Stellar **on/off-ramp (anchor)** services — it standardizes the wallet/exchange
integration surface so you don't hand-roll the protocols
([anchor-platform docs](https://developers.stellar.org/docs/platforms/anchor-platform)).

It implements the core anchor SEPs:
- **SEP-1** — Stellar Info File (`stellar.toml`, service discovery)
- **SEP-10** — Stellar Web Authentication
- **SEP-12** — KYC API
- **SEP-24** — Interactive (hosted) Deposit & Withdrawal
- **SEP-31** — Cross-border payments (receive)

It also covers further SEPs (e.g. **SEP-6**, **SEP-38** quotes). Source lives at
**github.com/stellar/java-stellar-anchor-sdk** with a `stellar/anchor-platform` Docker image. Adopting
it inherits SEP conformance rather than re-implementing each protocol.

**Not the same as the Stellar Disbursement Platform (SDP)**: SDP is for *bulk outbound payments*; the
Anchor Platform is for *anchor (deposit/withdraw/KYC/auth) integration*.

## Why these cards (routing rationale)

First-party platform fact → `stellar_docs_mcp`; `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Confusing Anchor Platform with SDP, or wrong SEP numbers, are the traps.
