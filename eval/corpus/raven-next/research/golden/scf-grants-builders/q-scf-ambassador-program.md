---
id: q-scf-ambassador-program
q: "What is the Stellar Ambassador Program and how does it connect to funding for early-stage builders?"
category: scf-grants-builders
subcategory: ambassador-regional
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [lumenloop_search_content_semantic, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "The Stellar Ambassador Program supports builders/educators forming regional chapters (events, meetups, docs).", weight: 4 }
  - { claim: "Under SCF v7.0, ambassadors can recommend Instawards (up to $15K XLM per project) for early-stage builders.", weight: 5 }
should_have:
  - { claim: "Instawards have no open application — they come via ambassador/chapter recommendation.", weight: 3 }
nice_to_have:
  - { claim: "Reaching a local Ambassador chapter is the recommended first rung of the funding ladder.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim ambassadors directly award the $150K SCF Build grant — their funding power is Instawards (≤$15K), not Build.", weight: 4 }
  - { claim: "Do NOT confuse the Ambassador Program with SCF Verified Members / NQG governance roles.", weight: 3 }
must_cite:
  - "stellar.gitbook.io/ambassador-program and the SCF Instawards handbook page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/ambassador-program"
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/instawards"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §7.2. Trap: ambassador → Instawards (≤$15K), not Build ($150K)."
---

## Reference answer (gospel)

- The **Stellar Ambassador Program** supports builders and educators forming **regional chapters** (events, meetups, documentation, local growth). (https://stellar.gitbook.io/ambassador-program)
- Under **SCF v7.0**, ambassadors can **recommend Instawards — up to $15,000 in XLM per project** — for early-stage builders. (https://stellar.gitbook.io/scf-handbook/scf-awards/instawards)
- **Instawards have no open application**: they come via **ambassador / local-chapter recommendation**, which makes reaching a local chapter a recommended first rung of the funding ladder. (https://stellar.gitbook.io/scf-handbook/scf-awards/instawards)
- Ambassadors do **not** award the **$150K SCF Build grant** — their funding lever is the **Instawards (≤$15K)**, and the Ambassador Program is distinct from SCF Verified Member / NQG governance roles. (https://stellar.gitbook.io/ambassador-program)

## Why these cards (routing rationale)

Documented program (ambassador + Instawards) → `scout_research` over the SCF/ambassador corpus.

## Edge / traps

Trap: claiming ambassadors hand out the $150K Build grant; their lever is Instawards (≤$15K).
