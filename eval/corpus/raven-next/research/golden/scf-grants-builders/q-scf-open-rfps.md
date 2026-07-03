---
id: q-scf-open-rfps
q: "What SCF RFPs are open right now — what is the SCF asking builders to build this quarter?"
category: scf-grants-builders
subcategory: rounds-rfps
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: "weekly"

expected_cards: [scout_rfps]
acceptable_cards: [scout_research, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns currently open SCF RFP briefs (the funding opportunities the SCF is soliciting).", weight: 5 }
  - { claim: "Flags that the open-RFP set is time-sensitive and tied to the active SCF quarter/round.", weight: 3 }
should_have:
  - { claim: "RFPs are reviewed via the SCF Build RFP Track (panel-only, no community vote).", weight: 2 }
  - { claim: "RFP awards follow the standard SCF Build $150K XLM cap (per-RFP bounties are not separately published).", weight: 2 }
nice_to_have:
  - { claim: "As of the 2026-06-29 live RFP feed (activeQuarter q2-2026), open RFPs include Trustline Onboarder, Passkey UI Kit, Account Demolisher, Contract Source Verification Service, and OZ Accounts Policy Builder.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present a specific RFP list as permanently current — the open set rotates by quarter.", weight: 4 }
  - { claim: "Do NOT invent RFP titles, per-RFP dollar amounts, or deadlines not in a source.", weight: 4 }
must_cite:
  - "The SCF RFP Track handbook page and/or the live RFPs feed."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellarlight.xyz"
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Dossier §4.2. scout_rfps is the exact card for 'what is SCF asking to be built'. Freshness item — confidence stays medium because the open set rotates. Re-verified live 2026-06-29 (/api/rfps): activeQuarter q2-2026, 5 open / 9 closed, open briefs unchanged (Trustline Onboarder, Passkey UI Kit, Account Demolisher, Contract Source Verification Service, OZ Accounts Policy Builder). Rubric gates on the freshness caveat, not the exact list."
---

## Reference answer (gospel)

- The right source is Stellar Light's `scout_rfps` — it returns the currently open SCF RFP briefs (the work the SCF is soliciting) for the active quarter. [Stellar Light scout / stellarlight.xyz]
- **Time-sensitive set (2026-06-29 live feed):** `activeQuarter = q2-2026`, **5 open / 9 closed**.
  The open briefs are **Trustline Onboarder**, **Passkey UI Kit**, **Account Demolisher**,
  **Contract Source Verification Service**, and **OZ Accounts Policy Builder**. Report this as a
  dated live snapshot, not a fixed list. [scout_rfps `/api/rfps`]
- **Always flag freshness:** the open-RFP set rotates by SCF quarter/round, so confirm against the
  live RFP feed. The Q1 2026 briefs **Prices API & Indexing Service**, **DeFi Positions API**, etc.
  are closed in the 2026-06-29 feed and should not be presented as currently fundable. [stellarlight.xyz scout]
- RFPs are reviewed via the **SCF Build RFP Track** — panel-only, no community (NQG) vote — and follow the standard **$150K-in-XLM** Build cap; per-RFP bounties are not separately published. [SCF Build Award handbook]
- Don't invent RFP titles, per-RFP dollar amounts, or deadlines not in the live feed.

## Why these cards (routing rationale)

"Open SCF RFPs / what to build this quarter" is the textbook `scout_rfps` query (its good_at).

## Edge / traps

Trap: freezing a rotating RFP list, or inventing per-RFP bounty amounts the handbook doesn't publish.
