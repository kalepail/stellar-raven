---
id: q-pay-mgusd-stablecoin
q: "What is MGUSD, who issues it, and how does it relate to MoneyGram's Stellar strategy?"
category: compliance-rwa-payments
subcategory: remittance-disbursement
axes: [edge-governance, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "MGUSD is MoneyGram's own US-dollar stablecoin, issued on Stellar (launched in 2026), distinct from earlier reliance on third-party USDC.", weight: 5 }
  - { claim: "It is issued via Bridge (a Stripe company), positioned as a GENIUS-Act-aligned issuer, with named infrastructure partners (e.g. M0 for minting, Fireblocks for custody).", weight: 3 }
should_have:
  - { claim: "MGUSD is integrated into the MoneyGram app for hold/cash-out at MoneyGram's retail network; treats this as a recent/evolving rollout.", weight: 3 }
  - { claim: "Flags launch details as recent/freshness-sensitive.", weight: 2 }
nice_to_have:
  - { claim: "Contrasts MGUSD (MoneyGram-issued) with USDC (Circle) on Stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim MoneyGram itself / Stripe issues MGUSD on its own L1 or a non-Stellar chain as primary.", weight: 4 }
  - { claim: "Do NOT assert MGUSD is MiCA-compliant in the EU (it is US-focused; don't cross regimes).", weight: 3 }
must_cite:
  - "The MoneyGram MGUSD press release / dated reputable coverage."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://www.prnewswire.com/news-releases/moneygram-launches-mgusd-a-stablecoin-to-power-its-own-global-network-302787799.html
  - https://stablecoininsider.org/moneygram-launches-mgusd-stablecoin-on-stellar-to-bring-digital-dollars-to-60-million-customers/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 RE-VERIFIED via MoneyGram PR Newswire + CoinDesk/Cointelegraph: MGUSD launched June 2, 2026 — MoneyGram's own native USD stablecoin on Stellar (US-first, global rollout planned). Issuer = Bridge (a Stripe company), 'regulated, GENIUS Act-ready'. M0 = mint/burn smart-contract infra; Fireblocks = custody; integrated into MoneyGram app self-custodial wallet (~500K retail locations, 60M+ active customers). Distinct from third-party USDC (Circle). Trap: wrong issuing chain or crossing US/EU (MGUSD is US-focused, not MiCA)."
---

## Reference answer (gospel)

- **MGUSD is MoneyGram's own native US-dollar stablecoin, issued on Stellar**, launched **June 2, 2026**
  (US-first, global rollout planned) — distinct from MoneyGram's earlier reliance on third-party **USDC**
  (Circle) [1][2].
- It is **issued by Bridge (a Stripe company)**, described as a **"regulated, GENIUS Act-ready issuer"**;
  **M0** provides the mint/burn smart-contract infrastructure and **Fireblocks** the custody [1].
- It is **integrated into the MoneyGram app** as a self-custodial wallet, for hold/cash-out across
  MoneyGram's retail network (~500K locations, 60M+ active customers) — a **recent/evolving rollout** [1][2].
- Do **not** claim MGUSD is issued on a non-Stellar chain as primary, and do **not** assert it is
  MiCA-compliant (it is US-focused — don't cross regimes).

Sources: [1] MoneyGram MGUSD press release; [2] Stablecoin Insider.

## Why these cards (routing rationale)

Recent corporate/stablecoin news → `perplexity_search`/`parallel_search`; `scout_research` acceptable.

## Edge / traps

Trap: wrong issuing chain; over-claiming EU MiCA status.
