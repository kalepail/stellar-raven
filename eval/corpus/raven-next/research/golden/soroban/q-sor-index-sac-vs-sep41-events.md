---
id: q-sor-index-sac-vs-sep41-events
q: "When indexing Soroban token events, how do I distinguish SAC (classic-wrap) transfer/mint events from soroban-token-sdk SEP-41 events (3 vs 4 topics, recipient position), filter via getEvents, and dedup by id?"
category: soroban
subcategory: sac-token-interop
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Distinguishes SEP-41 contract-token events from SAC/unified asset events: SEP-41 transfer topics are `transfer`, `from`, `to`; CAP-67 SAC/classic transfer topics add the asset identifier as a fourth topic.", weight: 5 }
  - { claim: "Explains recipient position correctly: `to` is topic[2] for transfer; `mint` uses `to` as topic[1], while SAC/classic events add the asset identifier topic after the address topics.", weight: 5 }
  - { claim: "Recommends filtering with RPC `getEvents` by contract ID and topic patterns, including `*` wildcards and cursor pagination.", weight: 4 }
  - { claim: "Says event history on ordinary RPC is short-lived and durable indexers must poll/store events or use an indexer pipeline.", weight: 3 }
  - { claim: "Requires deduplication by the RPC event `id` / cursor identity rather than by transaction hash alone.", weight: 3 }
should_have:
  - { claim: "Mentions Protocol 23/CAP-67 unified asset events for classic payments, DEX, claimable balances, clawbacks, and SAC events.", weight: 3 }
  - { claim: "Mentions muxed destination data map (`amount`, `to_muxed_id`) as a P23/CAP-67 nuance.", weight: 2 }
nice_to_have:
  - { claim: "Points to the Token Transfer Processor as the reference indexing pattern when building a production indexer.", weight: 1 }
must_avoid:
  - { claim: "Do not assume every token event has the same number of topics.", weight: 5 }
  - { claim: "Do not put the recipient in topic[3] for transfer; topic[3] is the asset identifier only for Stellar Asset/SAC unified events.", weight: 5 }
  - { claim: "Do not promise RPC event retention beyond the provider's short window.", weight: 4 }
must_cite:
  - "SEP-41 for contract-token event shapes."
  - "CAP-67 or official payment/event docs for unified SAC/classic event shapes."
  - "Official RPC/getEvents docs for filtering, cursors, and retention."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md"
  - "https://github.com/stellar/stellar-protocol/blob/master/core/cap-0067.md"
  - "https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments#summary"
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/events#reading-events"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Stellar Docs MCP and stellar-protocol on 2026-06-29. `getEvents` result field names may vary by SDK wrapper; Phase 3 can spot-check the exact JSON-RPC response shape."
---

## Reference answer (gospel)

Indexers must branch on event shape, not assume a universal token format. SEP-41 contract-token `transfer` events have topics `['transfer', from: Address, to: Address]` and data `amount` or a map containing `amount`/muxed details. Source: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md.

SAC/classic unified asset events after CAP-67 add the Stellar asset identifier as an additional topic. The official payment guide summarizes transfer topics as topic[0] = `transfer`, topic[1] = sender, topic[2] = recipient, topic[3] = asset identifier, with topic[3] present only for Stellar Assets through SAC. CAP-67 also specifies `mint` as `['mint', to: Address, sep0011_asset: String]`, so the recipient is topic[1] on `mint`, not topic[2]. Sources: https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments#summary and https://github.com/stellar/stellar-protocol/blob/master/core/cap-0067.md.

Use RPC `getEvents` with `contractIds` and topic filters; `*` can wildcard a topic position, and pagination uses cursors. For a transfer indexer, filter the SAC contract ID for assets you care about, topic[0] = transfer/mint/burn/clawback as needed, then parse address topics and the data payload. Events are ephemeral on ordinary RPC providers, so a production indexer must poll often enough and persist results, or use an indexer pipeline. Sources: https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/events#reading-events and https://developers.stellar.org/docs/data/apis/rpc/api-reference/structure/pagination.

Dedup on the event identity returned by RPC (`id` / cursor identity in the SDK response), not just transaction hash: one transaction can emit multiple token events, and CAP-67 can emit operation-level and transaction-level events for the same ledger transaction class.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a precise official-spec/RPC event-shape question. `scout_research` is useful as a secondary cross-check because Scout indexes dev docs and CAP/SEP material, but the answer should cite SEP-41, CAP-67, and developers.stellar.org.

## Edge / traps

The trap is collapsing SAC and custom SEP-41 token events into one shape. A three-topic SEP-41 transfer and a four-topic CAP-67 SAC/classic transfer are both valid, but topic[3] means asset identifier in the SAC/classic shape, not recipient. Another trap is depending on RPC as a permanent historical event store.
