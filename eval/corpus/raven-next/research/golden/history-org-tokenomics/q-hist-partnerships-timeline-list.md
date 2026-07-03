---
id: q-hist-partnerships-timeline-list
q: "List the major enterprise and institutional partnerships Stellar has had over the years."
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, edge-governance]
query_type: list
difficulty: hard
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Includes IBM (World Wire) and MoneyGram as major Stellar partnerships.", weight: 4 }
  - { claim: "Includes at least one tokenized-RWA / asset-management partner (Franklin Templeton and/or WisdomTree).", weight: 4 }
  - { claim: "Includes at least one payments/card or stablecoin-issuer partner (Circle, Mastercard, Visa, or Paxos).", weight: 4 }
should_have:
  - { claim: "Gives rough timeframes (e.g. IBM ~2017-2019, MoneyGram ~2021-2023, Mastercard/Paxos ~2024, Visa ~2025).", weight: 2 }
  - { claim: "Flags that the list is non-exhaustive and partnership status evolves.", weight: 2 }
nice_to_have:
  - { claim: "Mentions newer entrants (e.g. Circle CCTP on Stellar, DTCC tokenization, Wirex).", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute Ripple/XRP partnerships (e.g. Santander's On Demand Liquidity) to Stellar.", weight: 4 }
  - { claim: "Do NOT fabricate a major partnership that did not happen (e.g. invent a Stellar x major-bank deal with no source).", weight: 4 }
must_cite:
  - "Reputable dated sources for the named partnerships (stellar.org and partner/news coverage)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/foundation-news/2025-year-in-review
  - https://stellar.org/case-studies
  - https://stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar
  - https://stellar.org/case-studies/dtcc
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "List/multi-source synthesis + freshness. Tests breadth without hallucinated partnerships. All named partners verified real (stellar.org + partner press): IBM, MoneyGram, Franklin Templeton, WisdomTree, Mastercard, Visa, Paxos, Circle/CCTP, DTCC, plus SatoshiPay/Tala/Velo. The Ripple-attribution (e.g. Santander ODL is Ripple, not Stellar) and fabrication traps both matter. Verified 2026-06-29 with dated primary sources: Visa added more chains/stablecoins to its settlement pilot July 2025; Wirex went live with dual-stablecoin (USDC+EURC) Visa settlement on Stellar Nov 18, 2025 (stellar.org/press); Circle CCTP live on Stellar May 19, 2026 (dedicated SDF blog, added as source [3]); DTCC tokenization of DTC-custodied assets announced May 27, 2026, targeting 1H 2027 (stellar.org/case-studies/dtcc, added as source [4])."
---

## Reference answer (gospel)

A non-exhaustive, dated list of major Stellar partnerships (status evolves — confirm against current sources):

- **IBM World Wire** — cross-border payments on Stellar (~2017 pilot → 2019 limited production; later wound down) [2].
- **MoneyGram** — cash on/off ramps (USDC) + SDF minority equity investment (~2021–2023) [2].
- **Franklin Templeton (BENJI / FOBXX)** — tokenized U.S. gov money fund on Stellar (since 2021) [2].
- **WisdomTree** — tokenized digital funds + gold token on Stellar (~2024) [2].
- **Mastercard** — Crypto Credential integration (Oct 2024) [2].
- **Paxos** — brings USDG / PYUSD to Stellar (Oct 2024) [2].
- **Visa** — added Stellar to its stablecoin-settlement platform (July 2025); **Wirex** went live Nov 2025 [1].
- **Circle** — USDC/EURC native on Stellar; **CCTP** live on Stellar (May 2026) [3].
- **DTCC** — tokenization of DTC-custodied assets on Stellar announced May 2026 (targeted 1H 2027) [4].

Traps to avoid: attributing **Ripple/XRP** partnerships (e.g. Santander's On Demand Liquidity) to Stellar; or fabricating a major deal that didn't happen [1][2].

- [1] stellar.org/blog/foundation-news/2025-year-in-review
- [2] stellar.org/case-studies
- [3] stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar
- [4] stellar.org/case-studies/dtcc

## Why these cards (routing rationale)

A breadth list spanning many partners and dates → `perplexity_search` (fan-out), with `scout_research`
acceptable for Stellar-published case studies.

## Edge / traps

Traps: pulling in Ripple/XRP partnerships; fabricating a major deal. Reward a non-exhaustive, dated,
sourced list.
