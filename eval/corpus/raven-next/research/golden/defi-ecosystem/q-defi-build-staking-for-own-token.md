---
id: q-defi-build-staking-for-own-token
q: "Since XLM has no native protocol staking, how can I build a staking or yield feature for my own Soroban token?"
category: defi-ecosystem
subcategory: staking-yield-design
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos, lumenloop_find_similar_projects_semantic]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States XLM does not have native protocol staking rewards like proof-of-stake chains.", weight: 5 }
  - { claim: "Explains a custom token staking/yield feature must be implemented at the application/contract/protocol layer, with explicit reward source, lock/accounting rules, and withdrawal logic.", weight: 5 }
  - { claim: "Mentions existing primitives may include Soroban token contracts, SAC tokens, Blend/lending markets, AMMs, vaults, or reward distributors depending on design, each with risk.", weight: 4 }
should_have:
  - { claim: "Discusses reward sustainability, securities/compliance, smart-contract risk, oracle/pricing risk, and user disclosure.", weight: 3 }
  - { claim: "Distinguishes staking terminology from lending, liquidity mining, and fixed-yield products.", weight: 3 }
nice_to_have:
  - { claim: "Mentions audits and testnet/mainnet staged launch.", weight: 1 }
must_avoid:
  - { claim: "Do NOT imply users can earn native XLM staking rewards from the Stellar protocol.", weight: 5 }
  - { claim: "Do NOT promise yield without identifying a real reward source and risks.", weight: 5 }
must_cite:
  - "Stellar/Soroban docs for contract/token mechanics and current protocol docs for any named DeFi primitive."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol"
  - "https://developers.stellar.org/docs/tokens/anatomy-of-an-asset"
  - "https://developers.stellar.org/docs/build/smart-contracts/overview"
  - "https://stellarlight.xyz/project/blend"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "No unresolved factual caveat; compliance/yield-risk treatment is jurisdiction- and product-specific."
---

## Reference answer (gospel)

XLM does not have native protocol staking rewards. Stellar reaches consensus with SCP/FBA rather than proof-of-stake, and official docs state validators do not receive monetary rewards. A "staking" product for a Soroban token is therefore an application/protocol feature: the contract must define the deposited token, reward source, lock/accounting rules, emission schedule, withdrawal/claim flow, admin controls, and failure behavior.

The building blocks can include SEP-41 custom contract tokens, Stellar assets exposed through the Stellar Asset Contract, AMM liquidity incentives, vault/reward-distributor contracts, or lending/yield protocols such as Blend. The answer must distinguish staking-language from lending, liquidity mining, fixed yield, and points/rewards. It should name sustainability, securities/compliance, smart-contract, oracle/pricing, and disclosure risks, and require audits plus staged testnet/mainnet launch for user funds.

## Why these cards (routing rationale)

`stellar_docs_mcp` is expected because the durable correction is protocol-level: SCP has no native staking rewards, while token/SAC/Soroban docs define the primitives. Scout/LumenLoop are useful for named DeFi primitives only.

## Edge / traps

The wrong answer says "stake XLM" as if Stellar were a PoS chain, or promises yield without identifying where rewards come from.
