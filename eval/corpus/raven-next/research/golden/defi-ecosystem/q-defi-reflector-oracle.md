---
id: q-defi-reflector-oracle
q: "What is Reflector and how does the price oracle work on Stellar?"
category: defi-ecosystem
subcategory: oracle
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [lumenloop_find_content_about_project, scout_research, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Reflector is a decentralized price oracle for Stellar: Soroban smart contracts plus a peer-to-peer consensus network of data-provider nodes run by trusted ecosystem orgs.", weight: 5 }
  - { claim: "It is secured by a multisig-protected consensus and offers free price data (no usage limits).", weight: 3 }
should_have:
  - { claim: "It is the de-facto leading / most-integrated oracle on Stellar (consumed by protocols like Blend, Orbit CDP, Laina, EquitX, and Defindex) — but NOT the only one; Band and RedStone are also live on mainnet (alongside DIA/Lightecho).", weight: 3 }
nice_to_have:
  - { claim: "Notes node operators (e.g. StellarExpert, UltraStellar, Script3, PublicNode, xyclooLabs, Lightsail, CreitTech) and products like Pulse/Flare.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Reflector as a DEX, AMM, lending protocol, or bridge.", weight: 5 }
  - { claim: "Do NOT claim Reflector charges per-call fees or has strict usage limits — it offers free data with no usage limits.", weight: 3 }
must_cite:
  - "A source on Reflector as the Stellar price oracle (reflector.network, GitHub, or Lumenloop record)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/reflector
  - https://reflector.network/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "GROUNDED 2026-06-22: Scout confirms Reflector (Infrastructure, Live, SCF $444,840, reflector.network): 'a decentralized price oracle and data-feed network for Stellar and Soroban smart contracts... on-chain and off-chain asset prices, CEX and DEX exchange rates, FX rates, and subscription-based custom data feeds.' Per-project identity → lumenloop_get_project. Note: Reflector is the most-integrated oracle but NOT the only one (see q-defi-reflector-alternatives) — keep should_have framing as 'de-facto leader', not 'only'."
---

## Reference answer (gospel)

**Reflector** is a **decentralized price oracle and data-feed network** for Stellar and Soroban smart
contracts [1][2]. It combines Soroban smart contracts with a **peer-to-peer consensus network of
data-provider nodes** run by trusted ecosystem orgs (secured by a **multisig-protected consensus**),
and delivers on-chain/off-chain asset prices, CEX/DEX rates, FX rates, and subscription custom feeds —
free price data with no usage limits [1][2]. It is the **most-integrated** Stellar oracle, consumed by
Blend, Orbit CDP, Laina, EquitX and Defindex (though not the only oracle — DIA, Band, Lightecho and
RedStone are also live). Node operators include StellarExpert, UltraStellar, Script3, PublicNode,
xyclooLabs, Lightsail and CreitTech.

Sources: [1] stellarlight.xyz Reflector record (Scout); [2] reflector.network.

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`.

## Edge / traps

Don't miscategorize the oracle as a DEX/lender/bridge; don't claim per-call fees (data is free).
