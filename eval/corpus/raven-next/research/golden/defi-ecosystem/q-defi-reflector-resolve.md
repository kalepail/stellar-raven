---
id: q-defi-reflector-resolve
q: "Resolve the Reflector project — give me its directory record and links."
category: defi-ecosystem
subcategory: oracle
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
  - { claim: "Resolves the Reflector directory entry and returns its identity (Stellar price oracle, reflector.network, reflector-network on GitHub).", weight: 5 }
should_have:
  - { claim: "Correctly resolves 'Reflector' to the oracle project (its category is oracle/data, not DEX).", weight: 3 }
nice_to_have:
  - { claim: "Surfaces links (website/GitHub) from the record.", weight: 1 }
must_avoid:
  - { claim: "Do NOT resolve to a wrong/confusable entity or invent fields not in the source data.", weight: 5 }
must_cite:
  - "The directory entry source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/reflector
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "GROUNDED 2026-06-22: Scout directory record — Reflector, category Infrastructure (oracle/data), status Live, website https://reflector.network/, github reflector-network, SCF $444,840. Name→directory resolution → lumenloop_search_directory."
---

## Reference answer (gospel)

The directory entry resolves to **Reflector** — a Stellar/Soroban **price oracle & data-feed network**
(category Infrastructure), status **Live** [1]:
- **Website:** https://reflector.network/
- **GitHub:** https://github.com/reflector-network
- SCF-awarded (~$444,840).

Source: [1] stellarlight.xyz Reflector directory record (Scout, 2026-06-22).

## Why these cards (routing rationale)

Resolve-by-name → `lumenloop_search_directory`.

## Edge / traps

Resolution correctness; Reflector's category is oracle/data (Infrastructure), not DEX.
