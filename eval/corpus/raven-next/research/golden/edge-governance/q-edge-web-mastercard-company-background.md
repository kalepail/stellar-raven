---
id: q-edge-web-mastercard-company-background
q: "Give me mainstream-press background on Mastercard as a company — its core business and scale — given it has partnered with Stellar on crypto initiatives."
category: edge-governance
subcategory: general-web-only
axes: [edge-governance]
query_type: edge-nonstellar
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [parallel_search]
acceptable_cards: [perplexity_search]
forbidden_cards: [scout_research]
expected_service: parallel
should_fire: true   # mainstream-press background on a non-Stellar entity in the Stellar orbit = the Parallel general-web edge

must_have:
  - { claim: "Pins Mastercard's specific identity: a global payments-technology / card-network company (NYSE: MA) operating a worldwide payment-processing network — not a bank or a crypto issuer.", weight: 5 }
  - { claim: "Answers from mainstream-press / general-web sources rather than refusing as not-Stellar-specific.", weight: 4 }
should_have:
  - { claim: "Frames Mastercard's scale (global card network, payment processing) as general company background.", weight: 3 }
  - { claim: "Keeps any Stellar-specific partnership detail (e.g. Crypto Credential) separate from the general company profile.", weight: 2 }
nice_to_have:
  - { claim: "Notes the Stellar connection only as the reason the background is in-scope, not as the focus.", weight: 1 }
must_avoid:
  - { claim: "Do NOT decline as out-of-scope; company background on a Stellar partner is legitimate general-web context.", weight: 4 }
  - { claim: "Do NOT fabricate financials, leadership, or specific partnership terms without a citation.", weight: 4 }
must_cite:
  - "At least one reputable mainstream-press / general-web source on Mastercard."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.mastercard.com/global/en/about.html
  - https://stellar.org/press/stellar-joins-the-mastercard-crypto-credential-ecosystem-to-unlock-verified-interactions-across-public-blockchain-networks
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Reviewed 2026-06-29: pinned Mastercard's identity (global card-network / payments-tech company, NYSE: MA) in must_have. Stellar tie re-verified — SDF announced the Mastercard Crypto Credential integration at Meridian 2024 in London on 15 Oct 2024 (stellar.org press + PRNewswire). Parallel-search EXPECTED route. Trap = over-refusal or fabricated company facts."
---

## Reference answer (gospel)

**General-web edge (Parallel route).** **Mastercard** is a **global payments-technology / card-network
company** — at its core it operates a worldwide network that processes card and digital payments between
issuers, acquirers, and merchants ([mastercard.com](https://www.mastercard.com/global/en/about.html)).
Raven should answer from mainstream-press / general-web sources (ranked dated excerpts favor
`parallel_search`), not refuse as "not Stellar." The Stellar tie — Mastercard's **Crypto Credential**
solution integrating with Stellar (announced at Meridian, **15 Oct 2024**)
([Stellar press](https://stellar.org/press/stellar-joins-the-mastercard-crypto-credential-ecosystem-to-unlock-verified-interactions-across-public-blockchain-networks))
— is kept **separate** from the general company profile. It must **not** fabricate financials, leadership,
or partnership terms without a citation.

## Why these cards (routing rationale)

Mastercard's corporate profile is open-web, mainstream-press information; ranked dated sources favor
`parallel_search`, with `perplexity_search` acceptable. Stellar-specific partnership detail would be a
distinct lookup; a Stellar corpus is the wrong primary for general company background.

## Edge / traps

Wrong answers: refusing the question as not-Stellar; fabricating Mastercard financials or partnership
terms without a source.
