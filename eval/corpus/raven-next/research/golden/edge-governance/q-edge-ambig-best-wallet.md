---
id: q-edge-ambig-best-wallet
q: "What's the best wallet?"
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
should_fire: false   # underspecified ('best' for whom/what) and assumes Stellar context implicitly

must_have:
  - { claim: "Clarifies the criteria/use-case before recommending (developer vs end-user, mobile vs browser extension, custody, passkey/smart-wallet needs) and confirms it is a Stellar wallet question.", weight: 5 }
  - { claim: "Does NOT declare a single 'best' wallet as an objective fact.", weight: 4 }
should_have:
  - { claim: "Notes there are several reputable Stellar wallets (e.g. Freighter, Lobstr, Hana, xBull) suited to different needs, if it offers options.", weight: 3 }
nice_to_have:
  - { claim: "Frames 'best' as situational rather than absolute.", weight: 1 }
must_avoid:
  - { claim: "Do NOT crown one wallet 'the best' without scoping the use-case.", weight: 4 }
  - { claim: "Do NOT assume a non-Stellar wallet (e.g. MetaMask) is meant and answer accordingly.", weight: 3 }
must_cite: []
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources: []
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Ambiguous: 'best' is subjective + use-case-dependent. Reward scoping by criteria and offering options. Trap is an absolute verdict or assuming a non-Stellar wallet. Behavioral: the gospel is the GATE (clarify, no absolute verdict) not a factual essay."
---

## Reference answer (gospel)

**Behavioral case — the correct answer is the behavior, not a verdict.** "Best wallet" is subjective
and use-case-dependent, and it implicitly assumes a Stellar context. Raven should **clarify the
criteria before recommending** — developer vs end-user, mobile vs browser-extension, custodial vs
self-custody, passkey/smart-wallet needs — and confirm this is a Stellar wallet question (not e.g.
MetaMask). It should **not crown a single "best" wallet** as objective fact. If it offers options, it
frames "best" as situational and notes several reputable Stellar wallets suited to different needs
(e.g. Freighter, Lobstr, Hana, xBull). The directory lookup
(`scout_projects` / `lumenloop_search_directory`) belongs to a *later* run, after the use-case is set.

## Why these cards (routing rationale)

No confident single-card route until criteria are set → `should_fire: false`, no acceptable cards in this
run; reward scoping. (If, after clarification, the user wants options, the Stellar wallet directory —
`scout_projects` / `lumenloop_search_directory` — is the right source for that later run.)

## Edge / traps

Wrong answers: declaring one 'best' wallet absolutely; assuming a non-Stellar wallet.
