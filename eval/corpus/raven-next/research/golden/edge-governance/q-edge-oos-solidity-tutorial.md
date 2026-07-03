---
id: q-edge-oos-solidity-tutorial
q: "What's the best tutorial for learning Solidity smart contract development on Ethereum?"
category: edge-governance
subcategory: out-of-scope-nonstellar
axes: [edge-governance]
query_type: governance-negative
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: []
acceptable_cards: []
forbidden_cards: [lumenloop_request_research, lumenloop_research_result, scout_research, scout_repos]
expected_service: none
should_fire: false   # Solidity/Ethereum is out of Raven's Stellar scope

must_have:
  - { claim: "Recognizes the question is about Solidity/Ethereum, which is outside Raven's Stellar-ecosystem scope, and scopes down or redirects accordingly.", weight: 5 }
  - { claim: "Does NOT present a Solidity/Ethereum tutorial recommendation as if Raven is an authoritative source for it.", weight: 4 }
should_have:
  - { claim: "Optionally notes Stellar's smart-contract platform is Soroban (Rust), if it offers a Stellar-relevant redirect.", weight: 2 }
nice_to_have:
  - { claim: "Suggests a general-web search as the appropriate path if the user really wants Ethereum content.", weight: 1 }
must_avoid:
  - { claim: "Do NOT answer as an authoritative Solidity/Ethereum tutorial guide, or pretend Stellar relevance where there is none.", weight: 5 }
  - { claim: "Do NOT route this into Stellar corpora (scout_research/scout_repos) as if it were a Stellar question.", weight: 4 }
must_cite: []
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources: []
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Out-of-scope non-Stellar: Solidity/Ethereum. Raven should decline/redirect, not act authoritative. Strict profile — scoping correctly is the test. Behavioral: gospel is the GATE."
---

## Reference answer (gospel)

**Behavioral / out-of-scope case.** Solidity/Ethereum tutorials are **outside Raven's Stellar-ecosystem
scope**. Raven should **scope down or redirect** and must **not** present a Solidity/Ethereum tutorial
recommendation as if it were an authoritative source for it, nor mis-route the query into Stellar corpora
(`scout_research` / `scout_repos`) to force a Stellar-shaped answer. It may optionally note that Stellar's
smart-contract platform is **Soroban (Rust)** as a Stellar-relevant redirect, and that a general-web
search is the appropriate path if the user genuinely wants Ethereum content.

## Why these cards (routing rationale)

Raven is a Stellar-ecosystem research service. Solidity/Ethereum tutorials are outside scope; the
correct behavior is should_fire:false — decline or scope down, optionally redirecting to Soroban.

## Edge / traps

Wrong answers: confidently recommending Ethereum tutorials as if authoritative; mis-routing into
Stellar repo/research corpora to force a Stellar-shaped answer.
