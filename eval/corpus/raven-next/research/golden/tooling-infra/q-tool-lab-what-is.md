---
id: q-tool-lab-what-is
q: "Is there an official web tool to build, sign, and submit Stellar transactions without writing code?"
category: tooling-infra
subcategory: laboratory
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Stellar Lab (lab.stellar.org) is the official all-in-one web tool to build, sign, simulate, and submit transactions and interact with contracts.", weight: 5 }
should_have:
  - { claim: "It includes a transaction builder, keypair generator, and Friendbot-backed testnet funding, plus contract invoke/simulate/submit.", weight: 3 }
nice_to_have:
  - { claim: "Notes the Lab was relaunched (the 'all-new Stellar Lab') in late 2024.", weight: 1 }
must_avoid:
  - { claim: "Do NOT refer to it only by the old name/URL without acknowledging the current Stellar Lab, or claim there is no such tool.", weight: 3 }
  - { claim: "Do NOT drift into a step-by-step UI walkthrough (fetch-sequence/Add-Operation button locations) — this question only needs to establish the tool exists and what it does at a glance.", weight: 1 }
must_cite:
  - "lab.stellar.org and/or the developers.stellar.org Lab docs / introducing-the-all-new-stellar-lab post."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://lab.stellar.org/
  - https://stellar.org/blog/developers/introducing-the-all-new-stellar-lab
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29 differentiation: this file owns the EXISTENCE/capabilities-at-a-glance lane ('is there an official no-code web tool? yes, Stellar Lab'); the step-by-step new-UI workflow (fetch sequence, Add Operation button locations, SAC, offline) is owned by q-ti-stellar-lab-usage-and-new-ui. lab.stellar.org is the official tool across Mainnet/Testnet/Futurenet; 'all-new Lab' relaunch (late 2024) supersedes the legacy Laboratory."
---

## Reference answer (gospel)

Yes — the **Stellar Lab** (`lab.stellar.org`) is the official all-in-one **web tool** to **build,
sign, simulate, and submit** transactions and **interact with contracts**, with no code
([Stellar Lab](https://lab.stellar.org/),
[introducing the all-new Stellar Lab](https://stellar.org/blog/developers/introducing-the-all-new-stellar-lab)).

- It includes a **transaction builder**, **keypair/account creation**, **RPC + Horizon endpoint
  explorers**, **XDR ↔ JSON** conversion, contract **invoke/simulate/submit**, and **Friendbot**
  funding on test networks (Mainnet/Testnet/Futurenet).
- It is the **"all-new Stellar Lab"** (relaunched late 2024), which supersedes the legacy "Stellar
  Laboratory."

Don't refer only to the old Laboratory name/URL or claim no such tool exists.

## Why these cards (routing rationale)

First-party tool fact → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Referencing only the legacy Laboratory without the current Lab is the trap.
