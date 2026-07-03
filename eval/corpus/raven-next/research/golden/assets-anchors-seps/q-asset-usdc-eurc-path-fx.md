---
id: q-asset-usdc-eurc-path-fx
q: "How can a Stellar wallet deliver EURC to a recipient when the sender only holds USDC, without the wallet touching the intermediate assets?"
category: assets-anchors-seps
subcategory: payments-dex
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
  - { claim: "Uses a path payment (PathPaymentStrictReceive/StrictSend) with source asset USDC and destination asset EURC.", weight: 5 }
  - { claim: "The network finds a path through SDEX offers and/or AMM pools and delivers EURC atomically in one transaction.", weight: 4 }
should_have:
  - { claim: "The sender/recipient must each hold a trustline to the asset they receive (recipient needs EURC trustline).", weight: 2 }
  - { claim: "Settles in seconds at low fee; the wallet never has to hold XLM or the intermediate hop asset.", weight: 2 }
nice_to_have:
  - { claim: "Notes strict-receive bounds the EURC delivered while capping USDC spent (send_max).", weight: 1 }
must_avoid:
  - { claim: "Do NOT recommend an off-chain FX bridge or centralized swap as the canonical Stellar mechanism.", weight: 3 }
  - { claim: "Do NOT claim the wallet must first manually swap on an external DEX then send.", weight: 2 }
must_cite:
  - "A path-payments / SDEX page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Applied how-to combining path payments + stablecoins. Dossier §3.5, §4.5."
---

## Reference answer (gospel)

- Use a **path payment** — `PathPaymentStrictReceiveOp` (or `PathPaymentStrictSendOp`) — with **source asset USDC** and **destination asset EURC** [1].
- The network **finds a path** through SDEX offers and/or AMM pools (e.g. USDC→XLM→EURC) and delivers EURC **atomically in one transaction**; the wallet never has to hold XLM or the intermediate hop asset [1].
- The **recipient must hold a trustline to the asset they receive (EURC)** for the payment to land; trustlines are required for non-native assets [1].
- Strict-receive bounds the EURC delivered while capping USDC spent via **`sendMax`** (strict-send instead fixes the USDC sent and sets a `destMin`). Settles in seconds for a low network fee [1].

## Why these cards (routing rationale)

How-to on a native protocol capability → `stellar_docs_mcp`. No general-web/deep-research.

## Edge / traps

Suggesting an off-chain FX bridge / centralized swap, or telling the wallet to manually swap on an external DEX first, instead of a native single-transaction path payment.
