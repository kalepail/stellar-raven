---
id: q-soroban-sac-vs-custom-token
q: "Should I launch a token as a Stellar Asset Contract or write a custom SEP-41 contract token? What are the tradeoffs?"
category: soroban
subcategory: sac
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Both expose the SEP-41 interface; a SAC is the built-in, audited bridge for a classic asset, while a custom contract token is hand-written Rust for programmable logic.", weight: 5 }
  - { claim: "Choose SAC for a standard asset (simplicity, classic-asset interop, no custom code/audit); choose a custom SEP-41 token when you need extra logic (fee-on-transfer, hooks, vesting, complex compliance).", weight: 4 }
should_have:
  - { claim: "A SAC inherits classic-asset features (issuer auth flags, clawback, trustlines); a custom token re-implements whatever it needs.", weight: 3 }
  - { claim: "Custom tokens carry their own audit burden; OpenZeppelin's SEP-41 base reduces it.", weight: 2 }
nice_to_have:
  - { claim: "Notes regulated/RWA cases may prefer an ERC-3643-style contract token over a plain SAC.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim SAC and custom tokens are incompatible / use different non-interoperable interfaces (both speak SEP-41).", weight: 3 }
  - { claim: "Do NOT recommend always writing a custom token (SAC is the default for standard assets).", weight: 2 }
must_cite:
  - "The developers.stellar.org tokens / SAC vs contract-token comparison."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
  - https://developers.stellar.org/docs/tokens/token-interface
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Comparison; trap is claiming incompatibility or always-custom. Verified: SAC is the built-in CAP-46-6/SEP-41 wrapper for classic assets; custom tokens also implement SEP-41; choose by whether you need programmable logic."
---

## Reference answer (gospel)

**Both expose the same SEP-41 token interface**, so they are interoperable — the choice is about
*who writes the logic*:

- **Stellar Asset Contract (SAC):** the **built-in, audited** contract that wraps a **classic Stellar
  asset** (issuer `G…` + code) into a SEP-41 token. It inherits classic-asset behavior — **issuer auth
  flags** (auth required/revocable, clawback, immutable), **trustlines**, and clawback — with **no
  custom Rust code and no separate audit**. This is the **default for a standard asset**.
- **Custom SEP-41 contract token:** hand-written Rust implementing SEP-41, for when you need
  **programmable logic** the SAC can't express — fee-on-transfer, transfer hooks, vesting, or complex
  compliance. It carries its **own audit burden**; an **OpenZeppelin SEP-41 base** reduces it.

So: **SAC for standard assets** (simplicity + classic interop), **custom token when you need extra
logic**. Regulated/RWA cases may prefer an **ERC-3643-style** contract token over a plain SAC. Don't
claim the two use incompatible interfaces (both speak SEP-41), and don't default to "always custom."

## Why these cards (routing rationale)

Token-design comparison → `stellar_docs_mcp`. `scout_research`/`scout_repos` acceptable.

## Edge / traps

Claiming non-interoperable interfaces; defaulting to custom token unnecessarily.
