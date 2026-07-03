---
id: q-asset-stablecoin-issuers-discovery
q: "Which projects or companies issue stablecoins on Stellar?"
category: assets-anchors-seps
subcategory: stablecoins
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_directory, lumenloop_find_content_by_entity, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Names Circle (USDC and EURC) as the dominant stablecoin issuer on Stellar.", weight: 4 }
should_have:
  - { claim: "Surfaces additional anchor-operated / fiat-pegged issuers from the directory rather than only naming Circle.", weight: 3 }
  - { claim: "Frames the answer as a discovery over the project directory, attributing issuers to specific entities.", weight: 2 }
nice_to_have:
  - { claim: "Flags that the issuer set changes over time (freshness caveat).", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate stablecoin issuers or invent token tickers not present in the corpus.", weight: 5 }
  - { claim: "Do NOT attribute USDC/EURC to a non-Circle issuer.", weight: 3 }
must_cite:
  - "The Stellar Light / Scout project directory or a stellar.org stablecoin page."
must_not_use_tier: []

pass_threshold: 0.65
weight_profile: standard

sources:
  - https://stellar.org/products-and-tools/circle-usdc-eurc
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Discovery → scout_projects. Freshness-sensitive (issuer set evolves). Dossier §4.4. The dominant, verifiable anchor is Circle (USDC + EURC); the broader issuer set must be grounded in the live directory, not invented. Verified 2026-06-29: stellar.org/products-and-tools/circle-usdc-eurc resolves and confirms Circle issues both USDC and EURC on Stellar."
---

## Reference answer (gospel)

A directory-discovery question: route to the **ecosystem project directory** (Scout / Lumenloop) and
ground the list, rather than answering from memory. The verifiable anchor of the answer is
**Circle**, which issues both **USDC** (USD-backed) and **EURC** (euro-backed) on Stellar — the
dominant stablecoin issuer on the network [1]. A good answer:

- Names **Circle (USDC + EURC)** correctly, and attributes USDC/EURC to **Circle, not** Tether /
  Paxos / SDF [1].
- Surfaces **additional anchor-operated / fiat-pegged issuers from the directory** (rather than
  naming only Circle), attributing each token to a specific entity.
- **Flags freshness** — the issuer set evolves, so this is a point-in-time directory snapshot.

The worst failure is **fabricating issuers or token tickers** not present in the corpus; the
directory must ground any names beyond Circle's USDC/EURC.

Source: [1] stellar.org "USDC and EURC on Stellar" (Circle); the Scout / Lumenloop project directory.

## Why these cards (routing rationale)

"Which projects issue X" is directory discovery → `scout_projects` (or Lumenloop directory). Not a docs lookup.

## Edge / traps

Fabricating issuers is the worst failure; the directory should ground the list.
