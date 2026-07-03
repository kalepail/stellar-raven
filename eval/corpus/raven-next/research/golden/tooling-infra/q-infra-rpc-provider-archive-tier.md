---
id: q-infra-rpc-provider-archive-tier
q: "I need full ledger history over RPC (getLedgers). Which Stellar RPC providers support the archive tier, and how do I choose between providers?"
category: tooling-infra
subcategory: rpc-providers-comparison
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Only a subset of providers expose the new RPC Archive tier that supports the `getLedgers` method for full ledger-history retrieval (e.g. Gateway, Ankr, Obsrvr, OnFinality, Lightsail/Quasar, Exaion, GetBlock).", weight: 5 }
  - { claim: "Archive-aware workloads must pick from that archive-tier subset; the other providers are fine for current-state reads but not full history.", weight: 4 }
should_have:
  - { claim: "Choice also depends on network coverage (Testnet/Mainnet/Futurenet) and dedicated-node availability; the official Providers table is the source of truth.", weight: 3 }
  - { claim: "Validation Cloud / QuickNode are low-friction consumer options; Blockdaemon/QuickNode/NowNodes offer dedicated production nodes.", weight: 2 }
nice_to_have:
  - { claim: "Archive data can also be self-hosted via the RPC data-lake integration.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim every RPC provider supports the getLedgers archive tier.", weight: 4 }
  - { claim: "Do NOT invent provider archive-support that contradicts the official Providers table.", weight: 3 }
must_cite:
  - "developers.stellar.org RPC Providers page (archive tier column) and getLedgers method docs."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/rpc/providers
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getLedgers
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Re-verified 2026-06-29 against the Providers page: 15 providers total; RPC Archive tier exposed by Gateway, Ankr, Obsrvr, OnFinality, Lightsail/Quasar, Exaion, GetBlock; page confirms 'Currently only the getLedgers RPC method supports this feature.' Freshness-sensitive (subset changes) — gate on 'only a subset supports archive; Providers table is source of truth', reward flagging staleness."
---

## Reference answer (gospel)

Full ledger history over RPC requires the **RPC Archive** tier, which supports the **`getLedgers`**
method — and **only a subset of providers expose it**
([Providers](https://developers.stellar.org/docs/data/apis/rpc/providers)). As of mid-2026 that subset
is: **Gateway, Ankr, Obsrvr, OnFinality, Lightsail Network (Quasar), Exaion, GetBlock** (this list is
freshness-sensitive — check the official Providers table for the live set).

- **Archive-aware workloads** (full ledger history / history-aware joins) must pick from that
  archive-tier subset; the **other providers are fine for current-state reads** but not full history.
- Choice also depends on **network coverage** (Testnet/Mainnet/Futurenet) and **dedicated-node**
  availability — the Providers table is the source of truth.
- Validation Cloud / QuickNode are low-friction consumer options; Blockdaemon / QuickNode / NowNodes
  offer dedicated production nodes.
- Archive data can also be **self-hosted** via the RPC data-lake/Galexie integration.

Do **not** assume every provider supports `getLedgers` — most do not.

## Why these cards (routing rationale)

Provider tradeoff comparison grounded in the first-party Providers table → `stellar_docs_mcp`. Deep-research/general-web are misses even though freshness-sensitive.

## Edge / traps

Claiming universal archive-tier support is the trap.
