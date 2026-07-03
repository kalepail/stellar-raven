---
id: q-defi-soroswap-scf
q: "Pull Soroswap's SCF funding history — which rounds and award types?"
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
  - { claim: "Resolves Soroswap and reports that it IS SCF-awarded with its submission history/amount from the source data (Scout shows ~$346,750 total SCF awarded).", weight: 5 }
should_have:
  - { claim: "Identifies Soroswap as the Stellar DEX/aggregator (built by PaltaLabs) when scoping the SCF lookup.", weight: 3 }
nice_to_have:
  - { claim: "Distinguishes the award type / round if present, treating the dollar figure as tool-sourced.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate an SCF round, dollar amount, or award tier for Soroswap not present in the source data.", weight: 5 }
  - { claim: "Do NOT claim Soroswap received no SCF funding — it is SCF-awarded.", weight: 3 }
must_cite:
  - "The SCF submission record for Soroswap (Scout/Lumenloop), with the tool-sourced amount."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/soroswap
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "lumenloop_get_scf_submissions (resolve→call). Anti-fabrication on SCF figures. Grounded on Scout: Soroswap is scfAwarded=true, scfTotalAwardedUSD ≈ $346,750 (built by PaltaLabs). Gate on 'is SCF-awarded + cite the record'; the exact total is tool-sourced and may shift."
---

## Reference answer (gospel)

**Soroswap IS SCF-awarded.** Scout's project record reports **`scfAwarded: true`** with a total of
roughly **$346,750** in SCF funding [Scout: stellarlight.xyz/project/soroswap]. Soroswap is the Stellar
**DEX + DEX aggregator** on Soroban (built by **PaltaLabs**). The correct answer resolves Soroswap and
reports its SCF history/amount **from the tool record**; if the per-round breakdown isn't surfaced,
report the SCF-awarded status + total and note the rounds aren't in the corpus — never invent a
round/tier.

## Why these cards (routing rationale)

Per-project SCF history → `lumenloop_get_scf_submissions`.

## Edge / traps

Inventing an SCF amount/round is an auto-fail; claiming no SCF funding is wrong. The ~$346.7K total is
tool-sourced (can change).
