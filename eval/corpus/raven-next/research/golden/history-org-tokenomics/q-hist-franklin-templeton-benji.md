---
id: q-hist-franklin-templeton-benji
q: "What is Franklin Templeton's BENJI / on-chain money fund on Stellar?"
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Franklin Templeton runs an on-chain U.S. government money market fund on Stellar, tokenized as the BENJI token.", weight: 5 }
  - { claim: "It was one of the first U.S.-registered funds to use a public blockchain (Stellar) as its system of record.", weight: 3 }
should_have:
  - { claim: "It is a major tokenized real-world asset (RWA) on Stellar (hundreds of millions in value).", weight: 2 }
  - { claim: "The fund launched on Stellar around 2021.", weight: 2 }
nice_to_have:
  - { claim: "The underlying fund is the Franklin OnChain U.S. Government Money Fund (FOBXX).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim BENJI / the Franklin fund is on Ripple or a non-Stellar chain (Stellar is its system of record).", weight: 4 }
  - { claim: "Do NOT describe BENJI as a memecoin or as Stellar's native token — it represents shares of a regulated money fund.", weight: 3 }
must_cite:
  - "stellar.org case study or Franklin Templeton materials on the on-chain fund / BENJI."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/case-studies/franklin-templeton
  - https://www.franklintempleton.com/investments/options/money-market-funds/products/29386/SINGLCLASS/franklin-on-chain-u-s-government-money-fund/FOBXX
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "FOBXX/BENJI launched on Stellar 2021; 'first US-registered mutual fund to use a public blockchain as its official system of record' (stellar.org case study + Franklin Templeton). $580M+ / 'second-largest RWA on Stellar' figure (Apr 30 2026 anniversary) is fresher vendor-press. Verified 2026-06-22."
---

## Reference answer (gospel)

- Franklin Templeton runs an **on-chain U.S. government money market fund** on **Stellar**, tokenized as the **BENJI** token [1].
- The underlying fund is the **Franklin OnChain U.S. Government Money Fund (FOBXX)** [2].
- It was **one of the first U.S.-registered mutual funds to use a public blockchain (Stellar) as its official system of record**, launched on Stellar around **2021** [1].
- It is a **major tokenized real-world asset (RWA) on Stellar** — hundreds of millions in value (reported **$580M+** in tokenized U.S. Treasuries at the April 2026 five-year anniversary) [1].
- Traps to avoid: putting BENJI on **Ripple**/another chain, or calling it a **memecoin** or Stellar's native token — it represents shares of a **regulated money fund** [1].

- [1] stellar.org/case-studies/franklin-templeton
- [2] franklintempleton.com/.../franklin-on-chain-u-s-government-money-fund/FOBXX

## Why these cards (routing rationale)

The BENJI/FOBXX-on-Stellar story is in a stellar.org case study (Stellar-own) → `scout_research`;
perplexity acceptable for the latest AUM figures.

## Edge / traps

Traps: putting BENJI on Ripple; describing it as a memecoin or as XLM. It tokenizes a regulated fund.
