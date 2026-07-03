---
id: q-edge-web-circle-company-background
q: "Who is Circle, the company behind USDC, and what is their general business?"
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
should_fire: true   # background on a company in the Stellar orbit = legit general-web context

must_have:
  - { claim: "Pins Circle's specific identity: the US fintech/payments company that issues the USDC (and EURC) stablecoin — not a wallet, exchange, or the token itself.", weight: 5 }
  - { claim: "Answers from a general-web source rather than refusing as not-Stellar-specific.", weight: 4 }
should_have:
  - { claim: "Describes Circle's core business (issuing/managing fiat-backed stablecoins, payments infrastructure).", weight: 3 }
  - { claim: "May note USDC is issued on multiple chains including Stellar as relevant context.", weight: 2 }
nice_to_have:
  - { claim: "Keeps Stellar-specific USDC facts separate from the general company profile.", weight: 1 }
must_avoid:
  - { claim: "Do NOT decline as out-of-scope; company background on the USDC issuer is legitimate general-web context.", weight: 4 }
  - { claim: "Do NOT fabricate financials, leadership, or a specific reserve composition without a citation.", weight: 4 }
must_cite:
  - "At least one reputable general-web source on Circle."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.circle.com/en/usdc
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Reviewed 2026-06-29: pinned Circle's identity (USDC/EURC issuer, US fintech/payments) in must_have so the rubric requires the real entity, not a generic crypto-firm gloss. Circle-as-USDC-issuer and USDC-on-Stellar verified. Trap = over-refusal or fabricating financials/reserves."
---

## Reference answer (gospel)

**General-web edge (should answer).** **Circle** is a financial-technology / payments company and the
**issuer of the USDC stablecoin** (and EURC); its core business is issuing and managing fiat-backed
stablecoins and providing payments infrastructure ([circle.com](https://www.circle.com/en/usdc)). Raven
should answer from a general-web source rather than refusing as "not Stellar." It may note USDC is issued
on **multiple chains including Stellar** as relevant context, kept separate from the general company
profile. It must **not** refuse, nor fabricate financials, leadership, or a specific reserve composition
without a citation.

## Why these cards (routing rationale)

Circle's corporate profile is open-web information; route to `perplexity_search` / `parallel_search`.
Stellar-specific USDC details would be a distinct lookup.

## Edge / traps

Wrong answers: refusing the question, or fabricating Circle financials/reserve facts without a source.
