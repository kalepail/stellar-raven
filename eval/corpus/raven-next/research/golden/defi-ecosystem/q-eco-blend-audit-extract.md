---
id: q-eco-blend-audit-extract
q: "Find and summarize the findings of Blend's security audit."
category: defi-ecosystem
subcategory: lending
axes: [tool-targeted]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [parallel_search]
acceptable_cards: [parallel_extract, scout_research]
forbidden_cards: []
expected_service: parallel
should_fire: true

must_have:
  - { claim: "Discovers the audit source (e.g. the auditing firm's report or Blend's docs) via search, then summarizes its actual findings rather than guessing from the project name.", weight: 5 }
should_have:
  - { claim: "Grounds the summary in the discovered document content, with the source URL cited.", weight: 3 }
nice_to_have:
  - { claim: "Notes Blend is the Soroban lending protocol when contextualizing the audit.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate audit findings, severities, or a firm name not present in the document.", weight: 5 }
  - { claim: "Do NOT confuse Blend (Stellar lending protocol) with blend.com's documents.", weight: 4 }
must_cite:
  - "The discovered audit source URL."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://sorobansecurity.com/report/38
  - https://sorobansecurity.com/report/9
  - https://www.halborn.com/blog/post/explained-the-yieldblox-hack-february-2026
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Discovery-first: parallel_search to find the audit source, then parallel_extract (acceptable) to deep-read it. Grounded: Blend is among the most-audited Soroban protocols — OtterSec, Certora (Jan 2024, for Script3), and a Code4rena assessment (Feb 24–Mar 17, 2025, Blend V2); reports are catalogued on sorobansecurity.com (the Soroban Security Portal). Specific finding severities are not gated — the rubric requires grounding the summary in the discovered report, not a memorized finding list. YieldBlox/Blend V2 oracle-manipulation tie-in VERIFIED 2026-06-29: Halborn URL resolves and the ~$10.2M Feb-22-2026 incident is multi-sourced (Halborn, QuillAudits, Olympix, Protos) — weakness was the pool's thin-liquidity RWA price-feed config, not the audited Blend core contracts."
---

## Reference answer (gospel)

Blend is one of the **most-audited lending protocols on Stellar/Soroban**, with multiple independent
assessments: **Certora** (Jan 2024, prepared for Script3 Ltd) and a **Code4rena** Smart Contract
Security Assessment of **Blend V2** (audit dates **Feb 24 – Mar 17, 2025**), plus **OtterSec** review;
reports are catalogued on the **Soroban Security Portal (sorobansecurity.com)** [sorobansecurity.com/report/38,
/report/9]. The correct behavior is to **discover** one of these reports via search, then **summarize
its actual findings** (the catalogued reports list severity-classified issues) — not to guess from the
project name. A thorough answer may also note that the **Feb 2026 (Feb 21–22) YieldBlox/Blend V2
oracle-manipulation incident** (a completed drain, partially contained by a validator XLM freeze) showed
the weakness was in the **pool's price-feed integration / thin-liquidity RWA pricing, not the audited
Blend core contracts** [halborn.com/blog/post/explained-the-yieldblox-hack-february-2026].

## Why these cards (routing rationale)

No URL is supplied, so the answer must discover the audit source first → `parallel_search`; once a URL
is surfaced, `parallel_extract` (acceptable) deep-reads it. A direct `parallel_extract` is impossible here.

## Edge / traps

Don't fabricate findings/severities or an audit-firm name; ground the summary in the discovered report.
Right Blend (Soroban lending), not blend.com.
