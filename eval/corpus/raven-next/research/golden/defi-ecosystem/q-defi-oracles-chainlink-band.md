---
id: q-defi-oracles-chainlink-band
q: "How do price oracles work on Stellar, are Chainlink Data Feeds or Band usable here, and what RWA-capable oracle options exist?"
category: defi-ecosystem
subcategory: oracles
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: monthly

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_find_similar_projects_semantic, scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Explains oracle correctness comes from data sources, publisher/network design, update cadence, aggregation, economic/security model, and consumer-side validation; it is not guaranteed merely by being on-chain.", weight: 5 }
  - { claim: "Requires current evidence before saying Chainlink Data Feeds or Band are live/usable on Stellar or Soroban.", weight: 5 }
  - { claim: "Names Reflector or other verified Stellar/Soroban oracle options only with dated sources and distinguishes mainnet, testnet, announced, and unsupported status.", weight: 5 }
should_have:
  - { claim: "Mentions RWA oracles may need proof of reserves, NAV, rates, identity/compliance data, or off-chain attestation beyond crypto price feeds.", weight: 3 }
  - { claim: "Encourages multiple-source or fallback design for high-value protocols.", weight: 2 }
nice_to_have:
  - { claim: "Mentions Chainlink CCIP is separate from Chainlink Data Feeds.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Chainlink Data Feeds or Band are live on Stellar without current primary/project evidence.", weight: 5 }
  - { claim: "Do NOT claim Reflector is the only possible oracle if current Scout data shows alternatives.", weight: 4 }
must_cite:
  - "Dated oracle/project docs or Scout/LumenLoop records for each oracle availability claim."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/oracles/oracle-providers"
  - "https://stellarlight.xyz/project/reflector"
  - "https://stellarlight.xyz/project/band"
  - "https://stellarlight.xyz/project/redstone-finance"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Official Stellar oracle-provider docs verified Reflector and DIA; Scout verified Band, RedStone, Lightecho, Orally and others. Phase 3 should primary-check Chainlink Data Feeds absence/status before asserting unsupported."
---

## Reference answer (gospel)

Price oracles on Stellar are contracts and data-provider networks; correctness depends on data sources, update cadence, aggregation, publisher/network security, and consumer-side validation. Being on-chain does not guarantee a correct price.

Official Stellar docs list Reflector and DIA as oracle providers; Scout additionally records Band as live on Stellar/Soroban, RedStone Finance as live on Stellar/Soroban mainnet since March 2026 with SEP-40 feeds including BTC, ETH, USDC, PYUSD and BENJI, plus Lightecho and Orally. Reflector remains a major native option, but it is not the only option surfaced by current Scout data. Phase 2 did not verify Chainlink Data Feeds live on Stellar from a primary Chainlink source; CCIP, if discussed, is a separate Chainlink cross-chain product, not a price-feed product.

For RWA use cases, a good answer should ask what data is needed: crypto price, FX, NAV, rates, proof of reserves, identity/compliance status, or issuer attestation. High-value protocols should validate feed freshness, bounds, fallback behavior, and multiple data sources.

## Why these cards (routing rationale)

`scout_projects` is expected because availability is current ecosystem discovery. Official Stellar docs should anchor known provider docs; web/provider docs are acceptable for Chainlink/Band/RedStone status.

## Edge / traps

Do not infer Stellar support from a brand's support on another chain. Do not call Reflector the sole oracle if Scout/provider docs show alternatives.
