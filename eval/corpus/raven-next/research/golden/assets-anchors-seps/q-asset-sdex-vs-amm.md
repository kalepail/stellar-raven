---
id: q-asset-sdex-vs-amm
q: "Compare the Stellar DEX (SDEX) orderbook with Stellar's AMM liquidity pools — how do they price trades and what are the cost differences?"
category: assets-anchors-seps
subcategory: payments-dex
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "SDEX is an on-chain central-limit orderbook (offers via ManageBuy/SellOffer); AMM pools price via a constant-product (x*y=k) curve.", weight: 5 }
  - { claim: "AMM swaps charge a fixed 30 basis points (0.30%) fee, separate from the network fee; orderbook offers can be priced tighter or wider.", weight: 4 }
should_have:
  - { claim: "Both live in-ledger (no off-chain matching engine); path payments can route across both.", weight: 3 }
  - { claim: "AMM pool-share trustlines cost two base reserves; LPs earn the accumulated fees proportional to their share.", weight: 2 }
nice_to_have:
  - { claim: "Notes high-volume pairs tend to live on offers, exotic pairs on pools.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state the AMM fee is a different number (e.g. 0.03%, 1%, 0.25%) as the canonical Stellar pool fee.", weight: 4 }
  - { claim: "Do NOT claim Stellar's DEX is an off-chain or order-matching-server based exchange.", weight: 3 }
must_cite:
  - "The SDEX / liquidity-pools page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Required comparison (SDEX vs AMM). Dossier §3, §8.2. AMM fee = fixed 30 bps."
---

## Reference answer (gospel)

- **SDEX** is an on-chain **central-limit orderbook**: accounts post offers via `ManageBuyOffer`/`ManageSellOffer`/`CreatePassiveSellOffer`; matching is on-ledger and atomic. Offers can be priced **tighter or wider** at the maker's discretion [1].
- **AMM liquidity pools** price via a **constant-product (x·y=k)** curve; each swap charges a **fixed 30 basis points (0.30%)** fee, separate from the network fee. Fees accrue into the pool (growing `k`) and are paid out to LPs proportional to their pool shares [1].
- Both live **in-ledger (no off-chain matching engine)**, and a single **path payment** can route across **both** offers and pools in one atomic transaction [1].
- **AMM pool-share trustlines cost two base reserves** (vs one for a normal asset trustline). High-volume pairs tend to concentrate on offers; exotic/long-tail pairs on pools [1].

## Why these cards (routing rationale)

Protocol comparison → `stellar_docs_mcp`. No general-web/deep-research.

## Edge / traps

Wrong AMM fee (it is **fixed 30 bps**, not 0.03%/0.25%/1%) or describing the DEX as off-chain / order-matching-server based.
