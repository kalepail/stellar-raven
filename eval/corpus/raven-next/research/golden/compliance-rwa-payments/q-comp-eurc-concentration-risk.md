---
id: q-comp-eurc-concentration-risk
q: "What is the regulatory concentration risk for Stellar's EU payments business given its reliance on Circle's EURC?"
category: compliance-rwa-payments
subcategory: audits-incidents-risks
axes: [edge-governance, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Stellar's EU-facing payments/aid density depends heavily on Circle's MiCA-compliant EURC, so a disruption to EURC (regulatory delisting, reserve failure) would be a concentrated risk to that segment.", weight: 5 }
  - { claim: "Frames this as analysis/risk, contingent on dated market-share figures, and flags uncertainty rather than asserting an outcome.", weight: 4 }
should_have:
  - { claim: "Notes EURC's compliance rests on a single issuer's EU license posture (e.g. French EMI), a single point of regulatory dependency.", weight: 3 }
nice_to_have:
  - { claim: "Suggests contingency paths (USDC, MGUSD) for EUR-dependent flows.", weight: 1 }
must_avoid:
  - { claim: "Do NOT predict a specific EURC failure or delisting as a certainty.", weight: 5 }
  - { claim: "Do NOT state live market-share percentages as permanent facts without a date/caveat.", weight: 3 }
must_cite:
  - "Dated EURC/Circle/MiCA reporting or reputable analysis."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: strict

sources:
  - https://www.circle.com/eurc
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: low
notes: "2026-06-29 reviewed; remains analytical/hedged, confidence kept low by design. ANALYTICAL risk + freshness. Durable facts: EURC is Circle-issued, MiCA-compliant, dependent on Circle's single French EMI license; circulation ~€380.9M as of June 15, 2026 (figure changes). The 'concentration risk' is analysis/hedged, NOT a prediction. Reward hedged, dated framing; must_avoid: predicting a certain EURC failure/delisting or stating market-share % as permanent. Contingency paths: USDC, MGUSD."
---

## Reference answer (gospel)

- Stellar's **EU-facing payments/aid density depends heavily on Circle's MiCA-compliant EURC**, so a
  **disruption to EURC** (regulatory delisting, reserve failure) would be a **concentrated risk** to that
  segment — framed as **analysis/risk, not a prediction** [1].
- EURC's compliance rests on a **single issuer's EU license posture** (Circle's **French EMI**) — a single
  point of regulatory dependency [1].
- Figures are **time-sensitive** (e.g. ~€380.9M circulation as of June 15, 2026) — flag uncertainty rather
  than asserting an outcome or stating live market-share % as permanent [1].
- Contingency paths for EUR-dependent flows: **USDC** or **MGUSD** (different regimes/issuers).
- Do **not** predict a specific EURC failure/delisting as a certainty.

Source: [1] circle.com/eurc.

## Why these cards (routing rationale)

Forward-looking market/regulatory risk = general-web analysis → `perplexity_search`/`parallel_search`; `scout_research` acceptable for Stellar-side density.

## Edge / traps

Trap: predicting a certain failure; stale figures as permanent.
