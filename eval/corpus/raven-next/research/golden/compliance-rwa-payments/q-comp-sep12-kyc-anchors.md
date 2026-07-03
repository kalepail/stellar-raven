---
id: q-comp-sep12-kyc-anchors
q: "Which Stellar SEP standardizes how a wallet uploads KYC/customer information to an anchor, and what kind of data does it carry?"
category: compliance-rwa-payments
subcategory: kyc-aml-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names SEP-12 as the KYC / customer-information sharing standard between Stellar clients and anchors.", weight: 5 }
  - { claim: "SEP-12 defines a standard way for clients to upload KYC (and other customer) data to anchors/services (e.g. via the PUT/GET /customer endpoints).", weight: 4 }
should_have:
  - { claim: "SEP-12 is used alongside SEP-6/SEP-24 deposit/withdrawal and SEP-10 authentication.", weight: 3 }
nice_to_have:
  - { claim: "Notes the anchor (not Stellar core) stores and decisions on the KYC data off-chain.", weight: 1 }
must_avoid:
  - { claim: "Do NOT name SEP-8 or SEP-10 as the KYC standard (SEP-8 is regulated assets; SEP-10 is auth).", weight: 5 }
  - { claim: "Do NOT claim KYC data is written on-chain / stored on the Stellar ledger.", weight: 3 }
must_cite:
  - "The SEP-12 spec (stellar-protocol GitHub) or developers.stellar.org KYC/SEP-12 docs."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Canonical. Verified vs SEP-0012 ('KYC API'): 'a standard way for stellar clients to upload KYC (or other) information to anchors and other services' via GET/PUT /customer (+ DELETE, /customer/files). Requires SEP-10 (or SEP-45) auth on all endpoints. Trap: confusing SEP-12 with SEP-8/SEP-10."
---

## Reference answer (gospel)

- **SEP-12 (the "KYC API")** is the standard way Stellar clients **upload KYC / customer information to
  anchors and other services** [1].
- It carries customer identity data (name, address, ID/document fields, etc.) via the **`PUT /customer`
  and `GET /customer`** endpoints (plus `DELETE /customer` and binary `/customer/files`), with the schema
  defined in SEP-12 / SEP-9 fields [1].
- It is used **alongside SEP-6/SEP-24** (deposit/withdrawal) and requires **SEP-10 (or SEP-45)
  authentication** on all its endpoints [1].
- The **anchor stores and decisions on the KYC data off-chain** — KYC data is **not written to the Stellar
  ledger** [1].

Source: [1] SEP-0012 (KYC API).

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` primary; `scout_research` acceptable. No general-web edge needed.

## Edge / traps

Trap is SEP misnumbering — SEP-12 is KYC, not SEP-8 (regulated assets) or SEP-10 (auth).
