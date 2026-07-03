---
id: q-edge-web-mica-overview
q: "What is the EU's MiCA regulation and what does it cover at a high level?"
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
should_fire: true   # legitimate general-web macro/regulatory context

must_have:
  - { claim: "Identifies MiCA as the EU Markets in Crypto-Assets Regulation (a European Union regulatory framework for crypto-assets).", weight: 5 }
  - { claim: "Answers from a general-web source (Perplexity/Parallel) rather than refusing because it is not Stellar-specific.", weight: 4 }
should_have:
  - { claim: "Notes MiCA covers issuers of crypto-assets and crypto-asset service providers (CASPs), including stablecoins / e-money tokens / asset-referenced tokens.", weight: 3 }
  - { claim: "Mentions MiCA is being phased in across the EU (notably 2024-2025).", weight: 2 }
nice_to_have:
  - { claim: "Connects MiCA to Stellar-relevant stablecoins (e.g. EURC/USDC) only as optional context, without overclaiming.", weight: 1 }
must_avoid:
  - { claim: "Do NOT decline this as out-of-scope; it is legitimate general-web regulatory context Raven should answer.", weight: 4 }
  - { claim: "Do NOT fabricate specific MiCA article numbers, dates, or thresholds without a citation.", weight: 4 }
must_cite:
  - "At least one reputable general-web source on MiCA (EU/regulatory or major outlet)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "General-web edge: MiCA is macro/regulatory context the Perplexity/Parallel cards SHOULD answer. The trap is over-refusing because it is not Stellar-specific, or inventing article numbers/dates."
---

## Reference answer (gospel)

**General-web edge (should answer).** **MiCA** is the EU's **Markets in Crypto-Assets Regulation**, a
harmonized European Union framework for crypto-assets
([ESMA](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica)).
At a high level it covers **issuers of crypto-assets and crypto-asset service providers (CASPs)**,
including stablecoins — split into **e-money tokens (EMTs)** and **asset-referenced tokens (ARTs)** — and
is being **phased in across the EU (notably 2024-2025)**. Raven should answer from a general-web source,
not refuse as "not Stellar." It may connect MiCA to Stellar-relevant stablecoins (USDC/EURC) only as
optional color. It must **not** invent specific article numbers, dates, or thresholds without a citation.

## Why these cards (routing rationale)

MiCA is not in any Stellar-specific corpus; it is general regulatory/macro context. The correct route
is the general-web edge (`perplexity_search` / `parallel_search`). A routing miss would be either
refusing it or trying to answer it from Stellar-only corpora.

## Edge / traps

The plausible wrong answers: (a) declining because "not Stellar-specific" — wrong, this is exactly the
general-web edge the cards exist for; (b) inventing article numbers or precise dates without a source.
