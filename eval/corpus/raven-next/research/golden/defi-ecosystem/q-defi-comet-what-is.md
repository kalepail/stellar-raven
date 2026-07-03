---
id: q-defi-comet-what-is
q: "What is Comet on Stellar — is it a major live DEX?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [lumenloop_search_content_semantic, scout_research, scout_projects]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Comet is a Soroban implementation of Balancer's weighted AMM (uses a cost function to enable flexible/weighted pool weights).", weight: 5 }
  - { claim: "Comet functions more as a reference / AMM primitive than a dominant high-traffic DEX — the bulk of Stellar DEX flow runs through Soroswap/Aquarius/Phoenix, not Comet.", weight: 4 }
should_have:
  - { claim: "Notes it originated from Stellar's Soroban Financial Innovation showcase / SCF submission and was demoed at Meridian 2023.", weight: 2 }
nice_to_have:
  - { claim: "Mentions the weighted-pool design reduces impermanent loss vs standard pools.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Comet is a high-traffic, dominant DEX on Stellar — it is an AMM primitive / reference, with the major DEX flow elsewhere (Soroswap/Aquarius/Phoenix).", weight: 5 }
  - { claim: "Do NOT describe Comet as a lending protocol or confuse it with an unrelated 'Comet' (e.g. Magic-the-Gathering finance threads).", weight: 4 }
must_cite:
  - "A Stellar source on Comet as the Soroban weighted-AMM reference (Stellar Soroban showcase, SCF submission, or Lumenloop record)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://lumenloop.com/projects/comet
  - https://github.com/cometdex
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "RE-VERIFIED 2026-06-29: live Scout confirms Comet (Protocol/Contract, type DEX, status Live, NOT SCF-awarded, github cometdex): 'a weighted-pool AMM and DEX primitive on Stellar Soroban (a Balancer-style port). It lets builders create custom-weight, multi-token liquidity pools (e.g. 80/20)...' This GROUNDS the Balancer-style weighted-AMM identity. CAVEAT: Scout lists status 'Live' and gives no traffic/TVL signal — it is unfunded and low-prominence, so the 'reference/primitive rather than high-traffic dominant DEX' framing is supported by absence of activity signals but is a soft judgment, not a hard 'low activity' datum (must_have softened accordingly). Per-project IDENTITY (lumenloop_get_project) — DISTINCT lane from q-defi-comet-content's topic-coverage corpus search (lumenloop_search_content_semantic)."
---

## Reference answer (gospel)

**Comet** is a **weighted-pool AMM and DEX primitive on Stellar Soroban — a Balancer-style port** [1].
It lets builders create **custom-weight, multi-token liquidity pools** (e.g. 80/20) using a cost
function, where LPs add liquidity to earn swap fees [1]. It originated from Stellar's Soroban
"Financial Innovation" showcase / SCF submission and was demoed at Meridian 2023.

It functions more as a **reference / primitive implementation** than a dominant high-traffic DEX: it is
**not SCF-funded** and carries no meaningful TVL/volume signal in the directory, so the bulk of Stellar
DEX flow runs through Soroswap/Aquarius/Phoenix, not Comet [1].

Source: [1] Lumen Loop / Stellar project-directory Comet record (Scout/LumenLoop, checked 2026-06-25;
github.com/cometdex).

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`; research/semantic acceptable.

## Edge / traps

Don't overstate Comet as a high-traffic, dominant DEX; don't confuse it with an unrelated "Comet"
(e.g. MTG-finance threads) or call it a lending protocol.
