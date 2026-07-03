---
id: q-token-2019-supply-burn
q: "What happened in the 2019 Stellar lumen supply burn — how much XLM was burned and when?"
category: history-org-tokenomics
subcategory: tokenomics
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "In November 2019 the SDF burned roughly half of the total XLM supply, cutting total supply from ~100 billion to ~50 billion.", weight: 5 }
  - { claim: "The burn occurred in early November 2019 (the burn transaction was on/around November 4, 2019).", weight: 3 }
should_have:
  - { claim: "The exact amount burned was approximately 55 billion XLM (~55,442,095,285 XLM).", weight: 3 }
  - { claim: "The burned XLM was worth roughly $4 billion (~$4.4B) at the time.", weight: 2 }
nice_to_have:
  - { claim: "The burn reduced SDF's share of total supply (roughly from ~85% down toward ~60%).", weight: 1 }
must_avoid:
  - { claim: "Do NOT state the burn was a small fraction (e.g. 5% or 10%) — it was roughly half of total supply.", weight: 5 }
  - { claim: "Do NOT give the wrong year (e.g. 2018, 2020, 2021) — the burn was in 2019.", weight: 4 }
  - { claim: "Do NOT confuse the supply burn with the (separate) end of the 1% inflation mechanism.", weight: 2 }
must_cite:
  - "A reputable dated source on the 2019 lumen burn (news coverage or SDF announcement)."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/learn/lumens
  - https://beincrypto.com/stellar-development-foundation-burns-55-billion-xlm-coins-reveals-new-strategy/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified 2026-06-22: SDF burned ~55B XLM (5B operating + 50B giveaway/partnership) in early Nov 2019 (announced Nov 5), cutting total ~100B→~50B. stellar.org/learn/lumens confirms 'in November 2019 the overall lumen supply was reduced ... now about 50 billion.' The exact 55,442,095,285.7418 figure is in the dossier (third-party) but the rounded ~55B is the durable claim. The SDF-share-drop framing varies by source (dossier: 85%→60%; BeInCrypto: to ~half of supply) — kept as nice_to_have. ~$4.4B-$4.7B at the time."
---

## Reference answer (gospel)

- In **early November 2019** (announced Nov 5) the **Stellar Development Foundation burned ~55 billion XLM** — about **half** of the total supply — cutting total supply from **~100B to ~50B** [1][2].
- The burn combined ~5B from the operating fund plus ~50B previously earmarked for the giveaway and partnership programs [2].
- stellar.org confirms: "in November 2019, the overall lumen supply was reduced ... Now there are about 50 billion lumens, total" [1].
- The burned XLM was worth roughly **~$4–4.7 billion** at the time [2].
- This was a **one-time supply reduction**, distinct from the separate **end of the 1% inflation** mechanism (also 2019) [1].
- (Exact figure cited in coverage: 55,442,095,285.7418 XLM.)

- [1] stellar.org/learn/lumens
- [2] beincrypto.com/stellar-development-foundation-burns-55-billion-xlm-coins-reveals-new-strategy/

## Why these cards (routing rationale)

The precise burn figures live in third-party coverage in the dossier → general-web `perplexity_search`
/ `parallel_search`; `scout_research` acceptable if SDF history surfaces.

## Edge / traps

Traps: wrong magnitude (it was ~half of supply), wrong year (2019), or conflating the burn with the
separate end of inflation.
