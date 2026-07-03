---
id: q-tool-cctp-stellar-integration
q: "Circle CCTP is live on Stellar — what integration details and Stellar-specific constraints should a wallet/bridge developer know?"
category: tooling-infra
subcategory: bridges-cctp
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [perplexity_search, parallel_extract]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Circle CCTP is live on Stellar (around 2026-05-19).", weight: 5 }
  - { claim: "CCTP moves native USDC cross-chain via burn-and-mint (burn on source, mint on destination), not lock-and-wrap.", weight: 5 }
  - { claim: "There are Stellar-specific address/precision behaviors to handle per Circle's CCTP-on-Stellar docs.", weight: 3 }
should_have:
  - { claim: "Integration follows Circle's CCTP references for Stellar (attestation/message flow).", weight: 3 }
nice_to_have:
  - { claim: "Notes the resulting USDC on Stellar is native Circle USDC, not a bridged wrapper.", weight: 1 }
must_avoid:
  - { claim: "Do NOT call CCTP a lock-and-wrap / bridged-USDC mechanism.", weight: 5 }
  - { claim: "Do NOT say CCTP is not available on Stellar.", weight: 5 }
must_cite:
  - "Circle's CCTP-on-Stellar docs and/or the stellar.org announcement of CCTP going live."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.circle.com/cctp/references/stellar
  - https://stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Freshness:true — verified: CCTP live on Stellar 2026-05-19 (stellar.org foundation-news + Circle @circle announcement), canonical burn-and-mint of native USDC across 23 supported chains, no wrapped/custodial bridge. Integration via developers.circle.com/cctp/references/stellar. Stellar-specific address/precision handling per Circle's Stellar reference."
---

## Reference answer (gospel)

**Circle CCTP is live on Stellar** (around **2026-05-19**). CCTP moves **native USDC** across chains
via **burn-and-mint** — USDC is **burned** on the source chain and **minted** on the destination,
gated by a **Circle attestation** — so the destination holds **native Circle USDC**, **not** a
locked/wrapped bridge asset. A wallet/bridge developer should follow **Circle's CCTP-on-Stellar
references**, handling **Stellar-specific address and precision** behavior.

## Why these cards (routing rationale)

Integration facts split across first-party Stellar/Circle docs → **`stellar_docs_mcp`** (with
`perplexity_search` / `parallel_extract` acceptable for the Circle docs). Deep-research tier is
forbidden.

## Edge / traps

Traps: (a) describing CCTP as **lock-and-wrap / bridged USDC** (it is burn-and-mint of native USDC);
(b) claiming CCTP **isn't on Stellar**. Both are weight-5 `must_avoid`.
