---
id: q-eco-stellar-wallets-list
q: "List the Stellar wallets the ecosystem directory tracks — enumerate the wallet projects available for Stellar."
category: defi-ecosystem
subcategory: wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_directory, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns a list of Stellar wallet projects from the curated directory (e.g. Freighter, Lobstr, Hana, xBull) rather than a single prose doc.", weight: 5 }
  - { claim: "Sources the enumeration from the project directory catalog rather than fabricating wallet names.", weight: 4 }
should_have:
  - { claim: "Distinguishes wallet types (browser-extension vs mobile vs multi-wallet kits) where the directory supports it.", weight: 2 }
nice_to_have:
  - { claim: "Notes the directory list is curated and may not be exhaustive of every wallet in existence.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet projects not present in the directory.", weight: 5 }
  - { claim: "Do NOT route to general-web for a directory-backed enumeration.", weight: 3 }
must_cite:
  - "The Stellar project directory (scout_projects / lumenloop directory) entries for wallets."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://lumenloop.com/projects?tag=wallet
  - https://lumenloop.com/projects/freighter
  - https://lumenloop.com/projects/lobstr
  - https://lumenloop.com/projects/hana
  - https://lumenloop.com/projects/xbull
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "GROUNDED 2026-06-25: Lumen Loop / Scout directory wallet records confirm Freighter, Lobstr, Hana, xBull, with StellarTerm + Hot Wallet as adjacent options. Enumerating wallets the directory tracks → scout_projects (free-text directory); lumenloop_search_directory acceptable. Trap = fabricating wallet names or routing to general-web. List is curated, not exhaustive and should be treated as freshness-sensitive."
---

## Reference answer (gospel)

The directory-tracked Stellar **wallet** projects (type=Wallet) include [1]:
- **Freighter** — SDF's official non-custodial wallet (browser extension + iOS/Android).
- **LOBSTR** — Ultra Stellar; web/mobile/extension (Stellar + XRP Ledger).
- **Hana** — non-custodial multi-chain wallet with Stellar support (extension + mobile).
- **xBull** — open-source non-custodial wallet (extension + web + mobile).
- Adjacent: **StellarTerm**, **Hot Wallet**.

This is the **curated directory catalog** (may not be exhaustive of every wallet), sourced from the
project directory rather than a prose doc.

Source: [1] Lumen Loop / Stellar project directory, wallet records (Scout/LumenLoop, checked
2026-06-25).

## Why these cards (routing rationale)

Enumerating wallet projects the directory tracks → `scout_projects` (curated directory by free-text);
`lumenloop_search_directory` acceptable. A docs page or general-web would miss the directory-backed
catalog intent.

## Edge / traps

Fabricating wallet names, or routing to general-web for a directory-backed enumeration.
