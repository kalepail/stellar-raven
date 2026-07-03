---
id: q-defi-market-making-kelp
q: "What tooling exists for automated market-making on Stellar, is Kelp still maintained, and how do bots keep offers repositioned near market price?"
category: defi-ecosystem
subcategory: market-making
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_repos]
acceptable_cards: [scout_research, perplexity_search, parallel_search, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Treats Kelp maintenance/status as a current repository question requiring dated repo evidence, not a static fact.", weight: 5 }
  - { claim: "Explains automated market making on Stellar can involve SDEX offer management, AMM pool liquidity, or protocol-specific liquidity incentives; these are different mechanisms.", weight: 4 }
  - { claim: "Explains offer-repositioning bots cancel/update/manage buy/sell offers based on external/internal price signals, spread, inventory, and risk controls.", weight: 4 }
should_have:
  - { claim: "Mentions looking at repo activity, releases, open issues, and docs before adopting Kelp or alternatives.", weight: 3 }
  - { claim: "Distinguishes classic SDEX orderbook bots from Soroban AMM/DEX liquidity tools.", weight: 3 }
nice_to_have:
  - { claim: "Mentions testnet or dry-run operation before mainnet funds.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Kelp is actively maintained or abandoned without dated repository/source evidence.", weight: 5 }
  - { claim: "Do NOT promise market-making profitability.", weight: 5 }
must_cite:
  - "Current Kelp repository or documentation, plus Stellar docs for offer/orderbook mechanics."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://github.com/stellar-deprecated/kelp"
  - "https://github.com/stellar-deprecated/kelp/releases/tag/v1.12.0"
  - "https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools"
  - "https://stellarlight.xyz/project/aquarius"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Verified with gh on 2026-06-29: stellar-deprecated/kelp is archived; latest release v1.12.0 was published 2021-11-05; last push 2023-11-03. Phase 3 can re-run gh repo view."
---

## Reference answer (gospel)

Kelp exists, but its current status must be described from repository evidence: `stellar-deprecated/kelp` is archived, the latest release is v1.12.0 from 2021-11-05, and the repository describes it as a Stellar DEX / centralized-exchange trading bot. That makes it useful prior art, not something Raven should casually call actively maintained.

Automated market making on Stellar can mean different things: classic SDEX offer management, liquidity provision to classic/Soroban AMM pools, DEX aggregator routing, or protocol incentives such as Aquarius rewards. A classic bot keeps offers near a target price by reading internal/external price signals, managing spread and inventory, canceling/updating offers, and handling partial fills and failed transactions. It should be dry-run/testnet tested and never sold as guaranteed profit.

## Why these cards (routing rationale)

`scout_repos` is expected because repo maintenance is central. `stellar_docs_mcp` is acceptable for SDEX mechanics; Scout project cards help distinguish AMM/pool venues from orderbook bots.

## Edge / traps

Do not state "Kelp is maintained" or "Kelp is abandoned" without dated repo evidence. Also do not conflate a SDEX offer bot with an AMM pool LP position.
