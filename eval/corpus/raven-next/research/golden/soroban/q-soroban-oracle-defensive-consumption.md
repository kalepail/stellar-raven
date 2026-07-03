---
id: q-soroban-oracle-defensive-consumption
q: "How should a Soroban lending protocol consume Reflector or other price oracles defensively so stale or thin-liquidity prices can't drain a pool?"
category: soroban
subcategory: oracles-security
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_get_project]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Check oracle staleness via the price timestamp and reject/halt on stale data.", weight: 5 }
  - { claim: "Apply sanity bounds / deviation limits so an implausible price can't be acted on.", weight: 4 }
  - { claim: "Use multiple sources and/or a time-weighted average (TWAP) rather than a single spot read.", weight: 4 }
  - { claim: "Use liquidity-aware pricing so thin-liquidity assets cannot be manipulated to drain the pool.", weight: 4 }
should_have:
  - { claim: "References Reflector and the real YieldBlox/USTRY oracle-manipulation incident as motivation.", weight: 3 }
nice_to_have:
  - { claim: "Notes circuit-breakers / caps on per-block price movement or borrow size.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim oracles are trustless or always-fresh.", weight: 5 }
  - { claim: "Do NOT ignore staleness / treat a single spot price as authoritative.", weight: 4 }
must_cite:
  - "A Reflector / oracle-security source and the real incident reference."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://blocksec.com/blog/yieldblox-dao-incident-on-stellar-oracle-misconfiguration-enabled-a-10m-drain
  - https://reflector.network
  - https://stellarlight.xyz
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: verified the incident is real and well-documented — Feb 2026 oracle-manipulation exploit against Blend V2 / YieldBlox DAO pool, USTRY (Etherfuse) collateral inflated ~100x via low-liquidity Reflector feeds, ~$10M+ drain (BlockSec post-mortem; corroborated by Blockaid/Binance/Medium). The four defensive measures (staleness/timestamp checks, deviation bounds, multi-source/TWAP, liquidity-aware pricing) are standard oracle-security guidance; rubric gates on the practices + naming the incident, not the exact $ figure (which varies $10M–$10.8M across reports)."
---

## Reference answer (gospel)

A Soroban lending protocol should consume oracles **defensively**:

1. **Staleness checks** — read the oracle's **price timestamp** and reject/halt if the price is older
   than a tolerance.
2. **Sanity bounds / deviation limits** — cap how far a new price may move; reject implausible jumps.
3. **Multiple sources / TWAP** — prefer a **time-weighted average** or cross-source agreement over a
   single spot read.
4. **Liquidity-aware pricing** — discount or refuse to fully trust prices for **thin-liquidity**
   assets, which are exactly what gets manipulated to drain a pool.

Motivation: the real **YieldBlox / USTRY / Reflector** manipulation incident. Oracles are **not**
trustless or always-fresh — design as if a feed can be stale or pushed.

## Why these cards (routing rationale)

Security guidance grounded in ecosystem incident knowledge → **`scout_research`** (with
`stellar_docs_mcp` / `lumenloop_get_project` acceptable for Reflector specifics). Deep-research tier is
forbidden.

## Edge / traps

Traps: (a) claiming oracles are **trustless / always-fresh**; (b) **ignoring staleness** and trusting a
single spot price. Both are `must_avoid`.
