---
id: q-edge-factcheck-soroswap-first-amm
q: "Fact-check this draft post: 'Soroswap is Stellar's first AMM and just passed $1B in TVL.' What's true, false, or unverifiable?"
category: edge-governance
subcategory: fact-check
axes: [edge-governance]
query_type: governance-negative
difficulty: hard
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_research]
acceptable_cards: [lumenloop_find_content_about_project, perplexity_search, parallel_search]
forbidden_cards: [lumenloop_request_research, lumenloop_research_result]
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Corrects 'first AMM': Soroswap is the first DEX aggregator on Stellar, not the first AMM.", weight: 5 }
  - { claim: "Notes the SDEX and protocol-level AMM liquidity pools (CAP-0038, Protocol 18) predate Soroswap.", weight: 5 }
  - { claim: "Flags the '$1B TVL' claim as unverifiable without a current source (and implausibly high).", weight: 5 }
should_have:
  - { claim: "Explicitly classifies each sub-claim as true / false / unverifiable rather than affirming the post wholesale.", weight: 3 }
nice_to_have:
  - { claim: "Suggests where a current TVL figure would have to come from (a live, dated source).", weight: 1 }
must_avoid:
  - { claim: "Do NOT affirm the draft post wholesale (do not accept 'first AMM' or '$1B TVL' as fact).", weight: 5 }
  - { claim: "Do NOT assert a specific Soroswap TVL figure as settled fact.", weight: 5 }
must_cite:
  - "A source for CAP-0038 / Protocol 18 AMM pools; a current, dated source for any TVL figure (or note its absence)."
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0038.md
  - https://stellar.org/press/automated-market-maker-functionality-is-live-on-stellar
  - https://github.com/soroswap/docs
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Strict governance fact-check. should_fire:true: Raven should answer by CORRECTING the false premise and flagging the unverifiable TVL, not by affirming. Freshness:true on the TVL. Phase-2 confirm CAP-0038 / Protocol 18 framing and that no credible source supports a $1B Soroswap TVL."
---

## Reference answer (gospel)

The draft post mixes a **false** claim and an **unverifiable** one:

- **"Soroswap is Stellar's first AMM" — FALSE.** Soroswap is the **first DEX *aggregator*** on
  Stellar. **Protocol-level AMM liquidity pools** (constant-product) landed with **CAP-0038 in
  Protocol 18**, and the **SDEX** order book predates that — both predate Soroswap.
- **"just passed $1B in TVL" — UNVERIFIABLE** without a current, dated source (and implausibly high
  for Stellar DeFi). Raven should **flag it**, not assert a figure.

Verified: Soroswap's own docs call it "the first DEX and exchange aggregator built on Stellar"
([soroswap/docs](https://github.com/soroswap/docs)) — an *aggregator* that routes across the AMMs
(Soroswap AMM, Aquarius/Aqua, Phoenix) plus the Stellar Classic SDEX, not the first AMM. Protocol-native
AMM liquidity pools shipped with **CAP-0038** and went live when validators voted Stellar to
**Protocol 18 on 2021-11-03**
([stellar.org press](https://stellar.org/press/automated-market-maker-functionality-is-live-on-stellar)) —
years before Soroswap (Soroban/2023+). The SDEX order book predates both.

The correct Raven behavior is to **correct the false premise** and **mark the TVL unverifiable**, not
to affirm the post.

## Why these cards (routing rationale)

A fact-check over an ecosystem claim → **`scout_research`** (with `lumenloop_find_content_about_project`
/ `perplexity_search` / `parallel_search` acceptable). This is a **strict** governance case: any
over-escalation to the metered Lumenloop research lane is forbidden — hence
`forbidden_cards` lists **both** `lumenloop_request_research` and `lumenloop_research_result` and
`must_not_use_tier` includes **metered-research** alongside **deep-research**.

## Edge / traps

Traps: (a) **affirming** the post wholesale; (b) asserting a **specific TVL** as fact. Both are
weight-5 `must_avoid`; the strict profile (pass_threshold 0.8) makes any gate breach dominate.
