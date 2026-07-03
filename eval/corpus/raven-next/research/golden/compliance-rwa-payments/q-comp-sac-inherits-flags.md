---
id: q-comp-sac-inherits-flags
q: "If a regulated, clawback-enabled classic asset is used through the Stellar Asset Contract on Soroban, does it keep its authorization-flag and clawback semantics?"
category: compliance-rwa-payments
subcategory: auth-flags-clawback
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Stellar Asset Contract (SAC) is the contract interface that lets contracts/users interact with a classic Stellar asset as a Soroban token.", weight: 5 }
  - { claim: "The SAC inherits the underlying native asset's authorization flags, so a clawback-enabled / auth-required asset retains those semantics when used via the SAC.", weight: 5 }
should_have:
  - { claim: "The issuer's compliance controls (authorize, clawback) still apply to balances held/moved through the SAC.", weight: 3 }
nice_to_have:
  - { claim: "Notes this lets regulated assets bridge into Soroban DeFi without losing issuer control.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim wrapping an asset in the SAC strips/bypasses its authorization flags or clawback ability.", weight: 5 }
  - { claim: "Do NOT confuse the SAC with a generic ERC-20-style token that has no issuer authorization.", weight: 3 }
must_cite:
  - "developers.stellar.org Stellar Asset Contract (SAC) docs."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified vs SAC docs: 'Classic trustline semantics will be followed'; transfers succeed only if the trustline has AUTHORIZED_FLAG; clawback only works if the trustline has TRUSTLINE_CLAWBACK_ENABLED_FLAG; the asset issuer keeps administrative permissions. Confidence raised draft->high. Trap: claiming the SAC bypasses issuer controls."
---

## Reference answer (gospel)

- **Yes — the SAC preserves the classic asset's authorization-flag and clawback semantics.** The Stellar
  Asset Contract is the built-in contract interface that lets contracts/users interact with a classic
  Stellar asset as a Soroban token; each asset has a reserved SAC instance [1].
- The docs state **"classic trustline semantics will be followed"**: transfers **only succeed if the
  trustline has the authorized flag set**, and a balance **can only be clawed back if the trustline has
  `TRUSTLINE_CLAWBACK_ENABLED_FLAG`** [1].
- The **asset issuer retains administrative permissions** through the SAC, so authorize/clawback controls
  set on the classic asset still apply to balances held/moved via the SAC [1].
- This lets regulated assets bridge into Soroban DeFi **without losing issuer control** — wrapping does
  **not** strip the flags, and the SAC is **not** a generic ERC-20-style token with no issuer
  authorization [1].

Source: [1] developers.stellar.org Stellar Asset Contract (SAC).

## Why these cards (routing rationale)

SAC/asset-control fact → `stellar_docs_mcp`; `scout_research` acceptable.

## Edge / traps

Trap: asserting SAC wrapping defeats authorization flags/clawback.
