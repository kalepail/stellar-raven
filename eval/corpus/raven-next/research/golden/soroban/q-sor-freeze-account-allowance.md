---
id: q-sor-freeze-account-allowance
q: "Can I lock an account (master-key weight 0) while still letting a Soroban contract move its funds via a pre-set SAC allowance, and how do I freeze a balance until a deadline?"
category: soroban
subcategory: authorization-patterns
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that setting master-key weight to 0 prevents that account key from signing future transactions; it can permanently lock the account unless other signers remain.", weight: 5 }
  - { claim: "Explains SAC/SEP-41 allowance semantics: `approve(from, spender, amount, live_until_ledger)` authorizes a spender, and `transfer_from(spender, from, to, amount)` is authorized by the spender while consuming allowance.", weight: 5 }
  - { claim: "Says a pre-set allowance can let the spender/contract pull tokens only within the allowance and expiration, but setting/changing the allowance still requires `from` authorization before the account is locked.", weight: 4 }
  - { claim: "For freezing until a deadline, recommends contract custody/escrow or a custom token/account policy keyed to ledger timestamp/sequence, not relying on a locked G-account as a timer.", weight: 4 }
should_have:
  - { claim: "Mentions issuer-level freeze/revoke/clawback/admin controls are separate asset controls, not a personal timed escrow primitive.", weight: 3 }
  - { claim: "Warns that allowance race conditions exist when overwriting allowances; zero then set/verify is safer.", weight: 2 }
nice_to_have:
  - { claim: "Suggests using ledger timestamp tests for deadline logic.", weight: 1 }
must_avoid:
  - { claim: "Do not imply a locked master key can later sign to renew/cancel allowance unless another signer remains.", weight: 5 }
  - { claim: "Do not confuse SAC allowance with a Stellar account signer/delegation mechanism.", weight: 5 }
  - { claim: "Do not claim master-key weight 0 freezes only a balance; it affects account signing authority.", weight: 4 }
must_cite:
  - "Official signatures/multisig or Set Options docs for master-key weight 0."
  - "Official SAC/SEP-41 token interface docs for approve/allowance/transfer_from."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/signatures-multisig#thresholds"
  - "https://developers.stellar.org/docs/tokens/token-interface"
  - "https://developers.stellar.org/docs/tokens/stellar-asset-contract#contract-interface"
  - "https://developers.stellar.org/docs/tokens/control-asset-access#limiting-the-supply-of-an-asset"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Stellar Docs MCP and SEP-41 on 2026-06-29."
---

## Reference answer (gospel)

Setting an account's master-key weight to 0 disables that master key from signing future transactions and can permanently lock the account if no other signer remains. It is an account-signing control, not a timed balance-freeze primitive. Source: https://developers.stellar.org/docs/learn/fundamentals/transactions/signatures-multisig#thresholds.

A SAC allowance is token-interface state. SEP-41 defines `approve(from, spender, amount, live_until_ledger)` and `transfer_from(spender, from, to, amount)`, where `transfer_from` is authorized by the spender and consumes the allowance. So yes, if the account authorized an allowance before being locked, the spender/contract can pull only up to that amount and only until the allowance expiry. But the locked account cannot later sign to change or renew that allowance unless another valid signer remains. Sources: https://developers.stellar.org/docs/tokens/token-interface and https://developers.stellar.org/docs/tokens/stellar-asset-contract#contract-interface.

To freeze a balance until a deadline, use a contract pattern: transfer/custody the tokens into an escrow contract and release only after `env.ledger().timestamp()` or a ledger-sequence condition, or use a custom token/account policy that enforces time-locked transfers. Issuer authorization, revocation, clawback, and SAC admin controls are asset-administration tools; they are not the same as a user-controlled recurring/timed escrow. Source: https://developers.stellar.org/docs/tokens/control-asset-access#limiting-the-supply-of-an-asset.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this combines official account signer semantics with official SAC/SEP-41 allowance semantics. Scout can provide examples, but the correct answer is protocol/API behavior.

## Edge / traps

The dangerous answer is "lock the account and you're done." Master-key weight 0 is irreversible without another signer. SAC allowance is not account delegation; it is token spending permission with its own expiry and amount.
