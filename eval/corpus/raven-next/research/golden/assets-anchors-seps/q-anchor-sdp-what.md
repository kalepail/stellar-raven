---
id: q-anchor-sdp-what
q: "What is the Stellar Disbursement Platform and how many payments can it send per batch?"
category: assets-anchors-seps
subcategory: disbursement
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "SDP is SDF's open-source tool for organizations to make bulk payments to many recipients over Stellar.", weight: 5 }
  - { claim: "It can send up to 10,000 payments in a single batch (upload a receiver list).", weight: 4 }
should_have:
  - { claim: "Use cases include payroll, aid/humanitarian disbursements, and government payouts.", weight: 2 }
  - { claim: "Recipient KYC is collected via SEP-12 and payments use SEP-31/SEP-24 anchor rails.", weight: 2 }
nice_to_have:
  - { claim: "Notes the org never has to script raw transactions directly.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a wrong batch ceiling (e.g. 1,000 or 100,000) as the canonical SDP limit.", weight: 4 }
  - { claim: "Do NOT confuse SDP with the Anchor Platform or describe it as a wallet.", weight: 3 }
must_cite:
  - "The SDP page on stellar.org or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/products-and-tools/disbursement-platform
  - https://developers.stellar.org/docs/platforms/stellar-disbursement-platform
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §6. Verified on stellar.org SDP product page: 'up to 10,000 payments' per batch by uploading a receiver list; open-source SDF tool for bulk cross-border payouts."
---

## Reference answer (gospel)

The **Stellar Disbursement Platform (SDP)** is **SDF's open-source tool for organizations to make
bulk payments** to many recipients over Stellar — an easier/faster/cheaper way to send cross-border
payouts at scale [1]. Its headline capability: **send up to 10,000 payments in a single batch** by
uploading a receiver list, rather than scripting raw transactions [1]. Listed use cases include
**global payroll, cash/humanitarian assistance, gig-worker payouts, vendor payouts, and government
payouts** [1][2]. Recipients complete **KYC via SEP-12** and payments ride **SEP-31 cross-border /
SEP-24 anchor rails**; SDP coordinates the anchor(s), so the org never assembles raw transactions
itself [2]. It is **not** the Anchor Platform (anchor backend) and it is **not** a wallet — it is the
disbursement orchestration layer.

Sources: [1] stellar.org Stellar Disbursement Platform product page; [2] developers.stellar.org SDP
introduction.

## Why these cards (routing rationale)

Product/docs fact → `stellar_docs_mcp`; `scout_repos` acceptable.

## Edge / traps

Wrong batch limit, or conflating SDP with the Anchor Platform.
