---
id: q-edge-web-cbdc-vs-stablecoin
q: "At a high level, what is the difference between a central bank digital currency (CBDC) and a stablecoin?"
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
should_fire: true   # general macro/finance concept question

must_have:
  - { claim: "Explains a CBDC is issued by a central bank (sovereign/public money) whereas a stablecoin is issued by a private entity, typically backed by reserves.", weight: 5 }
  - { claim: "Answers from general knowledge / general-web sources rather than refusing as not-Stellar.", weight: 4 }
should_have:
  - { claim: "Notes the trust/issuer and regulatory differences (central-bank liability vs private issuer).", weight: 3 }
nice_to_have:
  - { claim: "May mention Stellar has been used in CBDC/stablecoin pilots as optional context.", weight: 1 }
must_avoid:
  - { claim: "Do NOT decline as out-of-scope; this is a legitimate general macro/finance concept question.", weight: 4 }
  - { claim: "Do NOT conflate CBDC and stablecoin as the same thing.", weight: 4 }
must_cite: []
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.imf.org/en/Topics/fintech/central-bank-digital-currency
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "General-web/general-knowledge edge: a conceptual macro question. Should answer cleanly; trap is over-refusal or conflating the two concepts."
---

## Reference answer (gospel)

**General-web edge (should answer).** This is a legitimate macro/finance concept question — Raven should
answer it from general knowledge / general-web sources, not refuse as "not Stellar." The key distinction:

- **CBDC** — a digital form of **sovereign/public money issued by a central bank**; it is a direct
  central-bank liability.
- **Stablecoin** — issued by a **private entity**, typically a token **backed by reserves** (fiat,
  treasuries) and pegged to a reference value.

The differences hinge on **issuer and trust/regulatory model** (central-bank liability vs private
issuer). Raven must **not conflate** the two. It may note Stellar has hosted CBDC/stablecoin pilots as
optional color. Route: `perplexity_search` / `parallel_search`.

## Why these cards (routing rationale)

Conceptual macro/finance question — general-web edge. No Stellar corpus needed.

## Edge / traps

Wrong answers: refusing, or treating CBDC and stablecoin as interchangeable.
