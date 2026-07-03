---
id: q-tool-passkeykit-smart-wallet
q: "What library do I use to build a passkey-based smart wallet on Stellar?"
category: tooling-infra
subcategory: passkeys-smart-wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "PasskeyKit (`passkey-kit`) is a TypeScript SDK for creating/managing Stellar smart wallets with passkeys (WebAuthn).", weight: 5 }
  - { claim: "passkey-kit is now positioned as the legacy precursor to OpenZeppelin Smart Accounts; new projects should use `smart-account-kit` (built on the audited OpenZeppelin stellar-contracts library).", weight: 4 }
should_have:
  - { claim: "A Stellar smart wallet is a Soroban contract account that enforces auth in `__check_auth`/`check_auth` rather than a single secret key.", weight: 3 }
  - { claim: "Both kits expose signer primitives like secp256r1 (passkey), Ed25519, and policy signers.", weight: 2 }
nice_to_have:
  - { claim: "passkey-kit works with the OpenZeppelin Relayer for submitting passkey-signed transactions.", weight: 1 }
must_avoid:
  - { claim: "Do NOT recommend rolling your own WebAuthn contract from scratch as the standard path.", weight: 3 }
  - { claim: "Do NOT present passkey-kit as the current/greenfield default without noting smart-account-kit, nor claim passkeys require an EVM/ERC-4337 stack.", weight: 4 }
must_cite:
  - "developers.stellar.org smart-wallets guide and/or the passkey-kit / smart-account-kit package pages."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/contract-accounts/smart-wallets
  - https://www.npmjs.com/package/passkey-kit
  - https://github.com/kalepail/smart-account-kit
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Freshness-sensitive but verified: passkey-kit is the legacy precursor to OpenZeppelin Smart Accounts; smart-account-kit (kalepail, ~v0.2.x, Apache-2.0, built on OZ Smart Account contracts, WebAuthn passkey auth) is the current greenfield default. Reward flagging the migration."
---

## Reference answer (gospel)

**PasskeyKit (`passkey-kit`)** is a TypeScript SDK for creating/managing **Stellar smart wallets with
passkeys (WebAuthn)**. As of 2026 it is positioned as the **legacy precursor to OpenZeppelin Smart
Accounts** — **new projects should use `smart-account-kit`** (kalepail), a TypeScript SDK for deploying
and managing **OpenZeppelin Smart Account contracts** on Stellar/Soroban with WebAuthn passkey auth,
**built on the audited OpenZeppelin stellar-contracts library**.

A Stellar smart wallet is a **Soroban contract account** that enforces authorization in
**`__check_auth`/`check_auth`** rather than relying on a single secret key. Both kits expose multiple
**signer primitives**: **secp256r1** (passkey/WebAuthn), **Ed25519**, and **policy signers**. passkey-kit
also works with the **OpenZeppelin Relayer** for submitting passkey-signed transactions. Don't roll your
own WebAuthn contract from scratch, and this is **not** an EVM/ERC-4337 stack — it's native Soroban.

## Why these cards (routing rationale)

Smart-wallet/passkey library fact → `stellar_docs_mcp` (smart-wallets guide); `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Naming passkey-kit as the greenfield default without mentioning smart-account-kit, implying an ERC-4337
stack, or recommending a from-scratch WebAuthn contract as the standard path.
