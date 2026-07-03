---
id: q-anchor-platform-what
q: "What is the Stellar Anchor Platform and which SEPs does it implement?"
category: assets-anchors-seps
subcategory: anchor-platform
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Anchor Platform is SDF's (Java) backend/toolset for deploying a SEP-compliant anchor (on/off-ramp) service.", weight: 5 }
  - { claim: "It implements the anchor SEP set: SEP-1, SEP-6, SEP-10, SEP-12, SEP-24, SEP-31, and SEP-38 (plus SEP-45).", weight: 4 }
should_have:
  - { claim: "It is the fastest way to go live as an anchor without re-implementing the SEP endpoints.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes it from the (TypeScript) Wallet SDK, which is the wallet-side counterpart.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber the SEPs the Anchor Platform implements.", weight: 5 }
  - { claim: "Do NOT claim the Anchor Platform is a wallet app or a consumer product rather than anchor backend infrastructure.", weight: 3 }
must_cite:
  - "The Anchor Platform page on developers.stellar.org or the stellar/anchor-platform repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/platforms/anchor-platform
  - https://github.com/stellar/anchor-platform
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §5.4. Verified: SDF-maintained Java toolset; docs list SEP-1/6/10/12/24/31/38/45. scout_repos acceptable (graded repo)."
---

## Reference answer (gospel)

- The **Anchor Platform** is **SDF's (Java) toolset/backend** for building and running a SEP-compliant anchor (on/off-ramp) service — the fastest way to go live without re-implementing the SEP endpoints [1][2].
- It implements the anchor SEP set: **SEP-1, SEP-6, SEP-10, SEP-12, SEP-24, SEP-31, SEP-38** (and SEP-45 for contract-account auth) [1].
- It is **anchor-operator backend infrastructure**, not a consumer app — distinct from the (TypeScript) **Wallet SDK**, which is the wallet-side client counterpart [1].

## Why these cards (routing rationale)

Product/docs fact → `stellar_docs_mcp`; `scout_repos` acceptable (graded repo). No general-web/deep-research.

## Edge / traps

SEP misnumbering, or confusing the Anchor Platform (anchor backend) with the Wallet SDK (wallet client) or with a consumer wallet app.
