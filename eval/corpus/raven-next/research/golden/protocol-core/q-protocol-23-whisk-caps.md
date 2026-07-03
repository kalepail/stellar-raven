---
id: q-protocol-23-whisk-caps
q: "What did Stellar Protocol 23 ('Whisk') introduce, and which CAPs were in it?"
category: protocol-core
subcategory: protocol-version-history
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Identifies Protocol 23 by codename 'Whisk' and its headline feature: parallel/multi-threaded smart-contract transaction processing (CAP-0063).", weight: 5 }
  - { claim: "Names live-vs-archival state separation (CAP-0062) as part of Whisk.", weight: 4 }
should_have:
  - { claim: "Mentions additional Whisk CAPs such as unified Classic+Soroban events (CAP-0067) and/or caching parsed WASM modules permanently (CAP-0065).", weight: 3 }
  - { claim: "Notes Whisk activated on Mainnet around 2025-09-03.", weight: 2 }
nice_to_have:
  - { claim: "Notes Whisk's archival logic later required a Protocol 24 corrective/stability upgrade.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute parallel execution to the wrong protocol (e.g. Protocol 20 or 21).", weight: 4 }
  - { claim: "Do NOT cite the wrong CAP numbers for parallelism / state separation (e.g. calling parallel execution CAP-0046 or CAP-0059).", weight: 4 }
  - { claim: "Do NOT claim Whisk introduced Soroban itself (that was Protocol 20).", weight: 4 }
must_cite:
  - "The Protocol 23 / Whisk upgrade material (stellar.org blog 'Introducing Whisk' or the CAP files in stellar/stellar-protocol)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/introducing-whisk-stellar-protocol-23
  - https://stellar.org/blog/developers/protocol-23-upgrade-guide
  - https://github.com/stellar/stellar-protocol/tree/master/core
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Whisk = Protocol 23. DATE VERIFIED 2025-09-03 (stellar.org 'Introducing Whisk' + Protocol 23 Upgrade Guide: Mainnet vote 2025-09-03 17:00 UTC). A reviewer's '2025-06-10' was the blog publish date, not activation — do NOT use it. Headline = parallel exec (CAP-0063) + live/archival separation (CAP-0062). Trap is wrong CAP numbers or attributing parallelism to the wrong protocol."
---

## Reference answer (gospel)

**Protocol 23 ("Whisk")** activated on Stellar Mainnet **2025-09-03 (17:00 UTC)** [1][2]. Its headline
feature is **parallel / multi-threaded smart-contract transaction processing (CAP-0063)** — non-conflicting
transactions (disjoint footprints) apply concurrently [1]. Whisk also shipped **live-vs-archival state
separation (CAP-0062)**, plus unified Classic+Soroban events (**CAP-0067**), permanently cached parsed WASM
modules (**CAP-0065**), new Soroban read resource types (CAP-0066), and dynamic ledger timing config
(CAP-0070) [1][3]. Whisk's archival/eviction path later required a corrective **Protocol 24** stability
upgrade. Whisk did NOT introduce Soroban — that was Protocol 20.

Sources: [1] stellar.org "Introducing Whisk, Stellar Protocol 23"; [2] stellar.org Protocol 23 Upgrade
Guide; [3] stellar/stellar-protocol `core/` (CAP-0062…-0070).

## Why these cards (routing rationale)

Protocol-history / CAP detail → `stellar_docs_mcp` + `scout_research` (papers/dev-docs corpora);
`perplexity_search` acceptable for the dated upgrade announcement. Deep-research is overkill.

## Edge / traps

The traps are CAP misnumbering (CAP-0063 parallel exec, CAP-0062 state separation) and attributing
parallelism to P20/P21 or claiming Whisk introduced Soroban (Soroban was P20).
