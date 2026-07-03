---
id: q-edge-fresh-latest-protocol-version
q: "What is the very latest Stellar protocol version live on Pubnet right now?"
category: edge-governance
subcategory: freshness-staleness
axes: [edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true   # answerable, but must flag staleness rather than assert confidently

must_have:
  - { claim: "Gives the current protocol version from a dated/sourced lookup AND flags it may be stale (protocol versions advance via validator upgrade votes).", weight: 5 }
  - { claim: "Does NOT assert a specific protocol version as definitively current without a dated source or staleness caveat.", weight: 4 }
should_have:
  - { claim: "Points the user to an authoritative live source (e.g. dashboard / stellar-core release / docs) to confirm the current version.", weight: 3 }
nice_to_have:
  - { claim: "Notes how protocol upgrades are activated (validator voting on a ledger).", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a protocol version number as the definitive current version with no source and no staleness flag.", weight: 5 }
must_cite:
  - "Cite a dated source for the version (docs / stellar-core release / network dashboard)."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-core/releases
  - https://stellar.expert/explorer/public
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Freshness honesty: 'very latest protocol version' is moving (protocol-release horizon). As of 2026-06-22 Mainnet runs Protocol 26 'Yardstick' (activated by validator vote 2026-05-06 — NOT the uncorroborated dossier '2026-06-17 / ledger 63,073,409' figure, which primary stellar.org does not confirm; see q-protocol-current-mainnet-version / q-protocol-version-history-list). Protocol 27 'Zipper' reached Testnet 2026-06-18, Mainnet vote pending. Gate on the BEHAVIOR (name the current mainnet protocol + cite a dated primary source + flag staleness), not a frozen ledger number."
---

## Reference answer (gospel)

**Freshness-honesty case — gate the behavior, not the number.** Raven should give the current version
from a **dated/sourced lookup AND flag that it may be stale** (protocol versions advance via validator
upgrade votes), pointing to an authoritative live source (stellar-core
[releases](https://github.com/stellar/stellar-core/releases) / a network dashboard like
[stellar.expert](https://stellar.expert/explorer/public)). As of **2026-06-22**, Mainnet runs
**Protocol 26 "Yardstick"** (activated by the validator vote on **2026-05-06**), with **Protocol 27
"Zipper" (CAP-0071)** queued — it reached **Testnet 2026-06-18**, Mainnet vote pending. The rubric must
**not** hard-gate on a specific number or ledger — it goes stale on the next vote; the gate is the
**dated + staleness-flagged** behavior (name the current mainnet protocol, cite a dated primary source,
flag staleness). Raven must not assert a version as definitively current with no source/caveat.

## Why these cards (routing rationale)

`stellar_docs_mcp` / `scout_research` surface the current version; the rubric rewards pairing it with a
dated source and a staleness caveat, not a bare number.

## Edge / traps

Wrong answer: asserting a version as definitively current with no source/caveat (goes stale immediately).
