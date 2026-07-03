---
id: q-defi-allbridge-what-is
q: "What is Allbridge and which chains does it bridge to/from Stellar?"
category: defi-ecosystem
subcategory: bridge
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [lumenloop_find_content_about_project, lumenloop_search_content_semantic, scout_projects]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Allbridge is a cross-chain bridge connecting Stellar with other chains for asset transfer.", weight: 5 }
  - { claim: "It bridges Stellar to chains including Ethereum, Solana, Celo, Polygon (and later XRP Ledger).", weight: 4 }
should_have:
  - { claim: "Notes the Stellar integration launched in 2023 ('seamless digital asset transfer between Stellar and other prominent chains').", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes Allbridge from SDF's Starbridge (a 2022 trust-minimized Stellar-Ethereum research project).", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Allbridge as a DEX, AMM, lending protocol, or oracle.", weight: 4 }
  - { claim: "Do NOT invent a chain it does not support or fabricate a bridge volume figure not in the source data.", weight: 4 }
must_cite:
  - "A source on Allbridge bridging Stellar to other chains."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/allbridge
  - https://stellar.org/press/allbridge-launch-connects-stellar-network-to-ethereum-solana-and-polygon
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Per-project identity → lumenloop_get_project. Don't confuse with Starbridge. Grounded on Scout: Allbridge enables access to the Stellar ecosystem via cross-chain bridge swaps; Allbridge Core added Stellar (via Soroban) for native USDC/stablecoin cross-chain swaps. SDF press (Jul 2023) covers the Stellar↔Ethereum/Solana/Polygon launch; Celo and XRP Ledger added later."
---

## Reference answer (gospel)

**Allbridge** is a **cross-chain bridge** that connects Stellar with other blockchains for asset
transfer. Via **Allbridge Core**, Stellar joined as a supported chain (using Soroban) to offer
**native USDC and stablecoin cross-chain swaps** [Scout: stellarlight.xyz/project/allbridge]. SDF's
press announcement (July 11, 2023) covered the Stellar bridge connecting to **Ethereum, Solana, and
Polygon** (with **Celo** and later the **XRP Ledger** added) [stellar.org press]. It is a bridge —
**not** a DEX/AMM, lending protocol, or oracle — and is distinct from SDF's 2022 **Starbridge**
research project (a trust-minimized Stellar↔Ethereum bridge).

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`.

## Edge / traps

Don't miscategorize the bridge; don't invent chains or fabricate a bridge-volume figure; distinguish
from Starbridge.
