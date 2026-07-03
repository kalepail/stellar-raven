---
id: q-anchor-sdp-vs-anchor-platform
q: "What's the difference between the Stellar Disbursement Platform, the Anchor Platform, and the Wallet SDK?"
category: assets-anchors-seps
subcategory: disbursement
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
  - { claim: "Anchor Platform = anchor-operator backend (Java) implementing the anchor SEP endpoints (SEP-6/10/12/24/31/38).", weight: 4 }
  - { claim: "SDP = disbursement-org tool for sending bulk payments (up to 10,000/batch) to many recipients.", weight: 4 }
  - { claim: "Wallet SDK = wallet-developer (TypeScript) library wrapping client-side SEP flows (SEP-10/12/24/31/38).", weight: 4 }
should_have:
  - { claim: "All three are SDF-maintained; each targets a different role (anchor / disbursement org / wallet).", weight: 3 }
nice_to_have:
  - { claim: "Notes SDP itself relies on anchor SEP rails (SEP-12 KYC, SEP-31 cross-border).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim SDP and the Anchor Platform are the same product, or swap their roles.", weight: 4 }
  - { claim: "Do NOT misnumber the SEPs each component covers.", weight: 3 }
must_cite:
  - "developers.stellar.org pages for the Anchor Platform, SDP, and Wallet SDK."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/platforms/anchor-platform
  - https://developers.stellar.org/docs/platforms/stellar-disbursement-platform
  - https://stellar.org/products-and-tools/wallet-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Three-way comparison. Dossier §6.4 table. All three SDF-maintained; roles verified."
---

## Reference answer (gospel)

All three are **SDF-maintained**, each for a different role [1][2][3]:

- **Anchor Platform** — the **anchor operator's** backend (Java) that implements the anchor SEP endpoints (**SEP-1/6/10/12/24/31/38**). Run it to *be* an anchor [1].
- **Stellar Disbursement Platform (SDP)** — a tool for a **disbursement organization** to send **bulk payments (up to 10,000 per batch)** to many recipients (payroll, aid, payouts) [2]. It *relies on* anchor SEP rails (SEP-12 KYC, SEP-31 cross-border) rather than replacing them.
- **Wallet SDK** — a **wallet developer's** (TypeScript) client library wrapping the client-side SEP flows (**SEP-10/12/24/31/38**) [3].

So: Anchor Platform = anchor backend; SDP = bulk-payout app; Wallet SDK = wallet client library.

## Why these cards (routing rationale)

Product comparison → `stellar_docs_mcp`. No general-web/deep-research.

## Edge / traps

Swapping the roles of SDP vs the Anchor Platform (they are not the same product), or misnumbering the SEPs each covers.
