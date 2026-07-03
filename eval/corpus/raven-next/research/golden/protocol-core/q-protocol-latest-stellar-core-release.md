---
id: q-protocol-latest-stellar-core-release
q: "What is the latest stellar-core release and which protocol version does it target?"
category: protocol-core
subcategory: stellar-core
axes: [tool-targeted, ecosystem-spectrum, edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Identifies stellar-core v27.0.0 (released ~2026-06-05) as the latest release, targeting Protocol 27 (CAP-0071), as of the 2026-06-29 snapshot.", weight: 5 }
  - { claim: "Flags this as freshness-sensitive and points to the GitHub releases page (github.com/stellar/stellar-core/releases) as the live source.", weight: 4 }
should_have:
  - { claim: "Notes that the release targeting Protocol 27 is ahead of Mainnet activation (P26 was the live Mainnet version at the snapshot; the P27 vote was pending).", weight: 3 }
nice_to_have:
  - { claim: "Notes CAP-0071 adds SOROBAN_CREDENTIALS_ADDRESS_V2 / address-bound Soroban credentials + delegation.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert an old stellar-core release (e.g. v22/v23/v25) as the latest.", weight: 4 }
  - { claim: "Do NOT claim v27.0.0 being released means Protocol 27 is already live on Mainnet.", weight: 4 }
  - { claim: "Do NOT present the release as fixed truth without a freshness caveat / live source.", weight: 3 }
must_cite:
  - "The stellar-core GitHub releases page (github.com/stellar/stellar-core/releases)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-core/releases
  - https://developers.stellar.org/docs/networks/software-versions
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness item (extra). RE-VERIFIED 2026-06-29: stellar-core v27.0.0 (targets Protocol 27 / CAP-0071) is the latest release — developers.stellar.org Software Versions lists Stellar Core 27.0.0 under 'Protocol 27 (Testnet, June 18, 2026)'. P26 (Stellar Core 26.1.0) is the live Mainnet version; P27 Mainnet vote scheduled 2026-07-08 (still future). Confidence medium = freshness-sensitive. Trap is conflating 'released' with 'activated on Mainnet'."
---

## Reference answer (gospel)

As of the **2026-06-29 snapshot**, the latest stellar-core release is **v27.0.0**, which targets
**Protocol 27** (CAP-0071) [1][2]. The official Software Versions page lists Stellar Core **27.0.0** under
"Protocol 27 (Testnet, June 18, 2026)", while the live **Mainnet** version is Protocol 26 (Stellar Core
**26.1.0**) [2]. stellar-core's major version tracks the protocol version it supports (v26 → P26,
v27 → P27). A release targeting P27 does **not** mean P27 is live on Mainnet — the P27 Mainnet vote was
still pending at the snapshot. CAP-0071 adds address-bound Soroban credentials
(`SOROBAN_CREDENTIALS_ADDRESS_V2`) and authentication delegation.

**Freshness:** confirm the latest tag against github.com/stellar/stellar-core/releases [1] — releases land
ahead of each protocol vote.

Sources: [1] github.com/stellar/stellar-core/releases; [2] developers.stellar.org Software Versions.

## Why these cards (routing rationale)

Latest-release lookup → `stellar_docs_mcp` + `scout_research`; general-web acceptable for the dated GitHub
release. Deep-research is overkill for a single release lookup.

## Edge / traps

Asserting a stale release, or conflating 'v27 released' with 'Protocol 27 live on Mainnet', are the traps.
A good answer separates the latest software release from the live Mainnet protocol version and flags freshness.
