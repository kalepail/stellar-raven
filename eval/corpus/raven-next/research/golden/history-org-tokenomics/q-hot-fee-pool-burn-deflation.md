---
id: q-hot-fee-pool-burn-deflation
q: What is the Stellar fee pool, where do transaction fees go, and does ongoing fee burning create deflationary pressure on XLM supply?
category: history-org-tokenomics
subcategory: tokenomics-fees
axes:
  - tool-targeted
  - ecosystem-spectrum
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null
expected_cards:
  - stellar_docs_mcp
acceptable_cards:
  - scout_research
forbidden_cards: []
expected_service: stellar_docs
should_fire: true
must_have:
  - claim: Explains where Stellar transaction fees go under the current protocol semantics, including the fee pool/burn behavior as documented.
    weight: 5
  - claim: Distinguishes ordinary per-transaction fees from the 2019 one-time XLM supply burn and from the now-ended inflation mechanism.
    weight: 5
  - claim: "Answers the deflation question carefully: fees can reduce available supply only to the extent the protocol burns/removes them, but ordinary fees are tiny relative to total supply."
    weight: 4
should_have:
  - claim: Mentions base fee/surge pricing only as fee calculation context, not as a separate monetary-policy mechanism.
    weight: 2
  - claim: Uses protocol documentation rather than price-tokenomics speculation.
    weight: 2
nice_to_have:
  - claim: Notes that a current protocol/source should be checked if fee-pool semantics change in a future protocol upgrade.
    weight: 1
must_avoid:
  - claim: Do NOT claim transaction fees are paid to validators as staking/mining rewards.
    weight: 5
  - claim: Do NOT confuse ongoing fee handling with the 2019 SDF supply burn.
    weight: 4
  - claim: Do NOT overstate normal transaction fees as a major guaranteed deflationary driver without evidence.
    weight: 4
must_cite:
  - Official Stellar developer/protocol documentation for transaction fees or fee pool behavior.
must_not_use_tier: []
pass_threshold: 0.75
weight_profile: standard
sources:
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0005.md
  - https://stellar.org/blog/foundation-news/sdfs-next-steps
  - https://developers.stellar.org/docs/tokens/anatomy-of-an-asset
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: medium
notes: Protocol fee-pool wording should be re-checked in Phase 3 against current stellar-core/protocol source. Dossier evidence supports no validator fee rewards and tiny ordinary fees relative to supply.
---

## Reference answer (gospel)

Stellar transaction fees are network fees, not validator/miner/staker rewards. Current developer docs explain classic inclusion fees and Soroban resource fees; smart-contract fees include resource fees in addition to inclusion fees. For the monetary-policy answer, distinguish three things: ordinary per-transaction fees, the historical inflation mechanism that validators voted to end in 2019, and SDF's one-time 2019 burn of roughly 55B XLM.

A careful answer may say fees are removed from ordinary circulating use under the protocol's fee-pool/burn semantics as documented, but ordinary fees are deliberately tiny and should not be oversold as a major guaranteed deflation engine for XLM. The 2019 burn was a one-time SDF supply action, not an ongoing per-transaction fee mechanism, and fees are not paid out to validators as staking rewards.

## Why these cards (routing rationale)

`stellar_docs_mcp` is expected because fees and protocol semantics require official docs or stellar-protocol source. `scout_research` can corroborate the 2019 burn context.

## Edge / traps

Common errors import Bitcoin/Ethereum/PoS economics: validator fee rewards, staking yield, or EIP-1559-style tokenomics. Another error is treating normal fees as equivalent to the November 2019 supply burn.
