---
id: q-scf-submission-lifecycle-deadlines
q: After I submit an SCF proposal, what does the review timeline look like — prescreen, track/panel review, community vote, results, KYC — and what is the round cadence and how long does each review stage take?
category: scf-grants-builders
subcategory: scf-process
axes:
  - tool-targeted
  - ecosystem-spectrum
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly
expected_cards:
  - scout_rfps
acceptable_cards:
  - scout_research
  - perplexity_search
  - parallel_search
forbidden_cards: []
expected_service: stellar_light
should_fire: true
must_have:
  - claim: "Describes the post-submission REVIEW sequence and its ordering: prescreen, track/panel review (Track Delegate Panels), community vote on the Open Track, results/award decision, then KYC/KYB and milestone-based tranche payments."
    weight: 5
  - claim: "Explains the round CADENCE — SCF Build rounds run on a roughly 6-week cycle — and that the review window for a given round spans roughly that cycle, with exact per-stage dates being freshness-sensitive."
    weight: 5
  - claim: "States that exact per-stage dates (review window, vote window, results publication) must be confirmed against the live SCF round page/dashboard rather than fabricated."
    weight: 4
should_have:
  - claim: "Distinguishes durable review mechanics/cadence from any one round's specific calendar dates."
    weight: 3
  - claim: "Notes track-specific review variation: the Open Track has a community (NQG) vote, while Integration and RFP tracks are panel-oriented."
    weight: 3
nice_to_have:
  - claim: "Points to the live Community Fund / SCF handbook source for confirming the current review schedule."
    weight: 1
must_avoid:
  - claim: "Do NOT fabricate stage dates or copy a stale round's review dates as current."
    weight: 5
  - claim: "Do NOT collapse the review process into only a single final submission deadline."
    weight: 4
  - claim: "Do NOT restate the specific current open round number/submission deadline (that is owned by q-scf-current-round) or re-teach the applicant-side how-to-apply steps (owned by q-scf-how-to-apply); this question is about the review-side timeline and cadence."
    weight: 3
  - claim: "Do NOT confuse SCF rounds with SDF-direct grant programs such as Marketing Grants or Matching Fund."
    weight: 3
must_cite:
  - The live/current SCF Community Fund source for round deadlines, plus SCF handbook/process documentation for lifecycle mechanics.
must_not_use_tier: []
pass_threshold: 0.8
weight_profile: standard
sources:
  - https://stellar.gitbook.io/scf-handbook/scf-awards/build-award
  - https://stellar.org/blog/ecosystem/introducing-scf-v7
  - https://communityfund.stellar.org/awards
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: high
notes: "DIFFERENTIATED 2026-06-29: re-scoped to the review-side timeline + round cadence. Dropped the specific current-round number/deadline (owned by q-scf-current-round) and the applicant how-to-apply steps (owned by q-scf-how-to-apply). Build cadence ~6 weeks confirmed; exact per-stage review dates are not reliably published in static sources, so the rubric requires live checking rather than fabricated dates."
---

## Reference answer (gospel)

This question is about the REVIEW-side timeline and cadence, not the current open round's deadline (see q-scf-current-round) or the applicant how-to-apply steps (see q-scf-how-to-apply).

The durable review sequence once a proposal is in: prescreen, track-specific panel review (Track Delegate Panels), an Open-Track community (NQG) vote where applicable, results/award decision, then KYC/KYB and milestone-based tranche payments tied to approved/MVP/testnet/mainnet milestones. SCF Build rounds run on a roughly 6-week cadence, so the full review window for a given round spans approximately that cycle.

Track variation matters: the Open Track includes a community vote; Integration and RFP tracks are panel-oriented. If exact per-stage dates (review window, vote window, result publication) are not visible in the live round page or handbook, Raven should say so and direct the user to the live SCF round page/dashboard/handbook rather than invent dates.

## Why these cards (routing rationale)

`scout_rfps` should fire for active funding windows and RFP/round context. `scout_research` and current web search are acceptable for the SCF handbook and live schedule.

## Edge / traps

The main failure is stale-date confidence. Do not copy a previous round schedule as current, collapse the review process to one deadline, restate the specific current-round number/deadline (q-scf-current-round owns that), re-teach the apply steps (q-scf-how-to-apply owns those), or confuse SCF with SDF direct grants such as Marketing Grants or Matching Fund.
