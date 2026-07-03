---
id: q-asset-sac-usdc-soroban
q: "Can a Soroban smart contract move USDC, and does it need a separate 'USDC-on-Soroban' token to do it?"
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
  - { claim: "Yes — a Soroban contract calls into USDC's reserved Stellar Asset Contract (SAC) by contract ID.", weight: 5 }
  - { claim: "No separate/wrapped 'USDC-on-Soroban' token is needed; the SAC is the same classic USDC asset.", weight: 4 }
should_have:
  - { claim: "The underlying movement still uses USDC's classic trustline ledger entry.", weight: 2 }
nice_to_have:
  - { claim: "Notes every classic asset has a deterministic, protocol-reserved SAC contract ID.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim USDC must be bridged or re-issued as a new Soroban token to be used in a contract.", weight: 5 }
must_cite:
  - "The Stellar Asset Contract page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "SAC↔stablecoin interop. Dossier §2.5. Verified: every Stellar asset has a reserved contract address the SAC can be deployed to; the SAC is the same classic asset exposed to Soroban (developers.stellar.org SAC page)."
---

## Reference answer (gospel)

**Yes — and no separate token is needed.** A Soroban contract moves USDC by calling into USDC's
**Stellar Asset Contract (SAC)** by its contract ID; the SAC is the protocol-reserved on-chain
interface to the **same classic USDC asset**, not a wrapped or re-issued token [1]. Every Stellar
asset has a **reserved contract address** the SAC can be deployed to, so there is no
"USDC-on-Soroban" to bridge or keep in sync — Soroban and classic share one source of truth [1].
Under the hood, the SAC moves balances via USDC's classic **trustline** ledger entries (contract-to-
contract movements use contract-data entries), and Circle remains the issuer/admin (so mint and
clawback stay issuer-only) [1].

Source: [1] developers.stellar.org Stellar Asset Contract page.

## Why these cards (routing rationale)

SAC interop fact → `stellar_docs_mcp`.

## Edge / traps

Claiming a bridge/wrapped token is required — it is not.
