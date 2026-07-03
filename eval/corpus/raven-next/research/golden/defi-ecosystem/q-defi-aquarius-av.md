---
id: q-defi-aquarius-av
q: "Have any Stellar talks or podcasts discussed Aquarius or AMM liquidity incentives?"
category: defi-ecosystem
subcategory: dex-amm
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_av_passages]
acceptable_cards: [lumenloop_find_content_about_project, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Searches talk/podcast transcripts for passages on Aquarius or Stellar AMM liquidity incentives and returns what is (or isn't) in the corpus.", weight: 5 }
should_have:
  - { claim: "Frames Aquarius as the Stellar AMM / liquidity-rewards project when surfacing passages.", weight: 2 }
nice_to_have:
  - { claim: "Returns timestamped/quoted passages where available.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate a talk, quote, or speaker not present in the transcript corpus.", weight: 5 }
must_cite:
  - "Each surfaced passage carries its talk/podcast source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/aquarius
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Behavior/routing test for the A/V transcript lane. Aquarius is grounded as the Stellar AMM / liquidity-rewards project (Scout: DEX, Live, SCF $391K; AQUA token, liquidity pools). The 'answer' is the correct BEHAVIOR: search talk/podcast transcripts and return what is (or isn't) in the corpus, each passage carrying its talk/podcast source — never fabricate a talk, quote, or speaker. Transcript search → lumenloop_find_av_passages. 2026-06-29 reviewed: re-confirmed Aquarius identity on Scout (Live DEX, SCF $391K) and that lumenloop_find_av_passages exists in CARDS.md. Confidence kept medium (behavior test, corpus contents unknowable a priori)."
---

## Reference answer (gospel)

This is an **A/V transcript-discovery** question — the correct behavior is to **search talk/podcast
transcripts** for passages on **Aquarius** (the Stellar **AMM / liquidity-rewards** project — AQUA
token, liquidity pools, grounded Live [1]) or on Stellar **AMM liquidity incentives**, and return
**what is (or isn't) in the corpus**, with each surfaced passage **carrying its talk/podcast source**
(timestamped/quoted where available). If the corpus has no such passage, say so honestly. **Never
fabricate** a talk, quote, or speaker.

Source (project grounding): [1] stellarlight.xyz Aquarius record (Scout, 2026-06-22).

## Why these cards (routing rationale)

Talk/podcast transcript search → `lumenloop_find_av_passages`.

## Edge / traps

Don't fabricate a talk/quote/speaker not present in the transcript corpus.
