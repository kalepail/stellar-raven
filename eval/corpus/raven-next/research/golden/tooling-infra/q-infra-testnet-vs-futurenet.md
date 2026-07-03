---
id: q-infra-testnet-vs-futurenet
q: "What's the difference between Stellar's Testnet and Futurenet, and when should I use each?"
category: tooling-infra
subcategory: testnet-futurenet
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
  - { claim: "Testnet and Futurenet are both public networks separate from Mainnet/Pubnet.", weight: 4 }
  - { claim: "Testnet mirrors Mainnet behavior (stable, for general integration testing); Futurenet runs upcoming/experimental protocol features ahead of Mainnet.", weight: 5 }
should_have:
  - { claim: "Use Testnet for normal app testing and Futurenet only when you need to exercise pre-release protocol features.", weight: 2 }
  - { claim: "Far fewer RPC providers support Futurenet than Testnet/Mainnet.", weight: 1 }
nice_to_have:
  - { claim: "Both can be funded via Friendbot.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Testnet or Futurenet hold real-value assets or are the same as Mainnet.", weight: 4 }
  - { claim: "Do NOT swap their roles (describing Testnet as the experimental/pre-release network).", weight: 3 }
must_cite:
  - "developers.stellar.org networks docs (testnet/futurenet)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/networks
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified against the networks docs: both are public, fake-XLM networks separate from Mainnet; Testnet is stable (resets ~2-4×/yr), Futurenet runs bleeding-edge/pre-release protocol features (irregular resets). Both fundable via Friendbot (~10,000 fake XLM). Role swap is the trap."
---

## Reference answer (gospel)

**Testnet** and **Futurenet** are both **public networks separate from Mainnet/Pubnet**, using
**fake XLM with no real value**, and both periodically reset
([networks docs](https://developers.stellar.org/docs/networks)).

- **Testnet** — the **stable** network that mirrors Mainnet behavior; for general integration testing.
  Resets ~2–4×/year on a predictable schedule.
- **Futurenet** — a dev network for **bleeding-edge / pre-release protocol features** introduced ahead
  of Mainnet; resets on an irregular cadence.

**When to use:** Testnet for normal app testing; **Futurenet only when you need to exercise
pre-release protocol features**. Far fewer RPC providers support Futurenet than Testnet/Mainnet. Both
can be funded via **Friendbot** (~10,000 fake XLM, accounts and contracts).

Do **not** swap their roles (Testnet is *not* the experimental network) or claim either holds
real-value assets.

## Why these cards (routing rationale)

Network comparison from first-party docs → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Swapping the two networks' roles is the trap.
