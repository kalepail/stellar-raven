---
id: q-eco-stellar-rwa-stablecoin-volume
q: "How big is Stellar's on-chain RWA and stablecoin activity according to recent SDF reporting?"
category: defi-ecosystem
subcategory: adoption
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Reports recent dated Q1-2026-era adoption figures — e.g. SDF Q1 2026: $2B+ on-chain RWAs, $5.5B stablecoin payment volume, ~86% developer growth (Messari's State of Stellar Q1 2026 separately puts the tokenized-RWA stack at ~$2.8B) — attributed to a dated source AND flagged as a point-in-time quarterly snapshot.", weight: 5 }
should_have:
  - { claim: "Attributes the numbers to a specific dated report (SDF Q1 2026 update or Messari State of Stellar Q1 2026) rather than asserting bare figures.", weight: 3 }
nice_to_have:
  - { claim: "Frames RWA + stablecoins as Stellar's strongest adoption story.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present these figures as permanent/current without a date, source, and staleness caveat.", weight: 5 }
  - { claim: "Do NOT invent adoption metrics not present in the source data.", weight: 4 }
must_cite:
  - "A dated report (SDF Q1 2026 update or Messari State of Stellar Q1 2026) for the figures."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale
  - https://lumenloop.com/research/stellar-weekly-roundup-week-29-2026
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "FRESHNESS item (quarterly). Two dated sources, slightly different cuts: SDF Q1 2026 'Execution at network scale' cites $2B+ on-chain RWAs, $5.5B stablecoin payment volume, ~86% dev growth; Messari 'State of Stellar Q1 2026' (per Lumenloop roundup, week of May 29 2026) puts the tokenized-RWA stack at ~$2.8B (4th among ecosystems) with ~1,700 monthly active devs. Don't gate on one exact number — gate on 'cite a dated Q1-2026 report + flag it's a snapshot.' 2026-06-29 reviewed: directly verified both anchors — SDF blog 'Q1 2026: Execution at network scale' confirms RWAs crossed $2B (from $785M YE2025), stablecoin payment volume $5.5B (+72% YoY); SDF President interview (2026-06-04) states RWA stack now ~$2.8B, '3rd or 4th' among chains. LinkedIn/Messari cross-check shows Stellar #4 RWA (~$1.7B registered-fund scope) — note the $1.2-2B vs $2.8B gap is a scope difference (registered funds vs broad RWA incl. stablecoins); file already gates on caveat. Confidence kept medium (figures move quarterly)."
---

## Reference answer (gospel)

Recent **dated** reporting (Q1 2026), flagged as a **point-in-time quarterly snapshot**:
- **SDF Q1 2026 ("Execution at network scale"):** **$2B+ in on-chain RWAs**, **$5.5B in stablecoin
  payment volume**, **~86% developer growth** [stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale].
- **Messari "State of Stellar Q1 2026"** (per Lumenloop roundup, week of May 29 2026): tokenized-RWA
  stack **crossed ~$2.8B** (a 3.5x rise since late 2025, **4th** among ecosystems), with **~1,700
  monthly active developers** [lumenloop.com/research/stellar-weekly-roundup-week-29-2026].

RWA + stablecoins are Stellar's strongest adoption story. These are moving quarterly figures — **cite
the dated report and flag staleness**; don't present them as current/permanent or invent metrics.

## Why these cards (routing rationale)

Recent adoption reporting → semantic content search for the dated SDF update; Scout research / general-web acceptable.

## Edge / traps

Freshness: cite the dated quarterly report and flag staleness; figures from SDF vs Messari differ
slightly — don't fixate on one number.
