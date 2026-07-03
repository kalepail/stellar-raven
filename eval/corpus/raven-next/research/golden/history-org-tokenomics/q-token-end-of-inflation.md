---
id: q-token-end-of-inflation
q: "Did Stellar ever have an inflation mechanism, and is it still active?"
category: history-org-tokenomics
subcategory: tokenomics
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Stellar originally had a built-in inflation mechanism that increased the XLM supply by about 1% per year.", weight: 5 }
  - { claim: "The inflation mechanism was disabled/ended in 2019 (via a validator/protocol vote).", weight: 5 }
should_have:
  - { claim: "Inflation ended in late October 2019 (around October 28, 2019).", weight: 2 }
  - { claim: "Since then XLM has had a fixed supply (0% inflation) — no new lumens are minted by inflation.", weight: 3 }
nice_to_have:
  - { claim: "The inflation mechanism was separate from the November 2019 supply burn.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar still has an active 1% inflation mechanism — it was disabled in 2019.", weight: 5 }
  - { claim: "Do NOT state the inflation rate was something other than ~1% per year (e.g. 5% or 10%).", weight: 3 }
  - { claim: "Do NOT conflate ending inflation with the supply burn (two distinct events, both 2019).", weight: 2 }
must_cite:
  - "A reputable dated source on the end of Stellar inflation (the 2019 vote / SDF docs)."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/learn/lumens
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "stellar.org/learn/lumens (Stellar-own) confirms: '~1% annually, by design ... That inflation mechanism was ended by community vote in October 2019.' Exact ~Oct 28 2019 date is third-party. Distinct from the Nov 2019 burn (trap pair with q-token-2019-supply-burn). Verified 2026-06-22."
---

## Reference answer (gospel)

- Yes — Stellar **originally had a built-in inflation mechanism** that increased the XLM supply by **~1% per year** [1].
- That mechanism was **ended by community vote in October 2019** (~Oct 28, 2019) [1].
- Since then XLM has had a **fixed supply (0% inflation)** — no new lumens are minted by inflation [1].
- This is **separate** from the November 2019 supply burn (a one-time ~100B→~50B reduction); both happened in 2019 but are different events [1].

- [1] stellar.org/learn/lumens

## Why these cards (routing rationale)

The exact inflation-end date is third-party-sourced → `perplexity_search`; `scout_research` acceptable
for the original 1% mechanism (stellar.org/learn/lumens).

## Edge / traps

Traps: claiming inflation is still active, wrong rate, or conflating with the burn.
