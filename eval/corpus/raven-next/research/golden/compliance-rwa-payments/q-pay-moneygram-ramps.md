---
id: q-pay-moneygram-ramps
q: "What is MoneyGram Ramps on Stellar, which SEP and asset does it use, and what are its per-transaction limits?"
category: compliance-rwa-payments
subcategory: remittance-disbursement
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly
expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "MoneyGram Ramps lets users of third-party apps (wallets/exchanges) cash-in and cash-out fiat using USDC on Stellar.", weight: 5 }
  - { claim: "It is implemented using the SEP-24 (hosted/interactive deposit & withdrawal) protocol.", weight: 4 }
should_have:
  - { claim: "Cites per-transaction off-ramp limits (e.g. ~$5 USDC min to ~$2,500 USDC max) and flags these can change.", weight: 3 }
  - { claim: "Notes the global retail agent footprint (cash-out at hundreds of thousands of locations across 170+ countries).", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes Ramps (on/off-ramp) from the Stellar Disbursement Platform (bulk payout).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim MoneyGram Ramps uses SEP-31 or SEP-6 as its core protocol (it is SEP-24).", weight: 4 }
  - { claim: "Do NOT state limit amounts as permanent without a freshness caveat.", weight: 2 }
must_cite:
  - "developers.stellar.org MoneyGram Ramps docs and/or MoneyGram developer docs."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/ramps/moneygram
  - https://developer.moneygram.com/moneygram-developer/docs/integrate-moneygram-ramps
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified: Ramps uses SEP-24 + USDC on Stellar; MainNet off-ramp limit 5 USDC min / 2,500 USDC max per tx; available in 174 countries (per MoneyGram dev docs, June 2026). Limits/country counts are freshness-sensitive. Trap: wrong SEP (it's SEP-24, not SEP-6/31)."
---

## Reference answer (gospel)

- **MoneyGram Ramps** lets users of **third-party apps (wallets/exchanges)** cash-in and cash-out fiat
  using **USDC on Stellar** [1].
- It is implemented with the **SEP-24** (hosted/interactive deposit & withdrawal) protocol [1][2].
- Per-transaction **off-ramp limits on MainNet: ~$5 USDC min / ~$2,500 USDC max** (these can change —
  treat as a dated snapshot) [2].
- Global retail footprint: off-ramp **available in ~170+ countries** (MoneyGram dev docs cite 174) at the
  MoneyGram agent network [2].
- Distinct from the **Stellar Disbursement Platform** (bulk payout).

Sources: [1] developers.stellar.org MoneyGram Ramps; [2] MoneyGram developer docs.

## Why these cards (routing rationale)

Ramps integration mechanic is documented in Stellar docs → `stellar_docs_mcp`; `scout_research`/`perplexity_search` acceptable for scale figures.

## Edge / traps

Trap: attributing the wrong SEP; stating limits as permanent.
