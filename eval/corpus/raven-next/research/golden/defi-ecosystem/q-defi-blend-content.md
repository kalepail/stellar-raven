---
id: q-defi-blend-content
q: "What has been written or said about Blend Capital across Stellar news, research, and talks?"
category: defi-ecosystem
subcategory: lending
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_content_about_project]
acceptable_cards: [lumenloop_search_content_semantic, lumenloop_find_content_by_entity]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Returns curated content (news/research/talks/SCF) about Blend Capital, the Soroban lending protocol.", weight: 5 }
should_have:
  - { claim: "Frames Blend as the Stellar lending money-market primitive when surfacing coverage.", weight: 3 }
nice_to_have:
  - { claim: "Surfaces integrations/adopters (e.g. earn products routing through Blend) if present in coverage.", weight: 1 }
must_avoid:
  - { claim: "Do NOT return coverage about blend.com (US bank lending company) as if it were the Stellar protocol.", weight: 5 }
  - { claim: "Do NOT fabricate articles, quotes, or partnerships not present in the corpus.", weight: 4 }
must_cite:
  - "Each surfaced item carries its source (Lumenloop content record)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/blend
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "GROUNDED 2026-06-22 (re-verified 2026-06-29): Blend confirmed as the Stellar Soroban lending/money-market protocol (Scout: Lending, Live) — 'a lending and borrowing protocol (money market) on Stellar Soroban... permissionless, isolated lending pools.' This is the CONTENT-DISCOVERY lane (resolve→call, multiple sourced news/research/talks/SCF items) → lumenloop_find_content_about_project — DISTINCT from q-defi-blend-what-is (lumenloop_get_project; single identity record). KEY trap is entity resolution: blend.com (US bank-lending company) is NOT this Blend."
---

## Reference answer (gospel)

This is a **content-discovery** query (resolve→call): Raven should return **curated coverage**
(news/research/talks/SCF) about **Blend** — the **Stellar Soroban lending / money-market protocol**
(Live, SCF-funded ~$50K) — each item carrying its own source [1]. Frame Blend as the Stellar
**lending money-market primitive** (permissionless, isolated pools; suppliers earn yield, borrowers
post collateral); surface adopters/integrations (e.g. earn products routing through Blend) where the
corpus shows them. Do not fabricate articles or partnerships.

Source: [1] stellarlight.xyz Blend record (Scout, 2026-06-22).

## Why these cards (routing rationale)

"All content about one named project" is the textbook `lumenloop_find_content_about_project` route
(resolve→call). Semantic content search is an acceptable alternate.

## Edge / traps

Entity-resolution trap: **blend.com** (US bank-lending company) content vs **Stellar Blend** (Soroban
lender). Don't fabricate coverage.
