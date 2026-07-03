---
id: q-pay-travel-rule-aid-flows
q: "Who is responsible for FATF Travel Rule / KYC compliance in a Stellar-based humanitarian aid disbursement — Stellar, the SDP, or the aid org?"
category: compliance-rwa-payments
subcategory: remittance-disbursement
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null
expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "The originating/participating organization (e.g. the humanitarian org or the licensed anchor), not the Stellar network or SDF, holds the Travel Rule / KYC compliance obligation.", weight: 5 }
should_have:
  - { claim: "SDF explicitly disclaims control over fees and operations of independent organizations participating in aid flows.", weight: 3 }
  - { claim: "KYC in aid contexts is handled off-chain and is contextual/proportionate to the recipient population.", weight: 2 }
nice_to_have:
  - { claim: "Notes the Stellar protocol provides the rails (SDP, anchors) but not the compliance/licensing.", weight: 2 }
must_avoid:
  - { claim: "Do NOT claim the Stellar protocol/SDF itself enforces the Travel Rule or performs recipient KYC.", weight: 5 }
  - { claim: "Do NOT state a regulatory conclusion (e.g. 'aid flows are exempt from Travel Rule') as settled fact.", weight: 3 }
must_cite:
  - "SDF aid/SDP docs or policy materials; reputable Travel-Rule reference where relevant."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellar.org/use-cases/stellar-for-aid
  - https://developers.stellar.org/docs/learn/fundamentals/anchors
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed. SDF-published responsibility framing: the originating org / licensed anchor holds Travel Rule/KYC; SDF disclaims control over independent orgs' fees in aid flows. Don't state a regulatory exemption as settled. Trap: putting the compliance duty on the protocol."
---

## Reference answer (gospel)

- The **originating/participating organization** (the humanitarian org, or the **licensed anchor**) — **not
  the Stellar network or SDF** — holds the **FATF Travel Rule / KYC** obligation [1][2].
- **SDF explicitly disclaims control** over the fees and operations of **independent organizations**
  participating in aid flows [1].
- KYC in aid contexts is handled **off-chain** and is **contextual/proportionate** to the recipient
  population [1].
- The **Stellar protocol provides the rails** (SDP, anchors) but **not the compliance/licensing**. Don't
  state a regulatory conclusion (e.g. "aid flows are exempt from the Travel Rule") as settled fact.

Sources: [1] stellar.org Stellar for Aid; [2] developers.stellar.org Anchors.

## Why these cards (routing rationale)

Responsibility framing is in SDF aid/policy materials → `scout_research`; `stellar_docs_mcp`/`perplexity_search` acceptable for Travel-Rule context.

## Edge / traps

Trap: assigning Travel-Rule duty to the protocol; stating an exemption as settled.
