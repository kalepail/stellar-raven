---
id: q-defi-rwa-overview
q: "What real-world-asset (RWA) products are live on Stellar?"
category: defi-ecosystem
subcategory: rwa
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [scout_research, lumenloop_find_content_by_entity, perplexity_search, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Names the live institutional RWAs on Stellar: Franklin Templeton's BENJI (FOBXX money-market fund), WisdomTree's CRDT (private credit), and Ondo's USDY (Treasuries-backed yieldcoin).", weight: 5 }
  - { claim: "Characterizes Stellar RWA as Treasuries + private credit (institutionally validated), each with a source.", weight: 4 }
should_have:
  - { claim: "Notes BENJI has been on Stellar since 2021 (FOBXX = first US-registered mutual fund using a public blockchain as system of record).", weight: 3 }
  - { claim: "Flags these figures/launches are time-sensitive and the RWA set keeps expanding.", weight: 2 }
nice_to_have:
  - { claim: "Notes equity/real-estate/commodity tokenization is not yet live at scale on Stellar (whitespace).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim live tokenized equities, real estate, or commodities on Stellar at scale — those are whitespace.", weight: 5 }
  - { claim: "Do NOT invent an RWA issuer/product not in the source data or misattribute a product to the wrong issuer.", weight: 4 }
must_cite:
  - "Each named RWA product carries a dated source (Lumenloop/news/issuer)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund
  - https://ir.wisdomtree.com/news-events/press-releases/detail/755/wisdomtree-brings-private-credit-onchain-with-the-launch-of
  - https://stellar.org/press/ondo-finance-launches-usdy-on-stellar
  - https://lumenloop.com/research/stellar-weekly-roundup-week-29-2026
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "RWA is the deepest category and is FRESHNESS-sensitive (set keeps expanding). Live grounding (Scout research, May/Jun 2026): Stellar's tokenized-RWA stack crossed ~$2.8B (Messari State of Stellar Q1 2026, 4th among ecosystems); newer additions include WisdomTree WTGXX MMF ($1 min, 24/7 subscriptions), tZERO's USDM1 (Marshall Islands sovereign bond, 1:1 US Treasuries), and RedStone's SEP-40 oracle-consumer interface. Core institutional anchors: Franklin BENJI/FOBXX (since 2021), WisdomTree CRDT (private credit, Sep 2025), Ondo USDY (Treasuries yieldcoin, Sep 2025). Equities/real-estate still whitespace. Gate on 'cite dated sources + flag staleness,' not a frozen total. REVIEWED 2026-06-29: re-verified via Scout /api/research — lumenloop roundup (week of May 29 2026) confirms the $2.8B Messari Q1 2026 figure + WTGXX MMF + tZERO USDM1 + RedStone SEP-40; developers.stellar.org ecosystem snapshot independently confirms Franklin Templeton treasury fund + Ondo as live institutional issuers (and adds Spiko $1B, Archax $GOVY, Centrifuge). All four sources: URLs return 200. Treasuries+private-credit pattern and equities/real-estate-whitespace claim hold; totals remain point-in-time."
---

## Reference answer (gospel)

Stellar hosts the deepest, most institutionally-validated **RWA** stack of any non-EVM L1. Core live
products (each institution-issued, dated source):
- **Franklin Templeton BENJI / FOBXX** — tokenized US-government money-market fund, on Stellar since
  **2021**; first US-registered mutual fund to use a public blockchain as its system of record
  [stellar.org BENJI 5-year press].
- **WisdomTree CRDT** — Private Credit & Alternative Income Digital Fund, launched on Stellar (+Ethereum)
  **Sep 2025**; **private credit**, not Treasuries [ir.wisdomtree.com]. (Also newer: WisdomTree **WTGXX**
  tokenized MMF on Stellar, $1 min, 24/7 subscriptions.)
- **Ondo USDY** — Treasuries-backed **yieldcoin**, launched on Stellar **Sep 17 2025**, non-US persons
  [stellar.org Ondo press].

Pattern: **Treasuries + private credit**, institutionally validated. **Freshness flag:** the set keeps
expanding — by mid-2026 the tokenized-RWA stack crossed **~$2.8B** (Messari Q1 2026), with additions
like **tZERO USDM1** (Marshall Islands sovereign bond, 1:1 US Treasuries) and **RedStone's SEP-40**
oracle-consumer standard [lumenloop research, week of May 29 2026]. Tokenized **equities, real estate,
commodities** are **not yet live at scale** (whitespace). Cite dated sources and flag staleness rather
than asserting a frozen total.

## Why these cards (routing rationale)

"What RWAs are live" topic coverage → `lumenloop_search_content_semantic`; Scout research / general-web acceptable for current launches.

## Edge / traps

Don't claim live equity/real-estate RWA at scale; don't misattribute issuer↔product (CRDT=WisdomTree
private credit; USDY=Ondo Treasuries; BENJI=Franklin MMF). Treat totals as point-in-time.
