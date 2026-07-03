---
id: q-protocol-fee-model-base-fee
q: "How does the Stellar fee model work for classic transactions — what is the base fee and how are fees computed?"
category: protocol-core
subcategory: fee-model
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
  - { claim: "States the network base fee is 100 stroops (0.00001 XLM) per operation.", weight: 5 }
  - { claim: "States a classic transaction's minimum fee = base fee × number of operations.", weight: 4 }
should_have:
  - { claim: "Notes a stroop is the smallest XLM unit (1 XLM = 10,000,000 stroops).", weight: 3 }
  - { claim: "Notes that under surge/congestion, fees are determined by a market (you bid a max fee; surge pricing applies), and fee-bump transactions let a third party pay/raise fees.", weight: 2 }
nice_to_have:
  - { claim: "Notes Soroban transactions have an additional resource-based fee (separate from the classic per-operation base fee).", weight: 1 }
must_avoid:
  - { claim: "Do NOT state the base fee in whole XLM (e.g. '1 XLM per operation') or otherwise misstate the 100-stroop / 0.00001 XLM value.", weight: 5 }
  - { claim: "Do NOT claim Stellar has Ethereum-style gas priced in gwei.", weight: 3 }
must_cite:
  - "The fees / transaction-fees docs on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Base fee 100 stroops = 0.00001 XLM per op. Trap is misstating magnitude or gas/gwei framing."
---

## Reference answer (gospel)

- The network base fee is **100 stroops (0.00001 XLM) per operation** [1].
- A classic transaction's minimum fee = **base fee × number of operations** [1].
- A stroop is the smallest XLM unit: **1 XLM = 10,000,000 stroops** [1].
- Under surge/congestion, fees are market-determined — you bid a max fee and surge pricing applies; **fee-bump transactions** let a third party pay/raise fees [1].
- Soroban transactions add a separate **resource-based fee** on top of the classic per-operation base fee [1].

## Why these cards (routing rationale)

Canonical fee fact → `stellar_docs_mcp` primary; `scout_research` acceptable. No general-web/deep-research.

## Edge / traps

Misstating the base fee magnitude (it's 100 stroops = 0.00001 XLM per op) or importing Ethereum gas/gwei
framing are the traps.
