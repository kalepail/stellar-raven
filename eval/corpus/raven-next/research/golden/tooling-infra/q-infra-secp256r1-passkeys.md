---
id: q-infra-secp256r1-passkeys
q: "How does Soroban verify passkey (WebAuthn) signatures on-chain — what's the role of secp256r1?"
category: tooling-infra
subcategory: passkeys-secp256r1
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Soroban exposes a secp256r1 (P-256) signature-verification host function so contracts can verify WebAuthn/passkey signatures inside their auth check.", weight: 5 }
  - { claim: "secp256r1 is the curve used by WebAuthn/passkeys, which is why on-chain verification is needed for passkey smart wallets.", weight: 4 }
should_have:
  - { claim: "A smart-wallet contract account checks the signature in `__check_auth`/`check_auth`; signers can be secp256r1 (passkey), Ed25519, or policy signers.", weight: 3 }
nice_to_have:
  - { claim: "This signer model replaces trust in a single root key with multiple/custom signer types.", weight: 1 }
must_avoid:
  - { claim: "Do NOT confuse secp256r1 (P-256, used by passkeys) with secp256k1 (Bitcoin/Ethereum's curve) or Ed25519 (classic Stellar keys).", weight: 5 }
must_cite:
  - "developers.stellar.org smart-wallets / contract-accounts guide."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/contract-accounts/smart-wallets
  - https://developers.stellar.org/docs/build/guides/contract-accounts
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified against the smart-wallets guide: registration stores a WebAuthn (secp256r1/P-256/ES256) public key in contract state; in __check_auth the contract verifies the secp256r1 signature and applies policy checks. secp256r1 vs secp256k1 vs Ed25519 mix-up is the defining trap."
---

## Reference answer (gospel)

A passkey (WebAuthn) signs with the **secp256r1 (NIST P-256, COSE ES256)** curve, so a Soroban smart
wallet must verify that curve **on-chain**. Soroban exposes a **secp256r1 signature-verification host
function** for exactly this
([smart-wallets guide](https://developers.stellar.org/docs/build/guides/contract-accounts/smart-wallets)).

The flow:
- **Registration** — WebAuthn creates a device keypair; the wallet stores the **secp256r1 public key**
  (and optional credential ID) in contract state.
- **Signing** — a WebAuthn assertion produces a signature over the payload.
- **Verification** — inside the contract account's **`__check_auth`**, the contract **verifies the
  secp256r1 signature** and applies policy checks (limits, allow-lists, timelocks).

Signers can be **secp256r1 (passkey), Ed25519, or policy signers**, replacing trust in a single root
key with multiple/custom signer types.

**Do not confuse the curves:** **secp256r1 (P-256)** = passkeys/WebAuthn; **secp256k1** = Bitcoin/
Ethereum; **Ed25519** = classic Stellar `G...` keys.

## Why these cards (routing rationale)

Protocol/contract mechanics fact → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Confusing the three curves (secp256r1 vs secp256k1 vs Ed25519) is the load-bearing trap.
