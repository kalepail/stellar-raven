---
id: q-ti-provision-wallet-per-user
q: "What's the recommended way to provision a Stellar account per user from my app backend (Python/Flask, encrypted key storage), then activate it and add the trustlines they need?"
category: tooling-infra
subcategory: wallets-keys
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Starts by choosing custody model: custodial per-user G-account, pooled custodial account with muxed accounts, or non-custodial wallet/passkey flow.", weight: 5 }
  - { claim: "Explains account activation: a keypair alone is not an active Stellar account until funded with minimum XLM; Testnet can use Friendbot, Pubnet needs real XLM or sponsorship.", weight: 5 }
  - { claim: "Explains trustline setup with Change Trust for classic assets before receiving them, and distinguishes this from SAC/contract-token interactions.", weight: 4 }
should_have:
  - { claim: "Notes that custodial signing material should live behind server-side custody (KMS/Vault/HSM or envelope encryption) with no plaintext secrets in logs/db/frontend, but treats the deep storage-architecture design as a separate concern.", weight: 3 }
  - { claim: "Mentions Python can use py-stellar-base for Horizon/RPC/account/transaction flows, while official examples may be JS/Go.", weight: 2 }
  - { claim: "Mentions sponsored reserves or pooled/muxed accounts as alternatives to one funded account per user.", weight: 3 }
nice_to_have:
  - { claim: "Mentions compliance/terms implications of operating custodial wallets for email-login users.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say a public key alone creates an active account or trustline.", weight: 5 }
  - { claim: "Do NOT recommend storing user secret keys unencrypted in a database or browser localStorage for a custodial backend.", weight: 5 }
  - { claim: "Do NOT use Friendbot or testnet funding guidance for Pubnet.", weight: 4 }
must_cite:
  - "Primary Stellar account-creation/trustline/custody-model docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/apps/application-design-considerations#custody-models"
  - "https://developers.stellar.org/docs/build/guides/transactions/create-account"
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#change-trust"
  - "https://developers.stellar.org/docs/tools/lab/account#fund-account"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29 differentiation: this file owns the account-LIFECYCLE lane (custody-model choice → generate keypair → activate/fund (Friendbot Testnet vs real XLM/sponsorship Pubnet) → Change Trust trustlines → SAC vs classic). Deep key-storage architecture (KMS/Vault/HSM internals) is owned by q-ti-secret-key-custody-backend — demoted the KMS must_have here to should_have to keep the pair's must_haves distinct."
---

## Reference answer (gospel)

First decide whether you actually want custody. A backend that creates and stores one Stellar secret key per email-login user is a custodial service; Stellar's app-design docs distinguish this from non-custodial apps where the user stores/signs with their own key. For many custodial products, a pooled account plus muxed accounts is often simpler than one on-chain account per user; per-user accounts are still valid when each user needs separate signer policy, trustlines, or account-level state.

For a per-user account flow: generate a keypair in the backend or KMS-backed signer, store/sign with the secret only through KMS/Vault/HSM/envelope encryption, and persist the public key as the user address. Then activate the account: a keypair is not an on-chain account until it receives enough XLM for minimum balance. On Testnet/Futurenet you can use Friendbot; on Pubnet you must fund with real XLM or use a sponsorship design. To let the user receive a classic issued asset, submit a `change_trust` operation from the user's account before sending that asset. For SAC/contract-token flows, separately handle contract IDs and contract calls; do not assume a classic trustline is the same thing as a SEP-41 token balance.

In Python/Flask, `py-stellar-base` can build and submit the same Stellar transactions, but the architecture matters more than language: keep signing on the server side for custodial accounts, never return secrets to the browser, do not log plaintext, rotate/backup signing material deliberately, and make the user-facing terms clear that the service controls the keys.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because account creation, custody models, Friendbot/Testnet funding, and Change Trust are all official developer-doc topics. `scout_research` or general web can supplement Python-library specifics, but should not replace primary Stellar account-state guidance.

## Edge / traps

The biggest trap is confusing keypair generation with account activation. Another is mixing custody models: encrypted-in-browser keys are a non-custodial example pattern, not a safe backend custody design. Also avoid applying Friendbot instructions to Mainnet/Pubnet.
