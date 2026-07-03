---
id: q-ti-connect-wallet-button-code
q: "Show me the recommended 'Connect Wallet' button in React using Freighter (`@stellar/freighter-api`: requestAccess/getAddress/sign) or Stellar Wallets Kit, with a reusable hook - and how do I customize/strip the Wallets Kit modal UI? (incl. common errors like a missing `getAddress` export across versions)"
category: tooling-infra
subcategory: wallets-keys
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Shows the two supported integration lanes: direct Freighter via `@stellar/freighter-api` for single-wallet UX, or Stellar Wallets Kit for multi-wallet UX.", weight: 5 }
  - { claim: "Uses current Freighter concepts: check connection/installation, request access or get address, read network, sign transaction XDR with network passphrase, and keep secret keys out of the client.", weight: 5 }
  - { claim: "Provides a reusable React hook/component shape while warning that exact named exports can change across versions and should be verified against installed package types/docs.", weight: 4 }
  - { claim: "For Wallets Kit customization, says to use the kit's supported modal/module configuration or implement a custom wallet picker over the kit APIs; do not rely on undocumented DOM/CSS hacks.", weight: 4 }
  - { claim: "Explains that a wallet address is not the same as an activated/funded account; handle unfunded account/testnet Friendbot separately.", weight: 3 }
should_have:
  - { claim: "Cites official Freighter/Stellar frontend docs and the Wallets Kit docs/repo/release.", weight: 3 }
  - { claim: "Mentions version skew: missing `getAddress` export means docs/example and package version are mismatched or an older API is installed.", weight: 3 }
nice_to_have:
  - { claim: "Suggests checking `node_modules/@stellar/freighter-api` types or package README before copying snippets.", weight: 1 }
must_avoid:
  - { claim: "Do NOT expose or generate secret keys in the React wallet-connect component.", weight: 5 }
  - { claim: "Do NOT present one stale Freighter API snippet as timeless across versions.", weight: 5 }
  - { claim: "Do NOT claim Wallets Kit modal internals are stable unless citing the current project docs/API.", weight: 4 }
must_cite:
  - "Official Stellar/Freighter docs for browser signing."
  - "Wallets Kit docs/repo or official developer-tooling listing for multi-wallet support."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/guides/dapps/frontend-guide"
  - "https://developers.stellar.org/docs/build/guides/freighter/prompt-to-sign-tx"
  - "https://developers.stellar.org/docs/tools/developer-tools/wallets"
  - "https://github.com/Creit-Tech/Stellar-Wallets-Kit/releases/tag/v2.5.0"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Freighter and Wallets Kit releases were verified on 2026-06-29. Exact Wallets Kit modal customization APIs require current project docs/source inspection in Phase 3 because official Stellar docs only list/support the kit at a high level."
---

## Reference answer (gospel)

Use direct Freighter when you only support Freighter; use Stellar Wallets Kit when you want a multi-wallet selector. The official frontend guide imports `isConnected`, `setAllowed`, `getAddress`, and `signTransaction` from `@stellar/freighter-api` for wallet connection/signing (https://developers.stellar.org/docs/build/guides/dapps/frontend-guide), and the Freighter signing guide says JS dapps use `signTransaction` to prompt the extension to sign Soroban XDRs (https://developers.stellar.org/docs/build/guides/freighter/prompt-to-sign-tx).

The durable hook shape is: track `{installed, connected, address, network}`; on connect, request wallet access or address permission; on sign, pass the transaction XDR plus the correct network passphrase; never store a secret key in React. If `getAddress` is missing, do not cargo-cult an old snippet: check the installed `@stellar/freighter-api` version/types and the current docs, because package exports have moved over time.

Wallets Kit is the right abstraction when you need Freighter, LOBSTR, xBull, Albedo, Rabet, Hana, WalletConnect, and hardware wallet support. Stellar's developer tooling docs list Wallets Kit and its supported wallets (https://developers.stellar.org/docs/tools/developer-tools/wallets); the current GitHub release checked for this pass is v2.5.0 (https://github.com/Creit-Tech/Stellar-Wallets-Kit/releases/tag/v2.5.0). For modal customization, use documented module/modal options or build your own wallet picker over the kit's public API. Do not depend on private modal DOM structure.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for Freighter and official dapp docs. `parallel_search` or `scout_research` are acceptable for the Wallets Kit repo/docs because the customization behavior is project-specific and freshness-sensitive.

## Edge / traps

The common trap is giving a stale `@stellar/freighter-api` snippet and ignoring installed-version exports. Another is conflating "wallet connected" with "account funded"; a connected public address may still be unfunded on testnet/mainnet.
