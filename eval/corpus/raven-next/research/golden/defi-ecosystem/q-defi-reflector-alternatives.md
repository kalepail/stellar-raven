---
id: q-defi-reflector-alternatives
q: "What oracle options do I have on Stellar besides Reflector?"
category: defi-ecosystem
subcategory: oracle
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [lumenloop_find_similar_projects_semantic]
acceptable_cards: [scout_projects, lumenloop_search_content_semantic, scout_clusters, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Names real Stellar/Soroban oracle alternatives to Reflector that are live in the directory — e.g. DIA, Band Protocol, Lightecho, RedStone (and Orally).", weight: 5 }
should_have:
  - { claim: "Conveys that Reflector is the dominant / most-integrated Stellar oracle, but NOT the only one — multiple price-oracle providers are live on Soroban.", weight: 3 }
nice_to_have:
  - { claim: "Notes Lightecho is an open-source/free oracle (BP Ventures) and that DIA/Band/RedStone are cross-chain oracles also live on Stellar mainnet.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Reflector is the only oracle on Stellar with no alternatives — that is false; DIA, Band, Lightecho, and RedStone are live.", weight: 5 }
  - { claim: "Do NOT invent a fictitious competing Stellar oracle, or name a non-Stellar oracle that is not actually live on Soroban.", weight: 4 }
must_cite:
  - "The directory/Scout entries for the named alternative oracles."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/reflector
  - https://reflector.network/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "FRESHNESS-GATED 2026-06-29: set freshness_sensitive:true (quarterly) — the answer carries dated specifics (RedStone 'mainnet since ~March 2026', Orally) that drift. CORRECTED vs dossier: live Scout (/api/projects/search?q=oracle, total=22) shows the oracle lane is NOT single-provider. Reflector is the most-integrated, but DIA, Band, Lightecho, RedStone and Orally are all live Stellar/Soroban oracles. The 'whitespace/single-provider' Phase-1 framing was stale — gate rewards naming real alternatives and forbids the 'only oracle' claim. Rubric gates on the discipline (real alternatives + not-only-oracle), not the exact RedStone date. find_similar_projects_semantic is the right route. DIFFERENT lane from q-defi-oracles-chainlink-band (which compares against the EVM oracle giants Chainlink/Band)."
---

## Reference answer (gospel)

Reflector is the **dominant and most-integrated** Stellar price oracle, but it is **not the only one** —
the directory lists **multiple live Stellar/Soroban oracle providers** as alternatives [1]:

- **DIA** — cross-chain oracle provider, live on Stellar/Soroban, customizable price feeds.
- **Band Protocol** — cross-chain data oracle live on Stellar/Soroban.
- **Lightecho** — open-source, free price oracle for Soroban (built by BP Ventures).
- **RedStone** — modular price oracle, live on Stellar/Soroban mainnet (since ~March 2026).
- **Orally** — push/pull on-chain oracles with cross-chain capability.

So the honest answer is **yes, there are alternatives**. Reflector leads on adoption (consumed by
Blend, Orbit CDP, etc. [2]), but a builder picking an oracle has real choices.

Sources: [1] stellarlight.xyz directory (Scout `oracle` search, 22 results); [2] reflector.network.

## Why these cards (routing rationale)

"Alternatives to X" → `lumenloop_find_similar_projects_semantic`; `scout_projects` / `scout_clusters` /
content search are acceptable for enumerating the oracle lane.

## Edge / traps

The Phase-1 trap was the *opposite* of reality: claiming Reflector is the only oracle. Live data shows
several live oracles — a correct answer names real alternatives and does NOT assert single-provider.
