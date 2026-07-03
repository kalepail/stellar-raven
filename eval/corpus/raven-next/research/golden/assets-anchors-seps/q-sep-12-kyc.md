---
id: q-sep-12-kyc
q: "Which SEP defines how a wallet submits KYC data to an anchor, and which SEP provides the standard field names?"
category: assets-anchors-seps
subcategory: seps-anchors
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
  - { claim: "Names SEP-12 as the KYC API (POST /customer, status callbacks) for sending customer PII/AML data to an anchor.", weight: 5 }
  - { claim: "Names SEP-9 as the Standard KYC Fields data dictionary that SEP-12 uses.", weight: 3 }
should_have:
  - { claim: "The anchor verifies the data and returns a status; SEP-12 is used by SEP-6/24/31 flows.", weight: 2 }
nice_to_have:
  - { claim: "Notes SEP-10 auth must precede SEP-12 KYC submission.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber KYC (it is SEP-12, not SEP-9 alone or SEP-24).", weight: 5 }
  - { claim: "Do NOT swap SEP-9 and SEP-12 roles (SEP-9 = fields dictionary, SEP-12 = the API).", weight: 3 }
must_cite:
  - "SEP-0012 (and SEP-0009) on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0009.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §7.1, Q15. SEP-9 vs SEP-12 distinction. Both Active (ecosystem README): SEP-12 'KYC API', SEP-9 'Standard KYC Fields'."
---

## Reference answer (gospel)

- **SEP-12 — "KYC API" (Active)** is the standard for a wallet to submit a customer's PII/AML data to an anchor: `PUT /customer`, `GET /customer` (status), `DELETE /customer`, plus file upload — the anchor verifies and returns a status (e.g. `ACCEPTED`/`PROCESSING`/`NEEDS_INFO`/`REJECTED`) [1].
- **SEP-9 — "Standard KYC Fields" (Active)** is the **data dictionary** of standard field names (e.g. `first_name`, `email_address`, `id_type`) that SEP-12 (and SEP-6/24/31) reference — it is the field vocabulary, not an API [2].
- SEP-12 is used by the SEP-6/24/31 deposit/withdraw/cross-border flows, and **SEP-10 auth must precede** the SEP-12 submission [1].

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + SEP repo. General-web/deep-research is a miss for an exact SEP mapping.

## Edge / traps

Swapping the roles: **SEP-9 = the fields dictionary, SEP-12 = the API**. Calling KYC "SEP-9 alone" or "SEP-24" is the misnumbering trap.
