---
id: q-eco-wallets-overview
q: "Which wallets can I use on Stellar, and how do they differ?"
category: defi-ecosystem
subcategory: wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_content_semantic, lumenloop_find_similar_projects_semantic, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Names the main Stellar wallets — Freighter, LOBSTR, Hana, and xBull (and may add StellarTerm / Hot Wallet).", weight: 5 }
  - { claim: "Distinguishes them by sponsor/model: Freighter is built by the Stellar Development Foundation; LOBSTR is by Ultra Stellar (independent commercial entity).", weight: 4 }
should_have:
  - { claim: "Notes scope differences: Freighter and xBull are Stellar-focused; LOBSTR and Hana are multi-chain (LOBSTR adds XRP Ledger; Hana is broadly multi-chain).", weight: 3 }
  - { claim: "Notes developers should integrate the Stellar Wallets Kit to stay wallet-agnostic.", weight: 2 }
nice_to_have:
  - { claim: "Notes xBull is built by Creit-Tech and has a passkey-based V2.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim LOBSTR is built/operated by the Stellar Development Foundation, or that Freighter is built by Ultra Stellar.", weight: 5 }
  - { claim: "Do NOT invent a wallet that is not in the source data or fabricate user counts.", weight: 4 }
  - { claim: "Do NOT route to general-web for this directory-backed wallet question — use the curated project directory.", weight: 3 }
must_cite:
  - "A source for each named wallet and its sponsor/model."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/freighter
  - https://stellarlight.xyz/project/lobstr
  - https://stellarlight.xyz/project/hana
  - https://stellarlight.xyz/project/xbull
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Directory discovery → scout_projects. This file OWNS the sponsor/model differentiation lane (Freighter=SDF, LOBSTR=Ultra Stellar, Hana multi-chain, xBull=Creit-Tech) — distinct from q-eco-stellar-wallets-list (flat enumeration probe) and q-eco-wallets-similar (find_similar routing). Added the directory-not-general-web guard as must_avoid (2026-06-29) to keep it in the directory lane. All grounded on Scout: Freighter (SDF official, browser+iOS/Android), LOBSTR (Ultra Stellar, SCF ~$232K), Hana (multi-chain, SCF ~$132K), xBull (Creit-Tech, SCF ~$56.2K). Devs use Stellar Wallets Kit to stay wallet-agnostic."
---

## Reference answer (gospel)

Main Stellar wallets, distinguished by **sponsor/model** (all Scout-grounded):
- **Freighter** — the **Stellar Development Foundation's** official non-custodial wallet (browser
  extension: Chrome/Firefox/Brave; iOS + Android) [Scout: .../freighter].
- **LOBSTR** — widely-used non-custodial wallet (iOS/Android/web/extension) by **Ultra Stellar** (an
  independent commercial entity, also behind StellarX/StellarTerm); SCF-awarded (~$232K) [Scout: .../lobstr].
- **Hana** — non-custodial **multi-chain** wallet with Stellar support (MetaMask-style); SCF-awarded
  (~$132K) [Scout: .../hana].
- **xBull** — open-source non-custodial Stellar wallet (extension/web/mobile) by **Creit-Tech**, with a
  passkey-based V2; SCF-awarded (~$56.2K) [Scout: .../xbull]. (Plus StellarTerm / Hot Wallet on the tail.)

Scope: **Freighter and xBull are Stellar-focused**; **LOBSTR adds XRP Ledger**; **Hana is broadly
multi-chain**. Developers should integrate the **Stellar Wallets Kit** to stay wallet-agnostic. Do NOT
attribute LOBSTR to the SDF or Freighter to Ultra Stellar; don't invent a wallet or fabricate user
counts.

## Why these cards (routing rationale)

"Which wallets / how do they differ" directory discovery → `scout_projects`; docs/semantic acceptable.

## Edge / traps

Sponsor mix-up (Freighter=SDF vs LOBSTR=Ultra Stellar) is the trap.
