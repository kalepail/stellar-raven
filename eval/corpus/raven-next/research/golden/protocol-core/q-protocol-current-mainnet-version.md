---
id: q-protocol-current-mainnet-version
q: "What is the current protocol version running on Stellar Mainnet, and when did it activate?"
category: protocol-core
subcategory: protocol-version-history
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
  - { claim: "Identifies the current Mainnet protocol version as Protocol 26 ('Yardstick'), activated by the validator vote on 2026-05-06, as of the 2026-06-29 snapshot.", weight: 5 }
  - { claim: "Flags that this is freshness-sensitive — the live version can change at the next validator upgrade vote — and points to a live source (stellar.org/protocol-upgrades, dashboard.stellar.org, or stellar.expert protocol history).", weight: 4 }
should_have:
  - { claim: "Notes that Protocol 27 (CAP-0071, 'Zipper') is the queued next version (stellar-core v27.0.0 released; P27 on Testnet 2026-06-18) with its Mainnet vote scheduled 2026-07-08 and still pending.", weight: 3 }
nice_to_have:
  - { claim: "Notes the alphabetic codename cadence (Whisk → X-Ray → Yardstick).", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert an older version (e.g. Protocol 20, 22, 23, or 25) as the current live Mainnet version.", weight: 5 }
  - { claim: "Do NOT assert Protocol 27 is already active on Mainnet (it is queued/pending as of the snapshot).", weight: 4 }
  - { claim: "Do NOT state the version as a flat fact with no freshness/staleness caveat.", weight: 3 }
must_cite:
  - "A live protocol-version source: stellar.org/protocol-upgrades, dashboard.stellar.org, or stellar.expert protocol-history."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/foundation-news/yardstick-stellar-protocol-26
  - https://developers.stellar.org/docs/networks/software-versions
  - https://stellar.expert/explorer/public/protocol-history
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness item #2. RE-VERIFIED 2026-06-29 against developers.stellar.org Software Versions + SDF Zipper P27 guide: Protocol 26 'Yardstick' is still the live Mainnet version (stellar-core 26.1.0), activated by validator vote 2026-05-06. P27 'Zipper' (CAP-0071, stellar-core 27.0.0) is queued — Testnet 2026-06-18, Mainnet vote scheduled 2026-07-08 (still future), so P27 NOT yet live. Rubric gates on 'P26 Yardstick + a dated primary source + freshness caveat', not an unverified ledger number. Confidence medium = freshness-sensitive (re-check after 2026-07-08). Trap is asserting an old version or claiming P27 is live."
---

## Reference answer (gospel)

As of the **2026-06-29 snapshot**, Stellar Mainnet runs **Protocol 26 ("Yardstick")**, activated by the
validator vote on **2026-05-06 (17:00 UTC)** [1]. Yardstick added new protocol-level configuration
settings, checked 256-bit integer arithmetic, v2 TTL host functions, additional BN254 host functions,
SAC improvements, and strkey conversion host functions [1]. **Protocol 27** (CAP-0071) is the queued next
version — stellar-core v27.0.0 is released and P27 reached **Testnet 2026-06-18** [2], with the Mainnet
vote still pending.

**Freshness:** the live Mainnet version changes at each validator upgrade vote — confirm against a live
source (stellar.org/protocol-upgrades, dashboard.stellar.org, or stellar.expert protocol-history [3])
before relying on this.

Sources: [1] stellar.org "Yardstick, Stellar Protocol 26"; [2] developers.stellar.org Software Versions;
[3] stellar.expert protocol-history.

## Why these cards (routing rationale)

Live network-state freshness question → `stellar_docs_mcp` + `scout_research`, with general-web
(`perplexity_search`/`parallel_search`) acceptable for the latest dated confirmation. Deep-research is
over-escalation for a single current-version lookup.

## Edge / traps

Asserting a stale version (P20/22/23/25) as current, or claiming P27 is already live, are the traps.
A good answer flags freshness and cites a live source.
