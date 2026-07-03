---
id: q-tool-passkey-wallet-recovery
q: "If a user loses a passkey for a Stellar smart wallet, what recovery patterns exist (backup signers, policy signers, multi-signer design)?"
category: tooling-infra
subcategory: smart-wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Stellar smart wallets / custom accounts (Soroban) support multiple signers and policy signers.", weight: 5 }
  - { claim: "Recovery comes from designing in backup/secondary signers and multisig thresholds, so a lost passkey is one of several keys, not the only one.", weight: 5 }
should_have:
  - { claim: "Session keys / a relayer can also be part of the recovery/operation design.", weight: 3 }
  - { claim: "passkey-kit / smart-account-kit support these multi-signer / policy-signer patterns.", weight: 3 }
nice_to_have:
  - { claim: "Notes the recovery flow is: authenticate with a remaining signer, add a new passkey, remove the lost one.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim a lost passkey means irrecoverable loss of the wallet/funds.", weight: 5 }
  - { claim: "Do NOT suggest seed-phrase / BIP-39 recovery — passkeys are not BIP-39 seeds.", weight: 5 }
must_cite:
  - "A primary developers.stellar.org smart-wallet / custom-account source (and/or passkey-kit docs)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/contract-accounts/smart-wallets
  - https://github.com/kalepail/passkey-kit
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified: the smart-wallets guide stores a WebAuthn (secp256r1) public key in contract state and verifies it in __check_auth with policy checks; signers can be secp256r1/Ed25519/policy. smart-account-kit exposes addPasskey/addDelegated/remove — the design supports adding a new passkey and removing a lost one (recovery via backup/secondary signers), confirming a lost passkey is NOT irrecoverable. Canonical URL fixed (old /docs/build/smart-wallets redirects)."
---

## Reference answer (gospel)

A lost passkey is **not** an irrecoverable loss when the wallet is designed for it. Stellar **smart
wallets / custom accounts (Soroban)** support **multiple signers** and **policy signers**
([smart wallets guide](https://developers.stellar.org/docs/build/guides/contract-accounts/smart-wallets)),
so recovery is a **design** property:

- Add **backup / secondary signers** up front so the lost passkey is one of several keys.
- Use a **multisig threshold** so no single signer is a single point of failure.
- **Session keys / a relayer** can support operation and recovery flows.
- **passkey-kit / smart-account-kit** implement these multi-signer / policy-signer patterns.

Recovery flow: authenticate with a **remaining signer**, **add a new passkey**, and **remove the lost
one**. Passkeys are **not BIP-39 seeds**, so seed-phrase recovery does not apply.

## Why these cards (routing rationale)

First-party smart-wallet design guidance → **`stellar_docs_mcp`** (with `scout_repos` acceptable for
passkey-kit). Deep-research tier is forbidden.

## Edge / traps

Traps: (a) claiming a lost passkey = **irrecoverable loss**; (b) suggesting **seed-phrase / BIP-39
recovery** (passkeys are WebAuthn credentials, not BIP-39 seeds). Both are weight-5 `must_avoid`.
