---
id: q-comp-irs-1099da-xlm
q: "Is XLM subject to US IRS digital-asset reporting (e.g. Form 1099-DA) in 2026?"
category: compliance-rwa-payments
subcategory: regulatory-treatment-xlm
axes: [edge-governance, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: regulatory-change
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: [stellar_docs_mcp, scout_research]
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "XLM, as a digital asset, is generally subject to US digital-asset tax reporting (e.g. Form 1099-DA broker reporting), and the answer treats the rules as current/evolving.", weight: 5 }
  - { claim: "Flags this as tax/regulatory information that changes year to year (freshness) and is general guidance, not tax advice.", weight: 3 }
should_have:
  - { claim: "Notes broker/exchange reporting obligations and that effective dates/forms can shift.", weight: 2 }
nice_to_have:
  - { claim: "Points to the IRS digital-assets / Form 1099-DA pages as the authority.", weight: 1 }
must_avoid:
  - { claim: "Do NOT give a specific tax rate / filing conclusion as personalized advice.", weight: 4 }
  - { claim: "Do NOT source IRS rules from Stellar developer docs (out of scope for stellar_docs).", weight: 3 }
must_cite:
  - "IRS digital-asset / Form 1099-DA materials or reputable dated tax coverage."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://www.irs.gov/forms-pubs/about-form-1099-da
  - https://www.irs.gov/instructions/i1099da
  - https://www.irs.gov/newsroom/reminders-for-taxpayers-about-digital-assets
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; stellar_docs/scout stay forbidden (tax law is not a protocol fact). VERIFIED: Form 1099-DA (Digital Asset Proceeds From Broker Transactions) is in effect — custodial brokers report GROSS PROCEEDS for sales on/after Jan 1, 2025 (basis for covered securities on/after Jan 1, 2026); first statements furnished to customers by Feb 17, 2026. XLM is a digital asset, so broker sales are covered (de-minimis/optional aggregate methods exist for qualifying stablecoins/NFTs). General guidance, not tax advice; rules evolve. stellar_docs FORBIDDEN (tax law isn't a Stellar protocol fact)."
---

## Reference answer (gospel)

- **Yes — XLM is a digital asset, so US digital-asset tax reporting applies.** **Form 1099-DA ("Digital
  Asset Proceeds From Broker Transactions")** is in effect: custodial **brokers report gross proceeds for
  sales effected on/after Jan 1, 2025** (and **basis for covered securities on/after Jan 1, 2026**);
  brokers furnished the first 1099-DA statements to customers by **Feb 17, 2026** [1][2][3].
- These are **broker/exchange reporting** rules; **effective dates and forms can shift** (rules for
  non-custodial/"DeFi" brokers are still pending) — treat as **current/evolving** [2].
- This is **general information, not tax advice**, and not a specific filing conclusion/rate [3].
- Authority is the **IRS** (digital-assets / Form 1099-DA pages) — **not** Stellar developer docs.

Sources: [1] IRS About Form 1099-DA; [2] IRS 1099-DA Instructions; [3] IRS digital-assets reminders.

## Why these cards (routing rationale)

US tax reporting is general legal/regulatory context → `perplexity_search`/`parallel_search`. Stellar docs/Scout are forbidden here — tax law is not a Stellar protocol fact, so routing there would be a miss.

## Edge / traps

Trap: personalized tax advice; sourcing tax law from Stellar docs.
