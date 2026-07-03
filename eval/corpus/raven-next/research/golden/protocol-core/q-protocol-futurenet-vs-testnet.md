---
id: q-protocol-futurenet-vs-testnet
q: "In protocol terms, how do Testnet and Futurenet differ in which protocol version they run and in their network passphrases — i.e. why does Futurenet exist as a pre-release protocol proving ground separate from Testnet?"
category: protocol-core
subcategory: networks-passphrases
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States Testnet tracks the protocol version currently activated on (or aligned with) Mainnet, while Futurenet runs ahead on not-yet-released / pre-vote protocol versions so new CAPs can be exercised before Mainnet.", weight: 5 }
  - { claim: "States each network has its own distinct network passphrase (and its own friendbot), so a transaction signed for one network is not valid on the other.", weight: 4 }
should_have:
  - { claim: "Notes both are free and resettable (Testnet periodically; Futurenet whenever needed), so neither carries permanent or valuable state.", weight: 3 }
  - { claim: "Explains why the split exists: validators/SDF need a place to run a newer protocol version than Testnet without disrupting normal app testing.", weight: 2 }
nice_to_have:
  - { claim: "Notes the passphrase strings differ (e.g. the 'Test SDF Network ; September 2015' Testnet passphrase vs Futurenet's own).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Testnet or Futurenet uses real XLM / has monetary value.", weight: 4 }
  - { claim: "Do NOT claim Futurenet is the production/Mainnet network.", weight: 4 }
must_cite:
  - "The networks page on developers.stellar.org/docs/networks."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/networks
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Refocused onto the protocol-version + network-passphrase angle (why Futurenet runs ahead of Testnet on pre-release protocol versions) to stay distinct from the tooling-infra q-infra-testnet-vs-futurenet 'when should I use each' dev-workflow comparison. Trap is treating Futurenet as production or claiming test networks have value."
---

## Reference answer (gospel)

- **Protocol version**: Testnet tracks the protocol version aligned with Mainnet, while **Futurenet runs ahead** on not-yet-released / pre-vote protocol versions so new CAPs can be exercised before they ship to Mainnet [1].
- **Distinct identities**: each network has its own **passphrase** and its own **friendbot**, so a transaction signed for one is invalid on the other — Futurenet is `Test SDF Future Network ; October 2022`; Testnet is `Test SDF Network ; September 2015` [1].
- **No value**: both are **free and resettable** (Testnet periodically; Futurenet whenever needed), so neither carries permanent or valuable state — neither uses real XLM, and Futurenet is not the production network [1].
- **Why the split**: SDF/validators need a place to run a **newer protocol** than Testnet without disrupting normal app testing on Testnet [1].

## Why these cards (routing rationale)

Network comparison → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Treating Futurenet as production, or claiming test networks carry real value, are the traps. Both reset.
