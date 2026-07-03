---
id: q-ti-fetch-all-balances-classic-sac
q: "How do I fetch every asset balance held by an account or a contract (C…) address — classic trustline assets AND Soroban/SAC balances — given Horizon's account endpoint doesn't return Soroban assets (getSACBalance)?"
category: tooling-infra
subcategory: assets-balances
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that Horizon /accounts/:id balances cover the account's native balance and classic trustline balances, not arbitrary Soroban contract token state.", weight: 5 }
  - { claim: "Explains SAC accounting: account balances for issued assets live in trustlines, while C... contract-address balances live in contract data and are read through the SAC/SEP-41 token interface or ledger entries.", weight: 5 }
  - { claim: "Gives a practical split: use Horizon for G... classic balances; for C... or Soroban/SAC balances, query known token contracts/SACs with balance(id) or index contract events/data.", weight: 4 }
  - { claim: "States there is no universal 'get every Soroban token balance for any address' RPC method without knowing/indexing token contracts.", weight: 4 }
should_have:
  - { claim: "Mentions that custom SEP-41 tokens and SACs share the token-interface subset, but SACs add asset-specific/admin functionality.", weight: 3 }
nice_to_have:
  - { claim: "Mentions StellarExpert/Hubble/indexers as discovery aids for token lists or historical portfolio snapshots.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT treat native XLM, classic issued assets, SAC account balances, SAC contract-address balances, and custom SEP-41 tokens as the same storage/accounting model.", weight: 5 }
  - { claim: "Do NOT imply Horizon account JSON will list every Soroban token held by a contract address.", weight: 5 }
must_cite:
  - "SAC docs and Horizon account/balances docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/tools/lab/api-explorer/horizon-endpoint#single-account"
  - "https://developers.stellar.org/docs/tokens/stellar-asset-contract"
  - "https://developers.stellar.org/docs/build/guides/tokens/stellar-asset-contract"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "No verified universal all-token discovery API; answer gates on splitting classic account balances from known/indexed token-contract balances."
---

## Reference answer (gospel)

Use two paths. For a classic G... account, Horizon's account endpoint returns account details including native XLM and balances for assets with trustlines [1]. That is the right path for classic trustline assets.

For Soroban/SAC balances, the accounting model is different. The SAC docs state that issued-asset balances for Stellar accounts are stored in trustlines, but balances for contract addresses are stored in contract data; SAC exposes a SEP-41 token interface over the same asset [2]. Therefore for a C... address, query each known SAC/custom token contract's `balance` method or read/index the relevant contract data/events. The token guide confirms the SDK token client targets contracts implementing the SEP-41 token interface [3].

There is no single Horizon account response or generic RPC call that discovers every token contract balance for an arbitrary C... address. For "all balances" in a wallet/portfolio product, maintain an indexed token universe and event/state index, or use a third-party explorer/indexer that already does that discovery.

## Why these cards (routing rationale)

`stellar_docs_mcp` is the primary route because the answer depends on official Horizon and SAC docs. `scout_research` can corroborate indexer/explorer options but should not be the only source for the storage model.

## Edge / traps

Wrong answers usually say "call Horizon /accounts/:id" for everything. That misses C... contract-address token balances. Another wrong answer treats SAC balances as wrapped/bridged assets; SAC is an API over the same Stellar asset, with different ledger-entry storage depending on account vs contract address.
