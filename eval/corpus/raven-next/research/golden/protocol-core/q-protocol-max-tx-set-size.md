---
id: q-protocol-max-tx-set-size
q: "What is the maximum transaction set size (operations per ledger) on Stellar Mainnet, and how is that limit set?"
category: protocol-core
subcategory: fee-model
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
  - { claim: "States the Mainnet ledger limit is currently 1,000 classic (non-smart-contract) operations per ledger.", weight: 4 }
  - { claim: "States this ledger limit is a network parameter set/adjusted by validators based on observed usage, not a fixed protocol constant.", weight: 5 }
should_have:
  - { claim: "Notes smart-contract transactions have a separate ledger limit (currently 100 Soroban transactions per ledger) governed by resource limits, not the 1,000-op classic count.", weight: 3 }
  - { claim: "Notes the limit balances ledger acceptance against fair fees, that exceeding it triggers surge pricing, and that it can be raised via validator-set upgrades as scaling work lands (Road to 5000 TPS).", weight: 3 }
nice_to_have:
  - { claim: "Notes the 1,000-ops limit has been the validator-set value since the Protocol 11 (2019) shift to measuring ledger capacity in operations rather than transactions, and is worth confirming against current docs / stellar.expert protocol history.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the ledger op-limit is hardcoded in the protocol and immutable.", weight: 4 }
  - { claim: "Do NOT claim there is no limit on operations per ledger.", weight: 3 }
must_cite:
  - "The official fees/resource-limits docs and/or the stellar.expert protocol-history page (the 'Parallelizing Stellar Core' scaling blog for the raise-the-limit roadmap)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
  - https://stellar.expert/explorer/public/protocol-history
  - https://stellar.org/blog/developers/parallelizing-stellar-core-the-first-step-toward-5000-tps
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Re-verified 2026-06-29 against official Fees/Resource-Limits/Metering docs: the public network is configured for 1,000 non-smart-contract operations per ledger and 100 smart-contract transactions per ledger (validator-configured). Value has been 1,000 ops/ledger since the Protocol 11 (2019) shift to measuring capacity in operations. Defining gate remains the validator-set-parameter caveat (not a fixed constant), not the exact number. Trap is treating it as immutable or claiming no limit. Confidence raised medium->high."
---

## Reference answer (gospel)

- The Mainnet ledger limit is currently **1,000 classic (non-smart-contract) operations per ledger** [1][2].
- This ledger limit is a **network parameter configured by validators** based on observed usage — **not a fixed protocol constant** [1]. It has sat at 1,000 ops/ledger since Protocol 11 (2019) reframed ledger capacity in operations rather than transactions.
- **Smart-contract (Soroban) transactions** have a separate ledger limit — currently **100 Soroban transactions per ledger** — governed by per-ledger resource limits (instructions, read/write entries, bandwidth) rather than the classic 1,000-op count [1].
- Exceeding the limit triggers **surge pricing**; the limit can be raised via validator-set upgrades as scaling work lands (the "Road to 5000 TPS") [3]. The exact numbers are validator-adjustable — confirm against current docs / stellar.expert protocol history [1][2].

## Why these cards (routing rationale)

Network-parameter fact → `stellar_docs_mcp` (official fees/resource-limits page now states the value) +
`scout_research`; `perplexity_search` acceptable for the live value. No deep-research.

## Edge / traps

Treating the op-limit as a fixed protocol constant (it's a validator-adjusted parameter), conflating the
classic 1,000-op limit with the separate 100-Soroban-tx limit, or claiming no limit are the traps.
