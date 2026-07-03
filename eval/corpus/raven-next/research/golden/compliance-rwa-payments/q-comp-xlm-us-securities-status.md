---
id: q-comp-xlm-us-securities-status
q: "Is XLM classified as a security or a commodity under US law as of 2026, and how settled is that classification?"
category: compliance-rwa-payments
subcategory: regulatory-treatment-xlm
axes: [edge-governance, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: regulatory-change

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Frames XLM's US classification as evolving/interpretive, NOT a settled statutory fact, and flags uncertainty.", weight: 5 }
  - { claim: "References the 2026 SEC interpretive guidance / SEC-CFTC joint interpretation that treats XLM (alongside other layer-1 tokens) as a digital commodity rather than a security.", weight: 4 }
should_have:
  - { claim: "Notes this is interpretive guidance that a future administration / litigation / Congress could revisit, so the answer carries regulatory-freshness risk.", weight: 3 }
  - { claim: "Distinguishes from the earlier 2018-2024 'is XLM a security?' uncertainty era.", weight: 2 }
nice_to_have:
  - { claim: "Mentions the five-part token taxonomy (digital commodity / digital security / stablecoin / etc.).", weight: 1 }
must_avoid:
  - { claim: "Do NOT state as settled legal fact that 'XLM is definitively a commodity and never a security' (this is interpretive, not adjudicated).", weight: 5 }
  - { claim: "Do NOT invent a specific court ruling or Supreme Court decision on XLM's status.", weight: 5 }
  - { claim: "Do NOT source this from Stellar developer docs as if it were a protocol fact.", weight: 3 }
must_cite:
  - "A dated regulatory/legal source (SEC release, law-firm analysis, or reputable news) — not stellar developer docs."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: strict

sources:
  - https://www.sec.gov/newsroom/press-releases/2026-30-sec-clarifies-application-federal-securities-laws-crypto-assets
  - https://www.jenner.com/en/news-insights/client-alerts/sec-and-cftc-issue-landmark-joint-interpretation-on-crypto-asset-classification
  - https://www.lowenstein.com/news-insights/publications/client-alerts/sec-issues-interpretive-framework-for-crypto-asset-classification-fctm
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "FRESHNESS/regulatory-evolving. 2026-06-29 RE-VERIFIED via SEC release 33-11412 (sec.gov) + CFTC PR 9198-26 + Lowenstein/Jenner/Norton Rose alerts: SEC+CFTC Joint Interpretation issued 2026-03-17 (effective ~2026-03-23 on Federal Register publication); five-part taxonomy = digital commodities / digital collectibles / digital tools / stablecoins / digital securities. XLM is explicitly named among the ~16 tokens deemed 'digital commodities'. KEY: it is a binding interpretive rule on the agencies, NOT a statute or court ruling, and a future administration could revise it. Reward uncertainty-flagging; must_avoid: asserting it as settled law or inventing a court/Supreme Court ruling. NOTE: dossier's taxonomy labels (wrapped stablecoins/NFTs) were imprecise — corrected here."
---

## Reference answer (gospel)

- As of **2026, XLM's US classification is interpretive, not a settled statutory or adjudicated fact** —
  flag the uncertainty [1].
- The **SEC and CFTC issued a Joint Interpretation on March 17, 2026** (effective ~March 23 on Federal
  Register publication) that **explicitly names XLM among ~16 tokens classified as "digital commodities"**
  (not securities), under a **five-part taxonomy**: digital commodities, digital collectibles, digital
  tools, stablecoins, and digital securities [1][2].
- This is a **binding interpretive rule on the two agencies, NOT a statute or court ruling**, and a
  **future administration could revise it** — so the answer carries **regulatory-freshness risk** [2][3].
- This is a sharp change from the **2018–2024 "is XLM a security?" uncertainty era** [3].
- Do **not** state "XLM is definitively a commodity and never a security" as settled law, and do **not**
  invent a court/Supreme Court ruling.

Sources: [1] SEC Press Release 2026-30; [2] Jenner & Block alert; [3] Lowenstein alert.

## Why these cards (routing rationale)

Securities/commodity classification is general legal/regulatory context, not a Stellar protocol fact → `perplexity_search` (recency-aware) is the correct edge; `parallel_search` acceptable. Pulling this from `stellar_docs_mcp` would be wrong (it's not a protocol fact). This is the deliberate general-web test.

## Edge / traps

Trap 1: asserting a settled legal conclusion. Trap 2: inventing a court ruling. Trap 3: treating regulatory status as a Stellar-docs fact. Reward explicit uncertainty + dated sourcing.
