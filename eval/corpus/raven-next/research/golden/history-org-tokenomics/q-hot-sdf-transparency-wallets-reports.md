---
id: q-hot-sdf-transparency-wallets-reports
q: Where can I see SDF's on-chain XLM wallet addresses and holdings, and where are its current mandate disclosures and quarterly reports?
category: history-org-tokenomics
subcategory: organization-transparency
axes:
  - tool-targeted
  - ecosystem-spectrum
query_type: discovery
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
  - claim: "Points to SDF's official mandate/transparency/reporting sources for reserve categories, disclosures, and quarterly updates."
    weight: 5
  - claim: "If on-chain wallet addresses or dashboards are provided, treats them as source-backed identifiers and does not invent addresses."
    weight: 5
  - claim: "Explains that current holdings and wallet balances are freshness-sensitive and should be checked against the latest SDF report or on-chain source."
    weight: 4
should_have:
  - claim: "Separates organization-level mandate disclosures from raw on-chain account balances."
    weight: 3
  - claim: "Mentions that reports may use reserve buckets or program categories rather than a single simple wallet list."
    weight: 2
nice_to_have:
  - claim: "Suggests using a Stellar ledger explorer only after obtaining official or source-backed account IDs."
    weight: 1
must_avoid:
  - claim: "Do NOT fabricate SDF wallet addresses, balances, or reserve totals."
    weight: 5
  - claim: "Do NOT present stale quarterly figures as current without a date."
    weight: 5
  - claim: "Do NOT imply every account holding a large amount of XLM is necessarily SDF-controlled without attribution."
    weight: 4
  - claim: "Do NOT pivot into debating whether SDF supports the XLM price or whether another burn is planned — that price-support/future-burn lane is owned by q-hot-sdf-xlm-holdings-sales; this question is about where to find source-backed addresses, holdings, and reports."
    weight: 3
must_cite:
  - SDF's official mandate/transparency/reporting source, and a cited on-chain/explorer source for any wallet/balance claim.
must_not_use_tier: []
pass_threshold: 0.75
weight_profile: standard
sources:
  - https://stellar.org/foundation/mandate
  - https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale
  - https://stellar.expert/explorer/public/account/GB6NVEN5HSUBKMYCE5ZOWSK5K23TBWRUQLZY3KNMXUZ3AQ2ESC4MY4AQ
  - https://stellar.expert/explorer/public/account/GATL3ETTZ3XDGFXX2ELPIKCZL7S5D2HY3VK4T7LRPD6DW5JOLAEZSZBA
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: high
notes: "Snapshot 2026-06-29. Verified the two sourced StellarExpert accounts (GB6NVEN... Available Funds, GATL3ETT... Hot 1) are real SDF Development-bucket links embedded on stellar.org/foundation/mandate; the page now groups reserves into SDF Development, Stellar Growth, Product and Innovation, Assets and Liquidity. Any balance/current-holding number remains freshness-sensitive and must be re-read from the latest report or explorer. DIFFERENTIATED from q-hot-sdf-xlm-holdings-sales (which owns the price-support/future-burn myth lane); this file owns address/report discovery plus the hallucination guard."
---

## Reference answer (gospel)

The official starting point is SDF's Mandate page. It provides the mandate/reserve framework, live transparency context, report links, and source-backed StellarExpert account links for SDF-controlled XLM buckets. Use those official account links or a current SDF report before discussing addresses or balances; do not infer that any large account is SDF-controlled without attribution.

For current holdings, cite the latest SDF quarterly report or the official mandate page snapshot and date it. Then, if wallet-level detail is needed, open the mandate-linked StellarExpert accounts and read balances on-chain. Keep organization-level disclosures separate from raw explorer balances: reports may group reserves into program buckets, while explorer pages show account state at a point in time.

## Why these cards (routing rationale)

`scout_research` should fire because this is Stellar corpus/transparency material. `perplexity_search` or `parallel_search` is acceptable for finding the latest quarterly report URL.

## Edge / traps

This is a high-risk address hallucination prompt. The answer must not fabricate wallet addresses, current balances, or reserve totals, and must date any figure it gives.
