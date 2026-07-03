---
id: q-defi-etherfuse-stablebonds
q: "What are Etherfuse Stablebonds on Stellar (e.g. USTRY/CETES) and how would a DeFi app integrate or reason about them?"
category: defi-ecosystem
subcategory: rwa
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_directory, lumenloop_get_project, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Etherfuse issues Stablebonds — tokenized government bonds — on Stellar.", weight: 5 }
  - { claim: "USTRY ≈ a tokenized US Treasury instrument and CETES ≈ a tokenized Mexican government bond.", weight: 4 }
  - { claim: "Stablebonds are usable as RWA collateral in Stellar DeFi (e.g. OrbitCDP).", weight: 4 }
should_have:
  - { claim: "Stablebonds like USTRY have been involved in a Stellar oracle/RWA-pricing incident (commonly cited as the YieldBlox/Reflector episode) — illustrating thin-liquidity RWA pricing risk.", weight: 2 }
nice_to_have:
  - { claim: "Notes integration means trustline/SAC handling plus oracle pricing for the RWA.", weight: 1 }
must_avoid:
  - { claim: "Do NOT confuse Etherfuse with other RWA issuers like Franklin Templeton (BENJI) or Ondo.", weight: 5 }
  - { claim: "Do NOT invent specific yields, dollar figures, or incident loss amounts for the Stablebonds.", weight: 4 }
must_cite:
  - "Scout / Lumenloop provenance for Etherfuse + a source tying USTRY/CETES to Etherfuse (e.g. the OrbitCDP directory record)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/orbitcdp
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "GROUNDED 2026-06-22: live Scout confirms OrbitCDP (Live, Lending, SCF $280K) describes its collateral as 'XLM and Etherfuse tokenized bonds like the USTRY US Treasury token and CETES Mexican T-bills' — directly grounding Etherfuse=Stablebonds issuer, USTRY≈US Treasury token, CETES≈Mexican T-bills, used as RWA collateral. YieldBlox/USTRY incident tie-in VERIFIED 2026-06-29: the USTRY-collateralized YieldBlox/Blend V2 pool was drained ~$10.2M on Feb 22 2026 via thin-liquidity oracle manipulation (multi-sourced: Halborn, QuillAudits, Olympix, Protos). Specific incident $ figures still NOT gated (the question is about the asset, not the hack) — kept as should_have (weight 2) and must_avoid still bans inventing incident loss amounts. Do not invent yields. Freshness:true (weekly)."
---

## Reference answer (gospel)

**Etherfuse** issues **Stablebonds** — **tokenized government bonds** — on Stellar. **USTRY** ≈ a
tokenized **US Treasury** token and **CETES** ≈ a tokenized **Mexican** government bond (T-bills). These
are used as **RWA collateral** in Stellar DeFi: the **OrbitCDP** directory record explicitly lists "XLM
and Etherfuse tokenized bonds like the USTRY US Treasury token and CETES Mexican T-bills" as vault
collateral [1]. A USTRY-related Stellar oracle/RWA-pricing episode (commonly cited as the
**YieldBlox/Reflector** incident) is a reminder to price thin-liquidity RWAs carefully — but do not
assert specific loss figures unless verified against a primary source.

Source: [1] stellarlight.xyz OrbitCDP directory record (Scout, 2026-06-22).

Integration: handle the asset's **trustline / SAC**, and reason about **oracle pricing** for the RWA
(thin-liquidity risk). Raven should not invent specific yields.

## Why these cards (routing rationale)

"What is this project / how to integrate" → **`scout_projects`** (with `lumenloop_search_directory` /
`lumenloop_get_project` / `parallel_search` acceptable). Deep-research tier is forbidden.

## Edge / traps

Traps: (a) confusing **Etherfuse** with **Franklin Templeton (BENJI)** or **Ondo**; (b) **inventing
yields/figures**. Both are `must_avoid`.
