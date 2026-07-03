---
id: q-protocol-parallel-execution
q: "Does Stellar execute smart-contract transactions in parallel, and when did that capability ship?"
category: protocol-core
subcategory: parallel-execution
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States parallel / multi-threaded smart-contract transaction application shipped in Protocol 23 ('Whisk') via CAP-0063.", weight: 5 }
  - { claim: "Explains parallelism works by scheduling non-conflicting transactions (disjoint read/write footprints) to apply concurrently with bounded execution time.", weight: 3 }
should_have:
  - { claim: "Notes this is part of the SDF 'Road to 5000 TPS' scaling effort (parallel core / dissemination work).", weight: 2 }
  - { claim: "Notes Whisk activated on Mainnet 2025-09-03.", weight: 2 }
nice_to_have:
  - { claim: "Notes the live-vs-archival state separation (CAP-0062) accompanied parallel execution.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute parallel execution to Protocol 20, 21, or 22.", weight: 4 }
  - { claim: "Do NOT cite the wrong CAP (e.g. CAP-0046 or CAP-0059) for parallel execution.", weight: 4 }
  - { claim: "Do NOT claim Stellar executes all transactions sequentially with no parallelism (it added parallelism in P23).", weight: 3 }
must_cite:
  - "The Protocol 23 / Whisk material and/or CAP-0063, plus the 'Parallelizing Stellar Core' blog."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/introducing-whisk-stellar-protocol-23
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0063.md
  - https://stellar.org/blog/developers/parallelizing-stellar-core-the-first-step-toward-5000-tps
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Parallel execution = CAP-0063 = Protocol 23 Whisk. DATE CORRECTED to 2025-09-03 (was 2025-06-10 in draft — that was the blog publish date, not activation). Verified via stellar.org 'Introducing Whisk' + Protocol 23 Upgrade Guide: Mainnet vote 2025-09-03 17:00 UTC. Trap is wrong CAP/version."
---

## Reference answer (gospel)

Yes — Stellar applies **smart-contract transactions in parallel**. Multi-threaded Soroban transaction
application shipped in **Protocol 23 ("Whisk")** via **CAP-0063** [1][2], activated on Mainnet **2025-09-03
(17:00 UTC)** [1]. Parallelism works by scheduling transactions whose read/write **footprints are disjoint**
(non-conflicting) to apply concurrently within a bounded per-cluster execution budget [2]. It is the
centerpiece of SDF's "Road to 5000 TPS" scaling work [3], and shipped alongside live-vs-archival state
separation (CAP-0062). Classic (non-Soroban) operations are unaffected by this CAP.

Sources: [1] stellar.org "Introducing Whisk, Stellar Protocol 23"; [2] stellar/stellar-protocol
`core/cap-0063.md`; [3] stellar.org "Parallelizing Stellar Core: The First Step Toward 5000 TPS".

## Why these cards (routing rationale)

Protocol-feature fact → `stellar_docs_mcp` + `scout_research`. `perplexity_search` acceptable. No deep-research.

## Edge / traps

Wrong CAP (it's CAP-0063) or wrong version (it's P23 Whisk) are the traps, as is claiming Stellar is
fully sequential. Whisk activated 2025-09-03 (not the blog's 2025-06 publish date).
