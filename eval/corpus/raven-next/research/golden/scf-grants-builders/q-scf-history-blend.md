---
id: q-scf-history-blend
q: "What is Blend's SCF funding history — which rounds did it win and what award types?"
category: scf-grants-builders
subcategory: per-project-history
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [lumenloop_get_scf_submissions]
acceptable_cards: [lumenloop_find_content_about_project, lumenloop_get_project, scout_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Resolves Blend (the Stellar lending protocol) to its project record and returns its SCF submission/funding history.", weight: 5 }
  - { claim: "Reports the specific SCF round(s) and award type(s) Blend received, grounded in the submissions data.", weight: 4 }
should_have:
  - { claim: "Distinguishes SCF awards from any SDF-direct funding when reporting Blend's history.", weight: 2 }
nice_to_have:
  - { claim: "Notes award amounts only where the submissions record provides them.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent specific round numbers or XLM/USD award amounts not present in the SCF submissions record.", weight: 5 }
  - { claim: "Do NOT confuse Blend (Stellar/Soroban lending) with a similarly named non-Stellar project.", weight: 3 }
must_cite:
  - "Blend's SCF submissions record (via Lumenloop get_scf_submissions) / its communityfund project page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellarlight.xyz/project/blend"
  - "https://communityfund.stellar.org"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Per-project SCF history → lumenloop_get_scf_submissions (resolve→call). Amounts must come from the record, not invented. Verified 2026-06-29 via /api/projects: Blend scf.awarded=true, totalAwarded=$50,000, category Protocol/Contract; record carries no awardedRounds breakdown (rounds null) so round count stays unstated. Funding total is live → freshness-sensitive."
---

## Reference answer (gospel)

- Resolve the named project **Blend** (the Stellar/Soroban lending protocol) and pull its SCF history via `lumenloop_get_scf_submissions`. [Lumenloop / stellarlight.xyz/project/blend]
- **Blend is SCF-funded.** Per the live record (`scfAwarded: true`), its total SCF award is **$50,000 USD**. State that this total comes FROM the record. [stellarlight.xyz/project/blend]
- **Round/award-type breakdown:** the live record reports a funded total but does NOT cleanly break out round-by-round; do NOT invent specific round numbers or award types. Confirm exact rounds/types on Blend's communityfund project page. [communityfund.stellar.org]
- Distinguish SCF awards from any SDF-direct funding, and report amounts only where the record provides them.
- Don't confuse Blend (Stellar/Soroban lending) with a similarly named non-Stellar project.

## Why these cards (routing rationale)

One project's SCF funding history → `lumenloop_get_scf_submissions` (resolve directory → call by slug)
is the exact card. `find_content_about_project`/`get_project` are acceptable corroboration.

## Edge / traps

Trap: inventing round numbers/amounts. The must_avoid forbids fabricating award figures.
