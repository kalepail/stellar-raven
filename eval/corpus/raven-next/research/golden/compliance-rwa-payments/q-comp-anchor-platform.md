---
id: q-comp-anchor-platform
q: "What is the Stellar Anchor Platform and how does it help a fintech meet compliance requirements?"
category: compliance-rwa-payments
subcategory: kyc-aml-anchors
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
  - { claim: "The Anchor Platform is SDF's open-source reference implementation for running an anchor that implements the SEP standards (SEP-10 auth, SEP-12 KYC, SEP-24/SEP-6 deposit/withdrawal, SEP-31).", weight: 5 }
should_have:
  - { claim: "It lets a fintech/wallet/custodian plug their own compliance/KYC/business logic behind a standardized SEP interface.", weight: 3 }
  - { claim: "It does not itself hold the anchor's regulatory license — the operator remains the regulated entity.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes the Anchor Platform from the Stellar Disbursement Platform.", weight: 2 }
must_avoid:
  - { claim: "Do NOT describe the Anchor Platform as a stablecoin issuer, a DeFi protocol, or the Disbursement Platform.", weight: 4 }
  - { claim: "Do NOT claim it removes the operator's KYC/AML/licensing responsibility.", weight: 3 }
must_cite:
  - "developers.stellar.org / stellar.org Anchor Platform docs."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://stellar.org/products-and-tools/anchor-platform
  - https://developers.stellar.org/docs/learn/fundamentals/anchors
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "First-party product/how-to → stellar_docs. Trap: confusing with SDP or implying it carries the license."
---

## Reference answer (gospel)

- The **Anchor Platform** is SDF's **open-source reference implementation** for running an anchor that
  implements the SEP standards — **SEP-10** (auth), **SEP-12** (KYC), **SEP-24/SEP-6**
  (deposit/withdrawal), **SEP-31** (cross-border) [1].
- It lets a fintech/wallet/custodian **plug their own KYC/compliance/business logic** behind a
  standardized SEP interface, so they don't reimplement the protocol plumbing [1].
- It **does not hold the anchor's regulatory license** — the **operator remains the regulated entity** and
  keeps its KYC/AML/licensing responsibility [2].
- It is distinct from the **Stellar Disbursement Platform** (bulk payouts) and is **not** a stablecoin
  issuer or DeFi protocol.

Sources: [1] stellar.org Anchor Platform; [2] developers.stellar.org Anchors.

## Why these cards (routing rationale)

Anchor Platform is a first-party SDF product → `stellar_docs_mcp`; `scout_research` acceptable.

## Edge / traps

Trap: confusing it with the SDP; implying it transfers the regulatory burden.
