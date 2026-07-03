---
id: q-asset-two-account-issuer
q: "What's the recommended account structure for issuing a custom asset on Stellar, and why?"
category: assets-anchors-seps
subcategory: classic-assets
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Recommends two accounts: a separate issuing account and a distribution account.", weight: 5 }
  - { claim: "The issuing account holds/creates supply and manages auth flags; the distribution account is public-facing and sends to users.", weight: 4 }
should_have:
  - { claim: "Rationale is blast-radius / security: a compromised distribution (hot) account only risks the float, not total supply.", weight: 3 }
  - { claim: "Issuing account should be kept locked down / cold storage.", weight: 2 }
nice_to_have:
  - { claim: "Notes assets are defined by the (asset_code, issuer) pair and holders need a trustline.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim a single account is the recommended/canonical issuing pattern for production assets.", weight: 4 }
  - { claim: "Do NOT claim Stellar assets are deployed as ERC-20 / Solidity contracts.", weight: 3 }
must_cite:
  - "An asset-issuance / control-asset-access page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/control-asset-access
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Classic asset model basics. Dossier §1.1, §1.6. 'Best practice is to create two accounts when issuing an asset' (control-asset-access)."
---

## Reference answer (gospel)

- Recommended structure is **two accounts**: a separate **issuing account** and a **distribution account** [1].
- The **issuing account** mints supply (by sending the asset) and manages authorization flags; it should be **locked down / cold storage** and used rarely. The **distribution account** is the public-facing account that sends the asset to users and holds a working float [1].
- Rationale is **blast-radius / segregation of duties**: if the hot distribution account is compromised, only the **float** is at risk, not the total supply, and the issuer retains flag/clawback control [1].
- Assets are defined by the **`(asset_code, issuer)`** pair, and holders need a **trustline**; a single-account setup is acceptable only for testing [1].

## Why these cards (routing rationale)

How-to / best-practice for asset issuance is first-party docs territory → `stellar_docs_mcp`; `scout_research` corroborates. No general-web or deep-research.

## Edge / traps

The trap is recommending a single account (fine only for testnets) or describing Stellar assets as Solidity/ERC-20 contracts.
