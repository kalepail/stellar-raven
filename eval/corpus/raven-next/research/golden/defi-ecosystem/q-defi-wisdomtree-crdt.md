---
id: q-defi-wisdomtree-crdt
q: "What did WisdomTree launch on Stellar in 2025 and what is the CRDT token?"
category: defi-ecosystem
subcategory: rwa
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_content_by_entity]
acceptable_cards: [lumenloop_search_content_semantic, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "WisdomTree launched the WisdomTree Private Credit and Alternative Income Digital Fund (token CRDT) on Stellar (and Ethereum) in September 2025.", weight: 5 }
  - { claim: "CRDT is a tokenized private-credit / alternative-income product (not Treasuries and not a money-market fund).", weight: 4 }
should_have:
  - { claim: "Notes accessibility via WisdomTree Connect / WisdomTree Prime with a low minimum investment (around $25).", weight: 2 }
nice_to_have:
  - { claim: "Notes it tracks a private-credit index (Gapstow / GLACI) and offers T+0 subscription settlement.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe CRDT as a Treasuries fund or money-market fund — it is private credit / alternative income.", weight: 5 }
  - { claim: "Do NOT misattribute CRDT to Franklin Templeton or Ondo.", weight: 4 }
must_cite:
  - "A dated source on WisdomTree CRDT's Stellar launch (Sep 2025)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://ir.wisdomtree.com/news-events/press-releases/detail/755/wisdomtree-brings-private-credit-onchain-with-the-launch-of
  - https://stellar.org/case-studies/wisdomtree
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Entity-grounded → find_content_by_entity. CRDT = private credit, NOT Treasuries (precision trap). Verified against WisdomTree IR press release (Sep 12 2025) + Stellar case study. CRDT tracks the Gapstow GLACI index; ~$25 min; T+0 subscription / T+2 redemption; Stellar + Ethereum."
---

## Reference answer (gospel)

In **September 2025** WisdomTree launched the **WisdomTree Private Credit and Alternative Income Digital
Fund (token: CRDT)** on **Stellar (and Ethereum)** [ir.wisdomtree.com press release, Sep 12 2025].
**CRDT is a tokenized private-credit / alternative-income product** — **not Treasuries and not a
money-market fund** — tracking the **Gapstow Private Credit & Alternative Income Index (GLACI)**.
It is accessible via **WisdomTree Connect / WisdomTree Prime** with a low **~$25 minimum**, **T+0
subscription** and **T+2 redemption** settlement [Stellar WisdomTree case study]. Do not describe CRDT
as Treasuries/MMF, and do not misattribute it to Franklin Templeton (BENJI) or Ondo (USDY).

## Why these cards (routing rationale)

Content about a named entity → `lumenloop_find_content_by_entity`; semantic/general-web acceptable for the dated launch.

## Edge / traps

CRDT is private credit, not Treasuries; don't misattribute to FT/Ondo.
