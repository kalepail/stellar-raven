---
id: q-eco-defi-tvl-current
q: "What's the current total value locked (TVL) in Stellar DeFi?"
category: defi-ecosystem
subcategory: adoption
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [scout_analyze, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Reports Stellar DeFi TVL from a DATED source (e.g. the ~$242M record on May 30 2026, or a live DeFiLlama chain figure) AND flags that TVL is volatile and may be stale — gating on the freshness caveat, not on a specific number.", weight: 5 }
should_have:
  - { claim: "Attributes the figure to a specific dated source (DeFiLlama, SDF blog, or dated news) rather than a bare number.", weight: 3 }
  - { claim: "Notes the live DeFiLlama snapshot moves substantially (it has ranged from a ~$242M May-2026 record down toward ~$140-200M since) — i.e. confirm against the live source.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes a point-in-time record ($242M, May 30 2026) from the live DeFiLlama snapshot, and notes Aquarius is a large single contributor.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a single TVL number as a fixed current fact without a date/source and a staleness caveat.", weight: 5 }
  - { claim: "Do NOT conflate the May 2026 record (~$242M) with a live DeFiLlama snapshot as the same/current number.", weight: 3 }
must_cite:
  - "A dated TVL source (DeFiLlama / SDF / dated news) with a freshness caveat."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://defillama.com/chain/stellar
  - https://x.com/BSCNews/article/2063985562260767069
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: low
notes: "FRESHNESS item, RE-VERIFIED LIVE 2026-06-29 (perplexity/DeFiLlama): figure is HIGHLY volatile and the dossier's ~$227M is stale. Record = ~$242M on May 30 2026 (confirmed via CryptoCompass/BSCNews). Live DeFiLlama chain reads have since ranged DOWN — mid-June 2026 reads near ~$200M, and the 2026-06-29 DeFiLlama read is ~$137.84M (matching the 06-22 scrape). So the gate MUST be on 'cite a dated source + flag staleness + confirm live', NOT a fixed number. Two distinct figures (record vs live snapshot) must not be merged. Confidence: low (volatile)."
---

## Reference answer (gospel)

Stellar DeFi TVL is **volatile** — answer with a **dated source + freshness caveat**, not a fixed
number:
- **Record:** ~**$242M on May 30, 2026** (point-in-time all-time high) [2].
- **Live snapshot:** the **DeFiLlama Stellar chain** page is the live figure [1] — but it **moves
  substantially**: since the May record it has ranged down (mid-June 2026 reads near ~$200M, and a
  2026-06-22 read near ~$140M). **Confirm against DeFiLlama before quoting.**

Aquarius is among the largest single contributors to listed Stellar TVL.

Sources: [1] defillama.com/chain/stellar (live); [2] BSCNews "$242M TVL" (May 30 2026).

## Why these cards (routing rationale)

Current TVL → semantic content search for the latest dated figure; Scout analytics / general-web
acceptable. Deep-research banned.

## Edge / traps

Freshness: flag volatility; keep the **record** ($242M) and the **live snapshot** separate; do not
assert a stale number as current.
