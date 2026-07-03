---
id: q-pc-practical-fee-setting
q: "What fee should I set in TransactionBuilder, does 100 stroops always work, what happens under surge pricing if my max fee is too low, and is there an API to estimate fees?"
category: protocol-core
subcategory: fees-practical
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
  - { claim: "Explains the fee is a maximum bid per operation/transaction and 100 stroops is the network minimum, not a guaranteed inclusion fee under surge.", weight: 5 }
  - { claim: "Explains under surge pricing lower fee bids may be delayed or excluded.", weight: 4 }
  - { claim: "Points to feeStats, last-ledger-base-fee, or current network fee data for estimation.", weight: 4 }
should_have:
  - { claim: "Mentions avoiding excessive overbids and using SDK/TransactionBuilder fee fields correctly.", weight: 2 }
  - { claim: "References the 100-stroop base fee rather than re-deriving the fee-model arithmetic (base fee × ops, stroop magnitude) which is owned by q-protocol-fee-model-base-fee.", weight: 1 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT claim 100 stroops always wins inclusion.", weight: 5 }
  - { claim: "Do NOT confuse Stellar fees with gas units or percentage-of-transfer fees.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering"
  - "https://developers.stellar.org/docs/data/analytics/hubble/analyst-guide/queries-for-horizon-like-data#fee-stats"
  - "https://developers.stellar.org/docs/build/guides/transactions/fee-bump-transactions"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Reviewed 2026-06-29: differentiated (D2) as the decision how-to (what fee to set, surge behavior, feeStats estimation, max-bid) that references — does not re-teach — the 100-stroop base fee owned by q-protocol-fee-model-base-fee. Verified against Stellar Docs; exact live fee conditions should be read from current network/RPC/Horizon data."
---

## Reference answer (gospel)

In `TransactionBuilder`, the fee you set is a maximum inclusion-fee bid per operation, not a guaranteed spend. The network minimum effective base fee is 100 stroops per operation, so 100 stroops is enough only when traffic is below ledger limits; when the network enters surge pricing, transactions with higher maximum base-fee bids are prioritized and a transaction whose bid is below the effective base fee may be pushed to later ledgers or discarded if it waits too long. Smart-contract transactions also have a resource-fee component and can see tighter surge behavior because contract transactions compete on resource limits. Source: https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering

A practical answer should tell the caller to estimate before submitting, then cap risk: query current fee statistics or network fee data, set the highest fee the app is actually willing to pay, use timebounds or ledger bounds, and use fee-bump/resubmission patterns only when the original envelope is available and the product wants to cover a higher bid. Hubble documents Horizon-like `fee-stats` data for fee prediction, including classic/Soroban and surge metrics. Source: https://developers.stellar.org/docs/data/analytics/hubble/analyst-guide/queries-for-horizon-like-data#fee-stats

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer depends on canonical fee semantics, surge pricing, and the current recommended docs. `scout_research` is acceptable corroboration, but routing only to general web would be weaker because the main risk is misstating protocol fee semantics.

## Edge / traps

The common wrong answer is "set 100 stroops and forget it." That ignores surge pricing and the distinction between minimum fee and max bid. Another trap is importing EVM gas mental models: Stellar classic transaction fees are per operation inclusion bids, while Soroban adds resource fees; neither is a percentage of the payment amount.
