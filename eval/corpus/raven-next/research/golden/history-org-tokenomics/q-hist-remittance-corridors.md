---
id: q-hist-remittance-corridors
q: "What real-world remittance deployments run on Stellar?"
category: history-org-tokenomics
subcategory: deployments
axes: [ecosystem-spectrum, tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [scout_research]
acceptable_cards: [perplexity_search, scout_projects]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Stellar powers cross-border remittance use cases, primarily by moving USDC (and other stablecoins) for fast, low-cost transfers.", weight: 5 }
  - { claim: "Names at least one concrete remittance deployment/partner (e.g. MoneyGram cash on/off ramps, Vibrant, Velo/PDAX, Nium, Onafriq, Coins.ph).", weight: 4 }
should_have:
  - { claim: "MoneyGram Access/Ramps lets users convert cash to/from USDC on Stellar across 170+ countries.", weight: 2 }
  - { claim: "Flags that specific corridors/partners change and a current source should confirm.", weight: 2 }
nice_to_have:
  - { claim: "Mentions a regional corridor example (e.g. Philippines, Latin America, Africa).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar remittances are settled in volatile XLM rather than stablecoins like USDC (most consumer flows use stablecoins).", weight: 2 }
  - { claim: "Do NOT fabricate a remittance partner that does not use Stellar.", weight: 3 }
must_cite:
  - "stellar.org case studies / partner announcements on remittance deployments."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/products-and-tools/moneygram
  - https://stellar.org/use-cases/payments
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Discovery + freshness. Dossier: MoneyGram Ramps (170+ countries), Velo+PDAX (Philippines, Mar 2022), Nium (190 countries, Jun 2022), Onafriq (43 African markets), Coins.ph. Mostly Stellar-own + partner press. Reward dated, sourced corridors + a freshness caveat. Verified 2026-06-29: stellar.org/products-and-tools/moneygram and the 'three-years-with-moneygram' SDF blog confirm cash<->USDC on Stellar across 170+ countries (the live product page now says 180+, ~475K locations); MoneyGram launched on Stellar via Vibrant/LOBSTR wallets (2022) and signed a multi-year extension in 2026 (LatAm focus). Both frontmatter source URLs resolve. Remittance flows settle in USDC, not volatile XLM (correct)."
---

## Reference answer (gospel)

- Stellar powers **cross-border remittances** primarily by moving **USDC (and other stablecoins)** for fast, low-cost transfers [1][2].
- Concrete deployments/partners include:
  - **MoneyGram Access / Ramps** — convert cash ↔ USDC on Stellar in **170+ countries** [1].
  - **Velo Labs + PDAX** — a Philippines corridor (~2022).
  - **Nium** — fiat → USDC payouts across ~190 countries (~2022).
  - **Onafriq** — real-time payments across ~43 African markets.
  - **Coins.ph** — PHP corridors into Stellar settlement.
- Freshness caveat: specific corridors/partners change — confirm against current sources.
- Traps to avoid: claiming consumer remittances settle in **volatile XLM** rather than stablecoins (most use **USDC**); or fabricating a partner that doesn't use Stellar [1].

- [1] stellar.org/products-and-tools/moneygram
- [2] stellar.org/use-cases/payments

## Why these cards (routing rationale)

A discovery question over Stellar deployments → `scout_research` (case studies) / `scout_projects`;
`perplexity_search` acceptable for fresh corridor news.

## Edge / traps

Traps: claiming consumer remittances settle in volatile XLM; fabricating a partner.
