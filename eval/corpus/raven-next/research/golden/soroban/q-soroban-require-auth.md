---
id: q-soroban-require-auth
q: "How do I require that a caller authorized an action in a Soroban contract?"
category: soroban
subcategory: authorization
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Call `address.require_auth()` (or `require_auth_for_args(args)`) on the `Address` whose authorization is needed.", weight: 5 }
  - { claim: "The host verifies the authorization payload/signatures against the transaction's SorobanCredentials at that call site.", weight: 3 }
should_have:
  - { claim: "`require_auth_for_args` lets you bind the authorization to a specific subset of arguments.", weight: 3 }
  - { claim: "Replay is prevented via a host-managed nonce + ledger expiration in the auth payload.", weight: 2 }
nice_to_have:
  - { claim: "In tests, `env.mock_all_auths()` bypasses real signatures.", weight: 1 }
must_avoid:
  - { claim: "Do NOT recommend `msg.sender`, `tx.origin`, or `onlyOwner` modifiers (those are Solidity, not Soroban).", weight: 5 }
  - { claim: "Do NOT claim Soroban authorization is just checking the transaction source account / no per-address auth exists.", weight: 3 }
must_cite:
  - "The developers.stellar.org authorization documentation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/auth
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections. This file owns the require_auth API how-to lane; the EVM msg.sender comparison/why and 'not an allowlist' nuance belong to q-sor-msg-sender-equivalent. Verified: address.require_auth()/require_auth_for_args; host verifies SorobanCredentials; replay via host-managed nonce + ledger expiration."
---

## Reference answer (gospel)

Call **`address.require_auth()`** (or **`require_auth_for_args(args)`**) on the **`Address`** whose
authorization you need. At that call site the **host verifies the authorization payload/signatures**
against the transaction's **`SorobanCredentials`** (and, for contract/custom accounts, invokes their
`__check_auth`). If authorization is missing/invalid, the call fails.

- **`require_auth_for_args`** binds the authorization to a specific subset of arguments.
- **Replay protection** is handled by a **host-managed nonce + a ledger-sequence expiration** in the
  auth payload, so you don't roll your own nonce for the standard case.
- In tests, **`env.mock_all_auths()`** bypasses real signature checks.

This is Soroban's **per-`Address`** authorization model — there is **no `msg.sender`/`tx.origin`/
`onlyOwner`** (those are Solidity), and it is **not** merely checking the transaction source account.

## Why these cards (routing rationale)

Auth how-to → `stellar_docs_mcp`. `scout_research`/`scout_repos` acceptable.

## Edge / traps

Recommending `msg.sender`/`tx.origin`/`onlyOwner`; assuming only the tx source matters.
