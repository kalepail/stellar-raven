---
id: q-defi-chainlink-ccip-vs-cctp
q: "Is Chainlink CCIP live on Stellar yet, and how does it compare with Circle CCTP for cross-chain transfers and messaging?"
category: defi-ecosystem
subcategory: bridges-messaging
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: monthly

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research, scout_projects]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Requires dated primary or reputable sources for whether Chainlink CCIP is live, announced, planned, or not available on Stellar.", weight: 5 }
  - { claim: "Distinguishes CCIP as a cross-chain messaging/token-transfer interoperability network from Circle CCTP as USDC burn-and-mint transfer infrastructure.", weight: 5 }
  - { claim: "States CCTP-on-Stellar claims must be tied to Circle/Stellar documentation and current network support.", weight: 4 }
should_have:
  - { claim: "Explains CCIP and CCTP are not interchangeable: CCIP can carry generalized messages depending on support, while CCTP is specific to native USDC transfers.", weight: 3 }
  - { claim: "Mentions bridge/security model differences and availability by chain/network.", weight: 3 }
nice_to_have:
  - { claim: "Mentions developers should verify supported lanes before designing production flows.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim CCIP is live on Stellar based only on an announcement or unrelated Chainlink integration.", weight: 5 }
  - { claim: "Do NOT describe CCTP as a generic arbitrary-message bridge.", weight: 5 }
must_cite:
  - "Dated Chainlink/Circle/Stellar primary sources for availability and feature claims."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - "https://docs.chain.link/ccip/directory/mainnet"
  - "https://developers.circle.com/stablecoins/cctp-getting-started"
  - "https://stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar"
  - "https://docs.chain.link/ccip"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Phase 3 should re-check Chainlink's CCIP Directory and Circle's supported-domain docs because this is explicitly monthly freshness-sensitive."
---

## Reference answer (gospel)

As of the 2026-06-29 verification pass, Raven should not assert that Chainlink CCIP is live on Stellar unless Chainlink's current CCIP Directory or a dated Chainlink/Stellar primary announcement lists Stellar. The durable rubric is to cite the current Chainlink directory and label status precisely: live, announced, planned, or not available.

CCIP and CCTP are different products. Chainlink CCIP is a cross-chain interoperability network for token transfers and, where supported, arbitrary cross-chain messages. Circle CCTP is USDC-specific burn-and-mint transfer infrastructure: it burns native USDC on the source chain and mints native USDC on the destination chain. Scout records Circle CCTP as live on Stellar, but any production answer should verify Circle's current supported domains and not describe CCTP as a generic message bridge.

## Why these cards (routing rationale)

`perplexity_search` is expected because current Chainlink/Circle support is freshness-sensitive and lives in provider docs. Scout is acceptable for Stellar-side corroboration, but primary provider docs should decide availability.

## Edge / traps

Do not infer "CCIP on Stellar" from Chainlink's presence elsewhere or from a different Chainlink service. Do not call CCTP a general arbitrary-message bridge.
