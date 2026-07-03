---
id: q-pay-anchor-msb-licensing
q: "Who holds the money-transmitter / MSB license when a wallet uses a Stellar anchor to on/off-ramp fiat — the wallet, the anchor, or Stellar?"
category: compliance-rwa-payments
subcategory: kyc-aml-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null
expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The anchor (a regulated financial institution) carries the licensing / money-transmitter / MSB obligation for the fiat leg; the Stellar network/SDF does not.", weight: 5 }
should_have:
  - { claim: "The wallet/app may also have its own MSB/money-transmitter obligations depending on custody and jurisdiction.", weight: 3 }
  - { claim: "Anchors must map licenses to every jurisdiction in which they onboard customers.", weight: 2 }
nice_to_have:
  - { claim: "Notes the Anchor Platform is a reference implementation but does not transfer the license to Stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar / the protocol holds the money-transmitter license or assumes the AML obligation.", weight: 5 }
  - { claim: "Do NOT state a definitive licensing requirement for a specific jurisdiction as settled legal advice.", weight: 3 }
must_cite:
  - "developers.stellar.org anchor docs; reputable regulatory reference where relevant."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/anchors
  - https://stellar.org/learn/anchor-basics
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Anchor responsibility model is first-party (anchors are regulated financial institutions; the protocol/SDF is not a licensee). Confidence raised draft->high on the durable framing; specific jurisdictional requirements are not asserted. Trap: licensing on the protocol."
---

## Reference answer (gospel)

- The **anchor — a regulated financial institution** — carries the **money-transmitter / MSB licensing**
  obligation for the fiat leg; the **Stellar network / SDF does not** hold a money-transmitter license or
  assume the AML obligation [1][2].
- The **wallet/app** may **also** have its own MSB/money-transmitter obligations depending on **custody
  and jurisdiction** [1].
- Anchors must **map licenses to every jurisdiction** in which they onboard customers (a legal-perimeter
  question — not settled here as advice for any specific jurisdiction) [1].
- The **Anchor Platform** is a reference implementation; it **does not transfer the license to Stellar**.

Sources: [1] developers.stellar.org Anchors; [2] stellar.org anchor basics.

## Why these cards (routing rationale)

Anchor responsibility model is in Stellar docs → `stellar_docs_mcp`; `scout_research`/`perplexity_search` acceptable for licensing nuance.

## Edge / traps

Trap: assigning the license to Stellar; over-asserting jurisdiction-specific requirements.
