---
id: q-infra-rpc-methods-list
q: "What are the main Stellar RPC methods, and which one do I use to dry-run a contract call before submitting?"
category: tooling-infra
subcategory: rpc-methods
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Stellar RPC methods include getHealth, getNetwork, getLatestLedger, getLedgerEntries, getTransaction(s), getEvents, getFeeStats, sendTransaction, and simulateTransaction.", weight: 5 }
  - { claim: "`simulateTransaction` is the method used to dry-run/footprint a contract call before submitting.", weight: 5 }
should_have:
  - { claim: "`getLedgers` is the archive-tier method for full ledger-history retrieval.", weight: 2 }
  - { claim: "`getEvents` retrieves contract events but has a limited retention window (24h default, ~7 days max).", weight: 2 }
nice_to_have:
  - { claim: "Points to the canonical RPC methods reference on developers.stellar.org.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent RPC method names that aren't in the spec, or attribute Horizon REST paths (e.g. /accounts) as RPC methods.", weight: 4 }
  - { claim: "Do NOT name a Horizon endpoint instead of `simulateTransaction` for dry-running contract calls.", weight: 4 }
must_cite:
  - "developers.stellar.org RPC API-reference methods page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getEvents
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: simulateTransaction is the load-bearing answer; inventing method names is the trap. 12-method enum is this file's lane (vs q-infra-simulate-transaction-howto, the procedure). Retention normalized: getEvents reference cites ~24h default with a ~7-day max queryable window; the unified HISTORY_RETENTION_WINDOW config default is 120960 ledgers (~7 days). Rubric gates on the durable 'limited window' fact, not the exact default."
---

## Reference answer (gospel)

The full Stellar RPC method set (per the RPC methods reference): **`getHealth`, `getNetwork`,
`getVersionInfo`, `getLatestLedger`, `getLedgers`, `getLedgerEntries`, `getTransaction`,
`getTransactions`, `getEvents`, `getFeeStats`, `sendTransaction`, `simulateTransaction`** (12 methods).
To **dry-run / footprint a contract call before submitting**, use **`simulateTransaction`** — it returns
the resource footprint, auth, and Soroban resource fees, which you apply before `sendTransaction`.
`getLedgers` is the archive-tier method for full ledger history. `getEvents` reads contract events but
keeps a **limited window** — **24h by default, configurable up to ~7 days max** — so older events need
an indexer.

## Why these cards (routing rationale)

Enumerate-the-methods list grounded in the RPC reference → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Inventing method names or substituting Horizon REST paths (e.g. `/accounts`) for RPC methods. Naming a
Horizon endpoint instead of `simulateTransaction` for dry-running. Asserting a flat "7 days" event
retention as the default (24h is the default; ~7 days is the configurable ceiling).
