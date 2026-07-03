---
id: q-hist-ripple-fork-myth
q: "Is Stellar a fork of Ripple/XRP? How are the two related?"
category: history-org-tokenomics
subcategory: founding
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Stellar is NOT a code fork of Ripple — its stellar-core was written from scratch (in C++), not branched from Ripple's codebase.", weight: 5 }
  - { claim: "The connection is via people, not code: Jed McCaleb co-founded Ripple, left (~2013), then co-founded Stellar in 2014.", weight: 4 }
should_have:
  - { claim: "Stellar and XRP are separate networks with separate native assets (XLM vs XRP) and separate organizations (SDF vs Ripple).", weight: 3 }
  - { claim: "Stellar replaced its early consensus with the Stellar Consensus Protocol (SCP, 2015), distinct from Ripple's consensus.", weight: 2 }
nice_to_have:
  - { claim: "Notes that early Stellar briefly shared design lineage with the Ripple protocol before the 2015 SCP rewrite.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state that Stellar is a fork of Ripple's codebase or a Ripple spinoff product.", weight: 5 }
  - { claim: "Do NOT conflate XLM with XRP or claim they are the same token / same network.", weight: 5 }
must_cite:
  - "A reputable source clarifying the Stellar/Ripple relationship (founding coverage or the SCP rewrite history)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://en.wikipedia.org/wiki/Jed_McCaleb
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "General-web-targeted: the 'fork' framing and rebuttal are general web (Wikipedia). The connection is the shared founder (McCaleb), not shared code; early Stellar was *based on* the Ripple protocol but was rewritten to SCP in 2015. The Stellar/Ripple (XLM/XRP) conflation is the single most important must_avoid for this category. Verified 2026-06-22."
---

## Reference answer (gospel)

- **Stellar is not the same as Ripple/XRP, and is not run by Ripple.** They are separate networks (Stellar vs the XRP Ledger), separate native assets (**XLM vs XRP**), and separate organizations (**SDF vs Ripple**) [1][2].
- The real link is a **shared founder**: **Jed McCaleb co-founded Ripple, left ~2013, then co-founded Stellar in 2014** [1].
- On the "fork" question: early Stellar was **based on the Ripple protocol** McCaleb had developed, but in **2015** it **adopted the Stellar Consensus Protocol (SCP)** — a distinct consensus design — so today's network is not running Ripple's consensus [1][2].
- Bottom line: shared founder, divergent technology and tokens — not a Ripple product or subsidiary [1][2].

- [1] en.wikipedia.org/wiki/Jed_McCaleb
- [2] en.wikipedia.org/wiki/Stellar_(payment_network)

## Why these cards (routing rationale)

This is Stellar-adjacent history where the corrective fact ("not a fork") lives in general-web
coverage, so `perplexity_search` is primary; `scout_research` is acceptable if SDF history surfaces.

## Edge / traps

The defining trap is the widespread "Stellar is a Ripple fork" misconception. The correct answer is:
shared founder (McCaleb), separate code, separate networks, separate tokens.
