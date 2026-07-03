---
id: q-ti-secret-key-custody-backend
q: "What are the recommended patterns for storing/using Stellar secret keys in a production backend (KMS/Vault, server-side signing without ever holding plaintext) vs encrypting keys in the browser, and how would I auto-create custodial wallets for email-login users?"
category: tooling-infra
subcategory: wallets-keys
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Clearly separates custodial backend custody from non-custodial browser-encrypted key storage.", weight: 5 }
  - { claim: "States that Stellar public keys are safe to share, while secret keys control the account and must never be exposed or logged.", weight: 5 }
  - { claim: "Recommends production backend signing through KMS/HSM/Vault/envelope encryption or equivalent controls, with secrets decrypted only inside a trusted signing boundary if at all.", weight: 5 }
  - { claim: "For email-login custodial wallets, keeps the focus on key custody: generate and hold signing material server-side behind the KMS/Vault/HSM boundary, maintain auditable compliance controls, and never return secret keys to the client.", weight: 4 }
should_have:
  - { claim: "Mentions multisig/policy separation, withdrawal limits, rotation/backup, access controls, and transaction review as operational controls.", weight: 3 }
  - { claim: "Mentions that browser localStorage encrypted by a PIN is an educational non-custodial pattern, not a substitute for backend KMS custody.", weight: 3 }
nice_to_have:
  - { claim: "Mentions smart accounts/passkeys as a way to reduce direct backend custody for some products.", weight: 1 }
must_avoid:
  - { claim: "Do NOT tell users a public address can reveal a secret key or encourage unsafe plaintext key handling.", weight: 5 }
  - { claim: "Do NOT recommend storing encrypted browser keys and also calling the app custodial without explaining who controls signing.", weight: 4 }
must_cite:
  - "Primary Stellar docs for keypair semantics and custody models."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/guides/transactions/create-account#create-a-keypair"
  - "https://developers.stellar.org/docs/build/apps/application-design-considerations#custody-models"
  - "https://developers.stellar.org/docs/build/apps/example-application-tutorial/account-creation#user-experience"
  - "https://developers.stellar.org/docs/build/guides/transactions/pooled-accounts-muxed-accounts-memos"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29 differentiation: this file owns the key-STORAGE-architecture lane (KMS/Vault/HSM/envelope, custodial-vs-browser custody, never expose secret). Account activation/funding/trustline lifecycle is owned by q-ti-provision-wallet-per-user — removed the activation must_have/must_avoid here to avoid duplicated must_haves across the pair."
---

## Reference answer (gospel)

A Stellar public key is an address and is safe to share; the secret key proves account control and should never be shared, logged, embedded in frontend code, or stored as plaintext. The first design decision is custody. In a non-custodial app, the user holds the secret/signing capability, and the server asks the user or wallet to sign. Stellar's BasicPay tutorial shows encrypted secret material living only in the browser as a non-custodial educational pattern. That is not the same as a production custodial backend.

In a custodial backend, put signing behind a KMS/HSM/Vault or equivalent boundary. Common patterns are KMS-held Ed25519 signing if supported, Vault transit/signing, envelope-encrypted secrets decrypted only in a short-lived trusted worker, strict IAM, audit logs, no plaintext at rest, no secrets in app logs, and separate hot/cold keys or multisig/policy controls for high-value flows. Your API should request "sign this validated transaction" from the signing boundary rather than handing secret keys around application code.

For email-login custodial wallets, the custody question is "where does the signing key live and who can invoke it," not "how do I activate an account" (that account-lifecycle flow — generate, fund, add trustlines, track reserve — is its own topic). Choose one Stellar account per user or a pooled account with muxed accounts; either way the secret/signing material stays inside the KMS/Vault/HSM boundary, never in the database as plaintext, never returned to the browser. Make the custody model explicit to users and handle compliance, recovery, rotation, and withdrawal policy as product requirements.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the keypair semantics, custody-model distinction, account creation, and muxed-account design are in official Stellar docs. `scout_research` is acceptable for ecosystem examples such as smart accounts/passkeys, but the answer's safety baseline is primary documentation.

## Edge / traps

Do not imply a public key can reveal a secret key. Do not call a browser-encrypted local key a custodial backend. Do not auto-create "wallets" without explaining account activation, minimum balance, and who can sign transactions.
