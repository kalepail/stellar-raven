---
id: q-comp-genius-act-stablecoins
q: "What is the GENIUS Act and how does it affect dollar stablecoins like USDC and MGUSD that run on Stellar?"
category: compliance-rwa-payments
subcategory: regulatory-treatment-stablecoins
axes: [edge-governance, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: regulatory-change
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "The GENIUS Act is a US federal framework for payment stablecoins (signed into law in 2025) that requires stablecoin issuers to follow a defined regulatory regime (reserves, supervision).", weight: 5 }
  - { claim: "It applies at the issuer level (e.g. Circle for USDC, Bridge/Stripe for MGUSD), not at the Stellar-chain level.", weight: 4 }
should_have:
  - { claim: "MGUSD (MoneyGram's stablecoin on Stellar) is positioned as a GENIUS-Act-ready / aligned issuer.", weight: 2 }
  - { claim: "Treats specifics (dates, which issuers qualify) as evolving with implementing rules.", weight: 2 }
nice_to_have:
  - { claim: "Notes the bill identifier (S.1582) or signing date as a dated, checkable detail.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the GENIUS Act regulates the Stellar protocol or makes Stellar itself a regulated issuer.", weight: 4 }
  - { claim: "Do NOT invent specific compliance determinations (e.g. 'MGUSD is fully GENIUS-certified') as settled fact.", weight: 3 }
must_cite:
  - "A dated legislative/regulatory or reputable-news source (congress.gov, law firm, Circle) — not stellar dev docs."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://www.congress.gov/bill/119th-congress/senate-bill/1582/text
  - https://www.whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-signs-genius-act-into-law/
  - https://www.prnewswire.com/news-releases/moneygram-launches-mgusd-a-stablecoin-to-power-its-own-global-network-302787799.html
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; Bridge/Stripe 'GENIUS Act-ready' MGUSD issuer framing re-confirmed via MoneyGram June-2026 release. VERIFIED: GENIUS Act = S.1582, signed July 18, 2025; first US federal payment-stablecoin framework (1:1 reserves, monthly disclosures, BSA/AML, OCC/state supervision). Issuer-level. Effective date pending = earlier of 18mo after enactment or 120 days after final regs (~late 2026). MGUSD issuer Bridge (a Stripe company) is described as 'regulated, GENIUS Act-ready'. Reward dated sourcing; must_avoid: applying the law to the chain or over-claiming a certification."
---

## Reference answer (gospel)

- The **GENIUS Act (S.1582)** is the **first US federal framework for payment stablecoins**, **signed into
  law July 18, 2025**; it requires issuers to hold **1:1 reserves**, make **monthly reserve disclosures**,
  comply with the **Bank Secrecy Act / AML**, and be supervised (OCC for federal nonbank issuers, or a
  substantially-similar state regime) [1][2].
- It applies at the **issuer level** (e.g. Circle for USDC, **Bridge/Stripe for MGUSD**) — **not at the
  Stellar-chain level**; the chain itself is not a "regulated issuer" [1].
- **MGUSD** (MoneyGram's stablecoin on Stellar) is issued by **Bridge (a Stripe company), described as a
  "regulated, GENIUS Act-ready issuer"** [3].
- Specifics are **evolving** with implementing rules — the Act's effective date is the **earlier of 18
  months after enactment or 120 days after final regulations** (~late 2026). Don't claim "MGUSD is fully
  GENIUS-certified" as settled fact.

Sources: [1] congress.gov S.1582; [2] White House fact sheet; [3] MoneyGram MGUSD release.

## Why these cards (routing rationale)

US stablecoin law is general regulatory context → `perplexity_search`/`parallel_search`. Not a Stellar protocol fact.

## Edge / traps

Trap: applying the law to the chain rather than the issuer; over-claiming a certification.
