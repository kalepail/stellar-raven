---
id: q-edge-web-moneygram-company-background
q: "Give me a quick background on MoneyGram as a company — what they do and their footprint."
category: edge-governance
subcategory: general-web-only
axes: [edge-governance]
query_type: edge-nonstellar
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true   # background on a Stellar partner company = legit general-web context

must_have:
  - { claim: "Pins MoneyGram's specific identity: a global money-transfer / cross-border remittance company with a large agent and retail cash network — not a bank, wallet, or crypto-native firm.", weight: 5 }
  - { claim: "Answers from a general-web source rather than refusing as not-Stellar-specific.", weight: 4 }
should_have:
  - { claim: "Describes its core business (remittances, cash-in/cash-out, large agent/retail network).", weight: 3 }
  - { claim: "May note the Stellar connection (MoneyGram Access / USDC off-ramp on Stellar) as optional context.", weight: 2 }
nice_to_have:
  - { claim: "Keeps the general company profile distinct from the Stellar integration.", weight: 1 }
must_avoid:
  - { claim: "Do NOT decline as out-of-scope; MoneyGram is a known Stellar partner and company background is legitimate general-web context.", weight: 4 }
  - { claim: "Do NOT fabricate specific revenue, agent counts, or country figures without a citation.", weight: 4 }
must_cite:
  - "At least one reputable general-web source on MoneyGram."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.moneygram.com/mgo/us/en/
  - https://stellar.org/blog/foundation/moneygram-access-launches
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Reviewed 2026-06-29: pinned MoneyGram's identity (global money-transfer/remittance company, large agent network) in must_have. Stellar tie verified — MoneyGram Access crypto-to-cash service on Stellar (USDC) launched 2022 from an Oct-2021 SDF partnership. Perplexity/Parallel should answer; Stellar tie is optional color. Trap = over-refusal or fabricated agent/revenue figures."
---

## Reference answer (gospel)

**General-web edge (should answer).** **MoneyGram** is a **global money-transfer / cross-border
remittance company** — its core business is remittances and cash-in/cash-out via a large agent and retail
network across many countries ([moneygram.com](https://www.moneygram.com/mgo/us/en/)). Raven should answer
from a general-web source rather than refusing as "not Stellar." It may note the Stellar connection —
**MoneyGram Access**, a USDC cash on/off-ramp built on Stellar
([Stellar blog](https://stellar.org/blog/foundation/moneygram-access-launches)) — as optional color kept
distinct from the company profile. It must **not** fabricate specific revenue, agent counts, or country
figures without a citation.

## Why these cards (routing rationale)

Corporate background is open-web → `perplexity_search` / `parallel_search`. The MoneyGram Access /
Stellar integration is a separate Stellar-corpus lookup.

## Edge / traps

Wrong answers: refusing because "not a Stellar question"; inventing agent/revenue figures.
