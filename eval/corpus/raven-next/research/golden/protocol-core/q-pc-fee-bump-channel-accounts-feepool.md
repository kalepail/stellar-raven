---
id: q-pc-fee-bump-channel-accounts-feepool
q: "How do fee-bump transactions and channel or fee-paying accounts work, does the fee account sign or use sequence, why can fees look doubled, and what is the fee pool?"
category: protocol-core
subcategory: fees-fee-bump
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains a fee-bump transaction wraps an inner transaction and has a fee source that pays the fee.", weight: 5 }
  - { claim: "States the fee source signs the fee-bump envelope, while the inner transaction still has its own source/sequence/signatures.", weight: 5 }
  - { claim: "Explains the fee account does not consume its sequence number merely by paying the fee bump.", weight: 4 }
  - { claim: "Explains why a fee-bump's displayed total fee can look doubled/larger (the outer envelope bids for the inner transaction's operations plus the fee-bump wrapper).", weight: 4 }
should_have:
  - { claim: "Notes the max fee is a bid under surge pricing, deferring fee-selection strategy to fee-setting guidance (owned by q-pc-practical-fee-setting).", weight: 2 }
  - { claim: "Mentions feeStats or network fee endpoints for estimating current inclusion fees.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT claim fee-bump replaces inner transaction authorization.", weight: 5 }
  - { claim: "Do NOT say the fee source sequence number is consumed like a normal source transaction.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/fee-bump-transactions
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md
  - https://developers.stellar.org/docs/build/guides/transactions/channel-accounts
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering#inclusion-fee
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Reviewed 2026-06-29: differentiated (D3) — dropped the surge-fee-choice clause from the q and downgraded the surge must_have to should_have so surge/fee-selection is owned by q-pc-practical-fee-setting; this question keeps the fee-bump-specific 'why fees look doubled' as a must_have. Fee-bump and channel-account mechanics verified against official docs and CAP-0015. Fee-pool wording follows prior-art protocol notes; verify current fee-pool XDR/core semantics directly before using as tokenomics ground truth."
---

## Reference answer (gospel)

A fee-bump transaction wraps an already-signed inner transaction in an outer fee-bump envelope. The outer fee source signs and pays the fee; the inner transaction keeps its own source account, sequence number, operations, and signatures [1][2]. Fee-bump was introduced so an arbitrary account can pay fees for an existing transaction without re-signing the inner transaction or managing the inner source's sequence number [2]. Paying a fee bump does not consume the fee account's sequence number the way making it the transaction source would.

Channel accounts are a different pattern for throughput: use separate source accounts for transactions while the operation source can still be the asset-holding/base account. That spreads sequence numbers across channels and avoids out-of-order `tx_bad_seq` contention, but the channel transaction source consumes its own sequence number and signs with the needed keys [3]. Displayed fees can look "doubled" because a fee-bump envelope carries an outer bid covering the inner transaction's operations plus the fee-bump wrapper, on top of the inner fee field [4]. The fee field is a maximum bid (not always the amount charged), so under surge an underbid may not make it into the ledger; the practical "what fee should I set / how to read fee stats under surge" decision is deferred to `q-pc-practical-fee-setting`. Stellar transaction fees go to the protocol fee pool, not to validator rewards; deeper burn/monetary-policy handling belongs in the separate fee-pool/tokenomics golden.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because official transaction, fee-bump, channel-account, and fee docs answer the mechanics. Scout is acceptable corroboration; general web is unnecessary unless checking a current operational service's fee endpoint behavior.

## Edge / traps

Do not say fee bump replaces inner authorization; it only changes who pays the outer fee. Do not say the fee source sequence number is consumed just for paying a fee bump. Do not confuse channel accounts with fee-bump accounts: channels are transaction sources for sequence parallelism, while fee bumps wrap an existing inner transaction.
