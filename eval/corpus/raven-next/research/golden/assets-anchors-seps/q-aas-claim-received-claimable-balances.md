---
id: q-aas-claim-received-claimable-balances
q: "How do I find all Stellar claimable balances addressed to me, claim one or several by id, and confirm none remain?"
category: assets-anchors-seps
subcategory: claimable-balances
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Mentions using Horizon's claimable balances endpoint filtered by claimant, or equivalent ledger-entry lookup, to discover claimable balance ids.", weight: 5 }
  - { claim: "Explains that claiming requires submitting `ClaimClaimableBalance`/claim-claimable-balance operations for specific balance ids from the claimant account.", weight: 5 }
  - { claim: "Mentions predicates must be satisfied for a claim to succeed.", weight: 4 }
should_have:
  - { claim: "Explains batching multiple claim operations in one transaction when feasible.", weight: 2 }
  - { claim: "Mentions re-querying the claimant filter after confirmation to verify no remaining claimable balances.", weight: 2 }
nice_to_have:
  - { claim: "Notes SDKs can build the claim operation after fetching ids.", weight: 1 }
must_avoid:
  - { claim: "Do NOT tell the user to send a normal payment to claim a claimable balance.", weight: 5 }
  - { claim: "Do NOT imply all listed balances are claimable before their predicates become true.", weight: 4 }
must_cite:
  - "Horizon or Stellar docs for claimable balances and the claim operation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/list-all-claimable-balances"
  - "https://developers.stellar.org/docs/build/guides/transactions/claimable-balances"
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#claim-claimable-balance"
  - "https://github.com/stellar/stellar-protocol/blob/master/core/cap-0023.md"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified Horizon endpoint, claim operation, and predicate failure semantics. Phase 3 may check whether current SDK examples should prefer Horizon or RPC for discovery."
---

## Reference answer (gospel)

Discover first, then claim by balance id. On Horizon, use the claimable-balances collection and filter for the claimant account, then page through the result set until exhausted. Each record has a claimable-balance id and claimants/predicates. A single claimable balance can also be retrieved by `/claimable_balances/:claimable_balance_id`.

To claim, the claimant account submits one `ClaimClaimableBalance` operation per balance id, with the claimant account as the operation source. Multiple claim operations can be placed in one transaction if the transaction size/operation limits and account sequence handling allow it. The protocol operation adds the claimable-balance amount to the source account and deletes the claimable-balance entry on success.

A listed balance is not necessarily claimable at this ledger close. The operation fails with `CLAIM_CLAIMABLE_BALANCE_CANNOT_CLAIM` if no claimant matches the source account or the matched claimant's predicate is false. For non-native assets, the claiming account also needs the relevant trustline, enough remaining trustline limit, and required authorization. After the transaction confirms, query the claimant filter again and verify the claimed ids are absent and no remaining balances match.

## Why these cards (routing rationale)

This is an official API/protocol how-to. The expected path is `stellar_docs_mcp` for Horizon endpoint names, operation names, result codes, and predicate semantics; `scout_research` is acceptable as a secondary source.

## Edge / traps

The user needs ids and claim operations, not ordinary payments or issuer intervention. Do not imply that every returned balance can be claimed immediately; predicates, trustlines, trustline limits, and authorization can still block the operation.
