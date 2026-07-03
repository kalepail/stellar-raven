---
id: q-aas-list-token-on-exchanges-aggregators
q: "After issuing a Stellar asset, how do I make it tradable and visible on exchanges, wallets, explorers, and aggregators?"
category: assets-anchors-seps
subcategory: asset-liquidity
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Explains technical prerequisites: issued asset, trustlines, home domain, valid SEP-1 stellar.toml metadata, and accessible logo/issuer information.", weight: 5 }
  - { claim: "Explains tradability requires market infrastructure such as SDEX offers, AMM pools, or listings/integrations with wallets/exchanges/aggregators.", weight: 4 }
  - { claim: "States each exchange, wallet, explorer, and aggregator applies its own listing/verification/liquidity policies.", weight: 5 }
should_have:
  - { claim: "Mentions liquidity and price/market-cap visibility generally require real markets and supply metadata rather than mere asset issuance.", weight: 3 }
  - { claim: "Advises checking the current listing docs/forms for the specific venue or aggregator.", weight: 2 }
nice_to_have:
  - { claim: "Mentions avoiding impersonation/scam-token presentation and using issuer-domain consistency.", weight: 1 }
must_avoid:
  - { claim: "Do NOT guarantee listing, verification, price, or market-cap display just because a Stellar asset exists.", weight: 5 }
  - { claim: "Do NOT present an official universal Stellar whitelist for every exchange/aggregator.", weight: 4 }
must_cite:
  - "SEP-1 or Stellar asset docs, plus dated venue/listing sources for freshness-specific claims."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0001.md"
  - "https://developers.stellar.org/docs/build/apps/example-application-tutorial/anchor-integration/sep1"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0042.md"
  - "https://stellar.expert/asset-lists"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness-sensitive. Verified durable prerequisites with SEP-1 and SEP-42; do not require any specific exchange/aggregator policy beyond dated current-source citation. Re-verified 2026-06-29: SEP-0042 confirmed as 'Stellar Asset List (SAL)', SEP-0001 + the build/apps SEP-1 tutorial resolve; stellar.expert/asset-lists is a client-rendered SPA so its catalog couldn't be content-fetched but the route is valid (load-bearing SEP claims verified via the protocol repo)."
---

## Reference answer (gospel)

Issuing a Stellar asset makes it technically valid, not automatically visible, trusted, liquid, or listed. The durable prerequisites are: issue the asset from the correct issuer account, make trustlines possible for holders, set the issuer account's `home_domain`, and publish a valid SEP-1 `https://DOMAIN/.well-known/stellar.toml` with `[[CURRENCIES]]` metadata for the exact code and issuer. SEP-1 says clients and exchanges can use that information to decide whether a token should be listed.

Tradability requires markets. On Stellar that can mean SDEX offers, liquidity pools, or integrations/listings in wallets, explorers, exchanges, and aggregators. Visibility and pricing usually require enough real liquidity, supply/issuer metadata, and a venue-specific policy review. SEP-42/Stellar Asset Lists define a community asset-list format and catalog that apps may use, but the catalog itself warns that inclusion in a list is not an endorsement or recommendation.

The practical answer is therefore a checklist, not a guarantee: publish correct SEP-1 metadata; keep issuer/domain/logo/contact/reserve information consistent; create real markets; apply to each target venue using its current listing process; and keep dated evidence for any verification, market-cap, or safety claim.

## Why these cards (routing rationale)

This blends Stellar metadata standards with ecosystem discovery. `scout_research` is expected because Scout surfaces SEP-1/SEP-42 and ecosystem context; `stellar_docs_mcp`, `parallel_search`, and `perplexity_search` are acceptable for primary specs and current venue policies.

## Edge / traps

The trap is overpromising visibility, verification, price, or market-cap display from issuance alone. There is no single official listing switch that forces all wallets, exchanges, explorers, and aggregators to show or verify a token.
