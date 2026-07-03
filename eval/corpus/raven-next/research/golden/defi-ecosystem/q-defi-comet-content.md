---
id: q-defi-comet-content
q: "What's been said about weighted AMM pools or Balancer-style AMMs on Stellar/Soroban?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [scout_research, lumenloop_find_content_about_project, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Surfaces coverage of weighted/Balancer-style AMM work on Soroban, centered on Comet (the Soroban weighted-AMM reference implementation).", weight: 5 }
should_have:
  - { claim: "Notes Comet is a reference/research implementation rather than a high-traffic live DEX.", weight: 3 }
nice_to_have:
  - { claim: "Connects to the Soroban Financial Innovation showcase / Meridian 2023 demo context.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate articles or overstate weighted-AMM adoption/traffic on Stellar.", weight: 4 }
must_cite:
  - "Each surfaced item carries its source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://communityfund.stellar.org/submissions/recG7Kj7ouwAFP2XY
  - https://stellar.org/blog/ecosystem/stellar-community-fund-recap-financial-innovation-powered-soroban
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "RECONCILED 2026-06-29: prior 'Futurenet' framing was stale — live Scout lists Comet status='Live' (Protocol/Contract, type DEX, github cometdex), consistent with q-defi-comet-what-is. Updated to 'Soroban mainnet weighted AMM (Balancer-style)'. Topic-coverage lane → lumenloop_search_content_semantic (DISTINCT from q-defi-comet-what-is, which is per-project identity → lumenloop_get_project). Comet originated from the SCF 'Financial Innovation Powered by Soroban' recap + Meridian 2023 demo; it is a reference/primitive impl, not a high-traffic dominant DEX (Aquarius/Soroswap/Phoenix carry the DEX flow)."
---

## Reference answer (gospel)

Coverage of **weighted / Balancer-style AMMs** on Soroban centers on **Comet** — a **Soroban
implementation of Balancer's weighted AMM** (status Live on the directory) using a cost function to
allow flexible pool weights, surfaced through the SCF submission record and the **"Financial Innovation
Powered by Soroban"** recap / **Meridian 2023** Soroban demo context
[communityfund.stellar.org/submissions/recG7Kj7ouwAFP2XY; stellar.org SCF recap]. The honest framing:
Comet is a **reference / primitive implementation**, not a high-traffic dominant DEX — Stellar AMM TVL is
concentrated in **Aquarius** (constant-product/stable pools), with Soroswap aggregating and Phoenix
offering constant-product + stableswap pools. Each surfaced item carries its source; don't overstate
weighted-AMM traffic/adoption.

## Why these cards (routing rationale)

"What's been said about topic X" → `lumenloop_search_content_semantic`; Scout research acceptable.

## Edge / traps

Don't overstate weighted-AMM traffic; Comet is a reference impl, not a live high-volume DEX.
