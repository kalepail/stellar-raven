---
id: q-edge-ambig-stellar-token-meaning
q: "How do I create a token on Stellar?"
category: edge-governance
subcategory: ambiguous-underspecified
axes: [edge-governance]
query_type: governance-negative
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: [lumenloop_request_research, lumenloop_research_result]
expected_service: stellar_docs
should_fire: true   # answerable, but two valid readings — best answer disambiguates

must_have:
  - { claim: "Recognizes 'token' is ambiguous on Stellar: a classic Stellar asset (issuer + trustlines) vs a Soroban token contract / SAC, and disambiguates or covers both.", weight: 5 }
  - { claim: "Does NOT silently assume one path is 'the' way to create a token without noting the other.", weight: 3 }
should_have:
  - { claim: "Briefly contrasts the classic asset model (issuer account, trustlines, asset code) with Soroban token contracts / the Stellar Asset Contract.", weight: 3 }
  - { claim: "Points to the relevant docs for whichever path the user means.", weight: 2 }
nice_to_have:
  - { claim: "Asks which the user wants if their goal (e.g. stablecoin vs in-app token) is unclear.", weight: 1 }
must_avoid:
  - { claim: "Do NOT conflate classic Stellar assets and Soroban token contracts as if identical.", weight: 4 }
  - { claim: "Do NOT describe token creation as a Solidity/ERC-20 deployment.", weight: 4 }
must_cite:
  - "Cite developers.stellar.org docs for the asset/issuance or SAC path covered."
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/how-to-issue-an-asset
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Ambiguous but answerable: 'token' = classic asset vs Soroban token contract. Reward disambiguating/covering both; trap is conflation or ERC-20 framing. Cross-checks assets skill."
---

## Reference answer (gospel)

"Token on Stellar" is **ambiguous** and the best answer disambiguates the two valid paths:

- **Classic Stellar asset** — an issuing account, an asset code, and **trustlines**; recipients
  establish a trustline and the issuer can set auth flags / clawback. No smart contract required
  ([issue an asset](https://developers.stellar.org/docs/tokens/how-to-issue-an-asset)).
- **Soroban token contract** — a Wasm contract implementing the token interface; any classic asset is
  also reachable from Soroban via its **Stellar Asset Contract (SAC)** wrapper
  ([SAC](https://developers.stellar.org/docs/tokens/stellar-asset-contract)).

Raven should name this fork (or cover both) and route to the right docs. Traps: silently assuming one
path, conflating classic assets with Soroban token contracts, or describing it as a Solidity/ERC-20
deployment.

## Why these cards (routing rationale)

`stellar_docs_mcp` covers both the classic asset issuance flow and the SAC/Soroban token path. The
best answer names the fork and routes to the right docs.

## Edge / traps

Wrong answers: assuming one path silently; conflating classic assets with Soroban contracts; ERC-20 framing.
