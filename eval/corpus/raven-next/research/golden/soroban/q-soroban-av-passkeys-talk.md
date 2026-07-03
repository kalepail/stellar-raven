---
id: q-soroban-av-passkeys-talk
q: "Find the conference talk or podcast where Stellar passkeys / smart-wallet signing was discussed — I want the actual recorded passage, not a docs page."
category: soroban
subcategory: smart-wallets
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_av_passages]
acceptable_cards: [lumenloop_search_content_semantic, lumenloop_find_content_by_entity]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Searches talk/podcast transcripts for passages where Stellar passkeys / smart-wallet signing was discussed and returns what is (or isn't) in the transcript corpus.", weight: 5 }
  - { claim: "Targets recorded AV passages rather than returning a developer-docs page.", weight: 3 }
should_have:
  - { claim: "Frames the topic as passkeys / secp256r1 smart-wallet signing on Stellar when surfacing passages.", weight: 2 }
nice_to_have:
  - { claim: "Returns timestamped/quoted passages with the talk or podcast source where available.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate a talk, speaker, or quote not present in the transcript corpus.", weight: 5 }
  - { claim: "Do NOT substitute a docs/blog citation when the user explicitly wants the recorded passage.", weight: 3 }
must_cite:
  - "Each surfaced passage carries its talk/podcast source (lumenloop_find_av_passages)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

source_kind: dynamic-corpus
sources: []
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Routing/behavior case — the 'answer' is the correct tool + honest corpus-bounded behavior, not a factual essay. lumenloop_find_av_passages is the transcript/AV-passage lane; semantic content search is acceptable but the explicit 'recorded passage, not docs' intent favors the av_passages card. No fixed source URL: graded on returning real transcript passages (with their talk/podcast provenance) or honestly reporting none in corpus. Fabrication is the trap."
---

## Reference answer (gospel)

This is a **routing/behavior** case, not a fixed-fact answer. The user explicitly wants the **recorded
passage** (talk/podcast transcript), so the correct behavior is to search the **AV-transcript corpus**
via **`lumenloop_find_av_passages`** for passages where **Stellar passkeys / secp256r1 smart-wallet
signing** was discussed, and return the matching passages **with their talk/podcast provenance**
(speaker, source, ideally a timestamp/quote).

If the corpus contains such passages, surface them. If it does **not**, the correct answer is to say so
honestly — **not** to fabricate a talk, speaker, or quote, and **not** to substitute a docs/blog page
(the user already excluded docs).

## Why these cards (routing rationale)

"Find the talk/podcast where <topic> was discussed" → `lumenloop_find_av_passages` (transcript
search); generic content semantic search is acceptable, but the explicit "recorded passage, not docs"
intent makes the AV-passage card the right primary.

## Edge / traps

Don't fabricate a talk/quote; don't substitute a docs page for the requested recorded passage.
