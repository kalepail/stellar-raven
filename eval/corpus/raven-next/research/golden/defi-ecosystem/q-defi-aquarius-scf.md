---
id: q-defi-aquarius-scf
q: "Did Aquarius get SCF grants, and what does its Stellar Community Fund history look like?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_scf_submissions]
acceptable_cards: [lumenloop_find_content_about_project, lumenloop_find_similar_scf_submissions]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Resolves Aquarius and reports that it IS SCF-awarded, with its submission history/amount from the source data (Scout shows ~$391K total SCF awarded).", weight: 5 }
should_have:
  - { claim: "Identifies Aquarius as the Stellar AMM / liquidity-rewards project when scoping the lookup.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes award type / round if present, and treats the dollar figure as tool-sourced (not asserted).", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate an SCF round, amount, or tier for Aquarius not present in source data.", weight: 5 }
  - { claim: "Do NOT claim Aquarius received no SCF funding — it is SCF-awarded.", weight: 3 }
must_cite:
  - "The SCF submission record for Aquarius (Scout/Lumenloop), with the tool-sourced amount."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/aquarius
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "lumenloop_get_scf_submissions. Anti-fabrication. Grounded on Scout: Aquarius is scfAwarded=true, scfTotalAwardedUSD ≈ $391,000. The exact dollar total is tool-sourced and may shift; gate on 'is SCF-awarded + cite the record,' reward the correct ballpark."
---

## Reference answer (gospel)

**Aquarius IS SCF-awarded.** Scout's project record reports **`scfAwarded: true`** with a total of
roughly **$391,000** in SCF funding [Scout: stellarlight.xyz/project/aquarius]. The correct
Raven-shaped answer resolves Aquarius (the Stellar Soroban AMM / liquidity-rewards project) and reports
its SCF submission history/amount **from the tool record** rather than asserting a number from memory.
If the per-round breakdown isn't surfaced, report the SCF-awarded status + total and note the rounds
aren't in the corpus — never invent a round/tier.

## Why these cards (routing rationale)

Per-project SCF history → `lumenloop_get_scf_submissions`.

## Edge / traps

Inventing an SCF amount/round is an auto-fail; so is claiming Aquarius got no SCF funding. Treat the
~$391K total as tool-sourced (it can change).
