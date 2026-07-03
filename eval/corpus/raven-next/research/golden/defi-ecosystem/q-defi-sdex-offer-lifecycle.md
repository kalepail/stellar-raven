---
id: q-defi-sdex-offer-lifecycle
q: "After submitting Stellar Manage Buy/Sell offers, how do I track offer ids, fills, cancellations, and path-payment executions through the SDEX orderbook?"
category: defi-ecosystem
subcategory: sdex-offers
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
  - { claim: "Explains Manage Buy Offer and Manage Sell Offer operations create, update, or delete offers and return effects/results that include offer identifiers or changed offer state.", weight: 5 }
  - { claim: "Explains offer fills/cancellations can be tracked through Horizon/account offers, operations/effects, trades, or streams, with a missing/404 or absent offer meaning it may be filled, deleted, or unavailable depending on context.", weight: 4 }
  - { claim: "Explains SDEX offers can be consumed by path payments, so trades may occur through path execution rather than only a user-visible direct orderbook match.", weight: 4 }
should_have:
  - { claim: "Mentions parsing transaction result XDR or effects to capture offer ids programmatically.", weight: 3 }
  - { claim: "Mentions partial fills and offer updates can leave a remaining offer with changed amount.", weight: 2 }
nice_to_have:
  - { claim: "Mentions streaming reconnection/pagination for reliable bots.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assume an offer disappeared only because it was fully filled; it may have been deleted or affected by other orderbook state.", weight: 4 }
  - { claim: "Do NOT say SDEX trades only execute when two users manually cross visible offers outside path payments.", weight: 5 }
must_cite:
  - "Stellar operation docs and Horizon/API docs for offers/effects/trades."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/manage-buy-offer"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/manage-sell-offer"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Phase 3 can tighten exact endpoint names if desired, but the protocol behavior is verified."
---

## Reference answer (gospel)

Manage Buy Offer and Manage Sell Offer create, update, or delete SDEX offers. The offer operation succeeds when placed/updated, can fail with codes such as `*_NOT_FOUND` for an unknown offer ID, and orderbook offers are stored as ledger obligations until consumed or canceled. Stellar docs explicitly state an offer can be consumed by another order, consumed by a path payment, or canceled by the creating account.

A bot should track lifecycle from transaction result XDR/effects, account offers, operations/effects, trades, and streams/pagination. Partial fills can leave a remaining offer with a reduced amount; absence from account offers may mean it was fully filled, canceled/deleted, expired from the queried view, or otherwise unavailable depending on context. Reliable tracking must handle stream reconnects and cursor pagination.

## Why these cards (routing rationale)

`stellar_docs_mcp` is expected because this is protocol/API documentation: SDEX orderbook behavior, operation result codes, and Horizon tracking surfaces.

## Edge / traps

Do not assume SDEX trades only happen through visible manual orderbook crossing; path payments can consume offers. Do not infer one cause from a disappeared offer without checking operation/effect/trade history.
