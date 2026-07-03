---
id: q-aas-trusted-asset-list-whitelist
q: "Is there an official list of trusted Stellar assets or an SDK helper, and how should a wallet build a token whitelist to filter scam assets?"
category: assets-anchors-seps
subcategory: asset-safety
axes: [tool-targeted, ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "States there is no single protocol-level official whitelist that makes an asset trusted across all Stellar wallets and apps.", weight: 5 }
  - { claim: "Explains wallets should evaluate issuer account, home domain, SEP-1 metadata, known issuer/project sources, liquidity, and user risk signals.", weight: 5 }
  - { claim: "Distinguishes protocol validity of an asset from wallet/explorer trust, verification, or display policy.", weight: 4 }
should_have:
  - { claim: "Mentions an SDK can read asset/account metadata but cannot by itself certify trust.", weight: 3 }
  - { claim: "Encourages sourced allowlists/denylist policy and dated review for wallet teams.", weight: 2 }
nice_to_have:
  - { claim: "Mentions avoiding lookalike asset-code and issuer impersonation traps.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar or SDF maintains a universal official trusted-token whitelist for every wallet.", weight: 5 }
  - { claim: "Do NOT label a specific asset safe or scam without cited, current evidence.", weight: 5 }
must_cite:
  - "Stellar docs/SEP-1 plus dated wallet/explorer/listing-policy sources if making current verification claims."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0042.md"
  - "https://github.com/stellar-asset-lists/index"
  - "https://stellar.expert/asset-lists"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0001.md"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified there is a SEP-42/community asset-list mechanism and SDK, not a universal SDF/protocol whitelist. Freshness-sensitive for specific providers."
---

## Reference answer (gospel)

There is no protocol-level official whitelist that makes a Stellar asset trusted across all wallets and apps. A Stellar asset can be valid on-chain while still being hidden, warned, unverified, or blocked by a particular wallet/explorer policy.

There is, however, a standards-based allowlist mechanism. SEP-42 defines Stellar Asset Lists: curated lists of Stellar asset metadata that applications can choose to trust. The community-managed `stellar-asset-lists/index` catalog and StellarExpert asset-list page let apps discover lists, and the `@stellar-asset-lists/sdk` package can fetch and parse them. The catalog explicitly says inclusion in a list should not be treated as endorsement or recommendation.

A wallet whitelist should combine sources and policy: exact asset code + issuer, issuer account and `home_domain`, SEP-1 TOML metadata and organization docs, known project/issuer sources, liquidity/market behavior, user reports or denylist evidence, and dated reviews of asset-list providers. SDK helpers can read metadata or SAL lists; they cannot certify that an asset is safe by themselves.

## Why these cards (routing rationale)

This needs Stellar corpus plus current ecosystem policy context; `scout_research` is expected because it surfaces SEP-42/SAL and wallet/explorer ecosystem context. Official docs/specs and general search are acceptable for current list-provider policy checks.

## Edge / traps

Do not turn metadata discovery into a guarantee of safety. Do not label a specific asset safe or scam unless the answer cites current evidence for that exact code and issuer.
