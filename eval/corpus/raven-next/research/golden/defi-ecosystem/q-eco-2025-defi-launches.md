---
id: q-eco-2025-defi-launches
q: "What were the notable DeFi and RWA launches on Stellar in 2025?"
category: defi-ecosystem
subcategory: launches
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [scout_research, perplexity_search, parallel_search, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Names key 2025 launches with dates: Ondo USDY on Stellar (Sep 17 2025), PayPal PYUSD on Stellar (Sep 18 2025), and WisdomTree CRDT (Sep 12 2025).", weight: 5 }
should_have:
  - { claim: "Notes the September 2025 cluster (USDY + PYUSD + CRDT around Meridian 2025 in Rio) as an inflection point for Stellar DeFi/RWA growth.", weight: 3 }
  - { claim: "Attributes each launch to a dated source and flags the list is time-bounded.", weight: 2 }
nice_to_have:
  - { claim: "Notes Franklin Templeton's 2025 first retail tokenized fund in Singapore on Stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misattribute a product to the wrong issuer (USDY=Ondo, PYUSD=PayPal, CRDT=WisdomTree) or assign the wrong launch year.", weight: 5 }
  - { claim: "Do NOT invent a launch that is not in the source data.", weight: 4 }
must_cite:
  - "A dated source for each named launch."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/ondo-finance-launches-usdy-on-stellar
  - https://ir.wisdomtree.com/news-events/press-releases/detail/755/wisdomtree-brings-private-credit-onchain-with-the-launch-of
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "VERIFIED dated facts against dossier primary sources: WisdomTree CRDT (Sep 12 2025, Stellar+Ethereum, GLACI index), Ondo USDY (Sep 17 2025, 5.3% APY), PayPal PYUSD (Sep 18 2025) — clustered around Meridian 2025 in Rio (Sep 17-18). Also FT first Singapore retail tokenized fund (2025). Freshness:quarterly — list is time-bounded. 'Notable launches in period X' → lumenloop_search_content_semantic."
---

## Reference answer (gospel)

The notable 2025 Stellar DeFi/RWA launches cluster in **September 2025** [1][2]:
- **WisdomTree CRDT** — Private Credit & Alternative Income Digital Fund, **Sep 12, 2025** (Stellar +
  Ethereum, tracks the GLACI index) [2].
- **Ondo USDY** — tokenized US-Treasuries yieldcoin, **Sep 17, 2025** (~5.3% APY, non-US only) [1].
- **PayPal PYUSD** — launched on Stellar **Sep 18, 2025**.

This **September cluster (CRDT + USDY + PYUSD)** landed around **Meridian 2025 in Rio (Sep 17-18)** and
is widely framed as the inflection point for Stellar's DeFi/RWA growth. Franklin Templeton also launched
its first **Singapore retail tokenized fund** on Stellar in 2025. (Freshness: time-bounded list.)

Sources: [1] stellar.org Ondo USDY launch; [2] WisdomTree CRDT press release.

## Why these cards (routing rationale)

"Notable launches in period X" → `lumenloop_search_content_semantic`; Scout research / general-web
acceptable.

## Edge / traps

Issuer↔product (USDY=Ondo, PYUSD=PayPal, CRDT=WisdomTree) and launch-year traps; don't invent launches.
