---
id: q-soroban-check-auth-custom-account
q: "How do I build a custom account (smart wallet) contract in Soroban using __check_auth?"
category: soroban
subcategory: authorization
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "A custom account / contract account implements the special `__check_auth(signature_payload, signatures, auth_context)` function that the host calls whenever `require_auth` targets that contract address.", weight: 5 }
  - { claim: "`__check_auth` returns `()`/Ok to approve or panics/errors to reject the authorization.", weight: 4 }
should_have:
  - { claim: "It enables account abstraction: arbitrary signature schemes (e.g., Ed25519, secp256r1/passkeys, multisig) instead of a classic Stellar keypair.", weight: 3 }
  - { claim: "The contract is responsible for its own replay protection (e.g., nonces) when relevant.", weight: 2 }
nice_to_have:
  - { claim: "References a worked example (e.g., the docs 'complex-account' multisig example or soroban-webauthn).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroban has no account abstraction / that custom signature schemes are impossible.", weight: 4 }
  - { claim: "Do NOT describe ERC-4337 EntryPoint/UserOperation machinery as the Soroban mechanism.", weight: 4 }
  - { claim: "Do NOT confuse `__check_auth` with `__constructor` or with `require_auth` itself.", weight: 3 }
must_cite:
  - "The developers.stellar.org custom-account / authorization docs (complex-account example)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/complex-account
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections. ERC-4337 confusion is the EVM trap. scout_repos acceptable for code templates. Verified against the docs 'complex-account' multisig example + authorization docs."
---

## Reference answer (gospel)

A **custom account** (contract account / smart wallet) is a Soroban contract that implements the
special **`__check_auth(signature_payload: BytesN<32>, signatures, auth_context)`** function. Whenever
`require_auth` targets that contract's address, the **host invokes `__check_auth`** to decide whether
the authorization is valid. The function **returns `Ok(())` to approve** and **panics / returns an
error to reject**.

This is Soroban's **account abstraction**: the contract can implement **any signature scheme** —
Ed25519, **secp256r1/passkeys**, multisig, threshold weights — instead of relying on a classic Stellar
keypair. The contract is responsible for its **own replay protection** (e.g. tracking nonces) when
needed, and for checking the `auth_context` (which contract/function/args are being authorized).

Worked references: the docs **"complex account"** multisig example and the BLS/WebAuthn custom-account
examples.

## Why these cards (routing rationale)

Account-abstraction how-to → `stellar_docs_mcp`; `scout_repos` acceptable for example contracts.

## Edge / traps

Pulling in ERC-4337 EntryPoint/UserOps; confusing `__check_auth` with `require_auth`/`__constructor`.
