---
id: q-infra-rpc-providers-list
q: "I don't want to run my own RPC node — which providers offer hosted Stellar RPC, and is there a free public endpoint?"
category: tooling-infra
subcategory: rpc-providers
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Hosted Stellar RPC providers include Validation Cloud, QuickNode, Blockdaemon, Nodies, Ankr, NowNodes, Alchemy, and others (the official Providers page is the canonical list).", weight: 5 }
  - { claim: "There are publicly-accessible RPC URLs too (e.g. via Liquify, Gateway, sorobanrpc.com, Nodies) for prototyping.", weight: 3 }
should_have:
  - { claim: "The official developers.stellar.org Providers page is freshness-sensitive (the roster and tiers change over time).", weight: 2 }
nice_to_have:
  - { claim: "Notes coverage differs by network (Testnet/Mainnet/Futurenet) per provider.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent provider names/URLs, or present a public endpoint as a production-grade SLA.", weight: 4 }
must_cite:
  - "developers.stellar.org RPC Providers page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/data/apis/rpc/providers
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Re-verified 2026-06-29: Providers page lists ~15 hosted providers (Blockdaemon, Validation Cloud, QuickNode, NowNodes, Gateway, Ankr, InfStones, Obsrvr, Nodies, OnFinality, Lightsail/Quasar, Uniblock, Exaion, Alchemy, GetBlock, Liquify) with a getLedgers archive tier on a subset. Freshness-sensitive: roster/tiers shift; reward pointing to the canonical Providers page + flagging staleness, not memorizing the list."
---

## Reference answer (gospel)

You don't need to self-host — the **official Providers page (`developers.stellar.org/docs/data/apis/rpc/providers`)
is the canonical, freshness-sensitive roster**. As of mid-2026 it lists ~15-16 hosted providers including
**Validation Cloud, QuickNode, Blockdaemon, NowNodes, Gateway, Ankr, InfStones, Obsrvr, Nodies,
OnFinality, Lightsail/Quasar, Uniblock, Exaion, Alchemy, GetBlock, and Liquify**, with coverage that
differs by network (Testnet/Mainnet/Futurenet) and an "RPC Archive" (`getLedgers`) tier on a subset.

There are also **publicly-accessible endpoints** for prototyping (e.g. via **Liquify, Gateway
(`soroban-rpc.{testnet,mainnet}.stellar.gateway.fm`), `sorobanrpc.com`, Nodies, SDF's
`rpc-futurenet.stellar.org`**) — but treat these as best-effort, **not a production SLA**. The roster
and tiers shift, so check the page rather than memorizing it.

## Why these cards (routing rationale)

The canonical provider roster lives on first-party docs → `stellar_docs_mcp`, even though freshness-sensitive. Deep-research/general-web are misses.

## Edge / traps

Fabricating provider names/URLs, or presenting a free public endpoint as production-grade, are the traps.
