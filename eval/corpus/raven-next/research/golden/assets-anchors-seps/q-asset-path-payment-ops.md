---
id: q-asset-path-payment-ops
q: "How do path payments work on Stellar and which two operations implement them?"
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
  - { claim: "Names PathPaymentStrictSend and PathPaymentStrictReceive as the two path-payment operations.", weight: 5 }
  - { claim: "Explains a path payment converts one asset to another by routing across the DEX orderbook and/or AMM pools in a single atomic transaction.", weight: 4 }
should_have:
  - { claim: "Strict-send fixes the source amount (receiver gets at least dest_min); strict-receive fixes the destination amount (sender pays at most send_max).", weight: 3 }
  - { claim: "Settles in a few seconds (≈ one ledger close, ~5s) at low fee.", weight: 2 }
nice_to_have:
  - { claim: "Notes the sender/recipient never needs to hold the intermediate asset (enables on-chain FX, e.g. USDC→EURC).", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent operation names (e.g. 'PathSwapOp', 'CrossAssetPaymentOp') as the canonical ops.", weight: 4 }
  - { claim: "Do NOT claim path payments require an off-chain bridge or a third-party DEX router.", weight: 3 }
must_cite:
  - "A path-payments page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/encyclopedia/transactions-specialized/path-payments
  - https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §3.2. Two ops: PathPaymentStrictSend / PathPaymentStrictReceive. Verified against developers.stellar.org path-payments / liquidity docs."
---

## Reference answer (gospel)

A **path payment** converts one asset into another in a **single atomic transaction**, routing
across the **Stellar DEX orderbook and/or AMM liquidity pools** to find a path — so the sender pays
in one asset and the recipient receives a different one, and neither party has to hold the
intermediate asset (this is what enables on-chain FX, e.g. USDC → EURC) [1]. Two operations
implement it [1]:

- **`PathPaymentStrictSend`** — the sender fixes the **exact source amount**; the recipient receives
  **at least `destMin`** of the destination asset.
- **`PathPaymentStrictReceive`** — the recipient is guaranteed an **exact destination amount**; the
  sender pays **at most `sendMax`**.

It settles in roughly one ledger close (~5 s) at the normal low network fee — no off-chain bridge or
third-party DEX router is involved.

Source: [1] developers.stellar.org path-payments / liquidity-on-the-Stellar-DEX docs.

## Why these cards (routing rationale)

Protocol operation → `stellar_docs_mcp`.

## Edge / traps

Inventing op names (e.g. "PathSwapOp") or claiming an external router/bridge is needed.
