---
id: q-asset-trustline-vs-sac
q: "What's the difference between holding a classic Stellar asset via a trustline and the same asset through its Stellar Asset Contract (SAC)?"
category: assets-anchors-seps
subcategory: sac-bridge
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Clarifies the SAC is NOT a separate/new token — it is a protocol-reserved contract that exposes the SAME classic asset to Soroban.", weight: 5 }
  - { claim: "Classic holding uses a trustline ledger entry; the SAC lets Soroban contracts move the asset by contract ID (transfers between contracts use contract data entries).", weight: 4 }
should_have:
  - { claim: "Both share one source of truth (e.g. one USDC), so there is no separate 'USDC-on-Soroban' to keep in sync.", weight: 3 }
  - { claim: "The SAC implements CAP-46-6 and the SEP-41 token interface.", weight: 2 }
nice_to_have:
  - { claim: "Notes the issuer remains admin of the SAC (mint/clawback/set_authorized are issuer-only).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the SAC is a distinct token requiring users to migrate balances or hold two versions of the asset.", weight: 5 }
  - { claim: "Do NOT claim you must redeploy/bridge the asset to use it in Soroban.", weight: 4 }
must_cite:
  - "The Stellar Asset Contract (SAC) page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Required comparison (trustline vs SAC). Dossier §2, §8.1. Verified against developers.stellar.org SAC page."
---

## Reference answer (gospel)

They are **two views of the same asset, not two different tokens.** Holding a classic asset means
your account has a **trustline ledger entry** to `<code:issuer>`; the **Stellar Asset Contract
(SAC)** is a **protocol-reserved contract** that exposes that *same* classic asset to Soroban so
contracts can move it by contract ID [1]. There is **no separate "USDC-on-Soroban"** to migrate to
or hold alongside — one source of truth backs both [1].

- **Classic / trustline:** balances live in trustline entries; payments use classic operations and
  respect issuer auth flags. Each trustline costs a base reserve.
- **SAC:** a Soroban contract calls `transfer`/`balance`/etc. on the asset's SAC by contract ID;
  account balances still resolve to the underlying **trustline**, while contract-to-contract
  movements use **contract-data** entries [1].
- Both share one supply; the SAC implements **CAP-46-6** and the **SEP-41** token interface; the
  **issuer stays admin** (mint/clawback/set_authorized are issuer-only) [1].

You never redeploy, bridge, or wrap the asset to use it in Soroban.

Source: [1] developers.stellar.org Stellar Asset Contract page.

## Why these cards (routing rationale)

SAC/Soroban-bridge concept → `stellar_docs_mcp`; `scout_research` acceptable.

## Edge / traps

The defining trap: treating the SAC as a separate wrapped token rather than the same asset exposed to contracts.
