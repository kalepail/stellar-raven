---
id: q-defi-arbitrage-pathpayment-bots
q: "Can I run a profitable arbitrage, path-payment, or market-making bot on Stellar with small capital, and how do strict-send/strict-receive path queries work?"
category: defi-ecosystem
subcategory: trading-bots
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains Stellar supports path payments and pathfinding concepts such as strict-send and strict-receive, but profitability is not guaranteed.", weight: 5 }
  - { claim: "Mentions realistic bot profitability depends on liquidity, spreads, fees, slippage, latency, failed transactions, competition, and capital, especially for small accounts.", weight: 5 }
  - { claim: "Explains path queries/simulation should be used to estimate destination amounts and guard with minimum/maximum constraints such as destination-min or send-max.", weight: 4 }
should_have:
  - { claim: "Mentions circular/same-asset arbitrage and batching should be tested carefully because paths can disappear or execute differently by submission time.", weight: 3 }
  - { claim: "Mentions result-code traps such as under-destination-min or no-path when quoting and submitting.", weight: 2 }
nice_to_have:
  - { claim: "Mentions backtesting and paper/testnet trading before risking capital.", weight: 1 }
must_avoid:
  - { claim: "Do NOT promise profit or imply small-capital arbitrage is reliably profitable.", weight: 5 }
  - { claim: "Do NOT provide financial advice as a guaranteed strategy.", weight: 5 }
must_cite:
  - "Stellar docs for path payments/pathfinding and dated market/liquidity sources for current profitability claims."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/guides/transactions/path-payments"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/path-payment-strict-send"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/path-payment-strict-receive"
  - "https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Profitability is intentionally not gated on a current numeric estimate; Phase 3 should attack any answer that turns pathfinding mechanics into financial advice."
---

## Reference answer (gospel)

Stellar supports path payments through `PathPaymentStrictSend` and `PathPaymentStrictReceive`; path payments can traverse orderbook liquidity, but the protocol does not make arbitrage or market making profitable. A strict-send quote fixes the source amount and estimates destination output, then the submitted transaction should protect the user with `destination_min`; a strict-receive quote fixes destination amount and protects the sender with `send_max`. If liquidity moves before inclusion, the operation can fail with path-payment result codes such as `UNDER_DESTMIN`, `OVER_SENDMAX`, or no usable path / too-few-offers. Sources: Stellar path-payment guide and Horizon operation-specific result-code docs.

For a small-capital bot, the defensible answer is "possible to build, not reliably profitable." Expected costs and risks include spreads, slippage, base fees and surge pricing, failed transactions, stale quotes, minimum reserves/trustlines, path disappearance, competition, latency, inventory imbalance, and thin pools. Backtesting and testnet/paper trading are required before risking funds; Raven should not recommend a strategy as a guaranteed return.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the durable answer is official path-payment, result-code, and SDEX mechanics. Scout/repos/web are acceptable only for examples of current bots or liquidity conditions; they should not replace the primary mechanics.

## Edge / traps

The trap is conflating a successful path query with a profitable executable strategy. Quotes are point-in-time estimates; orderbook offers may be consumed by other transactions or by path payments before the bot's transaction lands.
