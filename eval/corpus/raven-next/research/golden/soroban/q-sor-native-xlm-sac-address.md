---
id: q-sor-native-xlm-sac-address
q: "What is the SAC contract address for native XLM (and USDC) per network, why does native XLM not have an ERC-20-style address, how do I derive it (`stellar contract id asset --asset native`) / get it inside a contract, and how does it differ testnet vs mainnet?"
category: soroban
subcategory: sac-token-interop
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that native XLM is a Stellar native asset, not an ERC-20-style deployed token address; the SAC is a network-specific contract interface/reserved address for the asset.", weight: 5 }
  - { claim: "Gives the current `stellar contract id asset --asset native --network <network>` derivation path and says contract IDs differ by network passphrase.", weight: 5 }
  - { claim: "Includes empirically verified native XLM SAC IDs for testnet and mainnet as of 2026-06-29, or explains how to derive instead of freezing values.", weight: 4 }
  - { claim: "Shows that USDC uses `--asset USDC:<issuer>` and that issuer choice/network affects the resulting SAC ID.", weight: 4 }
  - { claim: "Inside contracts, recommends accepting the SAC contract `Address` or using SDK token clients with the asset's contract ID, not hardcoding issuer account IDs as token addresses.", weight: 3 }
should_have:
  - { claim: "Cites official SAC docs stating SAC implements SEP-41 and the asset parameter is the deployed contract address, not the issuer address.", weight: 3 }
  - { claim: "Mentions `Asset.contractId(networkPassphrase)` / generated bindings as an app-side alternative.", weight: 2 }
nice_to_have:
  - { claim: "Notes that anyone can deploy an asset's SAC to its reserved address and the reserved ID can be derived before deployment.", weight: 1 }
must_avoid:
  - { claim: "Do not give one universal XLM/USDC contract address across all networks.", weight: 5 }
  - { claim: "Do not treat the USDC issuer `G...` account as the SAC/token contract address.", weight: 5 }
  - { claim: "Do not claim native XLM has an ERC-20 contract on Stellar.", weight: 4 }
must_cite:
  - "Official SAC docs or token guide for SAC/SEP-41 semantics and derivation command."
  - "A dated empirical CLI check or current official docs for any frozen address values."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/tokens/stellar-asset-contract"
  - "https://developers.stellar.org/docs/build/guides/tokens/stellar-asset-contract#contract-code"
  - "https://developers.stellar.org/docs/build/apps/guestbook/setup-passkeys#passkey-client"
  - "https://developers.stellar.org/docs/tools/lab/api-explorer/horizon-endpoint#all-assets"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Empirical check on 2026-06-29 with local `stellar 25.2.0`: native testnet CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC; native mainnet CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA; testnet USDC issuer from docs produced CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA; mainnet Circle USDC issuer from Stellar docs produced CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75."
---

## Reference answer (gospel)

Native XLM does not have an ERC-20-style deployed token address. It is Stellar's native asset; the Stellar Asset Contract is the built-in SEP-41-compatible contract interface for interacting with that asset from Soroban. The SAC docs state that an asset and its SAC represent the same asset, and the SAC is simply an API for the asset; Stellar account balances for native XLM remain on accounts, while contract balances are contract data entries. Source: https://developers.stellar.org/docs/tokens/stellar-asset-contract.

Derive the native XLM SAC ID per network with:

```sh
stellar contract id asset --asset native --network testnet
stellar contract id asset --asset native --network mainnet
```

Empirically verified on 2026-06-29 with `stellar 25.2.0`: testnet native XLM is `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`; mainnet native XLM is `CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA`. The ID differs by network because contract IDs are derived with the network identifier/passphrase. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction#function.

For USDC, derive using the asset code and issuer, for example `stellar contract id asset --asset USDC:<issuer> --network <network>`. The official docs use testnet USDC issuer `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`; Stellar's Horizon API Explorer example identifies mainnet Circle USDC issuer `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`. Empirical derived IDs on 2026-06-29: testnet `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`; mainnet `CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75`. Sources: https://developers.stellar.org/docs/build/guides/basics/verify-trustlines and https://developers.stellar.org/docs/tools/lab/api-explorer/horizon-endpoint#all-assets.

Inside a contract, accept the token contract `Address` or use `soroban_sdk::token::TokenClient` / `StellarAssetClient` against the asset's SAC ID. The token guide explicitly warns that the asset parameter for contract interaction is the deployed contract address for the asset, not the issuer account address. Source: https://developers.stellar.org/docs/build/guides/tokens/stellar-asset-contract#contract-code.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the command, SAC semantics, and network-specific derivation are official-docs questions. Scout is acceptable for cross-checking ecosystem values, but the core answer should come from developers.stellar.org plus an empirical CLI derivation.

## Edge / traps

Do not publish one global address for XLM or USDC. SAC IDs are network-specific and asset-specific. Do not confuse the USDC issuer account with the contract ID. Do not imply native XLM is a normal deployed ERC-20-style contract; the SAC is the Soroban-facing interface to the native asset.
