---
id: q-tool-indexer-repos-discovery
q: "Find me open-source GitHub repos for indexing Soroban contract events or building a Stellar indexer."
category: tooling-infra
subcategory: indexers-discovery
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_repos]
acceptable_cards: [stellar_docs_mcp, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns concrete Stellar/Soroban GitHub repositories relevant to indexing/event ingestion, ranked (e.g. by repoScore/stars).", weight: 5 }
  - { claim: "Surfaces real ecosystem indexer/code candidates (e.g. SubQuery's Stellar starter, OBSRVR, Mercury, or Soroban event-indexing repos) rather than prose-only docs.", weight: 3 }
should_have:
  - { claim: "Distinguishes code/repo discovery from conceptual docs lookups.", weight: 2 }
nice_to_have:
  - { claim: "Notes repoScore/activity as a ranking signal for quality.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate repo names/URLs that don't exist.", weight: 4 }
must_cite:
  - "Scout repo results (stellarlight.xyz/api/repos) and/or the GitHub repos returned."
must_not_use_tier: []

pass_threshold: 0.68
weight_profile: standard

sources:
  - https://stellarlight.xyz/api/repos/search
  - https://developers.stellar.org/docs/data/indexers
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Code-shaped discovery → scout_repos is the designed surface. Fabricated repos are the trap."
---

## Reference answer (gospel)

This is a **code/repo discovery** request, so Raven should return **concrete, ranked Stellar/Soroban
GitHub repositories** for indexing/event ingestion — not prose docs. The right surface is **`scout_repos`**
(Stellar Light's graded GitHub repos, ranked by `repoScore`/stars/activity). Real ecosystem candidates
it should surface include the **SubQuery Stellar starter (`subquery/stellar-subql-starter`)**, **OBSRVR**,
**Mercury**, and Soroban event-indexing repos. Repo activity/`repoScore` is a useful quality/maintenance
signal. (The conceptual **Indexers Overview** docs page is acceptable supporting context, but the
deliverable is a repo list, not an essay.)

## Why these cards (routing rationale)

A code/repo discovery question is exactly `scout_repos`' lane (graded GitHub repos by repoScore). `stellar_docs_mcp` is acceptable for the conceptual Indexers Overview but a repo list is the better fit. Deep-research/general-web are misses.

## Edge / traps

Hallucinated repos/URLs, or answering with prose-only docs instead of concrete repos, are the traps.
