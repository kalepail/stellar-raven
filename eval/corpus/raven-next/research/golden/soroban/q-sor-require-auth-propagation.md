---
id: q-sor-require-auth-propagation
q: "In a cross-contract chain (user → A → B), whose auth does `require_auth()` check in B, and how do I make A authorize a sub-call as itself (authorize_as_current_contract)?"
category: soroban
subcategory: authorization-patterns
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that `require_auth(address)` checks authorization for the exact Soroban `Address` passed to it; in B, `user.require_auth()` requires the user's auth, while `a_contract.require_auth()` requires A to authorize as a contract account/current contract.", weight: 5 }
  - { claim: "Explains that authorized sub-contract calls are represented as invocation trees; an entry-point contract should usually call `user.require_auth()` to bind inner authorized calls atomically and prevent front-running/reuse.", weight: 5 }
  - { claim: "Explains that a contract authorizes its own sub-call with `Env::authorize_as_current_contract` by supplying `InvokerContractAuthEntry`/sub-invocation context matching the downstream call.", weight: 4 }
  - { claim: "Distinguishes user/account authorization from invoker/current-contract authorization and avoids `msg.sender` semantics.", weight: 4 }
should_have:
  - { claim: "Mentions custom account `__check_auth` only when B requires auth for an `Address::Contract` account.", weight: 2 }
nice_to_have:
  - { claim: "Mentions using simulation/auth recording or tests to inspect the required auth tree.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say B automatically checks the immediate caller A unless B explicitly requires A's address.", weight: 5 }
  - { claim: "Do NOT describe Soroban auth as EVM `msg.sender` propagation.", weight: 5 }
  - { claim: "Do NOT omit the front-running/reuse reason for requiring auth at A's entry point.", weight: 4 }
must_cite:
  - "Official Stellar authorization docs."
  - "Official cross-contract authorization starter guide for entry-point auth and sub-call behavior."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization
  - https://developers.stellar.org/docs/build/guides/auth/contract-authorization
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/transaction-simulation
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: ""
---

## Reference answer (gospel)

In Soroban, `require_auth()` is not "the caller" check. It checks the exact `Address` supplied to it. If B runs `user.require_auth()`, B requires an authorization entry for the user, even though A is the immediate contract caller. If B runs `a_address.require_auth()`, then B requires authorization for A's address; if A is a contract address, that means contract-account/current-contract authorization rather than a user signature.

Cross-contract authorization is modeled as an invocation tree. Stellar's docs recommend requiring the user at the entry point A when A will make inner calls authorized for that user, because otherwise a recorded inner authorization could be reused/front-run outside A's intended wrapper. Contracts do not need special handling when they merely pass through a user's authorized sub-call to B, but they must make the required call tree match what the user signed (https://developers.stellar.org/docs/build/guides/auth/contract-authorization).

When A itself needs to authorize a downstream call, A uses `Env::authorize_as_current_contract` with an `InvokerContractAuthEntry`/sub-invocation describing B's contract id, function name, arguments, and nested sub-invocations. This is the Soroban equivalent of "A authorizes this exact sub-call as A", not an EVM-style `msg.sender` check (https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization).

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a primary-docs Soroban authorization semantics question. `scout_research` or `scout_repos` can support examples, but routing to general web would be weaker than the official authorization docs.

## Edge / traps

The trap is importing EVM mental models. B does not implicitly authorize the immediate caller. The required authorization depends on the `Address` B passes to `require_auth`, and front-running protection depends on wrapping inner user-authorized calls in an entry-point authorization context.
