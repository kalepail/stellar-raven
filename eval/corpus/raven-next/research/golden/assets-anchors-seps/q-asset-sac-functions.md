---
id: q-asset-sac-functions
q: "What functions does the Stellar Asset Contract expose, and which are restricted to the asset issuer/admin?"
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
  - { claim: "Lists core token functions like transfer, allowance/approve, and burn that any holder can use.", weight: 4 }
  - { claim: "Identifies admin-only (issuer) functions: mint, clawback, set_admin, set_authorized.", weight: 4 }
should_have:
  - { claim: "Notes the issuer is automatically granted admin over the asset's SAC.", weight: 2 }
nice_to_have:
  - { claim: "Notes the interface matches the SEP-41 token interface.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim any caller can mint or clawback (these are issuer/admin-gated).", weight: 4 }
  - { claim: "Do NOT invent functions that are not part of the token interface.", weight: 2 }
must_cite:
  - "The Stellar Asset Contract page on developers.stellar.org or SEP-0041."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §2.2. Function surface verified against the SAC page: SEP-41 unprivileged set + SAC-specific admin set."
---

## Reference answer (gospel)

The SAC implements **CAP-46-6** and the **SEP-41** token interface [1]:

- **Unprivileged (any holder, authorized by the address spending/allowing balance)** [1]: `transfer` / `transfer_from`, `approve` / `allowance`, `balance`, `burn` / `burn_from`, plus metadata getters `name` / `symbol` / `decimals`, and `trust` (create a trustline for a G-address).
- **Admin-only (issuer/administrator)** [1]: `mint`, `clawback`, `set_admin` (and `admin`), `set_authorized` (and `authorized`).
- After SAC deployment the **asset's issuer is automatically the admin**, so only the issuer can mint, claw back, or authorize/deauthorize [1].

## Why these cards (routing rationale)

Contract interface detail → `stellar_docs_mcp`. No general-web/deep-research.

## Edge / traps

Claiming any caller can `mint`/`clawback` (these are admin/issuer-gated), or inventing functions outside the token interface.
