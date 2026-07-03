---
id: q-pay-sdp-disbursement
q: "What is the Stellar Disbursement Platform (SDP) and what is it used for?"
category: compliance-rwa-payments
subcategory: remittance-disbursement
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null
expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Stellar Disbursement Platform (SDP) is an open-source tool for making bulk payments/disbursements to many recipients and monitoring them.", weight: 5 }
should_have:
  - { claim: "Recipients can receive funds needing only a mobile phone/wallet (no bank account required), often cashing out via anchors like MoneyGram.", weight: 3 }
  - { claim: "It powers humanitarian and remittance use cases (e.g. Stellar Aid Assist).", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes SDP (bulk payout) from MoneyGram Ramps (individual on/off-ramp).", weight: 2 }
must_avoid:
  - { claim: "Do NOT describe the SDP as a smart-contract / DeFi protocol or a stablecoin issuer.", weight: 3 }
  - { claim: "Do NOT confuse the SDP with the Anchor Platform (different products).", weight: 3 }
must_cite:
  - "developers.stellar.org / stellar.org Stellar Disbursement Platform docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/use-cases/stellar-for-aid
  - https://developers.stellar.org/docs/category/stellar-disbursement-platform
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Canonical product fact → stellar_docs. Trap: confusing SDP with Anchor Platform / Ramps."
---

## Reference answer (gospel)

- The **Stellar Disbursement Platform (SDP)** is an **open-source tool for making bulk
  payments/disbursements** to many recipients and **monitoring** them [1].
- Recipients can receive funds needing only a **mobile phone/wallet (no bank account)**, often **cashing
  out via anchors like MoneyGram** [1].
- It powers **humanitarian and remittance** use cases (e.g. **Stellar Aid Assist**) [1].
- It is **distinct** from **MoneyGram Ramps** (individual on/off-ramp) and the **Anchor Platform** (anchor
  reference runtime); it is **not** a smart-contract/DeFi protocol or a stablecoin issuer.

Sources: [1] stellar.org Stellar for Aid / SDP docs.

## Why these cards (routing rationale)

First-party product → `stellar_docs_mcp`; `scout_research` acceptable.

## Edge / traps

Trap: conflating SDP with Anchor Platform or Ramps.
