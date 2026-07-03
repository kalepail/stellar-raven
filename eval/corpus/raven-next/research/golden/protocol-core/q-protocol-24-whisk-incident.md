---
id: q-protocol-24-whisk-incident
q: "Why did Stellar ship Protocol 24 so soon after Protocol 23, and what was the state-archival bug?"
category: protocol-core
subcategory: protocol-version-history
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States Protocol 24 was a corrective / stability upgrade that fixed a state-archival bug introduced by Protocol 23 (Whisk).", weight: 5 }
  - { claim: "Describes the bug: Whisk's eviction/restore path archived and then restored entries incorrectly, producing state that diverged from the canonical onchain history.", weight: 4 }
should_have:
  - { claim: "Notes Protocol 24 was voted/activated at the next upgrade slot on 2025-10-22 (17:00 UTC).", weight: 3 }
  - { claim: "Notes the root feature was the live-vs-archival state separation (CAP-0062) introduced in Whisk.", weight: 2 }
nice_to_have:
  - { claim: "Frames it as the 'feature upgrade → adjacent bug-fix upgrade' pattern enabled by protocol governance without forking.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Protocol 24 introduced a major new feature (e.g. ZK, parallel execution, or Soroban) — it was a stability fix.", weight: 4 }
  - { claim: "Do NOT claim the bug caused a chain fork or loss of funds rather than a state-archival inconsistency.", weight: 3 }
must_cite:
  - "The 'Addressing State Archival Inconsistencies' upgrade blog (stellar.org) and/or the protocol-upgrades history."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/addressing-state-archival-inconsistencies-protocol-upgrade-vote-next-week
  - https://stellar.expert/explorer/public/protocol-history
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Reviewed 2026-06-29. Incident/governance narrative grounded in SDF's 'Addressing State Archival Inconsistencies' / 'Protocol 24 Upgrade Guide' blog. Protocol 23 (Whisk) shipped 2025-09-03; Protocol 24 corrective upgrade Mainnet vote NOW INDEPENDENTLY VERIFIED at 2025-10-22 17:00 UTC (SDF Protocol 24 Upgrade Guide + developers.stellar.org Software Versions 'Protocol 24 (Mainnet, October 22, 2025)'). Confidence raised medium->high. Rubric still gates on the corrective-upgrade narrative + state-archival bug. Trap is treating P24 as a feature release or overstating the bug as a fork/fund loss."
---

## Reference answer (gospel)

**Protocol 24** was a **corrective / stability upgrade** shipped soon after Protocol 23 ("Whisk") to fix a
**state-archival bug** that Whisk introduced [1]. Whisk's live-vs-archival state separation (CAP-0062)
added an eviction/restore path; a defect in that path **archived and then restored entries incorrectly**,
producing onchain state that **diverged from the canonical history** [1]. Rather than let it compound, SDF
shipped Protocol 24 at the next scheduled upgrade slot (~2025-10-22, 17:00 UTC) to restore the affected
entries and tighten the path [1][2]. This was a state-archival inconsistency — **not a chain fork or loss
of funds** — and exemplifies the "feature upgrade → adjacent bug-fix upgrade" pattern that Stellar's
protocol governance enables without a contentious fork.

Sources: [1] stellar.org "Addressing State Archival Inconsistencies: Protocol Upgrade Vote Next Week";
[2] stellar.expert protocol-history.

## Why these cards (routing rationale)

Incident narrative grounded in SDF's own blog → `stellar_docs_mcp` + `scout_research` (incidents corpus);
`perplexity_search` acceptable for the dated post. No deep-research.

## Edge / traps

Treating P24 as a feature release, or overstating the archival inconsistency as a fork / fund loss, are
the traps. It was a same-year corrective upgrade.
