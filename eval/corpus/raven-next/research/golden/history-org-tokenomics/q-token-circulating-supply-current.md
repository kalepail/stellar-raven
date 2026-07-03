---
id: q-token-circulating-supply-current
q: "What is the current circulating supply of XLM, and what's the max supply?"
category: history-org-tokenomics
subcategory: tokenomics
axes: [ecosystem-spectrum, edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: "weekly"

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Max/total supply of XLM is approximately 50 billion (fixed after the 2019 burn).", weight: 5 }
  - { claim: "Circulating supply is roughly 29-34B XLM depending on the source/definition: the official Stellar lumens page reports circulating ~29B (total minus SDF Mandate, Upgrade Reserve, and Fee Pool), while market trackers like CoinMarketCap show ~33-34B — both consistent with the fixed ~50B total.", weight: 4 }
should_have:
  - { claim: "Flags that circulating supply is freshness-sensitive and gives a date / points to a live source (e.g. the official lumens page, CoinMarketCap, or dashboard.stellar.org).", weight: 3 }
  - { claim: "Notes there is NO ongoing inflation, so total supply is fixed near ~50B.", weight: 2 }
nice_to_have:
  - { claim: "The large non-circulating remainder (~16-21B depending on the circulating definition used) is held by SDF under its mandate; some press loosely rounds SDF holdings up to ~30B.", weight: 1 }
must_avoid:
  - { claim: "Do NOT cite a max supply near 100 billion as if current — the 100B figure was the pre-2019-burn supply.", weight: 5 }
  - { claim: "Do NOT claim XLM has an unlimited / uncapped / inflationary max supply — total/max is fixed near ~50B after inflation ended in 2019 (some market-data sites mislabel max supply as ∞).", weight: 4 }
  - { claim: "Do NOT assert a precise circulating-supply number with false confidence and no date / no live-source caveat.", weight: 3 }
must_cite:
  - "A live/dated supply source (the official developers.stellar.org lumens page, CoinMarketCap, dashboard.stellar.org, or a comparable tracker)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/lumens
  - https://coinmarketcap.com/currencies/stellar/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness item (weekly). Re-verified 2026-06-29. RECONCILED the supply math: official lumens page (developers.stellar.org/docs/learn/fundamentals/lumens) reports total ~50,001,803,905 and circulating ~28.98B (its circulating = total minus SDF Mandate, Upgrade Reserve, Fee Pool); CoinMarketCap shows circulating ~33.96B and max ~50B. So circulating is ~29B (official) to ~34B (market) and the SDF-held non-circulating remainder is ~16-21B — the widely-quoted '~30B SDF holdings' is a looser press figure that overstates vs the official lumens accounting. CoinGecko mislabels max as ∞. Key traps: 100B-as-current max and unlimited/uncapped supply."
---

## Reference answer (gospel)

As of the **2026-06-29** snapshot:
- **Total / max supply: ~50 billion XLM** (~50,001,803,905 on the official lumens page) — fixed since the 2019 burn + end of inflation; **no ongoing inflation**, so no new lumens are minted [1][2].
- **Circulating supply depends on the source/definition:**
  - The official Stellar **lumens page** reports circulating **~29B** (~28.98B) — it defines circulating as total *minus* the SDF Mandate, Upgrade Reserve, and Fee Pool [1].
  - Market trackers (**CoinMarketCap**) report **~33-34B** circulating using a looser definition [2].
  - Both are consistent with the fixed ~50B total — they differ on what counts as "circulating."
- The large **non-circulating remainder (~16-21B**, depending on which circulating figure you use) is held by SDF under its mandate. Some press rounds SDF holdings up to "~30B," which **overstates** vs the official lumens accounting — flag it rather than asserting it [1].

Freshness caveat: circulating supply moves as SDF distributes lumens — **cite a live source** (the official lumens page, CoinMarketCap, dashboard.stellar.org) and date it. Note: some market-data sites (e.g. CoinGecko) **mislabel** XLM's max supply as "∞/unlimited"; the network has **no ongoing inflation** and total supply sits near ~50B [1][2].

- [1] developers.stellar.org/docs/learn/fundamentals/lumens
- [2] coinmarketcap.com/currencies/stellar/

## Why these cards (routing rationale)

Live token-supply numbers are general-web / market-data → recency-aware `perplexity_search` /
`parallel_search`. Not a Stellar-corpus lookup.

## Edge / traps

Traps: citing ~100B (pre-burn) as the current max; asserting a stale precise circulating number with
no date. The graded behavior rewards a dated, caveated answer.
