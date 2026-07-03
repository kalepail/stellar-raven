---
id: q-sor-classic-dex-from-contract
q: "Can a Soroban contract place orders on the classic SDEX or read classic AMM/LP state, and can I combine a classic op and a contract invocation in one transaction (the one-host-function-op-per-tx limit)?"
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
  - { claim: "States that Soroban contracts cannot directly interact with the classic SDEX, claimable balances, sponsorships, or classic AMM/LP ledger operations except via the supported account/asset surface.", weight: 5 }
  - { claim: "Explains SDEX order placement is done by classic operations such as Manage Buy Offer / Manage Sell Offer, not by a Soroban host function callable from contract code.", weight: 4 }
  - { claim: "States that smart-contract transactions containing InvokeHostFunctionOp / ExtendFootprintTTLOp / RestoreFootprintOp can only have one operation per transaction, so a classic op cannot be bundled with a contract invocation in the same tx.", weight: 5 }
  - { claim: "Gives the practical design alternative: use SAC/SEP-41 token transfers and Soroban-native DEX/AMM contracts, or orchestrate classic and Soroban actions in separate transactions off-chain.", weight: 4 }
should_have:
  - { claim: "Mentions that Soroban is additive to Stellar, not a replacement for the classic operation set.", weight: 2 }
  - { claim: "Warns that reading classic AMM state from inside contract execution is not the same as off-chain indexing through Horizon/RPC/ingest.", weight: 2 }
nice_to_have:
  - { claim: "Mentions that one InvokeHostFunctionOp can perform multiple contract actions atomically inside contract logic.", weight: 1 }
must_avoid:
  - { claim: "Do not claim a contract can call classic ManageOffer, PathPayment, or LiquidityPool operations directly.", weight: 5 }
  - { claim: "Do not claim a transaction can contain both a classic operation and an InvokeHostFunctionOp.", weight: 5 }
  - { claim: "Do not import EVM router/DEX assumptions.", weight: 4 }
must_cite:
  - "Must cite official Stellar smart-contract FAQ or transaction docs for the no-SDEX/no-claimable-balances and one-operation constraints."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/overview
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions
  - https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified with Stellar Docs MCP and Scout research; Scout returned the same official smart-contract FAQ as a high-confidence dev-docs result."
---

## Reference answer (gospel)

No, a Soroban contract cannot directly place classic SDEX orders or read/control classic liquidity-pool
state from inside contract execution. The official smart-contract FAQ says Soroban can interact with
accounts/assets through the built-in Stellar Asset Contract, but otherwise cannot interact with SDEX,
claimable balances, or sponsorships (https://developers.stellar.org/docs/build/smart-contracts/overview).
The SDEX itself is the classic operation surface: Manage Buy Offer / Manage Sell Offer operations
place orders on the distributed exchange
(https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools).

You also cannot combine a classic op and a contract invocation in the same transaction. Stellar's
transaction docs state that smart-contract transactions containing InvokeHostFunctionOp,
ExtendFootprintTTLOp, or RestoreFootprintOp can only have one operation per transaction
(https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions).
The Soroban transaction docs also state there is only one InvokeHostFunctionOp allowed per transaction
and that contracts should be used for multiple atomic contract-side actions
(https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction).

Practical answer: for on-chain contract composition, use SAC/SEP-41 token transfers and Soroban-native
DEX/AMM contracts. If you must use classic SDEX or AMM operations, orchestrate that as a separate
classic transaction from an off-chain service or user wallet, and treat the boundary as non-atomic
unless your application explicitly handles the two-step state machine.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a protocol/transaction-constraint question. Scout is an
acceptable backup because it indexes the same smart-contract FAQ and can surface primary docs, but
project/repo search is secondary.

## Edge / traps

The plausible wrong answer is to say "Stellar has one ledger, so contracts can call every classic
operation." Soroban is integrated into Stellar but intentionally exposes only a bounded host surface.
Another wrong answer is to suggest bundling a ManageSellOffer operation after an invocation; smart
contract transactions are one-operation transactions.
