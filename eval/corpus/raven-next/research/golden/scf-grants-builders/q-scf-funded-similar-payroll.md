---
id: q-scf-funded-similar-payroll
q: "Have any crypto-payroll or stablecoin-payments apps been funded through the SCF before?"
category: scf-grants-builders
subcategory: scf-archive-topic
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [lumenloop_find_similar_scf_submissions]
acceptable_cards: [scout_research, lumenloop_search_content_semantic, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Searches the SCF submissions archive by topic (payroll / stablecoin payments) for prior funded work.", weight: 5 }
  - { claim: "Returns named prior SCF submissions in the payments/payroll space grounded in the archive.", weight: 4 }
should_have:
  - { claim: "Distinguishes the SCF archive answer from general 'crypto payroll' web results.", weight: 2 }
nice_to_have:
  - { claim: "Notes payments is a core Stellar theme, so prior funded work is likely.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent SCF-funded payroll projects or amounts not present in the archive.", weight: 5 }
  - { claim: "Do NOT claim nothing has been funded without actually querying the SCF archive.", weight: 3 }
must_cite:
  - "Lumenloop's SCF submissions archive (find_similar_scf_submissions) results."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/stables
  - https://communityfund.stellar.org/awards
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2nd archive-by-topic case. Verified 2026-06-29 via /api/projects: Stables $150,000 (round 36), Alfred $335,000 (rounds 9,19), PayZoll $100,000 (round 36), BlindPay $40,000 (rounds 30,33) — all match. Amounts are live totals → freshness-sensitive."
---

## Reference answer (gospel)

- Route to the SCF submissions archive by topic (payroll / stablecoin payments) via `lumenloop_find_similar_scf_submissions`; query the archive rather than asserting a yes/no. Source: https://communityfund.stellar.org/awards
- Return NAMED prior funded work in the payments/payroll space — e.g. Stables ($150,000), Alfred ($335,000), PayZoll ($100,000), BlindPay ($40,000). Source (named example): https://stellarlight.xyz/project/stables
- Distinguish the SCF-archive answer from general "crypto payroll" web results; payments is a core Stellar theme, so prior funded work is likely — but confirm it in the archive.
- Honesty case — do NOT invent SCF-funded payroll projects or amounts, and do NOT claim nothing has been funded without actually querying the archive.

## Why these cards (routing rationale)

Topic-level prior-funding check → `lumenloop_find_similar_scf_submissions`.

## Edge / traps

Trap: a bare yes/no without querying the archive, or fabricated projects.
