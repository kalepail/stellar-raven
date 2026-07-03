---
id: q-comp-eurc-mica
q: "Is EURC on Stellar a MiCA-compliant stablecoin, and what does that mean for using it in the EU?"
category: compliance-rwa-payments
subcategory: regulatory-treatment-stablecoins
axes: [edge-governance, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: regulatory-change
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "EURC (Circle's euro-backed stablecoin) is described by Circle as MiCA-compliant and is available on Stellar (among other chains).", weight: 5 }
  - { claim: "MiCA is the EU's Markets in Crypto-Assets regulation governing stablecoin (e-money/asset-referenced token) issuance and reserves in the EU.", weight: 4 }
should_have:
  - { claim: "Treats circulation/market-share figures as time-sensitive (e.g. EURC circulation as of a dated report) and flags they can change.", weight: 3 }
  - { claim: "Notes Circle's EU regulatory perimeter (e.g. a French/EU EMI license) underpins the compliance claim.", weight: 2 }
nice_to_have:
  - { claim: "Contrasts with USDC's US GENIUS-Act framing.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert MiCA compliance as a Stellar-protocol property (it is Circle/issuer-level, not chain-level).", weight: 4 }
  - { claim: "Do NOT state precise live market-cap figures as permanent facts without a date / freshness caveat.", weight: 3 }
must_cite:
  - "A dated Circle / MiCA / regulatory source (not stellar developer docs)."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://www.circle.com/eurc
  - https://stellar.org/products-and-tools/circle-usdc-eurc
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; freshness-gated circulation figure unchanged. VERIFIED: circle.com/eurc states EURC is MiCA-compliant, issued by Circle under a full-reserve model, accessible on Avalanche/Base/Ethereum/Solana/Stellar; reserves at EEA institutions with monthly attestations; Circle holds a French EMI license. Live on Stellar Sept 26, 2023. €380.9M in circulation as of June 15, 2026 (freshness-sensitive). MiCA compliance is ISSUER-level, not a chain property. Reward dated figures + caveats."
---

## Reference answer (gospel)

- **EURC** (Circle's euro-backed stablecoin) is described by **Circle as MiCA-compliant**, and it is
  **available on Stellar** (alongside Avalanche, Base, Ethereum, Solana) [1][2].
- **MiCA** is the EU's **Markets in Crypto-Assets** regulation governing stablecoin (e-money / asset-
  referenced token) issuance and reserves in the EU; EURC's compliance rests on **Circle's EU perimeter
  (a French E-Money Institution license)** and **EEA-held reserves with monthly attestations** [1].
- This is an **issuer-level** property of EURC — **not a property of the Stellar chain** [1].
- **Circulation is time-sensitive**: ~**€380.9M as of June 15, 2026** per Circle (flag that it changes) [1].
- Contrast: USDC additionally sits under the US **GENIUS Act** framing.

Sources: [1] circle.com/eurc; [2] stellar.org USDC/EURC.

## Why these cards (routing rationale)

MiCA/issuer regulatory status is general-web context → `perplexity_search`; `parallel_search`/`scout_research` acceptable. Not a Stellar protocol fact.

## Edge / traps

Trap: chain-level MiCA claim; stale market-cap stated as permanent.
