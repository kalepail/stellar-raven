---
id: q-ti-testnet-mainnet-migration
q: "How do I move from testnet to mainnet — does the same keypair/ address work on both, must I re-issue assets and re-create trustlines, and how do I bulk-create/fund many mainnet accounts?"
category: tooling-infra
subcategory: developer-tooling
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains Testnet and Mainnet are separate networks with different network passphrases; the same keypair can mathematically produce the same public address, but production guidance should use fresh Mainnet keys and configuration.", weight: 5 }
  - { claim: "States Testnet accounts, balances, trustlines, asset issuers, contracts, and SAC addresses do not migrate to Mainnet; recreate/reissue them on Mainnet.", weight: 5 }
  - { claim: "Distinguishes Friendbot/Testnet funding from Mainnet funding: Mainnet accounts require real XLM from an existing account/exchange/treasury and `CreateAccount` starting balance/base reserve.", weight: 5 }
  - { claim: "For issued assets, says you need Mainnet issuer/distribution accounts, stellar.toml/SEP-1 production metadata, and users must create Mainnet trustlines to the Mainnet issuer.", weight: 4 }
  - { claim: "For bulk account creation/funding, points to batched `CreateAccount` transactions/channel accounts/SDP-style distribution infrastructure instead of a faucet.", weight: 4 }
should_have:
  - { claim: "Mentions production services need Mainnet RPC/Horizon/provider URLs and `Public Global Stellar Network ; September 2015` passphrase.", weight: 3 }
  - { claim: "Notes testnet resets and should not be treated as persistent production state.", weight: 2 }
nice_to_have:
  - { claim: "Mentions fee-bump/channel-account patterns for higher-throughput account creation.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Testnet balances/trustlines/assets can be promoted to Mainnet.", weight: 5 }
  - { claim: "Do NOT recommend reusing Testnet distribution secrets for Mainnet production.", weight: 5 }
  - { claim: "Do NOT say Friendbot funds Mainnet accounts.", weight: 5 }
must_cite:
  - "Network passphrase or testnet/mainnet production docs."
  - "Asset issuance/trustline docs for reissuing assets."
  - "SDP or account creation docs for bulk funding patterns."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/platforms/anchor-platform/sep-guide/sep1
  - https://developers.stellar.org/docs/tokens/how-to-issue-an-asset
  - https://developers.stellar.org/docs/platforms/stellar-disbursement-platform/admin-guide/advanced-configuration
  - https://developers.stellar.org/docs/platforms/stellar-disbursement-platform
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Stellar Docs search. Uses SDP Mainnet guidance for 'do not reuse Testnet keys' and bulk distribution patterns."
---

## Reference answer (gospel)

Treat Mainnet as a new deployment. Testnet and Mainnet use different network passphrases: Testnet uses `Test SDF Network ; September 2015`, while Mainnet uses `Public Global Stellar Network ; September 2015` [SEP-1 guide](https://developers.stellar.org/docs/platforms/anchor-platform/sep-guide/sep1). A Stellar keypair can generate the same `G...` address on either network, but production guidance is to generate new secure Mainnet keys; SDF's SDP Mainnet configuration explicitly says not to reuse Testnet keys for a Mainnet distribution account [SDP advanced config](https://developers.stellar.org/docs/platforms/stellar-disbursement-platform/admin-guide/advanced-configuration).

Nothing on Testnet is promoted: balances, accounts, trustlines, issued assets, contracts, and SAC addresses must be created on Mainnet. For assets, create Mainnet issuer/distribution accounts, publish production `stellar.toml`/SEP-1 metadata, issue the Mainnet asset, and have recipients create Mainnet trustlines to the Mainnet issuer. The asset-issuance tutorial notes Testnet can use Friendbot, but production requires acquiring XLM from another wallet or exchange [issue an asset](https://developers.stellar.org/docs/tokens/how-to-issue-an-asset).

For many Mainnet accounts, fund from a treasury/distribution account using `CreateAccount` operations, channel accounts, and operational tooling such as the Stellar Disbursement Platform for large batches [SDP](https://developers.stellar.org/docs/platforms/stellar-disbursement-platform). There is no Mainnet Friendbot.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer is mostly official network/configuration, asset, and SDP documentation. `parallel_search` is acceptable only to verify current service pages; `scout_research` can supplement ecosystem tooling.

## Edge / traps

The main trap is confusing address/key portability with state portability. The address format can be the same, but the ledger state is not. A second trap is using Testnet secrets or faucet mental models in production.
