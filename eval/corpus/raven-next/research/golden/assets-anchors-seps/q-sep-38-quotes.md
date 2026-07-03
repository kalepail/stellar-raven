---
id: q-sep-38-quotes
q: "Which SEP provides a quote/RFQ API for exchanging between assets at an anchor?"
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
  - { claim: "Names SEP-38 as the Anchor RFQ / quote API for pricing between assets.", weight: 5 }
should_have:
  - { claim: "Quotes are fetched before a SEP-6/SEP-24/SEP-31 deposit, withdrawal, or send to present a price.", weight: 3 }
nice_to_have:
  - { claim: "Notes it supports both indicative and firm/committed quotes.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber the quote/RFQ standard (it is SEP-38, not SEP-31 or SEP-24).", weight: 5 }
must_cite:
  - "SEP-0038 on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0038.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §7.1, Q17. SEP-38 'Anchor RFQ API', Status Draft (ecosystem README)."
---

## Reference answer (gospel)

- **SEP-38 — "Anchor RFQ API"** is the quote/RFQ standard for pricing an exchange between two assets at an anchor (e.g. fiat↔stablecoin or asset↔asset) [1].
- It exposes `GET /info`, `GET /prices`, `GET /price` (indicative quotes) and `POST /quote` (a **firm/committed** quote with an `id` and `expires_at`) [1].
- Quotes are fetched **before** a SEP-6 / SEP-24 / SEP-31 deposit, withdrawal, or send to present and lock a price [1]. Status: **Draft** (still widely adopted via the Anchor Platform).

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + SEP repo. No general-web/deep-research for a single-SEP fact.

## Edge / traps

Misnumbering the quote/RFQ standard — it is **SEP-38**, not SEP-31 (cross-border) or SEP-24 (hosted deposit/withdraw).
