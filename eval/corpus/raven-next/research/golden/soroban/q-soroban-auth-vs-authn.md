---
id: q-soroban-auth-vs-authn
q: "In Soroban, what's the difference between authorization and authentication, and which does require_auth handle?"
category: soroban
subcategory: authorization
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Authentication = confirming identity (who you are); authorization = judging whether an operation is permitted.", weight: 4 }
  - { claim: "`require_auth` asserts that a given `Address` has authorized the current action; the host handles verifying the authentication (signatures) behind that.", weight: 5 }
should_have:
  - { claim: "For classic accounts the host checks signatures against the account; for contract (custom) accounts it delegates the check to the contract's `__check_auth`.", weight: 3 }
nice_to_have:
  - { claim: "Contract-level business rules (roles/permissions) are still the contract's responsibility on top of `require_auth`.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim `require_auth` performs no signature verification (the host does verify).", weight: 3 }
  - { claim: "Do NOT conflate the two terms as identical or swap their definitions.", weight: 3 }
must_cite:
  - "The developers.stellar.org authorization fundamentals page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Conceptual comparison straight from the auth docs; definitions and the __check_auth delegation verified verbatim against the authorization fundamentals page."
---

## Reference answer (gospel)

The Soroban authorization docs draw the line explicitly: "**Authorization** is the process of judging
which operations should or should not be allowed to occur; it is about judging permission,"
while **authentication** is "the narrower problem of judging whether a person is who they say they are."

- **`require_auth(addr)`** asserts that `addr` has authorized the current function call within the
  current context. The host enforces this — including **replay protection (nonces handled
  automatically)** — so it is the canonical authorization gate. [auth]
- **Authentication is handled by the host behind `require_auth`.** For **classic Stellar accounts** the
  built-in implementation verifies signatures against the account's signers/thresholds (Stellar
  multisig). For **contract (custom) accounts**, the host calls the account contract's
  **`__check_auth`**, which is responsible for verifying the signatures (any custom scheme) and
  optionally applying a custom authorization policy. [auth]
- Higher-level **business rules** (roles/permissions) remain the contract's own responsibility on top
  of `require_auth`.

Trap: claiming `require_auth` does no signature verification (the host does), or swapping the two
definitions.

## Why these cards (routing rationale)

Conceptual auth distinction → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Swapping the definitions; claiming `require_auth` skips signature verification.
