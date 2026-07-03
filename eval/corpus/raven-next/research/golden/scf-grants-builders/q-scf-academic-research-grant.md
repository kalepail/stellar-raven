---
id: q-scf-academic-research-grant
q: "Does Stellar fund academic research, and how would a university researcher apply?"
category: scf-grants-builders
subcategory: sdf-grants
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "SDF offers Academic Research Grants (up to ~$150K USD) for research advancing the foundation's goals.", weight: 5 }
  - { claim: "Applications go through SDF Research / research.stellar.org via a published RFP schedule.", weight: 4 }
should_have:
  - { claim: "This is an SDF-direct program, distinct from the community-driven SCF Build.", weight: 2 }
nice_to_have:
  - { claim: "Covers scientific, technological, economic, and legal research.", weight: 1 }
must_avoid:
  - { claim: "Do NOT route academic researchers to the SCF Build interest form as the academic-grant path.", weight: 4 }
  - { claim: "Do NOT invent an academic-grant amount other than the ~$150K USD figure.", weight: 3 }
must_cite:
  - "research.stellar.org/research-grants."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://research.stellar.org/research-grants"
  - "https://stellar.org/grants-and-funding"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Dossier §5.3. Distinct SDF Research line; trap is routing to SCF Build. Verified 2026-06-29 via WebFetch of research.stellar.org/research-grants: $150K cap confirmed (historical avg ~$75K); quarterly submission deadlines (Mar 31 / Jun 30 / Sep 30 / Dec 31), max 2 proposals/yr; awards go to degree-granting institutions (PI-led), funding ~1 grad student/postdoc for 12mo; covers scientific/technological/economic/legal research."
---

## Reference answer (gospel)

- Yes — **SDF offers Academic Research Grants of up to $150,000 (in USD)** for students and researchers whose work advances the foundation's goals. (https://research.stellar.org/research-grants)
- Applications go through **SDF Research at research.stellar.org/research-grants**, via a published RFP schedule — quarterly submission deadlines (Mar 31 / Jun 30 / Sep 30 / Dec 31), with a researcher submitting at most 2 proposals per year. Awards go to the degree-granting institution (PI-led), typically funding one graduate student or postdoc for ~12 months. (https://research.stellar.org/research-grants)
- This is an **SDF-direct program, distinct from the community-driven SCF Build** — a university researcher should **not** be routed to the SCF Build interest form for this. (https://stellar.org/grants-and-funding)
- The program covers research broadly (e.g. scientific, technological, economic, and legal). (https://research.stellar.org/research-grants)

## Why these cards (routing rationale)

Documented SDF Research program → `scout_research` (or Docs MCP) over Stellar corpora.

## Edge / traps

Trap: pointing an academic researcher at the SCF Build form rather than SDF Research.
