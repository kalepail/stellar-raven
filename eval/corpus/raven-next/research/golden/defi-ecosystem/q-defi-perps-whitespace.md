---
id: q-defi-perps-whitespace
q: "Are there perpetuals or derivatives DEXes on Stellar yet?"
category: defi-ecosystem
subcategory: market-map
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_find_similar_projects_semantic, lumenloop_search_content_semantic, scout_clusters]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Reports that perps/derivatives are an EMERGING category with several funded teams building on Stellar — names the testnet/pre-release entrants (Noether, Stellars Finance, Zenex) — while honestly noting there is NO confirmed mainnet perp DEX yet (the leaders are testnet/pre-mainnet, audits pending).", weight: 5 }
should_have:
  - { claim: "Distinguishes true perp DEXes from leveraged-spot products — e.g. Turbolong is one-click leveraged SPOT via Blend lending loops (no funding rates), NOT a perpetual-futures DEX.", weight: 3 }
nice_to_have:
  - { claim: "Notes Noether demoed at the 2026-04-16 SDF Developer Meeting as the 'first perpetual DEX on Stellar' (testnet), with mainnet pending an SCF-supported audit.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim perps/derivatives are fully live/mature on Stellar mainnet — no perp DEX is confirmed mainnet-live yet (the named entrants are testnet/pre-release pending audit).", weight: 5 }
  - { claim: "Do NOT claim the perps/derivatives space is totally empty / pure whitespace with no one building — that is stale; Noether, Stellars Finance and Zenex are funded testnet/pre-release entrants.", weight: 4 }
  - { claim: "Do NOT invent a fictitious Stellar perps/derivatives protocol name, and do NOT present a non-Stellar perps DEX (e.g. dYdX, GMX, Hyperliquid) as a live Stellar product.", weight: 4 }
must_cite:
  - "Cite the source data (Scout directory / SDF developer-meeting demo) for the named emerging entrants and their testnet/pre-mainnet status."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "EMERGING category, nuanced honesty (corrected vs Phase-1 'whitespace'). As of 2026-06 several SCF-funded teams ARE building perp/derivatives DEXes — Noether (testnet; demoed 2026-04-16 SDF mtg as 'first perpetual DEX on Stellar', mainnet pending audit), Stellars Finance (SCF perps grant, mainnet targeted), Zenex/Hermes (pre-release/testnet) — but there is NO independently-confirmed mainnet perp DEX yet. Turbolong is one-click leveraged SPOT (Blend recursive lending loops, no funding rates), NOT a perp. Best framing: 'emerging, multiple testnet entrants, no confirmed mainnet perp DEX yet.' Trap: claiming perps are fully live/mature on mainnet OR that the space is pure whitespace (both wrong); inventing a protocol; importing dYdX/GMX/Hyperliquid as Stellar-native. Freshness-soft: re-query the live directory. 2026-06-29 reviewed: re-verified all three entrants on Scout — Noether (perpetual futures, 'currently live on testnet', SCF $86.2K), Stellars Finance (Soroban perpetual futures for synthetic assets, SCF ~$119.3K), Zenex/formerly-Hermes (perp leveraged exchange, status 'Pre-Release', mainnet pending, SCF $150K); Turbolong confirmed as one-click leveraged SPOT on Blend pools, explicitly 'no perpetual futures, no funding rates' (Scout). Note Scout lists Noether/Stellars-Finance directory status as 'Live' but their own descriptions say testnet — kept the file's testnet/pre-mainnet framing (no independently-confirmed mainnet perp trading). Confidence kept medium (mainnet status moves)."
---

## Reference answer (gospel)

**Perps/derivatives on Stellar are an EMERGING category, not whitespace and not yet mainnet-mature.**
Several SCF-funded teams are actively building perpetual/derivatives DEXes [Scout directory:
stellarlight.xyz; SDF Developer Meeting 2026-04-16]:
- **Noether** (noether.exchange) — native Soroban perp DEX, live on **testnet**; demoed at the
  2026-04-16 SDF Developer Meeting as the team's "first perpetual DEX on Stellar," with mainnet
  planned **after** an SCF-supported audit.
- **Stellars Finance** (stellars.finance) — Soroban perpetual futures for synthetic assets; SCF perps
  grant, **mainnet targeted** but no independent mainnet-trading confirmation yet.
- **Zenex** (zenex.trade, formerly Hermes) — liquidity-pool + oracle-priced perp exchange,
  **pre-release / testnet**, mainnet pending.

The honest bottom line: **there is NO confirmed mainnet perp DEX on Stellar yet** — the leaders are
testnet / pre-mainnet pending audits. Saying "Stellar has a live mainnet perp DEX" is **not yet
true**; saying "perps are pure whitespace / no one is building" is **stale and also wrong**. Note that
**Turbolong** (turbolong.com), though sometimes lumped in, is **one-click leveraged SPOT** via atomic
recursive lending loops on Blend pools (up to ~12.9x, **no funding rates**) — a different primitive,
**not** a perpetual-futures DEX. (Derivatives-enabling infra such as SEP-40 oracle consumers is also
emerging.)

## Why these cards (routing rationale)

Directory discovery (`scout_projects`) / semantic search surfaces the emerging perp entrants and their
testnet/pre-release status; the test is naming them honestly while flagging that none is confirmed
mainnet-live yet.

## Edge / traps

Claiming perps are fully live/mature on mainnet (no perp DEX is confirmed mainnet-live yet) OR claiming
the space is pure whitespace (Noether/Stellars Finance/Zenex are funded entrants) are both wrong.
Inventing a perps protocol, treating Turbolong (leveraged spot) as a perp, or importing a non-Stellar
DEX (dYdX/GMX/Hyperliquid) as Stellar-native are auto-fails.
