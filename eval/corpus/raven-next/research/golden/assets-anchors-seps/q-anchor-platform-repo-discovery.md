---
id: q-anchor-platform-repo-discovery
q: "Where's the source code for SDF's anchor and disbursement tooling, and which repos should I look at?"
category: assets-anchors-seps
subcategory: anchor-platform
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
  - { claim: "Surfaces the canonical SDF repos: stellar/anchor-platform, stellar/typescript-wallet-sdk, and stellar/stellar-disbursement-platform-backend.", weight: 4 }
should_have:
  - { claim: "Maps each repo to its role (anchor backend / wallet SDK / disbursement backend).", weight: 3 }
nice_to_have:
  - { claim: "Notes these are under the stellar GitHub org.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent repo names/orgs that do not exist (e.g. a fabricated 'stellar/anchor-sdk').", weight: 5 }
must_cite:
  - "The Stellar Light / Scout repo index or the stellar GitHub org."
must_not_use_tier: []

pass_threshold: 0.65
weight_profile: standard

sources:
  - https://github.com/stellar/anchor-platform
  - https://github.com/stellar/stellar-disbursement-platform-backend
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Code-shaped discovery → scout_repos. All three repos confirmed live on the stellar GitHub org (2026-06-22)."
---

## Reference answer (gospel)

The canonical SDF anchor/disbursement source lives under the **`stellar` GitHub org** [1][2]:

- **`stellar/anchor-platform`** — the **Anchor Platform** (Java/Kotlin): turn-key anchor backend
  implementing the SEP-6/10/12/24/31/38 endpoints [1].
- **`stellar/stellar-disbursement-platform-backend`** — the **SDP backend** (Go): bulk-payment
  disbursement service, with native SEP-10/SEP-24 implementations [2].
- **`stellar/typescript-wallet-sdk`** — the **Wallet SDK** (TypeScript): the wallet-side library
  for consuming anchor SEP flows.

These are the repos to look at, each mapped to its role (anchor backend / disbursement backend /
wallet SDK). Do not invent names like a `stellar/anchor-sdk` — these three are the real ones.

Sources: [1] github.com/stellar/anchor-platform; [2] github.com/stellar/stellar-disbursement-platform-backend.

## Why these cards (routing rationale)

Code/repo discovery → `scout_repos` (graded repos); docs acceptable as corroboration.

## Edge / traps

Fabricating non-existent repo names.
