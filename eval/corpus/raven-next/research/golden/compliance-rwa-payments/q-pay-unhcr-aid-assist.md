---
id: q-pay-unhcr-aid-assist
q: "How has Stellar been used for humanitarian aid disbursement, e.g. by UNHCR via Stellar Aid Assist?"
category: compliance-rwa-payments
subcategory: remittance-disbursement
axes: [edge-governance, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly
expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search, lumenloop_find_content_by_entity]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Stellar Aid Assist (built on the Stellar Disbursement Platform) has been used by humanitarian orgs (UNHCR, IRC) to deliver digital cash assistance, e.g. to refugees/conflict-affected people in Ukraine.", weight: 5 }
should_have:
  - { claim: "Cites a dated, time-sensitive figure (e.g. ~$4.6M to ~2,500 households in Ukraine as of late 2024) and flags it as a snapshot.", weight: 3 }
  - { claim: "Recipients need only a mobile phone; cash-out is available across many countries via anchors.", weight: 2 }
nice_to_have:
  - { claim: "Notes the Travel Rule / KYC obligation sits with the originating humanitarian org, not Stellar.", weight: 2 }
must_avoid:
  - { claim: "Do NOT invent specific disbursement totals or beneficiary counts beyond the record (flag uncertainty / cite a date).", weight: 4 }
  - { claim: "Do NOT claim Stellar/SDF itself performs the KYC or controls the third-party cash-out fees.", weight: 2 }
must_cite:
  - "A dated SDF/UNHCR/IRC case study or reputable coverage."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://stellar.org/blog/foundation-news/stellar-aid-assist-2-year-anniversary
  - https://stellar.org/case-studies/unhcr
  - https://stellar.org/use-cases/stellar-for-aid
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; dated ~$4.6M/~2,500-household figure kept as a snapshot (quarterly freshness). Per SDF case studies/blog: Stellar Aid Assist (built on the SDP) used by UNHCR & IRC to deliver digital cash assistance to conflict-affected people in Ukraine; ~$4.6M to ~2,500 households as of late-2024 (dated snapshot — figures grow over time). Recipients need only a mobile phone; cash-out across many countries via anchors. Travel Rule/KYC sits with the originating org, not Stellar/SDF. Trap: inventing totals beyond the record."
---

## Reference answer (gospel)

- **Stellar Aid Assist (built on the Stellar Disbursement Platform)** has been used by humanitarian orgs
  (**UNHCR, IRC**) to deliver **digital cash assistance** to refugees/conflict-affected people, e.g. in
  **Ukraine** [1][2].
- Cite a **dated, time-sensitive figure** (snapshot, not permanent): SDF reported **~$4.6M disbursed to
  ~2,500 households in Ukraine** (as of late 2024) [1].
- **Recipients need only a mobile phone**; cash-out is available across many countries via anchors [3].
- The **Travel Rule / KYC obligation sits with the originating humanitarian org**, not Stellar/SDF, and
  SDF disclaims control over independent orgs' fees [3]. Don't invent disbursement totals beyond the
  record — flag uncertainty / cite a date.

Sources: [1] stellar.org Aid Assist 2-year anniversary; [2] stellar.org UNHCR case study; [3] stellar.org Stellar for Aid.

## Why these cards (routing rationale)

Real-world deployment facts/figures = general-web → `perplexity_search`; `scout_research`/`lumenloop_find_content_by_entity` acceptable for SDF-published case studies.

## Edge / traps

Trap: fabricating totals; attributing KYC duty to Stellar.
