---
id: q-token-burn-vs-inflation-compare
q: "How did XLM's tokenomics change in 2019 — what was the difference between the supply burn and ending inflation?"
category: history-org-tokenomics
subcategory: tokenomics
axes: [ecosystem-spectrum, edge-governance]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Both major 2019 tokenomics changes happened in 2019: the supply burn and the end of inflation.", weight: 4 }
  - { claim: "The supply burn was a one-time reduction of total supply from ~100B to ~50B XLM (November 2019).", weight: 5 }
  - { claim: "Ending inflation removed the ongoing ~1% annual new-issuance mechanism, fixing the supply going forward.", weight: 5 }
should_have:
  - { claim: "These were two distinct events, not the same action.", weight: 2 }
  - { claim: "Net effect: a smaller (~50B) and now fixed (0% inflation) XLM supply.", weight: 2 }
nice_to_have:
  - { claim: "The burn occurred around November 4, 2019 and inflation ended around late October 2019.", weight: 1 }
must_avoid:
  - { claim: "Do NOT treat the burn and the end of inflation as the same single event.", weight: 4 }
  - { claim: "Do NOT claim the burn changed the per-year inflation rate, or that ending inflation reduced existing supply — they are different mechanisms.", weight: 3 }
must_cite:
  - "Reputable dated sources covering the 2019 burn and the end of inflation."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/learn/lumens
  - https://beincrypto.com/stellar-development-foundation-burns-55-billion-xlm-coins-reveals-new-strategy/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Hard comparison. Both 2019, but distinct: (1) inflation-end (community/validator vote, ~Oct 2019) removed the recurring ~1% annual issuance; (2) supply burn (~Nov 2019) was a one-time ~100B→~50B cut. stellar.org/learn/lumens states both. Verified 2026-06-22."
---

## Reference answer (gospel)

Two **distinct** 2019 events — not the same action [1]:

1. **End of inflation** (community/validator vote, ~October 2019): removed the built-in **~1% annual new-issuance** mechanism. This **stopped new lumens from being minted** going forward; it did not destroy existing supply [1].
2. **Supply burn** (~November 2019): a **one-time** reduction of **total supply from ~100B to ~50B XLM** (~55B burned) [1][2]. This destroyed existing lumens; it was not a change to an issuance rate.

- **Net effect:** a **smaller (~50B)** and now **fixed (0% inflation)** XLM supply [1].
- Trap to avoid: collapsing the two into one, or claiming the burn changed the inflation rate / that ending inflation reduced existing supply — different mechanisms [1].

- [1] stellar.org/learn/lumens
- [2] beincrypto.com/stellar-development-foundation-burns-55-billion-xlm-coins-reveals-new-strategy/

## Why these cards (routing rationale)

Multi-event 2019 tokenomics history with third-party-sourced specifics → `perplexity_search` /
`parallel_search`; `scout_research` acceptable for the inflation mechanism doc.

## Edge / traps

The defining trap is collapsing the two events into one. They are distinct: a one-time burn vs.
disabling the recurring inflation.
