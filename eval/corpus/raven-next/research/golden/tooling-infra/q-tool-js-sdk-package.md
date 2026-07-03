---
id: q-tool-js-sdk-package
q: "What's the official JavaScript/TypeScript SDK for building Stellar and Soroban apps, and what package do I install?"
category: tooling-infra
subcategory: sdks-js
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The official JS/TS SDK is `@stellar/stellar-sdk`, maintained by SDF.", weight: 5 }
  - { claim: "Installed via a package manager, e.g. `npm install @stellar/stellar-sdk` (or pnpm/yarn equivalent).", weight: 4 }
  - { claim: "It talks to both Horizon (REST) and Stellar RPC (JSON-RPC) and handles transaction building/signing + XDR.", weight: 3 }
should_have:
  - { claim: "As of v16, the former `@stellar/stellar-base` package was folded into `@stellar/stellar-sdk` (no separate base install).", weight: 2 }
  - { claim: "Exposes classes like `Horizon`, `rpc`, `Keypair`, `TransactionBuilder`.", weight: 2 }
nice_to_have:
  - { claim: "Supports network selectors for mainnet/testnet/futurenet/local.", weight: 1 }
must_avoid:
  - { claim: "Do NOT name `stellar-sdk` (unscoped/legacy), `stellar-base` alone, or web3.js/ethers as the official current package.", weight: 5 }
  - { claim: "Do NOT claim the SDK is community-maintained — it is SDF-maintained.", weight: 2 }
must_cite:
  - "At least one primary developers.stellar.org SDKs page (client-sdks) or the stellar/js-stellar-sdk repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/sdks/client-sdks
  - https://github.com/stellar/js-stellar-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Package name is the defining fact; the scoped @stellar/ prefix is the trap. v16 base-fold claim holds (js-stellar-sdk v16 folded @stellar/stellar-base into @stellar/stellar-sdk)."
---

## Reference answer (gospel)

The official JS/TS SDK is **`@stellar/stellar-sdk`**, **maintained by SDF**. Install via a package
manager: **`npm install @stellar/stellar-sdk`** (or `pnpm add` / `yarn add` equivalent). It talks to
both **Horizon (REST)** and **Stellar RPC (JSON-RPC)**, and handles transaction building/signing and XDR
encode/decode. It exposes classes like **`Horizon`, `rpc`, `Keypair`, `TransactionBuilder`** and network
selectors for mainnet/testnet/futurenet/local. **As of v16, the former `@stellar/stellar-base` package
was folded into `@stellar/stellar-sdk`** — no separate base install is needed.

## Why these cards (routing rationale)

Primary-source factual lookup about the canonical SDK → `stellar_docs_mcp`. `scout_repos` is acceptable corroboration (it ranks the js-stellar-sdk repo). General-web/deep-research are routing misses for a first-party docs fact.

## Edge / traps

Naming the unscoped/legacy `stellar-sdk`, lone `stellar-base`, or EVM libs (web3.js/ethers) as the
official package; or crediting the SDK as community-maintained (it is SDF-maintained).
