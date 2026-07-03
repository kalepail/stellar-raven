---
id: q-comp-sep6-vs-sep12-roles
q: "In a SEP-6 programmatic deposit, which SEP actually carries the customer's KYC data — SEP-6 itself or another SEP?"
category: compliance-rwa-payments
subcategory: kyc-aml-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null
expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "SEP-12 (not SEP-6) carries the KYC/customer data upload; SEP-6 is the programmatic deposit/withdrawal API that relies on SEP-12 for KYC.", weight: 5 }
should_have:
  - { claim: "In SEP-6 (programmatic, no hosted UI) the wallet collects and submits KYC via SEP-12; in SEP-24 the anchor's hosted flow collects it.", weight: 3 }
  - { claim: "Both authenticate via SEP-10 first.", weight: 2 }
nice_to_have:
  - { claim: "Notes SEP-8 may additionally gate the transaction for regulated assets.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim SEP-6 itself defines the KYC schema, or that SEP-8/SEP-10 carries KYC.", weight: 5 }
must_cite:
  - "SEP-6 and SEP-12 specs / developers.stellar.org docs."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified: SEP-12 is the 'KYC API' (carries the customer data); SEP-6 is the programmatic Deposit & Withdrawal API and relies on SEP-12 for KYC, with SEP-10 auth first. Trap: thinking SEP-6 carries the KYC schema itself."
---

## Reference answer (gospel)

- **SEP-12 (the "KYC API") carries the customer's KYC data — not SEP-6.** SEP-6 is the **programmatic
  Deposit & Withdrawal API**; for any KYC it needs, the wallet uploads the data via SEP-12's
  `PUT /customer` [1][2].
- In **SEP-6** (programmatic, no hosted UI) the **wallet collects and submits KYC via SEP-12**; in
  **SEP-24** the anchor's **hosted interactive flow** collects it instead [2].
- Both flows **authenticate via SEP-10 first** [1].
- For a regulated asset, **SEP-8** may additionally gate the transaction via the issuer's approval server.

Sources: [1] SEP-0012; [2] SEP-0006.

## Why these cards (routing rationale)

SEP-role spec distinction → `stellar_docs_mcp`; `scout_research` acceptable.

## Edge / traps

Trap: attributing the KYC schema to SEP-6 instead of SEP-12.
