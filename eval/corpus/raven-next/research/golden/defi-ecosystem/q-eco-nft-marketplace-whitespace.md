---
id: q-eco-nft-marketplace-whitespace
q: "Is there a mature NFT marketplace on Stellar I could integrate?"
category: defi-ecosystem
subcategory: market-map
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_find_similar_projects_semantic, lumenloop_search_content_semantic, scout_clusters, lumenloop_request_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Surfaces the real Stellar NFT marketplace(s) from the directory — Litemint is the Stellar-native NFT marketplace (integrates Soroban for royalties); Rarible also supports Stellar.", weight: 5 }
should_have:
  - { claim: "Honestly characterizes NFT marketplaces as a thin/under-built category on Stellar (few options, none MetaMask/OpenSea-scale) rather than a crowded, mature market.", weight: 3 }
nice_to_have:
  - { claim: "Notes wallets like Freighter offer native NFT management, and Litemint also runs an on-chain game (Cyberbrawl) using NFT assets.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim there is NO NFT marketplace on Stellar — Litemint (Stellar-native) and Rarible are live in the directory.", weight: 5 }
  - { claim: "Do NOT invent a Stellar NFT marketplace not in the source data, and do NOT present a non-Stellar marketplace (e.g. OpenSea) as Stellar-native.", weight: 4 }
must_cite:
  - "The directory/Scout entries for Litemint (and Rarible) as the Stellar NFT-marketplace evidence."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "CORRECTED vs dossier (re-verified 2026-06-29): live Scout surfaces Litemint (Stellar-native NFT marketplace, Soroban royalties) and Rarible (multi-chain, Stellar-supported); Cyberbrawl (Litemint's on-chain TCG) is also Live. The Phase-1 'NFT marketplaces undeveloped / none surfaced' framing was stale. Honest answer: marketplaces exist but the category is thin/under-built (not crowded). This file OWNS the INTEGRATE-DECISION lane ('is there a mature marketplace I could integrate') — DISTINCT from q-defi-nft-standards-projects (NFT representation standards + project roster). Gate rewards naming Litemint and forbids the 'no NFT marketplace exists' claim."
---

## Reference answer (gospel)

There **is** a Stellar NFT marketplace to integrate, but the category is **thin** [1]:

- **Litemint** — the **Stellar-native** NFT marketplace; integrates **Soroban** smart contracts for
  royalties. (Litemint also runs **Cyberbrawl**, a live on-chain trading-card game using NFT assets.)
- **Rarible** — a multi-chain NFT marketplace that **supports Stellar** among its chains.

So the honest framing: a builder **can** integrate (Litemint is the obvious Stellar-native venue), but
NFT marketplaces on Stellar are an **under-built / thin** category — there is no OpenSea-scale dominant
venue. Wallets like **Freighter** also provide native NFT management, but that is custody/display, not
a marketplace.

Source: [1] stellarlight.xyz directory (Scout `NFT marketplace` search).

## Why these cards (routing rationale)

Directory discovery → `scout_projects` (curated catalog of the NFT lane); `scout_clusters` /
similar / content search acceptable for the saturation framing.

## Edge / traps

The Phase-1 trap was claiming the category is empty — it isn't (Litemint, Rarible). The correct answer
names the real marketplace(s), flags the category is thin, and does NOT import OpenSea as Stellar-native.
