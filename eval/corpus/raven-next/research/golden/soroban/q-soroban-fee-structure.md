---
id: q-soroban-fee-structure
q: "How are Soroban transaction fees structured, and which part can be refunded?"
category: soroban
subcategory: fees-metering
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
  - { claim: "Soroban fees split into an inclusion (bid) fee plus a resource fee; the resource fee has a non-refundable portion and a refundable portion.", weight: 5 }
  - { claim: "The refundable portion is returned based on actual on-chain usage after execution.", weight: 4 }
should_have:
  - { claim: "The non-refundable portion covers CPU instructions, read/write bytes, and bandwidth/size; the refundable portion covers rent, events, and return values (charged up front, refunded by actual usage).", weight: 3 }
  - { claim: "Fees are denominated in stroops (1 XLM = 10,000,000 stroops).", weight: 2 }
nice_to_have:
  - { claim: "Run `simulateTransaction` to estimate the resource fee before submitting.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Soroban fees as Ethereum-style gas/gwei with a single gas price.", weight: 4 }
  - { claim: "Do NOT claim the entire fee is refundable or that none of it is refundable.", weight: 3 }
must_cite:
  - "The developers.stellar.org fees & metering documentation (or CAP-0046 fee section)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "gas/gwei is the EVM trap; refundable-portion is the defining fact. Per the fees page the refundable portion is specifically rent + events + return values; the non-refundable is CPU + read/write bytes + bandwidth."
---

## Reference answer (gospel)

A Soroban transaction fee is **`Tx.fee = Inclusion Fee + Resource Fee`**. [fees]

- **Inclusion fee** — a bid (`# operations × effective base fee`) competing for ledger inclusion;
  non-refundable. [fees]
- **Resource fee** (smart contracts only) splits into:
  - **Non-refundable** — derived from **CPU instructions, read/write bytes, and bandwidth/size**.
    [fees]
  - **Refundable** — derived from **rent, events, and return values**; charged from the source account
    before execution and then **refunded based on actual usage**. [fees]

So it is **not** all-or-nothing: the rent/events/return-value portion is refunded by actual
consumption. Fees are in **stroops** (1 XLM = 10,000,000 stroops). Run `simulateTransaction` (RPC) /
`stellar tx simulate` to estimate the resource fee before submitting.

Trap: framing this as Ethereum-style gas × gas-price; or claiming the whole fee (or none of it) is
refundable.

## Why these cards (routing rationale)

Fee-model fact → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Ethereum gas/gwei framing; claiming all-or-nothing refundability.
