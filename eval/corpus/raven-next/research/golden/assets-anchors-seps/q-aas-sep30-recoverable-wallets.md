---
id: q-aas-sep30-recoverable-wallets
q: "What is SEP-30, and how does its recovery-signer-server model let a Stellar wallet recover accounts without holding the user's key?"
category: assets-anchors-seps
subcategory: wallet-standards
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names SEP-30 as Stellar's account recovery standard using recovery signer servers.", weight: 5 }
  - { claim: "Explains the recovery server is a signer or coordinates signer changes but does not need to hold the user's master secret key.", weight: 5 }
  - { claim: "Mentions recovery depends on Stellar account signers/thresholds and a wallet-server flow, not magic key reset.", weight: 4 }
should_have:
  - { claim: "Notes multiple recovery methods or servers can be used depending on account setup and wallet support.", weight: 2 }
  - { claim: "Distinguishes SEP-30 recovery from passkey smart-account recovery patterns.", weight: 2 }
nice_to_have:
  - { claim: "Mentions existing accounts require signer/threshold setup before they can be recovered this way.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim SEP-30 can recover any Stellar account after the secret key is lost with no prior signer setup.", weight: 5 }
  - { claim: "Do NOT say the recovery server should custody the user's master secret.", weight: 5 }
must_cite:
  - "SEP-30 specification or official Stellar docs covering recoverable wallets."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/apps/wallet/sep30"
  - "https://developers.stellar.org/docs/build/apps/wallet"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0030.md"
  - "https://stellar.org/blog/developers/sep-30-recoverysigner-user-friendly-key-management"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "SEP-30 spec status is Draft; official Wallet SDK docs still document the flow. Phase 3 can verify current Wallet SDK endpoint details if needed."
---

## Reference answer (gospel)

SEP-30 is Stellar's account-recovery standard for wallets that want users to regain access after losing a private key without giving a third party custody of that key. The official Wallet SDK docs describe the flow as a wallet communicating with one or more recovery signer servers to register the wallet for later recovery.

The mechanism relies on Stellar account signers and thresholds. Before loss, the wallet/account must be configured so recovery signer server(s) can participate in replacing signers or helping the user regain high-threshold control according to the SEP-30 flow. The recovery server verifies authenticated requests, commonly with SEP-10 JWTs or an external identity provider depending on the endpoint, and coordinates recovery. It does not need to hold the user's master secret key.

This is not a magic reset for arbitrary accounts. If the account was never enrolled with the right signers/thresholds, SEP-30 cannot recover it after the secret key is gone. It is also distinct from newer smart-account/passkey recovery patterns; SEP-30 is a classic-account signer-server standard.

## Why these cards (routing rationale)

Standards question, so `stellar_docs_mcp` should route to Wallet SDK docs and the SEP-30 spec. `scout_research` can corroborate the SDF blog and standard.

## Edge / traps

Recovery standards require preconfigured signers and thresholds; they are not post-hoc wallet support for arbitrary lost keys. The recovery signer server should not be described as holding the user's master secret.
