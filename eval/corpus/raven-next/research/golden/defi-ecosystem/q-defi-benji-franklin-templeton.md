---
id: q-defi-benji-franklin-templeton
q: "What is Franklin Templeton's BENJI token on Stellar and what fund does it represent?"
category: defi-ecosystem
subcategory: rwa
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_content_by_entity]
acceptable_cards: [lumenloop_search_content_semantic, lumenloop_get_project, perplexity_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "BENJI is the share token of Franklin Templeton's Franklin OnChain U.S. Government Money Fund (FOBXX) on Stellar.", weight: 5 }
  - { claim: "FOBXX was the first US-registered mutual fund to use a public blockchain (Stellar) as its official system of record; live on Stellar since 2021.", weight: 4 }
should_have:
  - { claim: "The fund holds at least ~99.5% of assets in US government securities; BENJI offers intraday yield and peer-to-peer transferability of shares.", weight: 3 }
nice_to_have:
  - { claim: "Notes Franklin Templeton's Stellar tokenization milestones (2024 Luxembourg UCITS; 2025 Singapore retail fund; 5-year BENJI milestone in 2026).", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe BENJI as an algorithmic stablecoin or as a yieldcoin like USDY — it is a tokenized US government money-market mutual fund share.", weight: 5 }
  - { claim: "Do NOT misattribute BENJI to WisdomTree or Ondo, or invent a different fund name.", weight: 4 }
must_cite:
  - "A source on BENJI / FOBXX (Franklin Templeton, Stellar, or Lumenloop record)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund
  - https://www.franklintempleton.com/investments/options/money-market-funds/products/29386/SINGLCLASS/franklin-on-chain-u-s-government-money-fund/FOBXX
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "VERIFIED against the dossier's primary sources (stellar.org BENJI 5-year press release + Franklin Templeton FOBXX product page). BENJI = share token of Franklin OnChain U.S. Government Money Fund (FOBXX); first US-registered mutual fund using a public blockchain (Stellar) as official system of record, live since 2021; intraday yield + P2P transferability; ≥99.5% assets in US gov securities. Entity-grounded content → find_content_by_entity. Issuer↔product trap (BENJI vs USDY/CRDT, mutual-fund-share vs stablecoin)."
---

## Reference answer (gospel)

**BENJI** is the **share token of Franklin Templeton's Franklin OnChain U.S. Government Money Fund
(FOBXX)** on Stellar [1]. FOBXX was the **first US-registered mutual fund to use a public blockchain
(Stellar) as its official system of record** for recording share ownership and processing
transactions; it has been **live on Stellar since 2021** [1]. The fund holds **at least ~99.5% of
assets in US government securities** (cash and repos fully collateralized by US gov securities) [2], and
BENJI is notable for **intraday yield and peer-to-peer (P2P) transferability of shares** [1]. Franklin
also marked the **5-year BENJI milestone (Apr 30, 2026)** and shipped the first Luxembourg UCITS (2024)
and first Singapore retail tokenized fund (2025) on Stellar [1].

Sources: [1] stellar.org BENJI 5-year press release; [2] Franklin Templeton FOBXX product page.

## Why these cards (routing rationale)

Content about a named entity (works without a directory slug) → `lumenloop_find_content_by_entity`;
get_project / semantic acceptable.

## Edge / traps

Don't describe BENJI as an algorithmic stablecoin or a yieldcoin like USDY — it is a **tokenized US
government money-market mutual-fund share**. Don't misattribute it to WisdomTree (CRDT) or Ondo (USDY).
