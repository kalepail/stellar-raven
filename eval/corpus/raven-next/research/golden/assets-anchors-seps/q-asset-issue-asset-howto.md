---
id: q-asset-issue-asset-howto
q: "Walk me through issuing a new custom token on Stellar from scratch."
category: assets-anchors-seps
subcategory: classic-assets
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "An asset is defined by its code + issuing account; there is no separate 'create asset' transaction — the asset exists once the issuer sends it.", weight: 5 }
  - { claim: "The distribution account must establish a trustline (ChangeTrust) to the issuer, then the issuer sends (payment) the supply to it.", weight: 4 }
should_have:
  - { claim: "Recommends the two-account (issuing + distribution) pattern and setting any needed auth flags first.", weight: 3 }
  - { claim: "Recommends publishing a stellar.toml (SEP-1) so wallets can discover/identify the asset.", weight: 2 }
nice_to_have:
  - { claim: "Notes optionally locking the issuer (AUTH_IMMUTABLE / setting master weight to 0) to cap supply.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe issuing a Stellar asset as deploying a Solidity/ERC-20 contract.", weight: 4 }
  - { claim: "Do NOT claim there is a dedicated 'createAsset' operation on the protocol.", weight: 3 }
must_cite:
  - "An asset-issuance page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/control-asset-access
  - https://developers.stellar.org/docs/tokens/how-to-issue-an-asset
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "End-to-end issuance how-to. Dossier §1."
---

## Reference answer (gospel)

There is **no 'create asset' operation** — a classic asset is defined by its **`(asset_code, issuer account)`** pair and simply comes into existence the first time the issuer pays it out [1][2]. The flow:

1. Create/fund the **issuing account** and a separate **distribution account** (two-account best practice) [1].
2. Optionally set issuer **authorization flags** first (e.g. AUTH_REQUIRED/REVOCABLE, or clawback) — these only apply to trustlines created afterward [1].
3. The **distribution account opens a trustline** to the asset via **`ChangeTrust`** [2].
4. The **issuer sends** (a `Payment`) the desired supply to the distribution account — this is the issuance/mint [2].
5. Publish a **`stellar.toml` (SEP-1)** so wallets can discover and identify the asset [1].
6. Optionally cap supply by locking the issuer (set master weight to 0 / AUTH_IMMUTABLE) [1].

## Why these cards (routing rationale)

Issuance procedure → `stellar_docs_mcp`. No general-web/deep-research.

## Edge / traps

Implying a dedicated `createAsset` operation exists, or framing issuance as deploying a Solidity/ERC-20 contract.
