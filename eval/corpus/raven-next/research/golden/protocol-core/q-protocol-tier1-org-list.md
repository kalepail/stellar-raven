---
id: q-protocol-tier1-org-list
q: "Which organizations are currently in Stellar's Tier 1 quorum, and is SDF a single point of control?"
category: protocol-core
subcategory: validators-topology
axes: [tool-targeted, ecosystem-spectrum, edge-governance]
query_type: discovery
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_research, stellar_docs_mcp]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that Stellar docs do not publish a single static canonical list of Tier 1 organizations (membership is fluid).", weight: 4 }
  - { claim: "States SDF is one organization inside a multi-org quorum set (e.g. SDF includes ~7 organizations including itself), not a sole authority.", weight: 5 }
should_have:
  - { claim: "Points to live/canonical sources for who is currently a validator/Tier 1 (e.g. the SDF decentralization blog, dashboard.stellar.org, or a quorum explorer like Obsrvr/StellarBeat).", weight: 3 }
  - { claim: "Flags that any named list is point-in-time and may be stale (freshness caveat).", weight: 2 }
nice_to_have:
  - { claim: "Names plausible current quorum members it can attribute to a source rather than guessing.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a confident hardcoded full Tier-1 list without flagging it as point-in-time / sourced.", weight: 4 }
  - { claim: "Do NOT claim SDF alone controls consensus or can unilaterally finalize ledgers.", weight: 5 }
must_cite:
  - "A live quorum/validator source (dashboard.stellar.org, SDF decentralization blog, or a quorum explorer) plus the Tier 1 docs page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/validators/tier-1-orgs
  - https://stellar.org/blog/developers/decentralization-double-time
  - https://dashboard.stellar.org/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness item #1. Reviewed 2026-06-29: verified against SDF 'Decentralization, Double Time' (2025-07) — SDF's quorum set then comprised 7 orgs (threshold 5): SDF, Blockdaemon, SatoshiPay, Franklin Templeton, LOBSTR, Creit Technologies, Public Node, with a stated plan to grow toward 13. The Tier 1 docs page (2026-06-17) explains the concept and qualification but does NOT publish a live roster. Honest answer flags no static list is canonical and rewards sourcing/staleness-flagging over confident enumeration; SDF-as-single-authority is the misconception trap. Confidence medium = roster is point-in-time/freshness-sensitive."
---

## Reference answer (gospel)

- Stellar's docs do **not** publish a single static canonical list of Tier 1 organizations — Tier 1
  membership is fluid and changes over time, so any enumerated list is point-in-time and may be stale
  [tier-1-orgs docs; decentralization-double-time]. The Tier 1 docs page explains the *concept* (the
  most reliable, highly-available orgs that most quorum sets depend on), not a live roster.
- **SDF is one organization inside a multi-org quorum set, not a sole authority.** Per SDF's own
  "Decentralization, Double Time," SDF includes roughly **7 organizations (including itself)** in its
  quorum set [decentralization-double-time]. SDF alone **cannot** control consensus or unilaterally
  finalize ledgers — validators run by independent orgs must agree under SCP.
- The Tier 1 set SDF's own quorum config cohered around (per "Decentralization, Double Time," 2025-07,
  threshold 5 of 7) is **SDF, Blockdaemon, SatoshiPay, Franklin Templeton, LOBSTR, Creit Technologies,
  and Public Node** [decentralization-double-time] — with a stated plan to grow toward 13 orgs. Treat any
  such roster as point-in-time/sourced, not a live canonical list.
- To find who is *currently* Tier 1 / a validator, point to live sources rather than guessing: the SDF
  decentralization blog [decentralization-double-time], **dashboard.stellar.org** [dashboard], and a
  quorum explorer such as StellarBeat / Obsrvr Radar. Flag freshness on any named members.

## Why these cards (routing rationale)

Current-membership discovery → `scout_research` (incidents/EC/dev-docs corpora) plus `stellar_docs_mcp`
for the Tier 1 concept; `perplexity_search` acceptable for a current, dated public list since this is a
live network-state question docs don't enumerate. Deep-research lane is overkill.

## Edge / traps

Two traps: (1) confidently reciting a hardcoded Tier-1 list without flagging staleness; (2) the SDF-as-
single-point-of-control misconception. SDF is one org in a multi-org quorum.
