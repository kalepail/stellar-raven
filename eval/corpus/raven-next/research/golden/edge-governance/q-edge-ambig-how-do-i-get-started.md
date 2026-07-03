---
id: q-edge-ambig-how-do-i-get-started
q: "How do I get started?"
category: edge-governance
subcategory: ambiguous-underspecified
axes: [edge-governance]
query_type: governance-negative
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: []
acceptable_cards: []
forbidden_cards: [lumenloop_request_research, lumenloop_research_result]
expected_service: none
should_fire: false   # too underspecified to route confidently; clarify first

must_have:
  - { claim: "Asks a clarifying question to scope the request (e.g. get started building a Soroban contract? a wallet/dApp? running a validator? issuing an asset?).", weight: 5 }
  - { claim: "Does NOT guess one interpretation and deliver a full how-to as if it were the obvious intent.", weight: 4 }
should_have:
  - { claim: "Briefly enumerates a few common 'getting started' paths in the Stellar ecosystem to help the user choose.", weight: 3 }
nice_to_have:
  - { claim: "Notes it can route to docs once the goal is specified.", weight: 1 }
must_avoid:
  - { claim: "Do NOT commit to a single narrow interpretation and run a full pipeline on it without scoping.", weight: 3 }
  - { claim: "Do NOT fabricate a one-size-fits-all 'getting started' answer covering everything shallowly.", weight: 2 }
must_cite: []
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources: []
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Ambiguous/underspecified: 'get started' with WHAT? Reward clarifying + offering paths. should_fire:false because routing without scope is the failure. Behavioral: gospel is the GATE (clarify-first), not a factual essay."
---

## Reference answer (gospel)

**Behavioral case — the correct answer is the behavior.** "How do I get started?" is too
underspecified to route confidently: it could mean building a Soroban contract, building a wallet/dApp,
running a validator, or issuing an asset. Raven should **ask a clarifying question to scope the goal**
and may briefly enumerate a few common Stellar "getting started" paths to help the user choose. It must
**not** silently pick one interpretation and run a full how-to as if it were the obvious intent, nor
dump a shallow everything-answer. Once the goal is scoped, `stellar_docs_mcp` / `scout_skills` become
the natural route — but that is a later run, not this one (`should_fire: false`).

## Why these cards (routing rationale)

No card should fire until the goal is scoped — the question spans contracts, wallets, validators, asset
issuance → `should_fire: false`, no acceptable cards in this run. Reward asking; punish a blind
full-pipeline guess. (Once scoped, `stellar_docs_mcp` / `scout_skills` become the natural route — a later
run, not this one.)

## Edge / traps

Wrong answers: assuming one path; dumping a shallow everything-answer.
