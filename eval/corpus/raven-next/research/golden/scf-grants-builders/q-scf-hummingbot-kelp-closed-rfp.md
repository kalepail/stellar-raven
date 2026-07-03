---
id: q-scf-hummingbot-kelp-closed-rfp
q: "Was there an SCF RFP about replacing Kelp or market-making bots on Stellar, and can I still apply to it?"
category: scf-grants-builders
subcategory: rounds-rfps
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: "scf-round"

expected_cards: [scout_rfps]
acceptable_cards: [scout_research, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Names the RFP as Hummingbot Integration (Trading Engine).", weight: 5 }
  - { claim: "States it is closed / Q1 2026 / no longer currently fundable in the live RFP feed.", weight: 5 }
  - { claim: "Explains the Kelp-deprecation/liquidity-gap framing: Stellar wanted a Hummingbot connector for automated market-making and arbitrage.", weight: 4 }
should_have:
  - { claim: "Mentions that Q2 2026 open RFPs are a different current set, so the user should check the live feed for fundable briefs.", weight: 2 }
nice_to_have:
  - { claim: "Summarizes technical requirements: Stellar orderbook connector, market-making/arbitrage strategies, optional AMM/Soroban arbitrage scope.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the Hummingbot/Kelp RFP is currently open or fundable if the live feed marks it closed.", weight: 5 }
  - { claim: "Do NOT invent a different RFP title or claim no such brief existed.", weight: 4 }
must_cite:
  - "The live Scout/Stellar Light RFP feed or the Hummingbot Integration RFP page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/ideas/hummingbot-integration
status: answered
authored: { phase1: 2026-06-25, phase2: 2026-06-25, reviewed: null }
confidence: high
notes: "Added from theboycoder/StellarLight data-layer intake. Verified 2026-06-25 against /api/rfps: Hummingbot Integration (Trading Engine), category defi, author Rahim, quarter q1-2026, status closed; description explicitly says Kelp deprecation left a liquidity gap."
---

## Reference answer (gospel)

Yes. The RFP was **Hummingbot Integration (Trading Engine)**. In the June 25, 2026 live RFP feed it is
`status: closed`, `quarter: q1-2026`, category `defi`, so it is **not currently fundable / not open
for application**. [1]

The brief is explicitly framed around **Kelp's deprecation leaving a liquidity gap**. It asked for a
Stellar orderbook connector for the official Hummingbot repository so builders could run automated
market-making and arbitrage strategies; optional future scope included Stellar AMMs and intra-Soroban
AMM arbitrage. [1]

If the user wants something fundable now, Raven should point them to the current open RFP feed rather
than pretending this closed Q1 brief is still open.

Source: [1] Stellar Light RFP record for Hummingbot Integration (Trading Engine).

## Why these cards (routing rationale)

RFP status/history is exactly `scout_rfps`. Search/research cards are acceptable if the live RFP feed
needs supporting context.

## Edge / traps

The trap is confusing a historical closed RFP with current funding opportunities.
