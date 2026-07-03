---
id: q-infra-horizon-deprecated
q: "Is Horizon deprecated now that Stellar RPC exists? Should I rip out my Horizon integration?"
category: tooling-infra
subcategory: rpc-horizon
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
  - { claim: "Horizon is NOT formally deprecated; it remains the REST API for classic Stellar data.", weight: 5 }
  - { claim: "Stellar RPC is positioned as the forward path for Soroban, but it does not cover all Horizon endpoints.", weight: 4 }
should_have:
  - { claim: "Because ~half of Horizon endpoints have no direct RPC equivalent, you should keep Horizon (or add an indexer) for those rather than ripping it out wholesale.", weight: 3 }
nice_to_have:
  - { claim: "References the official Aug 2025 migration guide as the basis for this guidance.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert Horizon is deprecated/shut down or that RPC has fully replaced it.", weight: 5 }
must_cite:
  - "developers.stellar.org Horizon page and/or migrate-from-horizon-to-rpc guide."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/horizon
  - https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Directly probes the 'Horizon is deprecated' misconception flagged in must_avoid for this category. Verified: the migration guide does not declare Horizon deprecated; it documents that many Horizon endpoints have no direct RPC equivalent."
---

## Reference answer (gospel)

**No — Horizon is not deprecated.** It remains the REST/HAL API for **classic Stellar data** (accounts,
transactions, operations, payments, offers, liquidity pools, claimable balances, effects). Stellar RPC
is positioned as the **forward path for Soroban**, but it **does not cover all of Horizon's surface**:
the official "Migrate from Horizon to RPC" guide shows that **roughly half of Horizon's endpoints have
no direct RPC equivalent** (claimable balances, offers, liquidity pools, `operations/{id}`, the
effects/operations-by-id family). The guide's own recommendation for those is to "partner with an
indexer or build your own indexed representation."

**So don't rip it out wholesale.** Keep Horizon (or add an indexer) for the classic-data endpoints with
no RPC equivalent; adopt RPC for Soroban/contract work.

## Why these cards (routing rationale)

Status/clarification fact → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Asserting Horizon is deprecated/shut down, or that RPC has fully replaced it, is the central trap.
