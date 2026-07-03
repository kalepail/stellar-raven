---
id: q-defi-aquarius-tvl-freshness
q: "What's Aquarius's current TVL and trading volume?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [lumenloop_find_content_about_project, scout_analyze, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Reports Aquarius's TVL/volume from a dated source (e.g. DeFiLlama ~$48M TVL, ~$104M 30-day DEX volume range) AND flags that these figures move and may be stale.", weight: 5 }
should_have:
  - { claim: "Attributes the figure to a specific dated source (DeFiLlama / aqua.network) rather than asserting a bare number.", weight: 3 }
  - { claim: "Notes Aquarius is roughly the largest single DEX/AMM on Stellar by TVL (~20% of listed Stellar TVL).", weight: 2 }
nice_to_have:
  - { claim: "Offers to confirm against a live source given the value's volatility.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a precise TVL/volume as a fixed, current fact without flagging it is time-sensitive and may be stale.", weight: 5 }
  - { claim: "Do NOT invent a TVL/volume number with no source.", weight: 5 }
must_cite:
  - "A dated TVL/volume source (DeFiLlama or aqua.network) with a freshness caveat."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://defillama.com/protocol/aquarius-stellar
  - https://aqua.network/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: low
notes: "FRESHNESS item. Aquarius is grounded as Live (Scout, AMM/DEX, SCF $391K). The dossier figures (DeFiLlama ~$48M TVL, ~$104M 30-day DEX volume, ~$584M cumulative) are dated reads and move — and since chain-wide Stellar TVL has dropped sharply since the May-2026 record, Aquarius's share has likely moved too. Gate on 'cite DeFiLlama/aqua.network dated figure + flag staleness + confirm live', NOT a fixed number. Confidence: low (volatile). 2026-06-29 reviewed: re-verified Aquarius is Live DEX, SCF $391K (Scout); SDF 2026-04-23 dev-meeting recorded Aquarius crossing ~$50M TVL (Aquarius-Stellar read $51.69M near the April peak), so dossier ~$48M is in-range; chain-wide DeFiLlama live read is now ~$137.84M (down from the $242M May record), confirming the number moves. Gating unchanged; kept low (volatile)."
---

## Reference answer (gospel)

Aquarius is the **largest single AMM/DEX on Stellar by TVL** (grounded Live, AMM, SCF-funded) [2], but
its **TVL/volume are volatile** — answer with a **dated source + freshness caveat**:
- The **DeFiLlama Aquarius-Stellar** protocol page is the live figure [1]; dossier-era reads showed
  **~$48M TVL**, **~$104M 30-day DEX volume**, and **~$584M cumulative DEX volume** — but these move
  and may be stale. **Confirm against DeFiLlama/aqua.network before quoting.**
- Aquarius has historically been roughly the largest single contributor to listed Stellar TVL.

Sources: [1] defillama.com/protocol/aquarius-stellar (live); [2] aqua.network.

## Why these cards (routing rationale)

Current-metric on a named project → semantic content search for the latest figure; Scout analytics and
general-web search are acceptable for current numbers. Deep-research tiers banned.

## Edge / traps

Freshness trap: TVL/volume is volatile; a correct answer flags staleness and cites a dated source
rather than asserting a bare current number.
