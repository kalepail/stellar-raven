---
id: q-rwa-projects-tokenizing-stellar
q: "Which projects or institutions are tokenizing real-world assets on Stellar?"
category: compliance-rwa-payments
subcategory: rwa-legal-structuring
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly
expected_cards: [scout_projects]
acceptable_cards: [lumenloop_find_similar_projects_semantic, scout_research, perplexity_search, lumenloop_request_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Names major institutional RWA issuers on Stellar, e.g. Franklin Templeton (BENJI) and WisdomTree.", weight: 5 }
should_have:
  - { claim: "Mentions other RWA/tokenization participants (e.g. DTCC's planned DTC tokenization service) and treats the landscape as evolving.", weight: 3 }
  - { claim: "Notes these use Stellar's regulated-asset model (SEP-8 + flags).", weight: 2 }
nice_to_have:
  - { claim: "Flags the list is non-exhaustive and freshness-sensitive.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent fictional RWA projects or attribute unrelated chains' projects to Stellar.", weight: 4 }
  - { claim: "Do NOT present a forward-dated plan (e.g. DTCC 1H27) as already-live tokenization.", weight: 3 }
must_cite:
  - "Scout/Lumenloop project directory entries and/or dated issuer sources."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://stellar.org/case-studies/franklin-templeton
  - https://stellar.org/case-studies/wisdomtree
  - https://www.dtcc.com/news/2026/may/27/tokenization-service-to-connect-with-stellar-public-blockchain-as-dtc-advances-multi-chain-strategy
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 re-verified dated claims and freshness-gated. Franklin Templeton (BENJI/FOBXX, ~$654M AUM on Stellar) and WisdomTree (Prime funds + gold) confirmed; Figure YLDS = SEC-registered face-amount certificate, live on Stellar May 5, 2026 (stellar.org/press/figure-announces-launch-of-ylds-on-stellar-network) — consistent with q-rwa-dtcc-tokenization which keeps DTCC's DTC service PLANNED for H1 2027 (not live). Ondo Finance also active. Landscape evolving/freshness-sensitive (quarterly). Trap: inventing projects or presenting DTCC's forward-dated plan as live."
---

## Reference answer (gospel)

- Major institutional RWA issuers on Stellar include **Franklin Templeton (BENJI / FOBXX money-market
  fund)** and **WisdomTree (Prime digital funds + gold token)** [1][2].
- Other participants: **Figure** (YLDS, an SEC-registered yield-bearing dollar product, live on Stellar
  May 5, 2026), **Ondo Finance**, and **DTCC's DTC tokenization service** — which is **planned for H1 2027,
  not yet live** [3].
- These use Stellar's **regulated-asset model (SEP-8 + authorization flags)** [2].
- The **list is non-exhaustive and freshness-sensitive** — the landscape is evolving. Don't invent
  fictional projects, attribute other chains' projects to Stellar, or present DTCC's forward-dated plan as
  already-live tokenization.

Sources: [1] stellar.org Franklin Templeton; [2] stellar.org WisdomTree; [3] DTCC press release.

## Why these cards (routing rationale)

"Who is building/doing X" discovery → `scout_projects` (and `lumenloop_find_similar_projects_semantic`); `scout_research`/`perplexity_search` acceptable for institutional detail.

## Edge / traps

Trap: fabricating projects; presenting forward-dated plans as live.
