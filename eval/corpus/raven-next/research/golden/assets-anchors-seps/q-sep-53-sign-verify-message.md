---
id: q-sep-53-sign-verify-message
q: "What is SEP-53 and what does it standardize?"
category: assets-anchors-seps
subcategory: seps
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "SEP-53 is titled 'Sign and Verify Messages'.", weight: 5 }
  - { claim: "SEP-53 standardizes signing and verifying arbitrary messages with Stellar keypairs.", weight: 5 }
  - { claim: "SEP-53 is in Final status.", weight: 3 }
should_have:
  - { claim: "The Stellar CLI `message` subcommand implements SEP-53.", weight: 3 }
nice_to_have:
  - { claim: "Notes the use case (proving control of a key / off-chain message attestation).", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber SEP-53 or attribute a different title to it.", weight: 5 }
  - { claim: "Do NOT conflate SEP-53 with SEP-10 (SEP-10 is the web-auth challenge/token, not general message signing).", weight: 5 }
must_cite:
  - "The SEP-53 spec in the stellar/stellar-protocol repo (or developers.stellar.org SEP listing)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0053.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "SEP-53 verified Final (ecosystem README + sep-0053.md preamble: Status Final, created 2025-02-01, updated 2026-06-18). Spec uses ed25519 + single-round SHA-256 over prefix 'Stellar Signed Message:\\n'. CLI `message` subcommand exists but is a should_have, not a hard gate."
---

## Reference answer (gospel)

- **SEP-53 — "Sign and Verify Messages"** (Status: **Final**) standardizes signing and verifying **arbitrary off-chain messages** with Stellar ed25519 keypairs, preventing ecosystem fragmentation [1].
- Mechanism: prefix the message with **`"Stellar Signed Message:\n"`**, hash with single-round **SHA-256**, and sign/verify the hash with the ed25519 key [1].
- Use cases: proving control of an address on social platforms, off-chain agreement/terms verification, cross-chain address proof [1].
- It is **distinct from SEP-10** (web-auth challenge/JWT) — SEP-53 is general message signing, not an auth flow. The Stellar CLI `message` subcommand implements it.

## Why these cards (routing rationale)

Definitional SEP question fully answered by the spec / first-party docs → **`stellar_docs_mcp`**, with
`scout_research` acceptable. Deep-research tier is governance-forbidden for a single-SEP lookup.

## Edge / traps

Traps: (a) **misnumbering** SEP-53 or giving it the wrong title; (b) conflating it with **SEP-10**
(web-auth challenge/JWT), which is a different problem. Both are weight-5 `must_avoid`.
