---
id: q-protocol-validator-upgrade-vote
q: "How do Stellar validators actually activate a new protocol version once a CAP is accepted?"
category: protocol-core
subcategory: upgrade-governance
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States each validator operator 'arms' the upgrade ahead of time, scheduling a protocol-version bump for a fixed UTC timestamp (e.g. an upgrades?mode=set&upgradetime=...&protocolversion=N command).", weight: 5 }
  - { claim: "States the upgrade is recorded in-band via the ledger header's Upgrades field, and SCP/validator agreement flips the protocol version at the scheduled time.", weight: 4 }
should_have:
  - { claim: "Notes mainnet upgrade votes happen at a fixed scheduled time (commonly 17:00 UTC on the announced date).", weight: 2 }
  - { claim: "Notes the pattern of testnet vote before the mainnet vote.", weight: 2 }
nice_to_have:
  - { claim: "Notes operators must run the matching stellar-core release that supports the target protocol version before arming.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim activation is via a token-holder vote, a hard fork download, or an off-chain SDF switch.", weight: 5 }
  - { claim: "Do NOT claim protocol upgrades require coordinated node-software downloads at the exact activation moment (the version bump is an in-band SCP vote, software is installed beforehand).", weight: 3 }
must_cite:
  - "A protocol upgrade guide (e.g. stellar.org Protocol 25/26 upgrade guide) and/or the validator admin docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/foundation-news/stellar-yardstick-protocol-26-upgrade-guide
  - https://developers.stellar.org/docs/validators/admin-guide
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Mechanics of activation (validator arming + Upgrades header). Trap is token vote / off-chain switch."
---

## Reference answer (gospel)

Each validator operator **"arms"** the upgrade ahead of time, scheduling a protocol-version bump for a
fixed UTC timestamp via an `upgrades?mode=set&upgradetime=...&protocolversion=N` command [1][2]. The
upgrade is recorded **in-band** via the ledger header's `Upgrades` field; SCP/validator agreement flips
the protocol version at the scheduled time [1][2]. Mainnet upgrade votes happen at a fixed scheduled
time (commonly **17:00 UTC** on the announced date), and a **testnet vote precedes the mainnet
vote** [1]. Operators must run the matching stellar-core release before arming [1]. This is **not** a
token-holder vote, **not** a hard-fork download, and **not** an off-chain SDF switch — the software is
installed beforehand, and the version bump itself is an in-band SCP vote [1][2].

- [1] stellar.org/blog/foundation-news/stellar-yardstick-protocol-26-upgrade-guide
- [2] developers.stellar.org/docs/validators/admin-guide

## Why these cards (routing rationale)

Activation mechanics → `stellar_docs_mcp` (upgrade guides + validator admin docs) + `scout_research`.
`perplexity_search` acceptable. No deep-research.

## Edge / traps

Claiming token-holder voting, an off-chain SDF switch, or a synchronized hard-fork download are the traps.
Activation is an in-band SCP vote recorded in the ledger's Upgrades field, with software pre-installed.
