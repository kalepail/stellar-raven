---
id: q-eco-wallets-similar
q: "I use Freighter — what are similar Stellar wallets I could offer my users instead?"
category: defi-ecosystem
subcategory: wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_similar_projects_semantic]
acceptable_cards: [scout_projects, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Surfaces wallet alternatives to Freighter such as LOBSTR, Hana, and xBull (and possibly StellarTerm / Hot Wallet).", weight: 5 }
should_have:
  - { claim: "Notes the practical answer is to integrate the Stellar Wallets Kit to support multiple wallets rather than picking one.", weight: 3 }
  - { claim: "Briefly distinguishes them by model (SDF vs independent; Stellar-only vs multi-chain).", weight: 2 }
nice_to_have:
  - { claim: "Notes the wallet market is crowded but differentiated, with no single MetaMask-scale winner.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent a wallet not present in the source data.", weight: 5 }
  - { claim: "Do NOT recommend a non-Stellar wallet (e.g. MetaMask) as a drop-in Stellar wallet.", weight: 3 }
must_cite:
  - "A source for each suggested wallet."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "GROUNDED 2026-06-22 (re-verified 2026-06-29): Scout wallet records confirm the alternatives — Lobstr (SCF $232K), Hana (SCF $132K, multi-chain), xBull (SCF $56.2K, open-source) all type=Wallet, Live. This is the FIND-SIMILAR routing lane ('wallets like Freighter' → lumenloop_find_similar_projects_semantic) — DISTINCT from q-eco-wallets-overview (scout_projects; sponsor/model differentiation) and q-eco-stellar-wallets-list (flat enumeration). The Stellar Wallets Kit (multi-wallet SDK) is the practical integration answer."
---

## Reference answer (gospel)

Wallet alternatives to **Freighter** in the directory [1]:
- **LOBSTR** (Ultra Stellar) — web/mobile/extension, Stellar + XRP Ledger, fiat on/off-ramps.
- **Hana** — non-custodial **multi-chain** wallet with Stellar support (extension + mobile).
- **xBull** — open-source, non-custodial Stellar wallet (extension + web + mobile), hybrid passkey V2.
- Also: StellarTerm and Hot Wallet appear as adjacent options.

The practical answer for a builder is to **integrate the Stellar Wallets Kit** (multi-wallet SDK) so
users can pick any of these rather than committing to one. The wallet market is **crowded but
differentiated** (SDF vs independent; Stellar-only vs multi-chain) with **no MetaMask-scale winner**.

Source: [1] stellarlight.xyz directory (Scout, 2026-06-22).

## Why these cards (routing rationale)

"Wallets like Freighter" → `lumenloop_find_similar_projects_semantic`; directory acceptable.

## Edge / traps

Don't invent a wallet; don't suggest MetaMask as a drop-in Stellar wallet.
