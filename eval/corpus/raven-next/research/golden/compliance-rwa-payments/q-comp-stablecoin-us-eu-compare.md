---
id: q-comp-stablecoin-us-eu-compare
q: "Compare how USDC, EURC, and MGUSD on Stellar are regulated across the US and EU."
category: compliance-rwa-payments
subcategory: regulatory-treatment-stablecoins
axes: [edge-governance, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: regulatory-change
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "USDC and EURC (both Circle) are described as MiCA-compliant in the EU; USDC additionally sits under the US GENIUS-Act framework.", weight: 5 }
  - { claim: "MGUSD is a US-focused, GENIUS-Act-aligned issuer (Bridge/Stripe for MoneyGram) with little/no EU (MiCA) footprint.", weight: 4 }
should_have:
  - { claim: "Regulatory status is at the issuer level, and the comparison is time-sensitive (flag freshness).", weight: 3 }
  - { claim: "Distinguishes US (GENIUS Act / state MSB) from EU (MiCA / EMI license) regimes.", weight: 2 }
nice_to_have:
  - { claim: "Notes all three run as assets on Stellar but carry distinct regulatory perimeters.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim any of these is regulated 'because it is on Stellar' (chain-level), rather than at the issuer level.", weight: 4 }
  - { claim: "Do NOT assert MGUSD is MiCA-compliant or EURC is GENIUS-regulated without evidence (don't cross the regimes).", weight: 4 }
must_cite:
  - "Dated issuer/regulatory sources (Circle, MoneyGram press, law-firm/regulatory analysis)."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: standard

sources:
  - https://www.circle.com/eurc
  - https://www.prnewswire.com/news-releases/moneygram-launches-mgusd-a-stablecoin-to-power-its-own-global-network-302787799.html
  - https://www.congress.gov/bill/119th-congress/senate-bill/1582/text
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; MGUSD US-focus/Bridge issuer re-confirmed via MoneyGram June-2026 release. VERIFIED: USDC & EURC (Circle) are MiCA-compliant in the EU (Circle French EMI); USDC also sits under US GENIUS Act. MGUSD (Bridge/Stripe for MoneyGram, launched June 2, 2026) is US-focused, 'GENIUS Act-ready', no current EU/MiCA footprint. All three are native Stellar assets but regulated at the ISSUER level. Freshness-sensitive. Trap: chain-level regulation claim or crossing US/EU regimes."
---

## Reference answer (gospel)

- **USDC and EURC (both Circle)** are **MiCA-compliant in the EU** (Circle holds a French EMI license);
  **USDC additionally sits under the US GENIUS Act** framework [1][3].
- **MGUSD** (issued by **Bridge/Stripe for MoneyGram**, launched **June 2, 2026**) is **US-focused and
  "GENIUS Act-ready," with little/no EU (MiCA) footprint** [2].
- Regulatory status is at the **issuer level** — US = **GENIUS Act / state MSB**, EU = **MiCA / EMI
  license** — and is **time-sensitive** (flag freshness) [1][2][3].
- All three run as **native assets on Stellar**, but carry **distinct regulatory perimeters** — none is
  regulated "because it is on Stellar." Don't cross regimes (MGUSD is not MiCA-compliant; EURC isn't
  GENIUS-regulated).

Sources: [1] circle.com/eurc; [2] MoneyGram MGUSD release; [3] congress.gov S.1582 (GENIUS).

## Why these cards (routing rationale)

Cross-jurisdiction stablecoin regulation → general-web `perplexity_search`/`parallel_search`; `scout_research` acceptable for Stellar-side framing.

## Edge / traps

Trap: chain-level regulation; mixing up which regime covers which issuer.
