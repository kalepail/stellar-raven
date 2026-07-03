---
id: q-sor-contract-as-claimable-arbiter
q: "Can a Soroban contract be the claimant/arbiter that releases a claimable balance (or hold escrow) and release on condition, and can it call `approve` on a SAC on a user's behalf?"
category: soroban
subcategory: soroban-development
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States that a Soroban contract cannot directly be the claimant/arbiter of a classic claimable balance or call classic claim-claimable-balance logic; official docs say contracts cannot interact with claimable balances.", weight: 5 }
  - { claim: "Provides the correct Soroban escrow design: hold SAC/SEP-41 token balances in contract storage or contract-owned balances and release with contract logic/authorization.", weight: 4 }
  - { claim: "Explains SAC `approve`/allowance is a token-contract call governed by Soroban authorization; a contract cannot approve on a user's behalf unless the user/address authorizes the invocation or the contract already controls the relevant address/balance.", weight: 5 }
  - { claim: "Distinguishes classic claimable-balance predicates from programmable Soroban escrow conditions.", weight: 4 }
should_have:
  - { claim: "Mentions source-account authorization / SorobanAuthorizationEntry as the mechanism behind user-approved contract calls.", weight: 3 }
  - { claim: "Warns that a two-step classic claimable-balance plus Soroban flow is not atomically bundled in one smart-contract transaction.", weight: 2 }
nice_to_have:
  - { claim: "Points to a timelock/escrow-style Soroban example as a design model if available.", weight: 1 }
must_avoid:
  - { claim: "Do not claim a contract can claim a classic claimable balance directly.", weight: 5 }
  - { claim: "Do not claim a contract can call `approve` for a user without the user's Soroban authorization.", weight: 5 }
  - { claim: "Do not conflate claimable balances with SAC allowances.", weight: 4 }
must_cite:
  - "Must cite official smart-contract FAQ for claimable-balance limitation and official authorization/SAC docs for approval semantics."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/overview
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified with official docs. Phase 3 may add a direct SEP-41 `approve` source if it wants to test exact allowance signatures."
---

## Reference answer (gospel)

A Soroban contract cannot directly act as the claimant/arbiter for a **classic claimable balance**.
The official smart-contract FAQ says contracts can interact with accounts/assets through the Stellar
Asset Contract, but cannot interact with SDEX, claimable balances, or sponsorships
(https://developers.stellar.org/docs/build/smart-contracts/overview).

If you want programmable escrow, build it as Soroban escrow: hold SAC/SEP-41 token balances under a
contract address/contract storage and release with contract logic. The SAC docs state that the Stellar
Asset Contract is the way contracts interact with native XLM and issued Stellar assets, and that
contract-address balances are stored in contract storage rather than classic trustlines
(https://developers.stellar.org/docs/tokens/stellar-asset-contract).

For `approve`: this is not a magic "spend user funds" escape hatch. SAC/SEP-41 approvals are contract
calls that must satisfy Soroban authorization. The transaction docs describe SorobanAuthorizationEntry
and authorized invocation trees, and the authorization docs describe `require_auth` as the mechanism
for an address to authorize an invocation
(https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction,
https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization). A contract
can approve only for an address/balance it controls, or when the user/address has authorized that
specific invocation.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a protocol boundary and auth semantics question. Scout
is acceptable as an expansion path because it indexes the same dev docs and examples, but the core
answer must be official.

## Edge / traps

Do not treat classic claimable-balance predicates as programmable Soroban conditions. They are a
classic operation feature outside contract reach. Do not tell users a contract can approve on behalf
of a G-address without authorization; that would break Soroban's authorization model.
