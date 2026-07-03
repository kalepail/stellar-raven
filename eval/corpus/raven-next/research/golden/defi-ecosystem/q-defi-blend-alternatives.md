---
id: q-defi-blend-alternatives
q: "Are there alternatives to Blend for lending on Stellar — what other lending protocols exist?"
category: defi-ecosystem
subcategory: lending
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_similar_projects_semantic]
acceptable_cards: [scout_projects, scout_clusters, lumenloop_search_content_semantic, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Treats Blend as the dominant / canonical Soroban lending primitive on Stellar, while honestly naming the smaller independent money-markets that do exist (e.g. Slender, Laina, K2 Lend) rather than claiming Blend has no alternatives at all.", weight: 5 }
should_have:
  - { claim: "Notes that 'earn'/yield flows on Stellar largely route through Blend (or Blend-aware routers like Defindex), making it the near-single backbone for lending even where smaller independent lenders exist.", weight: 3 }
nice_to_have:
  - { claim: "Mentions CDP-style or adjacent credit products (e.g. Orbit CDP, EquitX) as related, distinct categories rather than direct Blend clones.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent a fictitious competing Stellar lending protocol that is not in the source data.", weight: 5 }
  - { claim: "Do NOT name a DEX/AMM (Soroswap, Aquarius, Phoenix, Comet) as a lending alternative to Blend.", weight: 4 }
  - { claim: "Do NOT pivot this 'are there direct substitutes' question into an SCF-funding roster — whether teams have SCF backing is a different question.", weight: 2 }
must_cite:
  - "Sources for Blend's dominance and any named adjacent protocols."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/blend
  - https://stellarlight.xyz/project/defindex
  - https://stellarlight.xyz/project/yieldblox
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "DIFFERENTIATED 2026-06-29: this file OWNS the 'are there DIRECT money-market substitutes for Blend' lane (find_similar_projects_semantic; answer = Blend is the near-single backbone, alternatives are Blend-derived/Blend-routing). DISTINCT from q-defi-lending-scf-flagships (scout_projects; 'who built lending + which have SCF backing' landscape roster). Added must_avoid against drifting into the SCF-roster lane. Grounded on Scout: Blend is the canonical Soroban money-market; closest 'alternatives' are Blend-derived (YieldBlox built ON Blend) or Blend-routing (DeFindex vaults), plus CDP-style adjacents (Orbit CDP) — not independent head-to-head lenders. NB live Scout (2026-06-29) confirms Slender is itself a noncustodial money-market by eq-lab (a real adjacent lender), so 'no competitor at all' should be softened to 'few independent head-to-head competitors'."
---

## Reference answer (gospel)

Blend (`blend-capital`, Live on Soroban) is the **dominant / canonical money-market primitive** on
Stellar — the base lending/yield layer other DeFi apps build on. It is **not the only lender**, but the
real alternatives are smaller:
- **Smaller independent money-markets:** **Slender** (noncustodial lending/borrowing by eq-lab),
  **Laina** (low-fee trustless lending with looping), and **K2 Lend** (pooled/isolated/gated markets)
  are real, live, directly-competing lenders — just far smaller than Blend [Scout directory].
- **Blend-derived / Blend-routing (not rivals):** **YieldBlox** — a DAO-managed money-market **built on
  the Blend Protocol** [Scout: .../yieldblox]; **DeFindex** (PaltaLabs) — tokenized **yield vaults** that
  auto-route deposits across underlying protocols **including Blend**; a router, not a parallel lender
  [Scout: .../defindex].
- Adjacent **CDP** credit (distinct category): **Orbit CDP** (collateralized debt positions on Etherfuse
  bonds), **EquitX**.

The honest answer: Blend is the near-single lending backbone, but Slender/Laina/K2 Lend are genuine
(smaller) independent alternatives — don't claim Blend has no competition, and don't pad the list with
Blend-built apps (YieldBlox), routers (DeFindex), or DEX/AMMs.

## Why these cards (routing rationale)

"Alternatives to X" is the competitive-landscape route → `lumenloop_find_similar_projects_semantic`. Scout directory/clusters are acceptable for the market-structure framing.

## Edge / traps

Lending is a "single backbone" (Blend). The trap is inventing a competitor or naming a DEX/AMM
(Soroswap/Aquarius/Phoenix) as a lender. Note YieldBlox is built ON Blend (not a rival engine) and
DeFindex routes INTO Blend.
