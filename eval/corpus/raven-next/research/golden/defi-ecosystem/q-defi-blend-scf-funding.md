---
id: q-defi-blend-scf-funding
q: "Has Blend received any Stellar Community Fund (SCF) funding, and what's its SCF history?"
category: defi-ecosystem
subcategory: lending
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [lumenloop_get_scf_submissions]
acceptable_cards: [lumenloop_find_content_about_project, lumenloop_get_project]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Reports that Blend HAS received SCF funding — resolving the Blend project and citing its SCF total (~$50,000 per the directory record), or honestly states the figure if the live number differs.", weight: 5 }
should_have:
  - { claim: "Identifies Blend as the Soroban lending/money-market protocol (independent blend-capital team) when scoping the SCF lookup.", weight: 3 }
nice_to_have:
  - { claim: "Notes the SCF figure is directory-sourced and may be cumulative across rounds.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent a fabricated SCF round number, dollar amount, or award tier for Blend that is not in the source data.", weight: 5 }
  - { claim: "Do NOT confuse Blend with blend.com (US bank-lending company) or attribute another lender's SCF history to it.", weight: 4 }
must_cite:
  - "The SCF submission/funding record for Blend (Lumenloop/Scout directory)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/blend
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "GROUNDED: live Scout (2026-06-22, /api/projects/search?q=Blend) confirms Blend (Lending, Live) scfAwarded=true, scfTotalAwardedUSD=50000. The Phase-1 dossier had NO confirmed Blend SCF figure; live data fills it in. Rubric now rewards reporting the real ~$50K and forbids fabricating a different amount. Entity-resolution trap (Blend vs blend.com) preserved. REVIEWED 2026-06-29: re-confirmed live (q=Blend → category Protocol/Contract, type Lending, Live, scfTotalAwardedUSD=50000, blend.capital). SCF $ is drift-sensitive, so set freshness_sensitive:true (quarterly) and rubric gates on the discipline (cite the directory SCF record + allow honest restatement if the live figure moved), not the frozen $50K."
---

## Reference answer (gospel)

**Yes — Blend has received SCF funding.** The directory record for **Blend** (the Soroban
lending/money-market protocol, status Live, by the independent blend-capital team) shows
**`scfAwarded: true`** with an **SCF total of ~$50,000** [1]. Route is resolve Blend → report its SCF
submission/funding history; do not fabricate a different round/amount.

Source: [1] stellarlight.xyz Blend directory record (Scout, 2026-06-22).

## Why these cards (routing rationale)

Per-project SCF funding history is the exact job of `lumenloop_get_scf_submissions` (resolve Blend →
call). `find_content_about_project` / `get_project` are acceptable supporting alternates.

## Edge / traps

The trap is inventing an SCF amount or confusing **Blend** (Stellar Soroban lender) with **blend.com**
(US bank-lending company). The grounded figure is ~$50K — a fabricated number is an auto-fail.
