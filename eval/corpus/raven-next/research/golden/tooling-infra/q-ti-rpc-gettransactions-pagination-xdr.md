---
id: q-ti-rpc-gettransactions-pagination-xdr
q: "How do I reliably page Stellar RPC getTransactions/ getEvents with the cursor (and detect when my poller falls behind the per-call 200 limit), and decode resultMetaXdr to extract ops, affected accounts, and trustline changes?"
category: tooling-infra
subcategory: assets-balances
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains RPC cursor pagination: pass the returned opaque cursor into the next request and persist the last processed cursor/ledger transactionally.", weight: 5 }
  - { claim: "Corrects the limit premise: Horizon REST uses 1-200 records, while RPC `getEvents` docs allow 1-10000 and default 100; method-specific limits must be checked in RPC docs/provider behavior.", weight: 5 }
  - { claim: "Describes fall-behind detection by comparing latest ledger/retention window and by treating full pages/backlog growth as a signal to backfill from a data lake/indexer rather than assuming cursor continuity forever.", weight: 4 }
  - { claim: "Explains that `resultMetaXdr` must be XDR-decoded to inspect transaction metadata for operations, ledger-entry changes, affected accounts, trustline changes, and contract events.", weight: 5 }
should_have:
  - { claim: "Mentions that RPC/Horizon are not perfect substitutes and some Horizon endpoints/effects require XDR decoding or an indexer.", weight: 3 }
  - { claim: "Recommends idempotent processing keyed by transaction hash/ledger/index to survive retries.", weight: 3 }
nice_to_have:
  - { claim: "Mentions CAP-67/unified events as relevant for transfer-event monitoring on newer protocols.", weight: 1 }
must_avoid:
  - { claim: "Do NOT hard-code Horizon's 200 limit as the RPC getEvents limit.", weight: 5 }
  - { claim: "Do NOT claim Stellar RPC fully replaces every Horizon endpoint or swap their roles.", weight: 5 }
  - { claim: "Do NOT parse XDR blobs with string matching instead of SDK/XDR decoders.", weight: 4 }
must_cite:
  - "Primary RPC pagination docs and Horizon-to-RPC migration/XDR docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/apis/rpc/api-reference/structure/pagination"
  - "https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc#endpoint-mapping"
  - "https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments#summary"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/structure/pagination/page-arguments"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "The question's 'per-call 200 limit' applies to Horizon pagination. Phase 3 verified official RPC docs expose `getEvents` 1-10000/default 100 and `getTransactions` pagination shape, but not a universal `getTransactions` numeric limit across every provider; keep method/provider limits configurable."
---

## Reference answer (gospel)

For Stellar RPC methods that support pagination, the cursor is opaque. Persist the last fully processed cursor and ledger position, call the next page with that cursor, process idempotently, then commit the new cursor only after your downstream write succeeds. Do not invent meaning from the cursor string.

The question's 200-record premise needs correction. Horizon REST pagination is `limit=1..200`, but Stellar RPC pagination docs state `getEvents` defaults to 100 and allows up to 10000. `getTransactions` and provider deployments should be checked against the current RPC method docs/provider behavior; a robust poller treats method limits as configuration. If pages are consistently full, latest-ledger distance grows, or your requested start point falls outside RPC retention, treat that as falling behind and backfill from an indexer/data lake/Hubble rather than assuming the cursor can recover all history.

To extract operations, affected accounts, trustline changes, and events, decode `resultMetaXdr` with a current Stellar SDK/XDR library. The Horizon-to-RPC migration docs explicitly point to transaction meta XDR for event/effect-style data. After decoding, inspect transaction envelopes/operations plus ledger-entry changes for account/trustline deltas, and contract events for Soroban/SAC transfer flows.

## Why these cards (routing rationale)

`stellar_docs_mcp` is expected because the answer depends on official RPC pagination, Horizon pagination, and Horizon-to-RPC migration docs. `scout_research` and general web search are acceptable for provider-specific behavior or indexer backfill options.

## Edge / traps

The main trap is mixing Horizon and RPC limits, especially hard-coding Horizon's 200 into an RPC poller. Another is assuming `getEvents` replaces every Horizon operation/effect endpoint. For classic trustline deltas, decoding transaction metadata or using a historical/indexer pipeline is often necessary.
