---
id: q-sor-msg-sender-equivalent
q: "What's the Soroban equivalent of Solidity's `msg.sender` — how do I get the calling address, why must the user pass their own Address as an argument, and what exactly does `require_auth()` verify (it's not an allow/blocklist)?"
category: soroban
subcategory: authorization-patterns
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States that Soroban has no ambient `msg.sender`; contracts normally receive the relevant `Address` as an explicit argument.", weight: 5 }
  - { claim: "Explains that `Address::require_auth()` / `require_auth_for_args()` proves the address authorized the current function invocation/context through host-enforced authentication and replay protection.", weight: 5 }
  - { claim: "Distinguishes authentication/authorization from allowlists or blocklists; policy checks must be implemented separately in contract state or a custom account `__check_auth`.", weight: 4 }
  - { claim: "Mentions that multiple addresses can authorize one call and that clients must attach the corresponding Soroban authorization entries/signatures.", weight: 3 }
should_have:
  - { claim: "Contrasts with EVM `msg.sender` without importing EVM caller assumptions into Soroban.", weight: 3 }
  - { claim: "Mentions `require_auth_for_args` when the authorized payload should be narrower than the full invocation arguments.", weight: 2 }
nice_to_have:
  - { claim: "Points to tests using `env.mock_all_auths()` / `env.auths()` as local verification helpers.", weight: 1 }
must_avoid:
  - { claim: "Do not claim there is a direct `env.sender()` / `msg.sender` equivalent for normal contract calls.", weight: 5 }
  - { claim: "Do not describe `require_auth()` as a built-in allowlist, KYC, or blocklist decision.", weight: 5 }
  - { claim: "Do not say authorization is inferred from the transaction source account for arbitrary addresses.", weight: 4 }
must_cite:
  - "Official Stellar authorization docs for `Address`, `require_auth`, and host-managed authentication/replay protection."
  - "Official transaction/auth-entry docs when discussing client-supplied Soroban authorization entries."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization"
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction#authorization-data"
  - "https://developers.stellar.org/docs/learn/migrate/evm/solidity-and-rust-advanced-concepts#soroban-5"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Stellar Docs MCP on 2026-06-29."
---

## Reference answer (gospel)

Soroban does not expose an ambient `msg.sender` for ordinary contract code. A function that needs to know "who" is acting should take an `Address` argument, then call `address.require_auth()` or `address.require_auth_for_args(...)` to require that address to authorize the invocation. Stellar's authorization docs define `Address` as a host-managed identity type and say `require_auth` / `require_auth_for_args` ensure that the address authorized the current call context, with authentication rules and replay protection enforced by the host. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization.

`require_auth()` is not an allowlist or blocklist check. It proves the address authorized the call; your contract must still enforce policy, for example by checking stored admin/role state before or after the auth call. For contract accounts, `require_auth` invokes the account contract's `__check_auth`, where custom signature and policy logic can live. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization#contract-account.

Clients represent this proof with `SorobanAuthorizationEntry` data. Those entries name the authorizing address, the contract function, the arguments authorized by `require_auth` / `require_auth_for_args`, and any authorized sub-invocations. A call can require multiple addresses, unlike the single ambient EVM caller model. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction#authorization-data.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a core Soroban authorization semantics question with canonical official docs. `scout_research` or `scout_repos` are acceptable as secondary evidence for examples, audits, or source code, but the answer should be grounded in official docs.

## Edge / traps

The common wrong answer is to invent `msg.sender` as an implicit caller. Another trap is treating `require_auth()` as authorization policy; it authenticates/authorizes a specific invocation for an address, but does not decide whether that address is an admin, approved user, or compliant actor unless the contract code or account contract implements that policy.
