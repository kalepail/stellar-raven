---
id: q-rwa-dtcc-tokenization
q: "What did DTCC announce about tokenizing assets on Stellar, and what's the regulatory basis and timeline?"
category: compliance-rwa-payments
subcategory: rwa-legal-structuring
axes: [edge-governance, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "DTCC (via its DTC depository) and SDF announced DTC's tokenization service will connect to the Stellar public blockchain as part of a multi-chain strategy.", weight: 5 }
  - { claim: "The integration is forward-looking (targeted for ~1H 2027) and rests on an SEC no-action letter (reportedly issued December 2025).", weight: 4 }
should_have:
  - { claim: "Flags that the no-action letter is not public and its precise scope is uncertain, and the launch is forward-looking (freshness/uncertainty caveat).", weight: 3 }
  - { claim: "Asset classes under evaluation include US Treasuries, ETFs, and Russell 1000 constituents.", weight: 2 }
nice_to_have:
  - { claim: "Mentions DTCC's institutional scale (custody/processing) as context.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim DTC-tokenized assets are already live in production on Stellar (it is a future-dated plan).", weight: 5 }
  - { claim: "Do NOT quote the contents of the SEC no-action letter as if public/known.", weight: 4 }
must_cite:
  - "The DTCC press release / dated reputable coverage."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: strict

sources:
  - https://www.dtcc.com/news/2026/may/27/tokenization-service-to-connect-with-stellar-public-blockchain-as-dtc-advances-multi-chain-strategy
  - https://news.bitcoin.com/dtcc-and-stellar-target-2027-launch-for-tokenized-dtc-securities/
  - https://genfinity.io/2026/05/27/dtcc-stellar-tokenization-dtc-custodied-assets-2027/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; H1-2027 plan kept consistent with q-rwa-projects-tokenizing-stellar. VERIFIED: DTCC + SDF announced May 27, 2026 that DTC's tokenization service will connect to the Stellar public blockchain (multi-chain strategy). Targeted for H1 2027 (forward-looking, NOT live). Rests on an SEC Division of Trading and Markets NO-ACTION LETTER issued Dec 11, 2025 authorizing a 3-year DTC tokenization pilot. Assets under evaluation: Russell 1000 constituents, ETFs tracking major indices, US Treasury bills/notes/bonds. DTC keeps authoritative records; tokens are mirrored records. Trap: claiming it's live now; quoting the no-action letter as if public."
---

## Reference answer (gospel)

- **DTCC (via its DTC depository) and SDF announced on May 27, 2026** that **DTC's tokenization service
  will connect to the Stellar public blockchain**, part of DTCC's multi-chain strategy [1][3].
- The integration is **forward-looking — targeted for ~H1 2027 — and is NOT live** today [1][2].
- It rests on an **SEC (Division of Trading and Markets) no-action letter issued December 2025**
  (announced Dec 11, 2025) authorizing a **3-year DTC tokenization pilot**; DTC keeps the **authoritative
  records** while the chain holds **mirrored** records [1][3].
- Asset classes **under evaluation**: **Russell 1000 constituents, ETFs tracking major indices, and US
  Treasury bills/notes/bonds** [1].
- Do **not** claim DTC-tokenized assets are already live on Stellar, and do **not** quote the no-action
  letter's contents as if public/known.

Sources: [1] DTCC press release (May 27, 2026); [2] Bitcoin.com; [3] Genfinity.

## Why these cards (routing rationale)

Partnership/regulatory news = general-web → `perplexity_search`/`parallel_search`; `scout_research` acceptable.

## Edge / traps

Trap: stating the integration is live; treating the non-public no-action letter as known.
