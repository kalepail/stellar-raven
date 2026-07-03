---
id: q-defi-phoenix-scf
q: "Show Phoenix's SCF submission history on Stellar."
category: defi-ecosystem
subcategory: dex-amm
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
  - { claim: "Resolves Phoenix (Soroban DeFi-Hub / AMM DEX, $PHO token) and reports it IS SCF-funded, citing its SCF total (~$394,500 per the directory record), or honestly states the figure if the live number differs.", weight: 5 }
should_have:
  - { claim: "Identifies Phoenix as the Soroban DeFi-Hub / AMM project (constant-product + stableswap pools) when scoping the lookup.", weight: 2 }
nice_to_have:
  - { claim: "Notes the SCF submission framed the DEX as the first of several products in the DeFi hub.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate an SCF round number, amount, or tier for Phoenix not present in source data.", weight: 5 }
must_cite:
  - "The SCF submission/funding record for Phoenix (Lumenloop/Scout directory)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/phoenix
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "GROUNDED: live Scout (2026-06-22, /api/projects/search?q=Phoenix) confirms Phoenix (DeFi Hub AMM DEX, $PHO, Live) scfAwarded=true, scfTotalAwardedUSD=394500. Rubric now rewards reporting the real ~$394.5K and forbids a fabricated figure. REVIEWED 2026-06-29: re-confirmed live (q=Phoenix → 'Phoenix DeFi Hub is an SCF-funded AMM-based DEX on Stellar/Soroban (PHO token)', constant-product + stableswap pools, Live, scfTotalAwardedUSD=394500, phoenix-hub.io). SCF $ drift-sensitive → freshness_sensitive:true (quarterly); must_have now allows an honest restatement if the live figure moves rather than gating on the frozen dollar amount."
---

## Reference answer (gospel)

**Phoenix is SCF-funded.** The directory record for **Phoenix** (the Soroban **DeFi Hub** AMM-based DEX,
**$PHO** token, status Live — running constant-product and stableswap pools) shows
**`scfAwarded: true`** with an **SCF total of ~$394,500** [1]. The SCF submission framed the AMM DEX as
the first of several products in the hub. Route is resolve Phoenix → report its SCF history.

Source: [1] stellarlight.xyz Phoenix directory record (Scout, 2026-06-22).

## Why these cards (routing rationale)

Per-project SCF history → `lumenloop_get_scf_submissions` (resolve Phoenix → call).

## Edge / traps

Don't fabricate amounts/tiers.
