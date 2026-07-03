---
id: q-soroban-resource-limits
q: "What resource limits can cause a Soroban transaction to fail, like CPU instructions, memory, and ledger entries?"
category: soroban
subcategory: fees-metering
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "There are per-transaction (and per-ledger) caps on CPU instructions, Wasm memory, read/write ledger entries, and read/write bytes; exceeding them fails the transaction.", weight: 5 }
  - { claim: "These limits are network configuration settings that can change via protocol upgrades, so exact numbers should be flagged as version-dependent.", weight: 3 }
should_have:
  - { claim: "The Wasm memory limit is a hard ceiling with no fee (you cannot pay to exceed it).", weight: 2 }
  - { claim: "Hitting a resource limit produces a failed transaction at execution, not a soft warning.", weight: 2 }
nice_to_have:
  - { claim: "Notes ledger limits (e.g., ledgerMaxInstructions) gate how many contract txs fit in a ledger.", weight: 1 }
must_avoid:
  - { claim: "Do NOT cite a single fixed 'block gas limit' as in Ethereum as the model.", weight: 3 }
  - { claim: "Do NOT present specific limit numbers as permanently fixed constants without noting they are config-tunable.", weight: 3 }
must_cite:
  - "The developers.stellar.org fees/resource-limits/metering page (config settings)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Freshness: limit constants are validator-voted config and retuned across protocols; reward flagging config-tunability rather than quoting a fixed number. Categories verified against the fees/resource-limits page."
---

## Reference answer (gospel)

Soroban applies resource constraints (to smart-contract txs) on each of: [fees]

- **CPU instructions** (per-tx instruction meter).
- **Wasm memory (RAM)** — a hard ceiling that is **capped but uncharged**; you cannot pay to exceed it.
- **Ledger entry reads/writes** (number of read/write entries).
- **Ledger I/O bytes** (read/write byte totals).
- **Transaction size**.

Exceeding any of these **fails the transaction at execution** (a failed tx, not a soft warning).
These limits are **network configuration settings determined by validator vote**, and there are also
per-**ledger** aggregate caps (e.g., ledger max instructions) that gate how many contract txs fit in a
ledger. [fees]

Because the constants are config-tuned and retuned across protocol upgrades, **exact numbers should be
flagged as version-dependent** (check the live network config / Stellar Lab), not quoted as fixed.

Trap: modeling it as a single Ethereum "block gas limit," or presenting specific numbers as permanent
constants.

## Why these cards (routing rationale)

Resource-limit reference → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Single block-gas-limit framing; quoting limit numbers as permanent constants.
