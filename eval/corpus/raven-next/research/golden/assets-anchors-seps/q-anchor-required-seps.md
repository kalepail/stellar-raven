---
id: q-anchor-required-seps
q: "Which SEPs does a fully compliant Stellar anchor need to implement?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names SEP-1 (stellar.toml discovery) and SEP-10 (authentication).", weight: 4 }
  - { claim: "Names SEP-12 (KYC) and SEP-24 and/or SEP-6 (deposit/withdrawal).", weight: 4 }
  - { claim: "Names SEP-31 (cross-border) and SEP-38 (RFQ/quotes) for the cross-border + pricing flows.", weight: 3 }
should_have:
  - { claim: "Correctly maps each SEP to its role (auth/KYC/deposit/cross-border/quote/discovery).", weight: 3 }
nice_to_have:
  - { claim: "Notes the Anchor Platform implements this SEP stack in one deployment.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber any SEP in the anchor stack (e.g. call KYC SEP-24, or call interactive deposit SEP-31).", weight: 5 }
  - { claim: "Do NOT include unrelated SEPs (e.g. SEP-7 URI, SEP-41 token interface) as required for an anchor.", weight: 2 }
must_cite:
  - "The Learn About Anchors page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/anchors
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "List question with heavy SEP-misnumbering risk. Dossier §5.2, §7.2. Verified against developers.stellar.org 'Learn About Anchors' (lists SEP-6, 10, 12, 24, 31, 38) plus SEP-1 discovery."
---

## Reference answer (gospel)

The anchor SEP stack (developers.stellar.org "Learn About Anchors") [1]:

- **SEP-1** — Stellar Info File (`stellar.toml`): how wallets **discover** the anchor's endpoints/assets.
- **SEP-10** — Stellar Authentication: the wallet signs a challenge to get a session JWT.
- **SEP-12** — KYC API: collect/transmit customer KYC (fields per SEP-9).
- **SEP-24** — Hosted (interactive) Deposit & Withdrawal, and/or **SEP-6** — programmatic
  Deposit & Withdrawal.
- **SEP-31** — Cross-Border Payments API: anchor-to-anchor sends.
- **SEP-38** — Anchor RFQ API: price quotes between assets.

So a compliant anchor implements **SEP-1 + SEP-10 + SEP-12 + (SEP-6 and/or SEP-24) + SEP-31 +
SEP-38** [1]. SDF's **Anchor Platform** ships this SEP stack (SEP-6/10/12/24/31/38) in a single
deployment. SEP-7 (signing URI) and SEP-41 (Soroban token interface) are **not** part of the anchor
stack.

Source: [1] developers.stellar.org "Learn About Anchors".

## Why these cards (routing rationale)

Anchor SEP stack → `stellar_docs_mcp`.

## Edge / traps

Every SEP number must be correct; mapping the wrong role to a SEP fails the gate.
