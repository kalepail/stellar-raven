---
id: q-sor-contract-trustlines-c-address
q: "Does a Soroban contract / smart-wallet (C…) need a trustline (and an XLM minimum balance) to receive/hold/send a classic asset like USDC, can I send USDC directly to a C-address like a normal payment, and how does a contract send assets back out?"
category: soroban
subcategory: soroban-development
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that contracts interact with classic assets through the Stellar Asset Contract (SAC), not by receiving a classic payment operation exactly like a G-address.", weight: 5 }
  - { claim: "Distinguishes operationally that a `C...` contract holds a classic asset's balance in contract storage (no classic trustline) whereas a `G...` account holds it in a trustline/native balance; the exact ledger-entry/integer-width internals are out of scope here.", weight: 5 }
  - { claim: "States that a C-address does not open a classic trustline like a G-address, but sending/receiving through SAC creates/uses contract-address balance and authorization state.", weight: 4 }
  - { claim: "Explains outbound asset movement is a SAC `transfer` invocation from the contract/smart wallet, with Soroban authorization as required.", weight: 4 }
  - { claim: "Mentions G-address recipients still need a trustline and enough XLM/base reserve unless the SAC `trust` function creates the trustline under Protocol 26 with the address's authorization.", weight: 4 }
should_have:
  - { claim: "Mentions Horizon/RPC monitoring of contract-account payments via SAC/unified asset events rather than only classic payment records.", weight: 2 }
  - { claim: "Warns exchanges/memo-based services may not support payments from contract accounts.", weight: 2 }
nice_to_have:
  - { claim: "Notes native XLM has no issuer/trustline, but SAC still provides the contract-facing interface.", weight: 1 }
must_avoid:
  - { claim: "Do not tell users to use classic Change Trust on a C-address.", weight: 5 }
  - { claim: "Do not treat native XLM, classic issued assets, SAC balances, and custom SEP-41 tokens as the same storage/accounting model.", weight: 5 }
  - { claim: "Do not say a normal classic payment operation to a C-address is always equivalent to a G-address payment.", weight: 4 }
must_cite:
  - "Must cite the Stellar Asset Contract docs and C-account send/receive docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
  - https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-c-accounts
  - https://developers.stellar.org/docs/build/guides/contract-accounts
  - https://developers.stellar.org/docs/build/guides/tokens/custom-sac-admin
  - https://developers.stellar.org/docs/build/guides/tokens/stellar-asset-contract
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified with official docs plus Scout high-confidence dev-docs result for SAC/trustline behavior. Protocol 26 SAC `trust` (CAP-0073, Implemented) wording is grounded in the current SAC integration docs. 2026-06-29 differentiation: this file owns the operational how-to lane (does a C-address need a trustline, can I send USDC directly, how does a contract send out); the exact i64-trustline vs i128-contract-storage internals are deferred to q-soroban-sac-balance-storage so the two no longer share the G-vs-C integer-width must_have."
---

## Reference answer (gospel)

Use the **Stellar Asset Contract (SAC)** mental model. Contracts interact with classic assets through
the SAC, not by behaving exactly like a G-address receiving a classic Payment operation. The SAC docs
state it is the only way for contracts to interact with native XLM or issued Stellar assets
(https://developers.stellar.org/docs/tokens/stellar-asset-contract).

For `Address::Account`, the balance must exist in a classic account/native balance or trustline; if
the trustline/account is missing, a function touching that balance fails. For `Address::Contract`, the
balance and authorization state live in contract storage, not a classic trustline, and balances are
stored as i128 rather than trustline i64
(https://developers.stellar.org/docs/tokens/stellar-asset-contract). So a `C...` contract/smart-wallet
does not "open a trustline" with classic Change Trust the way a `G...` account does.

To receive/send USDC with a C-address, route through SAC transfer flows. The C-account guide describes
payments to/from contract accounts as SAC transfers and notes RPC/Horizon monitoring needs to look at
SAC/unified asset events
(https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-c-accounts). To send
assets back out, the contract/smart wallet invokes the SAC `transfer` with the required Soroban
authorization. If the recipient is a G-address and lacks a trustline, Protocol 26's SAC `trust`
function can create it as part of an invocation, but it still preserves opt-in authorization and the
account must satisfy the base reserve for the new trustline
(https://developers.stellar.org/docs/build/guides/tokens/custom-sac-admin).

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer depends on official SAC and C-account docs.
`scout_research` is acceptable because it indexes the same docs; `parallel_search` is acceptable only
for ecosystem/service support caveats such as exchange support.

## Edge / traps

Do not suggest running classic Change Trust on a C-address. Do not say a contract can send to every
exchange deposit flow like a normal G-account; contract-account docs warn memo/exchange workflows may
expect G-address behavior. Do not collapse SAC balances, classic trustlines, and custom SEP-41 token
storage into one model.
