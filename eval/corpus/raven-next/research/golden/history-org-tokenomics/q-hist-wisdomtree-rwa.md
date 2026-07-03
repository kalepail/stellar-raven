---
id: q-hist-wisdomtree-rwa
q: "Does WisdomTree use Stellar, and for what?"
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "WisdomTree (asset manager) uses Stellar to issue tokenized funds / digital-asset products (a tokenized real-world asset use case).", weight: 5 }
should_have:
  - { claim: "WisdomTree cited Stellar's native asset controls as a reason for choosing it.", weight: 2 }
  - { claim: "This is part of the broader RWA / tokenized-fund adoption on Stellar (alongside Franklin Templeton).", weight: 2 }
nice_to_have:
  - { claim: "The products are part of WisdomTree's digital/Prime offering.", weight: 1 }
must_avoid:
  - { claim: "Do NOT confuse WisdomTree with Franklin Templeton (both do tokenized funds on Stellar, but they are different firms).", weight: 3 }
  - { claim: "Do NOT claim WisdomTree's tokenized products run on Ripple/XRP.", weight: 3 }
must_cite:
  - "stellar.org case study or WisdomTree materials on tokenized funds on Stellar."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/case-studies/wisdomtree
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified 2026-06-22 against stellar.org case study: WisdomTree selected Stellar for 'native asset controls, relatively low cost, and operational performance'; uses Stellar's Regulated Assets standard; runs 13 digital funds + a Gold token via WisdomTree Prime (e.g. WTGXX money market fund), launched ~2024. The WisdomTree/Franklin-Templeton mixup is a real trap. Confidence raised to high."
---

## Reference answer (gospel)

- **WisdomTree** (asset manager) uses **Stellar to issue tokenized funds / digital-asset products** — a tokenized real-world-asset (RWA) use case [1].
- It offers **digital funds and a Gold token** through its **WisdomTree Prime** retail app, using Stellar-enabled wallets (e.g. the WTGXX money market digital fund), available since ~2024 [1].
- WisdomTree **chose Stellar for its native asset controls** (plus low cost and operational performance), using Stellar's **Regulated Assets** standard so transactions require issuer approval [1].
- This is part of the broader **RWA / tokenized-fund adoption on Stellar** (alongside Franklin Templeton, Ondo, Figure) [1].
- Traps to avoid: confusing **WisdomTree with Franklin Templeton** (different firms, both on Stellar), or claiming the products run on **Ripple/XRP** [1].

- [1] stellar.org/case-studies/wisdomtree

## Why these cards (routing rationale)

WisdomTree's Stellar case study is on stellar.org (Stellar-own) → `scout_research`; perplexity
acceptable for current product details.

## Edge / traps

Traps: conflating WisdomTree with Franklin Templeton; putting it on Ripple.
