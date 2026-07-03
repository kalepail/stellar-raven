---
id: q-sor-recurring-escrow-patterns
q: "What's the recommended Soroban pattern for a recurring- subscription / time-locked-savings / escrow contract (token allowance + backend charger), and how does authorization work for the periodic pulls?"
category: soroban
subcategory: authorization-patterns
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Recommends explicit contract state for subscriptions/escrows: payer, recipient, token SAC/contract address, amount, interval/deadline, max pulls or end ledger/time, and cancellation rules.", weight: 5 }
  - { claim: "Explains periodic pulls with SEP-41/SAC allowance: payer pre-approves the contract/spender with amount and `live_until_ledger`; the backend only submits transactions, while the spender/contract authorization and allowance state gate the pull.", weight: 5 }
  - { claim: "Explains that the backend is not trusted to spend arbitrary funds; each pull must pass contract checks and token `transfer_from`/allowance limits.", weight: 4 }
  - { claim: "For time-locked savings/escrow, recommends contract custody and release conditions based on ledger timestamp/sequence rather than a locked G-account or off-chain promise.", weight: 4 }
should_have:
  - { claim: "Mentions TTL extension for long-lived subscription/escrow state and allowances, plus restore/archival caveats.", weight: 3 }
  - { claim: "Mentions cancellation/revocation by setting allowance to zero or contract cancellation state, with care for allowance overwrite race conditions.", weight: 3 }
  - { claim: "Mentions testing deadline logic with Soroban ledger timestamp/sequence controls.", weight: 2 }
nice_to_have:
  - { claim: "Mentions future custom-account/session-key/delegated-auth patterns only as optional, not required for the basic allowance model.", weight: 1 }
must_avoid:
  - { claim: "Do not imply Soroban has autonomous cron execution; an external actor must submit each periodic transaction.", weight: 5 }
  - { claim: "Do not tell users to give a backend secret keys for recurring payments.", weight: 5 }
  - { claim: "Do not ignore allowance expiration, TTL archival, or cancellation.", weight: 4 }
must_cite:
  - "Official authorization docs for `require_auth` semantics."
  - "Official token/SAC or SEP-41 docs for allowance/transfer_from."
  - "Official storage/state archival docs for long-lived state TTL."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization"
  - "https://developers.stellar.org/docs/tokens/token-interface"
  - "https://developers.stellar.org/docs/tokens/stellar-asset-contract#contract-interface"
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Stellar Docs MCP and SEP-41 on 2026-06-29."
---

## Reference answer (gospel)

The baseline pattern is not "give the backend the user's key." Store a subscription/escrow record in contract state: payer, recipient, token contract/SAC address, amount, interval or unlock time, last charge, max charges/end ledger, and cancellation state. Long-lived state needs TTL management. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage.

For recurring pulls, the payer first authorizes a token allowance to the contract/spender with `approve(from, spender, amount, live_until_ledger)`. Each period, an external service submits a transaction that calls the subscription contract. The contract checks interval, amount, cancellation, and remaining schedule, then invokes the token's `transfer_from(spender, from, to, amount)`. SEP-41 states `transfer_from` consumes the allowance and is authorized by the spender. Sources: https://developers.stellar.org/docs/tokens/token-interface and https://developers.stellar.org/docs/tokens/stellar-asset-contract#contract-interface.

The backend is just a transaction submitter. It cannot spend arbitrary funds unless the contract logic and token allowance permit the pull. Users cancel by setting allowance to zero/expiry or by calling contract cancellation logic, depending on the product design. Be careful with allowance overwrite races; the token-interface docs warn that changing allowance directly can allow old and new allowances to be spent in separate transactions. Source: https://developers.stellar.org/docs/tokens/token-interface.

For time-locked savings or escrow, custody the funds in a contract and release only after `env.ledger().timestamp()` or ledger sequence reaches the deadline, with explicit refund/cancel paths. Soroban has no autonomous cron; someone must submit each periodic charge/release transaction. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer depends on official authorization, token allowance, and storage semantics. Scout is acceptable for example repos, but not necessary for the core pattern.

## Edge / traps

The high-risk trap is giving a backend custody of user keys. Another is implying the chain runs scheduled jobs by itself. Recurring payments require pre-authorized allowance or account policy, deterministic contract checks, and an external submitter.
