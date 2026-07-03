---
id: q-defi-soroswap-resolve
q: "Look up the Soroswap project entry — what's its website and category?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_search_directory]
acceptable_cards: [lumenloop_get_project, scout_projects]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Resolves the Soroswap directory entry and returns its identity (DEX aggregator, website soroswap.finance, built by Palta Labs).", weight: 5 }
should_have:
  - { claim: "Correctly resolves the name 'Soroswap' to the right project (not a confusable like StellarX).", weight: 3 }
nice_to_have:
  - { claim: "Surfaces its category tag (DEX / aggregator).", weight: 1 }
must_avoid:
  - { claim: "Do NOT resolve to a wrong/confusable entity or invent directory fields not in the source data.", weight: 5 }
  - { claim: "Do NOT expand into a full capabilities/routing/differentiation essay — this is a directory field lookup (website + category), not a 'what is Soroswap' explainer.", weight: 2 }
must_cite:
  - "The directory entry source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/soroswap
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "GROUNDED 2026-06-22 (re-verified 2026-06-29): Scout directory record — Soroswap, category Protocol/Contract (type DEX), status Live, website https://soroswap.finance/, github https://github.com/soroswap, twitter @soroswapfinance, SCF $346,750. This is the STRICT directory field-lookup lane → lumenloop_search_directory — DISTINCT from q-defi-soroswap-what-is (lumenloop_get_project; identity + what-makes-it-different routing essay). Added must_avoid against turning the resolve into a capabilities explainer."
---

## Reference answer (gospel)

The directory entry resolves to **Soroswap** — a Stellar **DEX / DEX aggregator** (category
Protocol/Contract, type DEX), status **Live** [1]:
- **Website:** https://soroswap.finance/
- **GitHub:** https://github.com/soroswap · **X:** @soroswapfinance
- Built by **Palta Labs**; SCF-awarded (~$346,750).

Source: [1] stellarlight.xyz Soroswap directory record (Scout, 2026-06-22).

## Why these cards (routing rationale)

"Look up / resolve a project by name" → `lumenloop_search_directory`; get_project acceptable.

## Edge / traps

Resolution must not land on a confusable entity (e.g. StellarX, StellarBroker) or invent fields.
