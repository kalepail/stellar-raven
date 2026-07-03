---
id: q-scf-instawards
q: "What is the SCF Instawards program and how do I get one?"
category: scf-grants-builders
subcategory: scf-mechanics
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [lumenloop_search_content_semantic, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Instawards are early-stage SCF awards of up to $15,000 in XLM per project.", weight: 5 }
  - { claim: "They are obtained via recommendation from a local Stellar Ambassador chapter (no open application).", weight: 4 }
should_have:
  - { claim: "Under SCF v7.0, Instawards replaced the prior Kickstart Award.", weight: 2 }
nice_to_have:
  - { claim: "Instawards are the first rung of the SCF funding ladder before SCF Build.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Instawards have a public application form / community vote — they are ambassador-recommended.", weight: 4 }
  - { claim: "Do NOT state a wrong cap (e.g. $50K, $150K) for Instawards.", weight: 4 }
must_cite:
  - "The SCF Instawards handbook page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/instawards"
  - "https://stellar.org/blog/ecosystem/introducing-scf-v7"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §2.2/§7.2. Trap: assuming an open application; it's ambassador-recommended."
---

## Reference answer (gospel)

- Instawards are early-stage SCF awards of **up to $15,000 in XLM per project** ([SCF handbook — Instawards](https://stellar.gitbook.io/scf-handbook/scf-awards/instawards)).
- They are obtained via **recommendation from a local Stellar Ambassador chapter — there is no open application form and no community vote** ([Instawards](https://stellar.gitbook.io/scf-handbook/scf-awards/instawards)).
- Under SCF v7.0, Instawards **replaced the prior Kickstart Award** ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- They are the **first rung** of the SCF funding ladder, ahead of the larger SCF Build Award ([Instawards](https://stellar.gitbook.io/scf-handbook/scf-awards/instawards)).
- Practical path to one: **engage your regional Ambassador chapter** rather than searching for an application portal ([Instawards](https://stellar.gitbook.io/scf-handbook/scf-awards/instawards)).

## Why these cards (routing rationale)

Documented SCF program → `scout_research` over the SCF handbook.

## Edge / traps

Trap: assuming a public Instawards application/vote; it's ambassador-recommended.
