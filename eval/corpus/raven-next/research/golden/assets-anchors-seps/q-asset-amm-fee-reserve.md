---
id: q-asset-amm-fee-reserve
q: "What fee does a Stellar AMM liquidity pool charge per swap, and how many base reserves does a pool-share trustline require?"
category: assets-anchors-seps
subcategory: payments-dex
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States the AMM swap fee is 30 basis points (0.30%).", weight: 5 }
  - { claim: "States a pool-share trustline consumes two base reserves (1.0 XLM).", weight: 4 }
should_have:
  - { claim: "Notes the pool enforces a constant-product (x*y=k) invariant and fees accrue to LPs.", weight: 2 }
nice_to_have:
  - { claim: "Notes pool shares cannot be transferred to another account (only deposit/withdraw).", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a wrong fee (0.03%, 0.25%, 1%) or a wrong reserve count (one base reserve).", weight: 5 }
must_cite:
  - "The Stellar liquidity-pools page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Precise-number factual. Dossier §3.3. Verified on developers.stellar.org liquidity-pools page: fee = 30 bps (0.30%); pool-share trustline = 2 base reserves; constant-product invariant A*B=k."
---

## Reference answer (gospel)

A Stellar AMM liquidity pool charges a **fixed 30 basis points (0.30%)** fee per swap, and a
**pool-share trustline requires 2 base reserves** (vs. 1 for a regular asset trustline) [1]. Pools
enforce the **constant-product invariant `Asset A * Asset B = k`** — the protocol never lets the
product of the reserves decrease — and the 0.30% fee accrues into the pool, growing `k` so it is
distributed to liquidity providers proportional to their shares [1]. Pool shares are not
transferable between accounts; they change only via deposit/withdraw.

Source: [1] developers.stellar.org "Liquidity on the Stellar DEX / Liquidity Pools" page.

## Why these cards (routing rationale)

Precise protocol fact → `stellar_docs_mcp`.

## Edge / traps

Wrong fee (0.03% / 0.25% / 1%) or wrong reserve count (one base reserve).
