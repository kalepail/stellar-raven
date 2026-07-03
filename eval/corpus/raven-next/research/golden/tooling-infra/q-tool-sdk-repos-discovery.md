---
id: q-tool-sdk-repos-discovery
q: "What are the top-rated Stellar/Soroban SDK and client-library repos on GitHub?"
category: tooling-infra
subcategory: sdks-discovery
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_repos]
acceptable_cards: [stellar_docs_mcp, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns graded Stellar/Soroban SDK/library GitHub repos ranked by repoScore/stars.", weight: 5 }
  - { claim: "Surfaces the real canonical repos (e.g. js-stellar-sdk, rs-soroban-sdk, go-stellar-sdk, py-stellar-base) rather than prose docs.", weight: 3 }
should_have:
  - { claim: "Distinguishes SDF-maintained from community-maintained repos where evident.", weight: 2 }
nice_to_have:
  - { claim: "Notes repoScore/activity as the ranking signal.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate repo names/URLs or rank a non-Stellar library as the top Stellar SDK.", weight: 4 }
must_cite:
  - "Scout repo results (stellarlight.xyz/api/repos) and/or the GitHub repos returned."
must_not_use_tier: []

pass_threshold: 0.68
weight_profile: standard

sources:
  - https://stellarlight.xyz/api/repos/search
  - https://github.com/stellar/js-stellar-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified Scout /api/repos/search returns graded repos ranked by repoScore; query 'stellar sdk' surfaces stellar/js-stellar-sdk (≈690 stars) at the top. Real canonical repos confirmed. Fabrication is the trap."
---

## Reference answer (gospel)

This is a **code/repo ranking** query → the **Scout repos** surface
(`stellarlight.xyz/api/repos/search`), which returns graded Stellar/Soroban GitHub repos ranked by
**repoScore** (freshness + traction + builder/SCF authority), not prose docs.

- It surfaces the **real canonical SDK/library repos**, e.g. **`stellar/js-stellar-sdk`** (the JS
  client, ~690 stars), **`stellar/rs-soroban-sdk`** (Rust contract SDK), **`stellar/go-stellar-sdk`**,
  **`stellarcn/py-stellar-base`** (Python), etc.
- Where evident, distinguish **SDF-maintained** (JS, Go, Rust contract/client) from
  **community-maintained** repos (Python, Java, Flutter/iOS/PHP).
- Ranking signal = repoScore / activity; cite each repo's URL.

Do not fabricate repo names/URLs or rank a non-Stellar library as the top Stellar SDK.

## Why these cards (routing rationale)

'Top SDK repos' is a code/repo ranking query → `scout_repos`. `stellar_docs_mcp` acceptable for the SDK index. Deep-research/general-web are misses.

## Edge / traps

Hallucinated/non-Stellar repos are the trap.
