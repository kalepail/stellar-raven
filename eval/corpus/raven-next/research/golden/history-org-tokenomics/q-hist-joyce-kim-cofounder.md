---
id: q-hist-joyce-kim-cofounder
q: "Who is Joyce Kim and what was her role in founding Stellar?"
category: history-org-tokenomics
subcategory: founding
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Joyce Kim co-founded Stellar (with Jed McCaleb) in 2014.", weight: 5 }
should_have:
  - { claim: "She was an early executive director of the Stellar Development Foundation.", weight: 2 }
  - { claim: "She had a background as a venture capitalist / startup founder before Stellar.", weight: 2 }
nice_to_have:
  - { claim: "She later left day-to-day SDF leadership.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar was founded by Jed McCaleb alone — Joyce Kim was a co-founder.", weight: 4 }
  - { claim: "Do NOT invent an unsupported role for Kim (e.g. claim she authored the SCP paper — that was David Mazières).", weight: 3 }
must_cite:
  - "A reputable source on Joyce Kim's role as Stellar co-founder."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
  - https://en.wikipedia.org/wiki/Jed_McCaleb
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "General-web-targeted: Kim's bio (former lawyer, VC/startup founder) is third-party-sourced. Tests that Raven credits the co-founder and doesn't conflate roles (SCP = Mazières). Verified 2026-06-29: Wikipedia (Jed McCaleb article) confirms McCaleb co-founded SDF WITH Joyce Kim in 2014 (debuted July 31, 2014, $3M Stripe loan); Kim was Executive Director and stepped down in 2016 (to SparkChain Capital), with McCaleb taking over. Background as lawyer turned VC corroborated by multiple third-party bios. SCP authored by David Mazières (correct)."
---

## Reference answer (gospel)

- **Joyce Kim co-founded Stellar with Jed McCaleb in 2014** and was an early leader (Executive Director) of the Stellar Development Foundation [1][2].
- She was a **former lawyer turned venture capitalist / startup founder** before Stellar [1].
- She later stepped back from day-to-day SDF leadership; current SDF CEO/Executive Director is Denelle Dixon.
- Note: she did **not** author the SCP paper — that was **David Mazières** — and Stellar was **not** founded by McCaleb alone [1].

- [1] en.wikipedia.org/wiki/Stellar_(payment_network)
- [2] en.wikipedia.org/wiki/Jed_McCaleb

## Why these cards (routing rationale)

A co-founder bio → general-web `perplexity_search` / `parallel_search`.

## Edge / traps

Traps: erasing Kim as co-founder; misattributing the SCP authorship to her.
