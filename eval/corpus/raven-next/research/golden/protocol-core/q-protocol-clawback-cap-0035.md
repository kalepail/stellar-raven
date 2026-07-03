---
id: q-protocol-clawback-cap-0035
q: "Does the Stellar protocol let an asset issuer claw back tokens, and which protocol change added that?"
category: protocol-core
subcategory: protocol-version-history
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
  - { claim: "States asset clawback (issuer can claw back a held asset for regulatory compliance) was added in Protocol 17 via CAP-0035.", weight: 5 }
should_have:
  - { claim: "Notes clawback must be enabled via an account/asset flag (clawback-enabled trustlines); it is opt-in, not retroactive on arbitrary assets.", weight: 3 }
  - { claim: "Notes Protocol 17 activated around 2021-06-01.", weight: 2 }
nice_to_have:
  - { claim: "Notes clawback is a building block for regulated/RWA stablecoins (alongside SEP-8 approval flows).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar has no clawback capability at all.", weight: 4 }
  - { claim: "Do NOT attribute clawback to the wrong CAP/protocol (e.g. CAP-0038/P18 or CAP-0046/P20).", weight: 4 }
  - { claim: "Do NOT claim any issuer can unilaterally claw back any asset regardless of trustline flags.", weight: 3 }
must_cite:
  - "The CAP-0035 file and/or the clawback docs on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Clawback = CAP-0035 = Protocol 17, opt-in via flag. Traps: 'no clawback', wrong CAP, or 'unconditional clawback'."
---

## Reference answer (gospel)

- Yes — Stellar **has** asset clawback (an issuer can claw back a held asset for regulatory compliance), added in **Protocol 17 via CAP-0035** [1].
- Clawback must be enabled via an account/asset flag (**clawback-enabled trustlines**); it is **opt-in**, not retroactive on arbitrary assets — an issuer cannot unilaterally claw back any asset regardless of trustline flags [1][2].
- Protocol 17 activated around **2021-06-01** [1].
- Clawback is a building block for regulated/RWA stablecoins (alongside SEP-8 approval flows) [2].

## Why these cards (routing rationale)

Protocol-feature fact → `stellar_docs_mcp` + `scout_research`. `perplexity_search` acceptable. No deep-research.

## Edge / traps

Claiming no clawback, wrong CAP/version, or unconditional clawback (it requires clawback-enabled
trustlines) are the traps.
