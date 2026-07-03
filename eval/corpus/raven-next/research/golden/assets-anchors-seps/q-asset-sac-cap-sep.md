---
id: q-asset-sac-cap-sep
q: "Which CAP and which SEP does the Stellar Asset Contract implement?"
category: assets-anchors-seps
subcategory: sac-bridge
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
  - { claim: "Names SEP-41 (Soroban token interface) as the token interface the SAC implements.", weight: 5 }
  - { claim: "Names CAP-46(-6) (Smart Contract Standardized Asset) as the asset spec the SAC implements.", weight: 4 }
should_have:
  - { claim: "Notes the SAC exposes token functions like transfer, allowance, burn, mint, clawback, set_admin, set_authorized.", weight: 2 }
nice_to_have:
  - { claim: "Notes every classic Stellar asset has a reserved SAC instance.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber the SEP — SEP-41 is the token interface, not SEP-31/SEP-24/SEP-40.", weight: 5 }
  - { claim: "Do NOT claim the SAC implements an ERC-20 standard or OpenZeppelin contract by name as its defining spec.", weight: 3 }
must_cite:
  - "The Stellar Asset Contract page on developers.stellar.org or SEP-0041 on the stellar-protocol repo."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "SEP-numbering trap. Dossier §2.1, §7.1. Verified: SAC implements CAP-46-6 (Smart Contract Standardized Asset) and the SEP-41 Soroban Token Interface (developers.stellar.org SAC page; SEP-0041 spec is 'a subset of the Stellar Asset contract... compatible with CAP-46-6')."
---

## Reference answer (gospel)

The **Stellar Asset Contract (SAC)** implements **CAP-46-6 ("Smart Contract Standardized Asset")**
and the **SEP-41 Soroban Token Interface** [1][2]. CAP-46-6 is the protocol-level standardized-asset
spec; SEP-41 is the ecosystem token interface that the SAC's token functions satisfy (SEP-41 is
explicitly defined as "a subset of the Stellar Asset contract... compatible with CAP-46-6") [2].
The SAC exposes standard token functions — `transfer`, `approve`/`allowance`, `balance`, `burn` —
plus issuer-only admin functions `mint`, `clawback`, `set_admin`, `set_authorized` [1]. Every
classic Stellar asset has a **reserved SAC contract address** it can be deployed to [1].

Sources: [1] developers.stellar.org Stellar Asset Contract page; [2] stellar-protocol
`ecosystem/sep-0041.md` (Soroban Token Interface; references `core/cap-0046-06.md`).

## Why these cards (routing rationale)

Spec mapping → `stellar_docs_mcp` + SEP repo.

## Edge / traps

SEP-41 is the Soroban token interface; calling it SEP-31 (cross-border) or SEP-40 (oracle) is the misnumbering trap.
