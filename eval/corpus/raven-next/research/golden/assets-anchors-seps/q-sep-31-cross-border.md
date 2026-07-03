---
id: q-sep-31-cross-border
q: "What does SEP-31 do and how is it different from SEP-24?"
category: assets-anchors-seps
subcategory: seps-anchors
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
  - { claim: "Names SEP-31 as the Cross-Border Payments API — a sending anchor to a receiving anchor (anchor-to-anchor) flow.", weight: 5 }
  - { claim: "Contrasts SEP-24 as wallet↔anchor interactive (hosted) deposit/withdrawal for an end user, not anchor-to-anchor.", weight: 4 }
should_have:
  - { claim: "In SEP-31 the sending anchor collects sender KYC and supplies receiver info; there is no end-user hosted webview.", weight: 3 }
  - { claim: "Both can use SEP-38 for quotes and SEP-10 for auth.", weight: 2 }
nice_to_have:
  - { claim: "Notes SEP-31 underpins remittance/disbursement corridors (e.g. via SDP).", weight: 1 }
must_avoid:
  - { claim: "Do NOT call SEP-31 the wallet/anchor interactive deposit-withdraw standard (that is SEP-24).", weight: 5 }
  - { claim: "Do NOT misnumber either SEP.", weight: 4 }
must_cite:
  - "SEP-0031 (and SEP-0024) on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Comparison; complements the exemplar (SEP-6 vs 24) with SEP-31 vs 24. Dossier §7.1, Q16. Verified: SEP-0031 'Cross-Border Payments API' Active; SEP-0024 'Hosted Deposit and Withdrawal' Active."
---

## Reference answer (gospel)

**SEP-31** is the **Cross-Border Payments API** (Status: Active): an **anchor-to-anchor** rail. A
**sending anchor** (which has already KYC'd the sender) pushes a payment to a **receiving anchor**
that pays out to the end recipient — there is **no end-user-facing hosted UI**; the sending anchor
supplies sender KYC and receiver details programmatically [1]. **SEP-24** ("Hosted Deposit and
Withdrawal", Active) is fundamentally different: it is a **wallet ↔ anchor interactive** flow where
the anchor serves a hosted **webview** that the end user drives to deposit/withdraw and complete
KYC [2]. So SEP-31 = business-to-business remittance corridors; SEP-24 = consumer on/off-ramp.
Both typically use **SEP-10** for auth and **SEP-38** for quotes; SEP-31 underpins remittance and
disbursement corridors (e.g. via the Stellar Disbursement Platform).

Sources: [1] stellar-protocol `ecosystem/sep-0031.md` (Cross-Border Payments API, Active);
[2] `ecosystem/sep-0024.md` (Hosted Deposit and Withdrawal, Active).

## Why these cards (routing rationale)

Spec comparison → `stellar_docs_mcp` + SEP repo.

## Edge / traps

The signature trap: calling SEP-31 the interactive wallet/anchor standard (that is SEP-24).
