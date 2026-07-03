---
id: q-pc-protocol-upgrade-timing
q: "When is the next protocol upgrade, how do validators vote it in, and what SDK-upgrade deadlines must developers meet?"
category: protocol-core
subcategory: protocol-upgrades
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: "protocol-release"

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Requires a dated current source for the next protocol-upgrade date/version (the forward-looking schedule: testnet upgrade, Mainnet vote date, SDK/core release window) and does not rely on stale examples.", weight: 5 }
  - { claim: "Connects developer deadlines to SDK/protocol compatibility guidance (upgrade integrations before the vote) only when cited.", weight: 4 }
should_have:
  - { claim: "Points to validator network-upgrade voting as the mechanism (a pointer, not a full re-teach — mechanics are owned by q-protocol-validator-upgrade-vote) without conflating it with CAP approval.", weight: 3 }
  - { claim: "Mentions Testnet/Futurenet preview or release-candidate timing if current sources support it.", weight: 2 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT assert a specific future vote date without a dated primary source.", weight: 5 }
  - { claim: "Do NOT confuse protocol upgrade voting with SEP/CAP approval alone.", weight: 4 }
must_cite:
  - "Dated primary source required for any upcoming protocol version, vote date, or SDK deadline."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide"
  - "https://developers.stellar.org/docs/networks/software-versions"
  - "https://developers.stellar.org/docs/validators/admin-guide/network-upgrades"
  - "https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Reviewed 2026-06-29: differentiated (D5) to uniquely own the forward-looking dated schedule; reduced validator-vote mechanics to a pointer (owned by q-protocol-validator-upgrade-vote) and deferred the present live-version fact to q-protocol-current-mainnet-version. Freshness-sensitive: re-verified 2026-06-29 against SDF Zipper P27 Upgrade Guide + Software Versions — P27 on Testnet 2026-06-18, Mainnet vote 2026-07-08 (still future as of review). Re-check after 2026-07-08."
---

## Reference answer (gospel)

As of 2026-06-29, the next published Mainnet protocol upgrade is Zipper, Protocol 27. SDF's Protocol 27 Upgrade Guide lists the Testnet upgrade for June 18, 2026 and the Mainnet upgrade vote for July 8, 2026, with core/RPC/Galexie/Horizon/SDK releases spread across June 5-12. Developers are told to upgrade their Stellar integrations before the vote to avoid breakage. This question owns the forward-looking dated schedule; the present live Mainnet version (Protocol 26 "Yardstick") is deferred to `q-protocol-current-mainnet-version`. Sources: https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide and https://developers.stellar.org/docs/networks/software-versions

The upgrade is adopted by validator network-upgrade voting (operators arm an `upgrades` endpoint with the protocol version and `upgradetime`, then validators vote at that network time) — not by CAP approval alone. The full vote mechanics are owned by `q-protocol-validator-upgrade-vote`; here it is only a pointer establishing that CAP status, software release, Testnet upgrade, and the Mainnet validator vote are separate milestones. Source: https://developers.stellar.org/docs/validators/admin-guide/network-upgrades

The answer may mention Protocol 27's CAP-0071 changes only with sources: authentication delegation and address-bound Soroban credentials become available in protocol 27, while the existing `SOROBAN_CREDENTIALS_ADDRESS` remains valid until the Protocol 28 migration window described in the guide. Sources: https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md and https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for Software Versions and validator upgrade mechanics. `scout_research`, `perplexity_search`, or `parallel_search` are acceptable only to discover dated announcements; any future vote date or SDK deadline must be pinned to a dated primary source.

## Edge / traps

Do not answer from stale examples or older upgrade guides. Do not say "CAP accepted" means "Mainnet upgraded"; CAP status, software release, Testnet upgrade, and Mainnet validator vote are separate milestones.
