---
id: q-protocol-operation-types-list
q: "List the core Stellar operation types available in a classic transaction — enumerate the main operations and what each does."
category: protocol-core
subcategory: operations
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Enumerates core payment/asset operations: Payment, CreateAccount, PathPaymentStrictSend/Receive.", weight: 5 }
  - { claim: "Enumerates DEX/trustline operations: ManageBuyOffer/ManageSellOffer, ChangeTrust, SetTrustLineFlags.", weight: 4 }
  - { claim: "Enumerates account/admin operations: SetOptions, AccountMerge, ManageData, BumpSequence.", weight: 4 }
should_have:
  - { claim: "Names claimable-balance and liquidity-pool operations (CreateClaimableBalance/ClaimClaimableBalance, LiquidityPoolDeposit/Withdraw).", weight: 3 }
  - { claim: "Names Clawback / ClawbackClaimableBalance and the InvokeHostFunction operation (Soroban contract invocation).", weight: 2 }
nice_to_have:
  - { claim: "Notes operations are the unit of action inside a transaction (a tx bundles 1+ operations).", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent non-existent operation names (e.g. 'Transfer', 'Mint', 'Burn' as classic operations).", weight: 4 }
  - { claim: "Do NOT conflate operations with transactions (operations are bundled inside a transaction).", weight: 3 }
must_cite:
  - "A list-of-operations page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Axis-C list rebalance. Enumeration of classic operation types → stellar_docs_mcp. Distinct from q-protocol-operations-vs-transactions (factual concept). Trap = inventing ERC-style 'Mint'/'Burn' ops or conflating ops with txs."
---

## Reference answer (gospel)

Operations are the unit of action inside a transaction (a tx bundles 1+ operations) [1]. The classic
operation types are [1]:

- **Payment / asset:** CreateAccount, Payment, PathPaymentStrictSend, PathPaymentStrictReceive
- **DEX / trustline:** ManageBuyOffer, ManageSellOffer, CreatePassiveSellOffer, ChangeTrust,
  SetTrustLineFlags (and legacy AllowTrust)
- **Account / admin:** SetOptions, AccountMerge, ManageData, BumpSequence
- **Claimable balances:** CreateClaimableBalance, ClaimClaimableBalance
- **Liquidity pools:** LiquidityPoolDeposit, LiquidityPoolWithdraw
- **Clawback:** Clawback, ClawbackClaimableBalance
- **Sponsorship:** BeginSponsoringFutureReserves, EndSponsoringFutureReserves, RevokeSponsorship
- **Soroban:** InvokeHostFunction, ExtendFootprintTTL, RestoreFootprint

There are **no** ERC-style `Transfer`/`Mint`/`Burn` classic operations [1].

- [1] developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations

## Why these cards (routing rationale)

Enumerating the classic operation types → `stellar_docs_mcp` (list-of-operations page);
`scout_research` acceptable. General-web is a miss for an exact protocol enumeration.

## Edge / traps

Inventing ERC-style 'Mint'/'Burn' operations, or conflating operations with transactions.
