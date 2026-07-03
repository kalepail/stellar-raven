---
id: q-protocol-amm-cap-0038
q: "When did automated market makers (liquidity pools) become a native protocol feature on Stellar, and via which CAP?"
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
  - { claim: "States native AMM / liquidity-pool functionality launched with Protocol 18 (activated ~2021-11-03) via CAP-0038.", weight: 5 }
should_have:
  - { claim: "Notes AMMs hold two assets in a constant-product pool and add cross-currency payment paths alongside the existing order-book DEX.", weight: 3 }
  - { claim: "Notes liquidity pools are a ledger entry type introduced by this change.", weight: 2 }
nice_to_have:
  - { claim: "Notes this is native protocol-level AMM, distinct from Soroban-contract AMMs (e.g. Soroswap).", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute native AMMs to the wrong protocol (e.g. Protocol 20/Soroban) or wrong CAP (e.g. CAP-0046).", weight: 4 }
  - { claim: "Do NOT claim Stellar's native AMM is a Soroban smart contract (it is a protocol-level liquidity-pool primitive).", weight: 3 }
must_cite:
  - "The CAP-0038 file and/or the 'Automated Market Maker Functionality is Live on Stellar' announcement."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0038.md
  - https://stellar.org/press/automated-market-maker-functionality-is-live-on-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Native AMM = CAP-0038 = Protocol 18. Trap is attributing to Soroban/P20 or wrong CAP."
---

## Reference answer (gospel)

- Native AMM / liquidity-pool functionality launched with **Protocol 18 (activated ~2021-11-03) via CAP-0038** [1][2].
- AMMs hold two assets in a **constant-product pool** and add cross-currency payment paths alongside the existing order-book DEX [1].
- Liquidity pools are a new **ledger entry type** introduced by this change [1].
- This is a **native protocol-level** AMM primitive — distinct from Soroban-contract AMMs (e.g. Soroswap); it is **not** a smart contract [1].

## Why these cards (routing rationale)

Protocol-history fact → `stellar_docs_mcp` + `scout_research`. `perplexity_search` acceptable. No deep-research.

## Edge / traps

Attributing native AMMs to Soroban/P20 or the wrong CAP is the trap; it's a protocol-level primitive
(CAP-0038, P18), not a smart contract.
