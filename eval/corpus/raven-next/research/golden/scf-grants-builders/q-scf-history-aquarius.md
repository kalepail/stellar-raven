---
id: q-scf-history-aquarius
q: "Pull the SCF award history for the Aquarius (AQUA) project — rounds, award types, and amounts where available."
category: scf-grants-builders
subcategory: per-project-history
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [lumenloop_get_scf_submissions]
acceptable_cards: [lumenloop_find_content_about_project, lumenloop_get_project]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Resolves Aquarius/AQUA (Stellar AMM/liquidity-incentive protocol) and returns its SCF submission history.", weight: 5 }
  - { claim: "Reports the round(s) and award type(s) from the submissions record.", weight: 4 }
should_have:
  - { claim: "Reports amounts only where the record provides them, and says so explicitly when absent.", weight: 3 }
nice_to_have:
  - { claim: "Distinguishes Aquarius's SCF awards from any non-SCF token-incentive activity (AQUA emissions).", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent award amounts or round numbers not present in the SCF submissions record.", weight: 5 }
  - { claim: "Do NOT conflate the AQUA token's market activity / emissions with SCF grant funding.", weight: 4 }
must_cite:
  - "Aquarius's SCF submissions record (Lumenloop) / communityfund project page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellarlight.xyz/project/aquarius"
  - "https://communityfund.stellar.org"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "3rd per-project-history case. Trap: AQUA token emissions ≠ SCF grants. Verified 2026-06-29 via /api/projects: Aquarius scf.awarded=true, totalAwarded=$391,000, category Protocol/Contract, awardedRounds [17,23,27,30] (4 rounds now broken out in the record). Funding total is live → freshness-sensitive."
---

## Reference answer (gospel)

- Resolve the named project **Aquarius (AQUA)** — the Stellar AMM / liquidity-incentive protocol — and pull its SCF history via `lumenloop_get_scf_submissions`. [Lumenloop / stellarlight.xyz/project/aquarius]
- **Aquarius is SCF-funded.** Per the live record (`scfAwarded: true`), its total SCF award is **$391,000 USD**. State that this total comes FROM the record. [stellarlight.xyz/project/aquarius]
- **Rounds:** the live record now lists the awarded rounds — Aquarius won across **4 SCF rounds (17, 23, 27, 30)** for the **$391,000** cumulative total. The record gives the round numbers and the aggregate, but does NOT cleanly break out a per-round dollar split — do NOT invent per-round amounts or award types. Confirm exact per-round figures/types on Aquarius's communityfund project page. [communityfund.stellar.org]
- **Critical trap:** do NOT conflate the AQUA token's market activity / liquidity-incentive emissions with SCF grant funding — only the `scfTotalAwardedUSD` figure is the SCF grant total.

## Why these cards (routing rationale)

Named-project SCF history → `lumenloop_get_scf_submissions` (resolve→call).

## Edge / traps

Trap: inventing amounts; conflating AQUA token emissions with SCF grant funding.
