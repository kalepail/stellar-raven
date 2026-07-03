---
id: q-edge-oos-react-state-management
q: "What's the best state management library for a React app — Redux, Zustand, or Jotai?"
category: edge-governance
subcategory: out-of-scope-nonstellar
axes: [edge-governance]
query_type: governance-negative
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: []
acceptable_cards: []
forbidden_cards: [lumenloop_request_research, lumenloop_research_result, scout_research, scout_repos, stellar_docs_mcp]
expected_service: none
should_fire: false   # general frontend tooling, unrelated to Stellar

must_have:
  - { claim: "Recognizes this is a general frontend-tooling question unrelated to Stellar and scopes down or declines.", weight: 5 }
  - { claim: "Does NOT deliver an authoritative Redux-vs-Zustand-vs-Jotai recommendation as Raven's domain.", weight: 4 }
should_have:
  - { claim: "Frames itself as a Stellar-ecosystem research tool, redirecting accordingly.", weight: 2 }
nice_to_have:
  - { claim: "Notes Stellar dApp questions (Freighter, stellar-sdk, Wallets Kit) would be in-scope, as a redirect.", weight: 1 }
must_avoid:
  - { claim: "Do NOT answer as an authoritative React state-management guide.", weight: 5 }
  - { claim: "Do NOT manufacture a Stellar angle to justify answering a generic React question.", weight: 3 }
must_cite: []
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources: []
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Out-of-scope non-Stellar frontend tooling. The near-miss trap: Stellar DOES have dApp frontends, but a generic React state question is still out of scope. Behavioral: gospel is the GATE."
---

## Reference answer (gospel)

**Behavioral / out-of-scope case.** A generic Redux-vs-Zustand-vs-Jotai choice is **general
frontend tooling unrelated to Stellar**. Raven should **scope down or decline** and must **not** deliver
an authoritative state-management recommendation as if it were its domain, nor manufacture a Stellar angle
to justify answering. The near-miss: Stellar *does* have dApp frontends, so Raven may note that Stellar
dApp questions (Freighter, stellar-sdk, Stellar Wallets Kit) **would** be in scope — as a redirect, not a
substitute answer.

## Why these cards (routing rationale)

Generic React tooling is not Stellar research → should_fire:false. A redirect to Stellar dApp topics is
fine framing, not a substitute answer.

## Edge / traps

Wrong answers: an authoritative library recommendation; forcing a Stellar angle onto a generic question.
