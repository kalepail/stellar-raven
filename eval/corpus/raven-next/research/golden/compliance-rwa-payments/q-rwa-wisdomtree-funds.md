---
id: q-rwa-wisdomtree-funds
q: "What real-world assets has WisdomTree tokenized on Stellar, and how does its regulated-asset model work?"
category: compliance-rwa-payments
subcategory: rwa-legal-structuring
axes: [edge-governance, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research, lumenloop_find_content_about_project]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "WisdomTree tokenized a set of digital funds (plus a physically-backed gold token) on Stellar, distributed through the WisdomTree Prime app.", weight: 5 }
  - { claim: "WisdomTree used Stellar's regulated-assets model (SEP-8 + authorization flags) so the tokens require issuer approval to transact, without a smart contract.", weight: 4 }
should_have:
  - { claim: "Treats counts/state-availability figures (e.g. 13 funds, ~41 US states) as time-sensitive and dated.", weight: 3 }
  - { claim: "Notes WisdomTree Prime / WisdomTree Digital Trust as the regulated operating entity.", weight: 2 }
nice_to_have:
  - { claim: "Notes these are native Stellar assets, contrasted with ERC-20 wrapped tokens.", weight: 1 }
must_avoid:
  - { claim: "Do NOT confuse WisdomTree's tokenized funds with Franklin Templeton's BENJI (different issuer/product).", weight: 4 }
  - { claim: "Do NOT state the exact number of funds / states as a permanent fact without a freshness caveat.", weight: 3 }
must_cite:
  - "A dated WisdomTree / SDF / reputable source."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://stellar.org/case-studies/wisdomtree
  - https://stellar.org/press/stellar-statement-on-wisdomtree-prime-being-available-to-users-in-41-states
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; fund/state counts kept freshness-gated, BENJI-vs-WisdomTree distinction preserved. VERIFIED: WisdomTree tokenized a set of digital funds (incl. a '40 Act money market fund, WTGXX) plus a 1:1 physical gold token on Stellar, distributed via the WisdomTree Prime app, operated by WisdomTree Digital Trust/Digital Funds. Used Stellar's Regulated Assets model (SEP-8 + flags), 'four-step process, no smart contract'. SDF (May 1, 2024) stated WisdomTree Prime available in 41 states / 75% of US population. COUNTS (13 funds / 41 states) are freshness-sensitive — flag and date. Trap: conflating with Franklin Templeton's BENJI; stale counts as permanent."
---

## Reference answer (gospel)

- **WisdomTree tokenized a set of digital funds** (including a '40 Act money-market fund) **plus a 1:1
  physically-backed gold token** on **Stellar**, distributed through the **WisdomTree Prime** app [1].
- It used **Stellar's Regulated Assets model (SEP-8 + authorization flags)** so the tokens **require issuer
  approval to transact, without a smart contract** [1].
- **Counts/availability are time-sensitive**: SDF (May 1, 2024) stated WisdomTree Prime was available in
  **41 US states (~75% of the US population)**; the fund count (~13 + gold) should be **dated and treated
  as evolving** [2].
- The regulated operating entity is **WisdomTree (Prime / Digital Trust)**, not Stellar.
- These are **native Stellar assets** (vs. ERC-20 wrapped tokens). Do **not** conflate WisdomTree with
  Franklin Templeton's **BENJI** (different issuer/product).

Sources: [1] stellar.org WisdomTree case study; [2] stellar.org WisdomTree Prime 41-states statement.

## Why these cards (routing rationale)

Issuer/product facts + counts = general-web → `perplexity_search`/`parallel_search`; `scout_research`/`lumenloop_find_content_about_project` acceptable for the SEP-8 mechanics.

## Edge / traps

Trap: conflating WisdomTree with BENJI; stating counts as permanent.
