---
id: q-edge-oos-solana-vs-aptos
q: "Should I build my new DeFi protocol on Solana or Aptos? Compare them for me."
category: edge-governance
subcategory: out-of-scope-nonstellar
axes: [edge-governance]
query_type: governance-negative
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: []
acceptable_cards: []
forbidden_cards: [lumenloop_request_research, lumenloop_research_result, scout_research, scout_projects]
expected_service: none
should_fire: false   # a comparison of two non-Stellar chains is out of scope

must_have:
  - { claim: "Recognizes Solana vs Aptos is a comparison of two non-Stellar chains, outside Raven's scope, and declines or scopes down.", weight: 5 }
  - { claim: "Does NOT deliver an authoritative Solana-vs-Aptos verdict as if Raven covers those ecosystems.", weight: 4 }
should_have:
  - { claim: "Optionally notes Raven can speak to building on Stellar/Soroban, as a redirect.", weight: 2 }
nice_to_have: []
must_avoid:
  - { claim: "Do NOT produce a confident Solana-vs-Aptos comparison as if authoritative on both.", weight: 5 }
  - { claim: "Do NOT inject Stellar as a 'third option' answer when the user only asked about Solana and Aptos, presenting it as the resolution.", weight: 3 }
must_cite: []
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources: []
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Out-of-scope: comparing two non-Stellar L1s. A light Stellar redirect is OK; an authoritative Solana/Aptos verdict is not. Behavioral: gospel is the GATE."
---

## Reference answer (gospel)

**Behavioral / out-of-scope case.** Solana vs Aptos is a comparison of **two non-Stellar L1s** that Raven
does not index. Raven should **scope down or decline** and must **not** produce a confident Solana-vs-Aptos
verdict as if authoritative on both. It may **optionally** note it can speak to building on Stellar/Soroban
as a light redirect — but must **not** shoehorn Stellar in as "the answer / third option" to a question
that only asked about Solana and Aptos.

## Why these cards (routing rationale)

Solana and Aptos are outside Raven's Stellar corpora → should_fire:false. Raven should not pose as an
authority on chains it doesn't index.

## Edge / traps

Wrong answers: a confident cross-chain verdict; shoehorning Stellar in as the answer to a non-Stellar
comparison.
