---
id: q-pc-account-activation-not-found
q: "Why does a Stellar account not exist until funded, what minimum activates it, and why do payments to a brand-new address fail as not found or not activated?"
category: protocol-core
subcategory: accounts-base-reserve
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains a keypair/public key alone is not an on-ledger account until a CreateAccount operation funds it with the minimum balance.", weight: 5 }
  - { claim: "States payments to a non-existent destination fail unless account creation is used where supported.", weight: 4 }
  - { claim: "Connects activation minimum to base reserve/minimum balance and notes the amount is protocol-version sensitive.", weight: 4 }
should_have:
  - { claim: "Mentions testnet Friendbot can fund testnet accounts only.", weight: 2 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT say every generated G-address already exists on ledger.", weight: 5 }
  - { claim: "Do NOT promise the current reserve amount without checking current docs.", weight: 3 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/create-account#create-an-account-1
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering#minimum-balance
  - https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/payment
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against official account-creation, payment-result, and base-reserve docs. Current empty-account minimum is 1 XLM because base reserve is 0.5 XLM and empty accounts require 2 base reserves; future protocol changes could alter the parameter."
---

## Reference answer (gospel)

A Stellar keypair is only a cryptographic identity until it is funded on ledger. Official docs state that a keypair alone does not make an account; the account exists after a `CreateAccount` operation funds it with the required minimum balance [1]. The current minimum for an empty account is 2 base reserves = 1 XLM, with the base reserve currently 0.5 XLM [2]. A normal `Payment` to a brand-new G-address fails with `PAYMENT_NO_DESTINATION` because the destination account does not exist [3]. On Testnet, Friendbot can create/fund accounts for testing; on Mainnet, use `CreateAccount`, sponsorship, or a funding service that actually submits account creation [1].

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a canonical protocol/account lifecycle question with exact docs pages for account creation, minimum balance, and operation result codes. `scout_research` is acceptable corroboration but not required.

## Edge / traps

The common trap is treating every generated G-address as an already-existing ledger account. Another trap is calling the 1 XLM reserve a fee that is paid to someone; it is a minimum balance locked by protocol rules until the account/subentries are removed. A plain payment is not a substitute for `CreateAccount` when the destination does not exist.
