---
id: q-sep-41-token-interface
q: "What is SEP-41 and how does it relate to the Stellar Asset Contract?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names SEP-41 as the Soroban Token Interface (the standard token trait/interface for Soroban contracts).", weight: 5 }
  - { claim: "The Stellar Asset Contract implements SEP-41, so SAC tokens and custom tokens share a common interface.", weight: 4 }
should_have:
  - { claim: "Defines common functions like transfer, allowance/approve, balance, and burn.", weight: 2 }
nice_to_have:
  - { claim: "Notes SEP-41 corresponds to the CAP-46-6 standardized asset interface.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber the token interface (it is SEP-41, not SEP-31 or SEP-40).", weight: 5 }
  - { claim: "Do NOT describe SEP-41 as an anchor/KYC/payment standard.", weight: 3 }
must_cite:
  - "SEP-0041 on the stellar-protocol repo or the SAC page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §7.1, Q18. Verified: SEP-0041 'Soroban Token Interface', Status Draft; spec is a subset of the SAC interface, compatible with CAP-46-6."
---

## Reference answer (gospel)

**SEP-41** is the **Soroban Token Interface** (Status: Draft) — the standard contract trait that
defines the common surface a fungible token contract on Soroban should expose, so SAC tokens and
custom tokens are "largely indistinguishable" to consuming contracts [1]. Its interface includes
`allowance`, `approve`, `balance`, `transfer`, `transfer_from`, `burn`, `burn_from`, plus
`decimals`/`name`/`symbol` [1]. The spec is explicitly a **subset of the Stellar Asset Contract's
interface and compatible with CAP-46-6**, so the **Stellar Asset Contract implements SEP-41** —
giving every classic asset's SAC and any custom token a shared interface [1][2]. (Note: SEP-41
defines `mint`/`clawback` as required *events* rather than required functions, leaving admin
naming to the implementation; the SAC layers on the admin functions.)

Sources: [1] stellar-protocol `ecosystem/sep-0041.md` (Soroban Token Interface, Draft);
[2] developers.stellar.org Stellar Asset Contract page.

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + SEP repo.

## Edge / traps

Misnumbering (it is SEP-41, not SEP-40 oracle / SEP-31 cross-border), or mislabeling SEP-41 as an
anchor/KYC standard.
