---
id: q-rwa-benji-structure
q: "What is Franklin Templeton's BENJI on Stellar, and how is it structured legally as a tokenized fund?"
category: compliance-rwa-payments
subcategory: rwa-legal-structuring
axes: [edge-governance, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research, lumenloop_find_content_about_project]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "BENJI is the on-chain token representing shares of Franklin Templeton's Franklin OnChain US Government Money Fund (ticker FOBXX), a US-registered 1940 Act money-market fund.", weight: 5 }
  - { claim: "The token is a recordkeeping/share representation; the substantive securities obligations (NAV, redemption, shareholder rights) come from the regulated 1940 Act fund structure, with Franklin Templeton's transfer agent retaining control.", weight: 4 }
should_have:
  - { claim: "The fund invests overwhelmingly in US government securities / cash / repos collateralized by US government assets.", weight: 2 }
  - { claim: "BENJI is multi-chain but has run on Stellar since ~2021 (multi-year track record).", weight: 2 }
nice_to_have:
  - { claim: "Notes the token is a native Stellar asset (not a Soroban smart contract).", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe BENJI as an unregulated crypto token or as a stablecoin (it is a tokenized registered money-market fund).", weight: 4 }
  - { claim: "Do NOT invent the fund's regulatory structure (e.g. call it an ETF or claim a structure not in the record) — flag uncertainty if unsure.", weight: 3 }
must_cite:
  - "A dated Franklin Templeton / SDF / reputable source on BENJI and FOBXX."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://www.franklintempleton.com/press-releases/news-room/2026/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u.s.-registered-tokenized-money-market-fund
  - https://stellar.org/case-studies/franklin-templeton
  - https://www.franklintempleton.com/investments/options/money-market-funds/products/29386/SINGLCLASS/franklin-on-chain-u-s-government-money-fund/FOBXX
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "VERIFIED: BENJI = on-chain share token of the Franklin OnChain US Government Money Fund (FOBXX), a US-registered 1940 Act money-market fund (CUSIP 35473R104; inception April 6, 2021 on Stellar, BENJI's first chain). >=99.5% US gov securities/cash/repos; targets $1.00 NAV (Rule 2a-7). Transfer agent maintains the official record via the Benji platform; allowlist (KYC-gated) + clawback enforced via Stellar's native asset model. ~$650M Stellar AUM / ~$2B across 8 chains (April 2026); 5-year milestone April 30, 2026. Confidence raised draft->high. Trap: calling BENJI a stablecoin/ETF or unregulated token."
---

## Reference answer (gospel)

- **BENJI is the on-chain share token of Franklin Templeton's Franklin OnChain US Government Money Fund
  (ticker FOBXX)** — a **US-registered 1940 Act money-market fund** (CUSIP 35473R104), launched on Stellar
  in **April 2021** (Stellar was its first chain) [1][2].
- The token is a **recordkeeping/share representation** (1 BENJI = 1 fund share): the substantive
  securities obligations — **NAV ($1.00 target), redemption, shareholder rights** — come from the
  regulated fund, and **Franklin Templeton's transfer agent maintains the official record** via the Benji
  platform; KYC-gated **allowlist + clawback** are enforced through Stellar's native asset model [2].
- The fund holds **≥99.5% in US government securities, cash, and government-collateralized repos** [3].
- BENJI is **multi-chain** (8 chains by 2026) with a **5-year Stellar track record** (~$650M Stellar AUM /
  ~$2B across chains as of April 2026) [1].
- It is **not** a stablecoin and **not** an unregulated crypto token (it's a tokenized registered MMF);
  don't call it an ETF.

Sources: [1] Franklin Templeton "Five Years of BENJI"; [2] stellar.org Franklin Templeton case study; [3] FOBXX fund page.

## Why these cards (routing rationale)

Real-world fund/legal structuring is general-web context → `perplexity_search`/`parallel_search`; Stellar-side coverage via `scout_research`/`lumenloop_find_content_about_project` acceptable.

## Edge / traps

Trap: mislabeling BENJI as a stablecoin/ETF or inventing its legal structure.
