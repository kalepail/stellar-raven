---
id: q-scf-sdf-marketing-grant
q: "Does the SDF offer marketing funding for a project that already launched on Stellar, and how much?"
category: scf-grants-builders
subcategory: sdf-grants
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "SDF offers Marketing Grants of up to $500,000 (in USD, USDC, or XLM).", weight: 5 }
  - { claim: "They target projects with a live product on Stellar (digital/offline marketing, in-app incentives, PR, communications).", weight: 3 }
should_have:
  - { claim: "Marketing Grants are an SDF-direct program (stellar.org/grants-and-funding), separate from SCF Build.", weight: 2 }
nice_to_have:
  - { claim: "This sits later in the funding ladder than SCF Build (post-launch growth/activation).", weight: 1 }
must_avoid:
  - { claim: "Do NOT cite the SCF Build cap ($150K XLM) as the Marketing Grant amount — they are different programs.", weight: 4 }
  - { claim: "Do NOT invent a marketing-grant amount other than the ~$500K cap.", weight: 3 }
must_cite:
  - "stellar.org/grants-and-funding marketing-grants section."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.org/grants-and-funding"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §5.5. Trap: applying the SCF Build $150K cap to the SDF Marketing Grant."
---

## Reference answer (gospel)

- Yes — **SDF offers Marketing Grants of up to $500,000** (payable in USD, USDC, or XLM). (https://stellar.org/grants-and-funding)
- They target **projects with a live product on Stellar** and cover digital/offline marketing, in-app incentives, PR, and communications. (https://stellar.org/grants-and-funding)
- Marketing Grants are an **SDF-direct program** (stellar.org/grants-and-funding), **separate from SCF Build**, and sit later in the funding ladder (post-launch growth/activation). (https://stellar.org/grants-and-funding)
- Do **not** quote the **SCF Build cap ($150K XLM)** for this — the Marketing Grant cap is **~$500K** and is a different program. (https://stellar.org/grants-and-funding)

## Why these cards (routing rationale)

Documented SDF-direct program → `scout_research` over the Stellar corpus; Docs MCP acceptable.

## Edge / traps

Trap: quoting the SCF Build cap for the (separate) SDF Marketing Grant.
