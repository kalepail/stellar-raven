---
id: q-hist-unhcr-stellar-aid-assist
q: "How has Stellar been used for humanitarian aid disbursements, e.g. with UNHCR in Ukraine?"
category: history-org-tokenomics
subcategory: deployments
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [perplexity_search, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "UNHCR (the UN Refugee Agency) used Stellar to disburse cash aid to people in Ukraine (the 'Stellar Aid Assist' program).", weight: 5 }
  - { claim: "Aid was sent as USDC on Stellar to recipients' digital wallets, redeemable for cash (e.g. via MoneyGram).", weight: 4 }
should_have:
  - { claim: "It used the Stellar Disbursement Platform (SDP) to send the payments.", weight: 2 }
  - { claim: "The program launched in 2022, during the war in Ukraine.", weight: 2 }
nice_to_have:
  - { claim: "By around end of 2023 it had disbursed over $1 million to over a thousand individuals.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the aid was disbursed as XLM speculation or as a non-stablecoin volatile asset — it was USDC (a dollar stablecoin).", weight: 3 }
  - { claim: "Do NOT attribute this UNHCR program to Ripple/XRP or another blockchain.", weight: 4 }
must_cite:
  - "stellar.org case study or UNHCR materials on Stellar Aid Assist."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/case-studies/unhcr
  - https://stellar.org/blog/foundation-news/one-year-of-stellar-aid-assist
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Stellar-own: Stellar Aid Assist (UNHCR + UNICC, 2022, Ukraine) → USDC via Stellar Disbursement Platform → recipient wallet → MoneyGram cash redemption; >$1.1M to >1,500 individuals by Dec 2023 (stellar.org blog/case study). The USDC-not-volatile and not-Ripple traps matter. Verified 2026-06-22."
---

## Reference answer (gospel)

- **UNHCR (the UN Refugee Agency)** used **Stellar** to disburse **cash aid** to people in **Ukraine** — the **"Stellar Aid Assist"** program (launched 2022, with UNICC) [1].
- Aid was sent as **USDC on Stellar** to recipients' digital wallets, **redeemable for cash** (e.g. via **MoneyGram**) [1].
- It used the **Stellar Disbursement Platform (SDP)** to send the payments [1].
- By around end of **2023** it had disbursed **over $1.1 million to over 1,500 individuals** [2].
- Traps to avoid: framing the aid as a **volatile / speculative XLM payout** (it was **USDC**, a dollar stablecoin), or attributing the program to **Ripple/XRP** [1].

- [1] stellar.org/case-studies/unhcr
- [2] stellar.org/blog/foundation-news/one-year-of-stellar-aid-assist

## Why these cards (routing rationale)

The UNHCR/Stellar Aid Assist case study is on stellar.org (Stellar-own) → `scout_research` /
`stellar_docs_mcp`; perplexity acceptable for corroborating coverage.

## Edge / traps

Traps: framing aid as a volatile-asset payout (it was USDC); attributing to Ripple.
