---
id: q-asset-rwa-tokenized-freshness
q: "How much tokenized real-world asset value is currently on Stellar, and how fast is it growing?"
category: assets-anchors-seps
subcategory: stablecoins
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Provides a current tokenized-RWA figure for Stellar with a dated source rather than a confident undated number.", weight: 4 }
should_have:
  - { claim: "Cites a dated source in the right order of magnitude (low-single-digit $B tokenized RWA on Stellar as of early/mid 2026, ~4x YoY growth).", weight: 3 }
  - { claim: "Explicitly flags the figure as time-sensitive / as-of-date.", weight: 3 }
nice_to_have:
  - { claim: "Names notable RWA issuers/products (e.g. Franklin Templeton BENJI, Spiko, Ondo Finance, WisdomTree).", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a precise TVL/RWA figure as a permanent fact without a date or freshness caveat.", weight: 4 }
  - { claim: "Do NOT fabricate a number not grounded in a cited report.", weight: 4 }
must_cite:
  - "A dated State-of-Stellar / network report or analytics source (e.g. SDF, Messari, rwa.xyz)."
must_not_use_tier: []

pass_threshold: 0.65
weight_profile: standard

sources:
  - https://app.rwa.xyz/networks/stellar
  - https://www.linkedin.com/posts/stellar-development-foundation_stellar-has-crossed-2-billion-in-rwas-onchain-activity-7449819130150653952-WHDR
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness item — figure is genuinely contested across sources, so the rubric gates on dated/caveated behavior, NOT one number. Live re-check 2026-06-29: rwa.xyz/networks/stellar resolves and shows ~$2.40B distributed asset value (69 RWA tokens, ~18.4k holders), down from the ~$2.84B seen earlier in June — still low-single-digit $B, confirming the order-of-magnitude gate. SDF announced 'crossed $2B' on 2026-04-11/14 (~4x YoY); Messari Q1-2026 tracked ~$1.2-1.5B excluding stablecoins. Issuers: Spiko, Franklin Templeton (BENJI), Ondo, WisdomTree."
---

## Reference answer (gospel)

- The correct behavior is a **dated, caveated figure**, not a confident permanent number — sources disagree by methodology (registered fund/cert products vs broader TVL) [1][2].
- As of **mid-2026**, tokenized RWA on Stellar is in the **low-single-digit billions**: rwa.xyz reported **~$2.84B distributed asset value** (2026-06) [1]; SDF announced Stellar **"crossed $2 billion" in RWAs on ~April 11, 2026** with **>4x growth in 12 months** [2]; Messari's Q1-2026 report tracked **~$1.2-1.5B excluding stablecoins** [2].
- Leading issuers: **Spiko** (EU/US T-bill tokens, largest), **Franklin Templeton (BENJI)**, **Ondo Finance**, **WisdomTree** [1][2].
- **Flag this as time-sensitive** — verify against a current dated source (SDF, Messari, rwa.xyz) before relying on it.

## Why these cards (routing rationale)

'Current/how-fast-growing' market figure → curated content search (`lumenloop_search_content_semantic` / `scout_research`); general-web acceptable. The right behavior is a dated, caveated number — not deep-research.

## Edge / traps

Asserting a stale figure as permanent truth, fabricating a number, or picking one source's tally without noting the methodology spread (Messari ~$1.2B vs rwa.xyz ~$2.8B).
