---
id: q-defi-named-newer-protocols
q: "What are FxDAO, OrbitCDP, zenex.trade, and named market makers such as JST in the Stellar DeFi ecosystem?"
category: defi-ecosystem
subcategory: emerging-protocols
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: monthly

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_directory, lumenloop_find_content_by_entity, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Treats each named protocol/entity as an entity-resolution and current-status lookup requiring dated evidence.", weight: 5 }
  - { claim: "For any verified entity, identifies its category or role such as CDP/stablecoin, perps, market maker, liquidity provider, or other DeFi role with a source.", weight: 5 }
  - { claim: "Clearly says when a named item is not found or cannot be verified in the Stellar corpus instead of inventing details.", weight: 5 }
should_have:
  - { claim: "Separates testnet/pre-launch/announced status from mainnet-live status.", weight: 3 }
  - { claim: "Mentions alternate spellings/domains only when sourced.", weight: 2 }
nice_to_have:
  - { claim: "Provides project links or repo/site links where available.", weight: 1 }
must_avoid:
  - { claim: "Do NOT hallucinate details for FxDAO, OrbitCDP, zenex.trade, JST, or any similarly named entity when sources are thin.", weight: 5 }
  - { claim: "Do NOT claim a protocol is live on Stellar mainnet without dated evidence.", weight: 5 }
must_cite:
  - "Dated Scout/LumenLoop/project/web sources for every named entity claim."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - "https://stellarlight.xyz/project/orbitcdp"
  - "https://stellarlight.xyz/project/zenex"
  - "https://github.com/FxDAO/FxDAO-SC"
  - "https://github.com/zenith-protocols/hermes"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Scout found OrbitCDP and Zenex directly. FxDAO was verified primarily through Scout codeReferences plus GitHub repo metadata, not a first-class project row in the returned search. JST was not verified as a Stellar DeFi market maker in Scout search."
---

## Reference answer (gospel)

This is an entity-resolution question, so the correct answer should be explicit about what was found and what was not.

OrbitCDP is verified in Scout as a live Stellar/Soroban CDP lending/borrowing protocol: users lock collateral, including XLM and tokenized RWA collateral, to borrow over-collateralized stablecoins such as oUSD. Zenex is verified in Scout as a pre-release/testnet perpetual leveraged-trading exchange on Stellar/Soroban with mainnet pending. FxDAO has code-level evidence in Scout and GitHub (`FxDAO/FxDAO-SC`, smart contracts for `fxdao.io`, last pushed 2025-06-16), but Phase 2 did not verify enough primary project material to over-specify status beyond "Stellar/Soroban DeFi protocol with smart-contract repo evidence." JST was not verified as a named Stellar DeFi market maker in Scout; Raven should say it could not verify that entity rather than inventing a role.

## Why these cards (routing rationale)

`scout_projects` is expected because the task is resolving named ecosystem entities. LumenLoop/project content or web search are acceptable expansions, but every entity claim needs its own source.

## Edge / traps

The trap is filling gaps with plausible DeFi labels. Mainnet-live, testnet, pre-release, repo-only, and not-found must stay separate.
