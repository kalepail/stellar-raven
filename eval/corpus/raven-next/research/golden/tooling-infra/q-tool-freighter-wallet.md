---
id: q-tool-freighter-wallet
q: "What is Freighter and is it the official Stellar wallet?"
category: tooling-infra
subcategory: wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_projects]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Freighter is a browser-extension wallet provided/maintained by the Stellar Development Foundation (SDF).", weight: 5 }
  - { claim: "It lets users interact with Stellar and Soroban (e.g. sign transactions, hold tokens) and also has a mobile presence.", weight: 3 }
should_have:
  - { claim: "Its source is open (github.com/stellar/freighter).", weight: 2 }
nice_to_have:
  - { claim: "Other wallets (LOBSTR, xBull, Albedo, Rabet, Hana) coexist and SDF supports a multi-wallet ecosystem.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Freighter is community/Creit-Tech-maintained or confuse it with the Stellar Wallets Kit.", weight: 4 }
must_cite:
  - "developers.stellar.org Freighter docs or the stellar/freighter repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/freighter
  - https://github.com/stellar/freighter
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Freighter = SDF wallet; the trap is confusing it with the (Creit-Tech) Wallets Kit."
---

## Reference answer (gospel)

**Yes — Freighter is the official Stellar wallet**, a **browser-extension wallet provided and maintained
by the Stellar Development Foundation (SDF)**, with a mobile presence as well. It lets users interact
with **Stellar and Soroban** — signing transactions, holding tokens/assets, and connecting to dApps.
It's **open source** (`github.com/stellar/freighter`). SDF supports a **multi-wallet ecosystem** — other
wallets (LOBSTR, xBull, Albedo, Rabet, Hana) coexist — but Freighter is SDF's reference wallet. It is
**not** community/Creit-Tech-maintained, and it is **not** the Stellar Wallets Kit (that's a separate
multi-wallet abstraction by Creit-Tech).

## Why these cards (routing rationale)

First-party wallet fact → `stellar_docs_mcp`; `scout_projects` acceptable. Deep-research/general-web are misses.

## Edge / traps

Confusing Freighter (SDF) with the Wallets Kit (Creit-Tech) is the trap.
