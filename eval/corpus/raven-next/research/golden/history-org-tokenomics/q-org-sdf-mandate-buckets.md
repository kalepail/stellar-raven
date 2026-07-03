---
id: q-org-sdf-mandate-buckets
q: "How does the Stellar Development Foundation organize its work / spending priorities?"
category: history-org-tokenomics
subcategory: sdf-org
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: "annual"

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "SDF organizes its mandate/spending into a small set of strategic buckets/programs (e.g. ecosystem support, product/innovation, growth, and SDF's own development).", weight: 4 }
should_have:
  - { claim: "The mandate framework has been revised over time (e.g. a 2019 framing and an updated ~2025 framing).", weight: 3 }
  - { claim: "SDF funds these from its XLM holdings rather than equity/shareholders.", weight: 2 }
nice_to_have:
  - { claim: "Names at least one current bucket (e.g. Assets and Liquidity, Product and Innovation, Stellar Growth, SDF Development).", weight: 2 }
must_avoid:
  - { claim: "Do NOT invent a precise XLM-allocation breakdown by bucket that isn't supported by a source.", weight: 3 }
  - { claim: "Do NOT describe SDF as a for-profit allocating shareholder capital.", weight: 2 }
must_cite:
  - "The SDF mandate page on stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/foundation/mandate
  - https://stellar.org/foundation/previous-mandate
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Freshness-sensitive (mandate buckets get revised). Re-verified live 2026-06-29 against stellar.org/foundation/mandate: the current (2025) reserve buckets are confirmed as SDF Development, Stellar Growth, Product and Innovation, and Assets and Liquidity, each with linked StellarExpert accounts; the prior 2019 framing (User Acquisition, Use-Case Investment, Ecosystem Support, Direct Development) is on the previous-mandate page."
---

## Reference answer (gospel)

- SDF organizes its mandate/spending into a **small set of strategic buckets/programs**, funded from its **XLM holdings** (not equity/shareholders) [1].
- The framework has been **revised over time**:
  - **2019 framing:** User Acquisition, Use-Case Investment, Ecosystem Support, Direct Development [2].
  - **~2025 framing:** Assets and Liquidity, Product and Innovation, Stellar Growth, SDF Development [1].
- Trap to avoid: inventing a precise per-bucket XLM allocation that isn't sourced, or describing SDF as a for-profit allocating shareholder capital [1].

Freshness caveat: bucket names/priorities get updated — confirm against the live mandate page.

- [1] stellar.org/foundation/mandate
- [2] stellar.org/foundation/previous-mandate

## Why these cards (routing rationale)

The SDF mandate framework is published on stellar.org (Stellar-own) → `scout_research` /
`stellar_docs_mcp`.

## Edge / traps

Traps: fabricating per-bucket XLM allocations; describing SDF as for-profit. Reward noting the
framework has been revised over time.
