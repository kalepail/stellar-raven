---
id: q-edge-ambig-is-it-secure
q: "Is it secure?"
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
should_fire: false   # no antecedent for 'it'; must clarify

must_have:
  - { claim: "Asks what 'it' refers to (the Stellar network/SCP? a specific contract or protocol? a wallet? the SAC?) before answering.", weight: 5 }
  - { claim: "Does NOT pick an arbitrary referent and assert a security verdict on it.", weight: 4 }
should_have:
  - { claim: "Notes the security answer differs sharply by referent (protocol consensus vs a single contract vs key custody).", weight: 2 }
nice_to_have: []
must_avoid:
  - { claim: "Do NOT answer 'yes, it's secure' (or 'no') without establishing what 'it' is.", weight: 4 }
must_cite: []
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources: []
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Ambiguous: dangling referent 'it'. Reward clarifying. The trap is a confident security verdict on an unspecified subject. Behavioral: gospel is the GATE (clarify the referent)."
---

## Reference answer (gospel)

**Behavioral case — the correct answer is the behavior.** "Is it secure?" has no antecedent for
"it." The security answer differs sharply by referent — the Stellar network / SCP consensus, a specific
Soroban contract, a wallet's key custody, or the Stellar Asset Contract are entirely different security
questions. Raven should **ask what "it" refers to before answering** and must **not** pick an arbitrary
referent and assert a blanket "yes, it's secure" / "no" verdict. Only after the user names a referent
would a route (`scout_research` / `stellar_docs_mcp`) be appropriate — a later run (`should_fire: false`).

## Why these cards (routing rationale)

Nothing to route on until 'it' is resolved → `should_fire: false`, no acceptable cards in this run. Reward
the clarifying question. (Only after the user names a referent would a route like `scout_research` or
`stellar_docs_mcp` become appropriate — that is a later run, not this one.)

## Edge / traps

Wrong answer: a blanket 'it's secure'/'it's not' verdict on an undefined subject.
