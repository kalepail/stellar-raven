---
id: q-defi-aquarius-what-is
q: "What is Aquarius (AQUA) on Stellar and what role does the AQUA token play?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [lumenloop_find_content_about_project, scout_projects, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Aquarius is a Soroban AMM / liquidity layer on Stellar (bills itself as Stellar's DeFi Hub) that runs liquidity pools and incentivizes liquidity.", weight: 5 }
  - { claim: "The AQUA token is used for liquidity rewards; locking AQUA mints ICE, a non-transferable governance/voting token that boosts pool earnings and earns AQUA emissions.", weight: 4 }
should_have:
  - { claim: "Aquarius is the largest DEX on Stellar by TVL (roughly ~20% of DeFiLlama-listed Stellar TVL).", weight: 3 }
  - { claim: "Integrates with wallets such as LOBSTR, StellarX, Freighter, StellarTerm.", weight: 2 }
nice_to_have:
  - { claim: "Supports stable, volatile, and concentrated pools (2-asset and 3-asset strategies).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim AQUA is a transferable governance token or that ICE is tradable — ICE is non-transferable (vote-locked).", weight: 4 }
  - { claim: "Do NOT describe Aquarius as a lending protocol, an oracle, or a bridge.", weight: 4 }
must_cite:
  - "A source on Aquarius and the AQUA/ICE token mechanics (Lumenloop record, aqua.network, or DeFiLlama)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/aquarius
  - https://aqua.network/
  - https://defillama.com/protocol/aquarius-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Per-project identity + tokenomics. AQUA/ICE lock mechanic is the precision trap. Grounded on Scout: Aquarius (AQUA) = DeFi liquidity layer + AMM on Soroban, stable/volatile pools with multihop swaps; LPs earn fees + AQUA yield; AQUA locks into ICE for on-chain DAO governance directing rewards. TVL is freshness-sensitive (DeFiLlama ~$48M in mid-2026) — gate on 'cite a current source,' not a frozen number."
---

## Reference answer (gospel)

**Aquarius (AQUA)** is a **DeFi liquidity layer / AMM on Stellar–Soroban** (bills itself as Stellar's
"DeFi Hub"). It runs **stable and volatile AMM liquidity pools** with multihop swaps where liquidity
providers earn **fees + AQUA reward yield**, and it incentivizes market-making on the native Stellar
DEX [Scout: stellarlight.xyz/project/aquarius]. **Token mechanics:** **AQUA** is the utility/reward
token; **locking AQUA mints ICE**, a **non-transferable** on-chain **DAO governance** token used to
vote on how rewards are directed across DEX/AMM markets (and to boost pool earnings) [aqua.network].
Aquarius is among the largest Stellar DEXes by TVL (DeFiLlama tracks it at roughly tens of $M — a
**freshness-sensitive** figure to confirm against a current source, not a frozen number). It is an
AMM/DEX — NOT a lending protocol, oracle, or bridge.

## Why these cards (routing rationale)

Named-project identity (with token detail) → `lumenloop_get_project`; content/directory cards acceptable.

## Edge / traps

Precision trap: ICE is **non-transferable** (vote-locked), AQUA is the reward token. Don't miscategorize
Aquarius as lending/oracle; don't assert a stale TVL as current.
