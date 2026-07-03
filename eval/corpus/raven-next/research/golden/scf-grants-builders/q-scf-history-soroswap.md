---
id: q-scf-history-soroswap
q: "Has Soroswap been funded by the SCF, and across how many rounds?"
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
  - { claim: "Resolves Soroswap (the Stellar/Soroban DEX/AMM) and returns its SCF submission history.", weight: 5 }
  - { claim: "Answers whether it was SCF-funded and across how many rounds, grounded in the submissions record.", weight: 4 }
should_have:
  - { claim: "Reports the award type(s) (e.g. Build) where the record shows them.", weight: 2 }
nice_to_have:
  - { claim: "Notes amounts only where present in the data.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate a round count or award amount not in the SCF submissions record.", weight: 5 }
  - { claim: "Do NOT confuse Soroswap with Soroban (the smart-contract platform) or with another DEX.", weight: 3 }
must_cite:
  - "Soroswap's SCF submissions record (Lumenloop) / its communityfund project page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellarlight.xyz/project/soroswap"
  - "https://communityfund.stellar.org"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Per-project SCF history. 'Has X been funded' phrasing borders on find_similar_scf_submissions, but a named project → get_scf_submissions. Verified 2026-06-29 via /api/projects: Soroswap scf.awarded=true, totalAwarded=$346,750, category Protocol/Contract, awardedRounds [15,17,21] (3 rounds). Funding total is live → freshness-sensitive."
---

## Reference answer (gospel)

- Resolve the named project **Soroswap** (the Stellar/Soroban DEX/AMM, live on mainnet) and pull its SCF history via `lumenloop_get_scf_submissions`. [Lumenloop / stellarlight.xyz/project/soroswap]
- **Yes, Soroswap is SCF-funded.** Per the live record (`scfAwarded: true`), its total SCF award is **$346,750 USD**, category Protocol/Contract. State that this total comes FROM the record. [stellarlight.xyz/project/soroswap]
- **Round count:** the live record now lists the awarded rounds — Soroswap was funded across **3 SCF rounds (15, 17, 21)** for the **$346,750** cumulative total. Report the round count from the record; do NOT invent a per-round dollar split or specific award types beyond what the record shows. Confirm exact per-round figures/types on Soroswap's communityfund project page. [communityfund.stellar.org]
- Report award type(s) (e.g. Build) and amounts only where the record shows them; don't fabricate figures.
- Don't confuse Soroswap (the DEX) with Soroban (the smart-contract platform) or with another DEX.

## Why these cards (routing rationale)

A *named* project's funding history → `lumenloop_get_scf_submissions`. (Contrast: a *topic* "has
anything like X been funded" → find_similar_scf_submissions.)

## Edge / traps

Trap: inventing a round count, or confusing Soroswap with Soroban.
