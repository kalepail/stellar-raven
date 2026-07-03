---
id: q-hist-founding-2014-mccaleb-kim
q: "Who founded Stellar and when, and what was Jed McCaleb's background before it?"
category: history-org-tokenomics
subcategory: founding
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Stellar was founded in 2014 by Jed McCaleb and Joyce Kim.", weight: 5 }
  - { claim: "Jed McCaleb co-founded Ripple (and earlier created Mt. Gox / eDonkey) before starting Stellar.", weight: 4 }
should_have:
  - { claim: "The Stellar network went live on July 31, 2014.", weight: 3 }
  - { claim: "Stripe (Patrick Collison) provided roughly $3 million in seed funding / initial backing.", weight: 2 }
nice_to_have:
  - { claim: "McCaleb left Ripple around 2013 before founding Stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT give a wrong founding year (e.g. 2013, 2015, or 2017) — Stellar was founded in 2014.", weight: 5 }
  - { claim: "Do NOT name the wrong founders (e.g. attribute the founding to David Mazières alone, or to Brad Garlinghouse / Chris Larsen of Ripple).", weight: 4 }
  - { claim: "Do NOT conflate McCaleb's Ripple role such that Stellar is described as a Ripple subsidiary or rebrand.", weight: 3 }
must_cite:
  - "At least one reputable dated web source on the founding (e.g. reputable crypto/news coverage or the Wikipedia/SDF history)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://en.wikipedia.org/wiki/Stellar_(payment_network)
  - https://en.wikipedia.org/wiki/Jed_McCaleb
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "General-web-targeted: founding bios live mostly outside Stellar's own corpora (Wikipedia primary). Verified 2026-06-22: launched July 31, 2014; founders McCaleb + Kim; Stripe $3M seed (Stripe got 2B lumens). scout_research is acceptable corroboration if SDF history surfaces."
---

## Reference answer (gospel)

- Stellar was founded in **2014** by **Jed McCaleb** and **Joyce Kim**; the network debuted **July 31, 2014** [1][2].
- Before Stellar, McCaleb **created Mt. Gox** and **co-founded Ripple** (he was CTO there until he left ~2013), and earlier created the eDonkey file-sharing network [2].
- The nonprofit **Stellar Development Foundation** was formed in collaboration with **Stripe** CEO **Patrick Collison**; Stripe provided **~$3 million** in seed funding (receiving ~2 billion lumens in return) [1][2].
- Stellar's stellar-core was a clean-room build; in 2015 it adopted the Stellar Consensus Protocol, diverging from the Ripple protocol it had initially been based on [2].

- [1] en.wikipedia.org/wiki/Stellar_(payment_network)
- [2] en.wikipedia.org/wiki/Jed_McCaleb

## Why these cards (routing rationale)

Founding history / exec bios are Stellar-adjacent but live largely outside Stellar's own docs, so
`perplexity_search` (general-web source discovery) is the primary card, with `parallel_search` as an
alternate and `scout_research` acceptable if the SDF history page is indexed. Deep-research tiers are
overkill for a one-shot factual lookup.

## Edge / traps

The trap is a wrong founding year or wrong founders, or conflating Stellar with Ripple (McCaleb's
prior company). Stellar was founded in 2014 by McCaleb and Kim; it is a separate organization.
