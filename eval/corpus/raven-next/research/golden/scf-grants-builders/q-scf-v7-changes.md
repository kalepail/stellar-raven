---
id: q-scf-v7-changes
q: "What changed when the SCF moved to v7.0, and when did that happen?"
category: scf-grants-builders
subcategory: history-changes
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [lumenloop_search_content_semantic, lumenloop_find_av_passages]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "SCF v7.0 launched in January 2026.", weight: 4 }
  - { claim: "Build was split into Open / Integration / RFP tracks.", weight: 4 }
  - { claim: "The disbursement model became 4 milestone tranches (10/20/30/40), and Instawards replaced Kickstart.", weight: 4 }
should_have:
  - { claim: "Supporting programs were consolidated into a unified Growth track; a Referral Program was added.", weight: 2 }
  - { claim: "UX audits / user testing were added to the Build evaluation.", weight: 2 }
nice_to_have:
  - { claim: "SCF #41 was the first round under v7.0.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute v6.0 features (Kickstart bootcamp, 3-equal tranches) to v7.0 as current.", weight: 4 }
  - { claim: "Do NOT invent a wrong launch date or version number for the current SCF.", weight: 3 }
must_cite:
  - "The 'Introducing SCF v7' blog post / SCF handbook history page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.org/blog/ecosystem/introducing-scf-v7"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §8/§9. Version-transition fact set; trap is attributing v6 features to v7."
---

## Reference answer (gospel)

- **SCF v7.0 launched January 2026**, with **SCF #41 as the first round** under the new model ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- **Build was split into three tracks: Open / Integration / RFP** ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- The disbursement model became **4 milestone tranches (10/20/30/40)** ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- **Instawards replaced the Kickstart Award** ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- Supporting programs were **consolidated into a unified Growth track**, and a **Referral Program** was added ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- **UX audits / user testing** were added to the Build evaluation ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).

## Why these cards (routing rationale)

Program-evolution fact → `scout_research` over the SCF corpus; Lumenloop semantic/AV acceptable.

## Edge / traps

Trap: attributing superseded v6.0 features (Kickstart bootcamp, 3 equal tranches) to current v7.0.
