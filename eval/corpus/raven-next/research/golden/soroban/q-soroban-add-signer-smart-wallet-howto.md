---
id: q-soroban-add-signer-smart-wallet-howto
q: "How do I add a custom signer (e.g. a new passkey) to an existing Soroban smart-wallet contract account?"
category: soroban
subcategory: smart-wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains the smart wallet is a custom-account Soroban contract whose `__check_auth` validates signatures, and adding a signer means invoking the contract's own add-signer function to store the new signer's public key.", weight: 5 }
  - { claim: "States the add-signer invocation must itself be authorized by an existing signer of the contract (require_auth / existing-signer check).", weight: 4 }
should_have:
  - { claim: "Notes a passkey signer is a secp256r1 public key, verified on-chain (CAP-51 / secp256r1 host function) inside __check_auth.", weight: 3 }
  - { claim: "References PasskeyKit / smart-wallet tooling as the practical path to manage signers.", weight: 2 }
nice_to_have:
  - { claim: "Notes a sensible policy (e.g. don't lock out all signers; consider recovery) when modifying the signer set.", weight: 1 }
must_avoid:
  - { claim: "Do NOT treat a smart-wallet contract account like a classic account using SetOptions/signer-weights for adding the signer — signers live in the contract's own storage and are managed by its functions.", weight: 5 }
  - { claim: "Do NOT claim a new signer can be added without authorization from an existing signer.", weight: 4 }
must_cite:
  - "A smart-wallet / custom-account / passkey page on developers.stellar.org or the PasskeyKit docs/repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/complex-account
  - https://github.com/kalepail/passkey-kit
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Axis-C how-to rebalance. Procedure → stellar_docs_mcp (scout_repos acceptable for PasskeyKit code). Distinct from q-soroban-check-auth-custom-account (concept) and q-tool-passkeykit-smart-wallet. Trap = treating the contract account like a classic account (SetOptions) or skipping existing-signer authorization. Verified: smart wallets are custom-account Soroban contracts using __check_auth; secp256r1 verification is a Soroban host function; PasskeyKit is the practical signer-management tooling."
---

## Reference answer (gospel)

A Stellar "smart wallet" is a **custom-account Soroban contract** (a `C…` contract address) whose
**`__check_auth`** validates signatures against the **signer set stored in the contract's own
storage**. Adding a signer therefore means **invoking the contract's own add-signer function** (e.g.
`add_signer` / `add_sig`) to write the new signer's public key — it is a contract call, **not** a
classic `SetOptions` operation.

That add-signer invocation **must itself be authorized by an existing signer** (the contract's
function calls `require_auth` / re-enters `__check_auth`), so a new key cannot be added without an
already-authorized signer approving it.

A passkey signer is a **secp256r1 (P-256) public key**; the contract's `__check_auth` verifies the
WebAuthn/secp256r1 signature on-chain using Soroban's native secp256r1 verification host function. In
practice, manage the signer set with **PasskeyKit** (and its launchtube/server tooling) rather than
hand-rolling the flow.

Policy note: don't remove/replace signers in a way that locks out every signer; keep a recovery path.

## Why these cards (routing rationale)

Procedure to add a signer to a smart-wallet contract account → `stellar_docs_mcp` (custom-account /
passkey docs); `scout_repos`/`scout_research` acceptable for PasskeyKit code. General-web/deep-research
are misses.

## Edge / traps

Treating the contract account like a classic account (SetOptions/signer weights), or adding a signer
without authorization from an existing signer.
