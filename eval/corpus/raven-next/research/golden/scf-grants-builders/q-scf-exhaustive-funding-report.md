---
id: q-scf-exhaustive-funding-report
q: "Give me a quick answer: how much has the SCF distributed and to how many projects? (don't run a deep-research report)"
category: scf-grants-builders
subcategory: funding-totals
axes: [edge-governance, tool-targeted]
query_type: governance-negative
difficulty: hard
freshness_sensitive: true
freshness_horizon: "weekly"

expected_cards: [scout_analyze]
acceptable_cards: [scout_research, lumenloop_search_content_semantic]
forbidden_cards: [lumenloop_request_research, lumenloop_research_result, scout_hackathon_compare]
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Answers the totals/count from a lightweight analytics lookup, NOT a metered deep-research run.", weight: 5 }
  - { claim: "Reports cumulative SCF distribution + project count with a freshness caveat.", weight: 4 }
should_have:
  - { claim: "Stays inside the keyless/low-cost analytics tier appropriate to a simple lookup.", weight: 2 }
nice_to_have:
  - { claim: "As of the 2026-06-29 live analytics, ~$19.97M USD across ~223 distinct funded projects via scout_analyze funding dimension (the communityfund awards counter separately shows ~504 awarded submissions).", weight: 1 }
must_avoid:
  - { claim: "Do NOT invoke the metered async deep-research lane (lumenloop_request_research) for a simple totals lookup.", weight: 5 }
  - { claim: "Do NOT escalate to Parallel/Perplexity deep research when keyless Stellar analytics answers it.", weight: 4 }
must_cite:
  - "Stellar Light analytics (scout_analyze funding) for the totals."
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources:
  - "https://stellarlight.xyz"
  - "https://communityfund.stellar.org/awards"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Governance-negative: the over-escalation trap. A simple totals lookup must NOT route to the banned/metered deep-research lane. Strict profile. Re-verified live 2026-06-29: scout_analyze funding = ~$19.97M / 223 projects; awards counter ~504 submissions. Kept in sync with q-scf-total-distributed."
---

## Reference answer (gospel)

- **Governance rule (the whole point):** answer the totals from the cheap, keyless `scout_analyze` **funding dimension** — a single lightweight analytics lookup. Do NOT escalate to the metered async `lumenloop_request_research` lane, and do NOT fire Parallel/Perplexity deep research, despite the word "report" in the ask. [Stellar Light scout / stellarlight.xyz]
- **Time-sensitive answer (2026-06-29 live analytics):** ~**$19.97M USD** across ~**223 distinct funded projects** (mean ≈ $89.5K). Report with a freshness caveat — totals accrue every ~6-week round and the live metric drifts (it was $21.36M / 239 a week earlier). [scout_analyze `?dimension=funding`]
- **Confirm live:** re-check against `scout_analyze` funding and the live awards counter, which use different bases — the communityfund.stellar.org/awards page showed ~504 awarded submissions (submissions, not distinct projects). [communityfund.stellar.org/awards]
- Stay inside the keyless/low-cost analytics tier — that tier already answers a simple totals+count lookup; reaching for deep research is over-escalation, not thoroughness.
- Keep scope distinct: SCF cumulative distribution ≠ SDF treasury, ≠ XLM supply, ≠ SDF Enterprise Fund.

## Why these cards (routing rationale)

A simple totals lookup → `scout_analyze` (funding). The governance point: it must NOT fire the
metered `lumenloop_request_research` lane or Parallel/Perplexity deep research. Those are forbidden.

## Edge / traps

THE governance trap: over-escalating a cheap lookup to a banned/metered deep-research tier.
