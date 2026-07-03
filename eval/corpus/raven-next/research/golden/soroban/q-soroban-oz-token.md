---
id: q-soroban-oz-token
q: "Does OpenZeppelin have a Soroban contracts library, and what's in it for building a SEP-41 token?"
category: soroban
subcategory: openzeppelin
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_repos]
acceptable_cards: [stellar_docs_mcp, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "OpenZeppelin maintains a Rust `stellar-contracts` (OpenZeppelin Contracts for Stellar/Soroban) library.", weight: 5 }
  - { claim: "It includes a SEP-41 fungible-token base plus extensions like mintable, burnable, capped, pausable, upgradeable, and access control.", weight: 4 }
should_have:
  - { claim: "It also provides access control / ownable / role primitives, utilities (e.g., Merkle proofs), and account/governance modules.", weight: 2 }
  - { claim: "Using the OZ base reduces audit surface vs writing a token from scratch.", weight: 2 }
nice_to_have:
  - { claim: "Mentions the OpenZeppelin Soroban/Stellar Contract Wizard for scaffolding.", weight: 1 }
must_avoid:
  - { claim: "Do NOT point to OpenZeppelin's Solidity `@openzeppelin/contracts` (ERC-20) as the Soroban library.", weight: 4 }
  - { claim: "Do NOT claim OpenZeppelin has no Stellar/Soroban support.", weight: 3 }
must_cite:
  - "The OpenZeppelin/stellar-contracts GitHub repo or docs.openzeppelin.com/stellar-contracts."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/OpenZeppelin/stellar-contracts
  - https://docs.openzeppelin.com/stellar-contracts
  - https://wizard.openzeppelin.com/stellar
  - https://stellar.org/blog/developers/how-to-use-the-openzeppelin-contract-wizard
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections. Verified the OpenZeppelin/stellar-contracts Rust repo (packages/, examples/, audits/) with a fungible-token (SEP-41) suite. Confirmed the OpenZeppelin Contract Wizard now has a Stellar tab (wizard.openzeppelin.com/stellar) and an SDF blog 'How to Use the OpenZeppelin Contract Wizard to Create a Fungible Token' — the 'Contract Wizard' name is real. Trap: pointing at the Solidity OZ contracts."
---

## Reference answer (gospel)

**Yes.** OpenZeppelin maintains **`OpenZeppelin/stellar-contracts`** — *OpenZeppelin Contracts for
Stellar/Soroban*, written in **Rust** (a separate library from the Solidity `@openzeppelin/contracts`).

For a token it provides a **SEP-41 fungible-token base** plus composable extensions —
**mintable, burnable, capped, pausable, upgradeable**, and **access control** — so you don't write the
token from scratch. The suite also includes **access-control / ownable / role** primitives,
**utilities** (e.g. Merkle proofs / signature verification), and **account / governance** modules, and
there is an OpenZeppelin **Soroban/Stellar Contract Wizard** for scaffolding.

Building on the audited OZ base **reduces your audit surface** versus a hand-rolled token. (Don't cite
the Solidity ERC-20 library as the Soroban one.)

## Why these cards (routing rationale)

Library/code discovery → `scout_repos`. Docs/research acceptable.

## Edge / traps

Citing the Solidity `@openzeppelin/contracts`; claiming no Soroban support.
