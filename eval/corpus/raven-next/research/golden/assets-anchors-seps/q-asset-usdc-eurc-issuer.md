---
id: q-asset-usdc-eurc-issuer
q: "Who issues USDC and EURC on Stellar, and when did EURC launch on the network?"
category: assets-anchors-seps
subcategory: stablecoins
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Identifies Circle as the issuer of both USDC and EURC on Stellar.", weight: 5 }
  - { claim: "States EURC launched on the Stellar network on September 26, 2023.", weight: 3 }
should_have:
  - { claim: "USDC is USD-backed and EURC is euro-backed, each redeemable 1:1.", weight: 2 }
  - { claim: "Both are issued as classic Stellar assets (and thus get a reserved SAC).", weight: 2 }
nice_to_have:
  - { claim: "Notes EURC's MiCA-regulated status (Circle Mint Europe entity).", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute USDC/EURC issuance to Tether, Paxos, or the Stellar Development Foundation.", weight: 4 }
  - { claim: "Do NOT claim USDC/EURC are algorithmic or non-fiat-backed stablecoins.", weight: 3 }
must_cite:
  - "A stellar.org Circle USDC/EURC page or the EURC launch press release."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/products-and-tools/circle-usdc-eurc
  - https://stellar.org/press/eurc-launches-on-the-stellar-network
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §4. Verified: Circle issues both USDC and EURC on Stellar; EURC launched on Stellar 2023-09-26, fiat-backed redeemable 1:1 for euro (stellar.org press release)."
---

## Reference answer (gospel)

**Circle issues both USDC and EURC on Stellar** [1][2]. **USDC** is the USD-backed stablecoin,
redeemable 1:1 for US dollars; **EURC** is the euro-backed stablecoin, redeemable 1:1 for euro under
a full-reserve model [2]. **EURC launched on the Stellar network on September 26, 2023** [2]. Both
are issued as **classic Stellar assets**, so each automatically has a reserved Stellar Asset Contract
(SAC) usable from Soroban. EURC is issued by Circle's MiCA-regulated EU entity (Circle Mint Europe),
making it usable for EUR-denominated anchor flows in scope of MiCA.

Sources: [1] stellar.org "USDC and EURC on Stellar" (Circle) page; [2] stellar.org press release
"EURC Launches on the Stellar Network" (Sept 26, 2023).

## Why these cards (routing rationale)

Stellar-specific stablecoin fact → `stellar_docs_mcp` / stellar.org pages; `perplexity_search` acceptable for the Circle/MiCA background.

## Edge / traps

Wrong issuer (Tether/Paxos/SDF) or calling them algorithmic.
