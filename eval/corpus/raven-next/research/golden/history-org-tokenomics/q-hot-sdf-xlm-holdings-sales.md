---
id: q-hot-sdf-xlm-holdings-sales
q: How does SDF manage and sell its XLM holdings, does it aim to support the XLM price, and is another supply burn like 2019 planned?
category: history-org-tokenomics
subcategory: tokenomics-sdf-reserves
axes:
  - ecosystem-spectrum
  - edge-governance
query_type: comparison
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly
expected_cards:
  - scout_research
acceptable_cards:
  - perplexity_search
  - parallel_search
forbidden_cards: []
expected_service: stellar_light
should_fire: true
must_have:
  - claim: "Explains that SDF holds and deploys XLM reserves under its mandate to support ecosystem development, not as a promise to manage or guarantee XLM's market price."
    weight: 5
  - claim: "Distinguishes SDF reserve management/sales from protocol-level monetary policy; SDF sales do not create new XLM."
    weight: 4
  - claim: "Treats any claim about future burns as speculative unless SDF has made a current, dated announcement."
    weight: 5
should_have:
  - claim: "References SDF mandate, transparency, or quarterly reporting as the proper source for current reserve/use disclosures."
    weight: 3
  - claim: "Contrasts the 2019 supply burn as a one-time historical event rather than a recurring tokenomics mechanism."
    weight: 3
nice_to_have:
  - claim: "Mentions that market price depends on broad market/liquidity conditions outside SDF's control."
    weight: 1
must_avoid:
  - claim: "Do NOT claim SDF explicitly supports, pegs, or guarantees the XLM price."
    weight: 5
  - claim: "Do NOT predict or promise another XLM burn without a dated primary source."
    weight: 5
  - claim: "Do NOT conflate SDF-held reserves with circulating supply or protocol inflation."
    weight: 4
  - claim: "Do NOT enumerate or invent specific SDF wallet addresses to answer this — discovery of source-backed account IDs and reports is owned by q-hot-sdf-transparency-wallets-reports; here the focus is the price-support and future-burn myths."
    weight: 3
must_cite:
  - A current SDF mandate/transparency/reporting source, plus a dated source for any stated future-burn claim.
must_not_use_tier: []
pass_threshold: 0.75
weight_profile: standard
sources:
  - https://stellar.org/foundation/mandate
  - https://stellar.org/blog/foundation-news/an-updated-mandate-for-a-growing-stellar-ecosystem
  - https://stellar.org/blog/foundation-news/sdfs-next-steps
  - https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: medium
notes: "Snapshot 2026-06-29. No current primary source found announcing another burn (the November 2019 burn remains a one-time historical event). Reserve/sales details are report-sensitive; verify the latest SDF report if exact figures are needed. DIFFERENTIATED from q-hot-sdf-transparency-wallets-reports (which owns address/report discovery); this file owns the price-support-myth plus future-burn-myth debunk."
---

## Reference answer (gospel)

SDF manages XLM reserves under its published mandate: using entrusted XLM to build, promote, and strengthen the Stellar network and ecosystem. That is not a promise to peg, support, or guarantee XLM's market price. SDF reserve deployment or sales are organization-level treasury/mandate activity; they do not mint new XLM and are distinct from protocol monetary policy.

The November 2019 burn was a historical one-time supply action described by SDF in its next-steps/mandate materials. A correct answer should not predict another burn or present one as planned unless there is a dated primary SDF announcement. Market price depends on broader liquidity and market conditions outside SDF's control; Raven should point users to the current mandate/transparency pages and latest quarterly report for reserve-use disclosures.

## Why these cards (routing rationale)

`scout_research` should fire because SDF mandate/reserve facts are Stellar corpus facts. General web search is acceptable for current dated reports or public statements.

## Edge / traps

Do not turn this into investment advice. Do not claim SDF supports the XLM price, promise a burn, or confuse SDF-held reserves with circulating supply or protocol inflation.
