---
id: q-defi-reflector-content
q: "Find all the content about Reflector — which protocols integrate it?"
category: defi-ecosystem
subcategory: oracle
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_content_about_project]
acceptable_cards: [lumenloop_search_content_semantic, lumenloop_find_content_by_entity]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Returns curated content about Reflector (the Stellar decentralized price oracle / data-feed network) and/or its integrating protocols (e.g. Blend, Laina, Slender; Orbit CDP, EquitX, DeFindex).", weight: 5 }
should_have:
  - { claim: "Frames Reflector as the de-facto oracle network consumed across Stellar DeFi (DAO-run node quorum delivering on-chain/off-chain prices, CEX/DEX rates, FX).", weight: 2 }
nice_to_have:
  - { claim: "Surfaces node-operator / product detail (e.g. Pulse/Flare, subscription feeds) if present.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate integrations or partner protocols not present in the corpus.", weight: 5 }
must_cite:
  - "Each surfaced item carries its source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/reflector
  - https://reflector.network/
  - https://www.halborn.com/blog/post/explained-the-yieldblox-hack-february-2026
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "All-content-for-one-project → lumenloop_find_content_about_project (this is the content/news lane; the reverse-dependency 'who depends on Reflector' query is q-defi-reflector-related-projects → lumenloop_get_related_projects, so get_related_projects removed from acceptable here to keep lanes distinct). Grounded on Scout: Reflector = decentralized price oracle / data-feed network for Stellar & Soroban via a DAO-run node quorum, powering DeFi protocols such as Blend, Laina, and Slender (dossier also lists Orbit CDP, EquitX, DeFindex). YieldBlox tie-in VERIFIED 2026-06-29 — the Feb 22 2026 (~00:25 UTC) YieldBlox/Blend V2 USTRY oracle-manipulation incident (~$10.2M, ~$7.2M/48M XLM frozen by Tier-1 validators) is multi-sourced (Halborn, QuillAudits, Olympix, Protos, Script3, Reflector). Reflector's thin-liquidity VWAP USTRY feed was the exploited price source; root cause was the consuming pool operator's feed config, NOT Reflector core (Reflector quoted correct prices for the data it observed)."
---

## Reference answer (gospel)

Curated content about **Reflector** should surface its identity as Stellar/Soroban's **decentralized
price oracle and data-feed network** — a **DAO-run node quorum** delivering on-chain/off-chain asset
prices, CEX/DEX exchange rates, FX, and subscription feeds — and its **integrating protocols**:
**Blend, Laina, Slender** (per Scout), plus **Orbit CDP, EquitX, DeFindex** (per the ecosystem dossier)
[Scout: stellarlight.xyz/project/reflector; reflector.network]. It is the **de-facto oracle network
consumed across Stellar DeFi**. A thorough answer may also surface the **Feb 2026 (Feb 21–22) YieldBlox/Blend V2 USTRY
oracle-manipulation** post-mortem, where Reflector's **thin-liquidity feeds** were the exploited price
source (root cause was the consuming pool's feed integration, not Reflector core). Each surfaced item
must carry its source; don't fabricate integrators.

## Why these cards (routing rationale)

All-content-for-one-project → `lumenloop_find_content_about_project`.

## Edge / traps

Don't fabricate integrators (stick to Blend/Laina/Slender/Orbit CDP/EquitX/DeFindex).
