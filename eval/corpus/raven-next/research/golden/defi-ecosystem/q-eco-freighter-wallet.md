---
id: q-eco-freighter-wallet
q: "What is Freighter and who maintains it?"
category: defi-ecosystem
subcategory: wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [scout_projects, lumenloop_find_content_about_project, stellar_docs_mcp]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Freighter is a non-custodial Stellar wallet (browser extension, plus mobile apps) built and published by the Stellar Development Foundation.", weight: 5 }
should_have:
  - { claim: "It signs Stellar/Soroban transactions in the browser and supports features like Blockaid scam protection, DEX swaps, and NFT management.", weight: 3 }
nice_to_have:
  - { claim: "Notes iOS/Android apps with biometric support and recovery-phrase import.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Freighter is built by Ultra Stellar / LOBSTR or that it is a multi-chain wallet beyond Stellar+Soroban.", weight: 5 }
  - { claim: "Do NOT describe Freighter as custodial.", weight: 3 }
must_cite:
  - "A source identifying Freighter as the SDF-built Stellar wallet (freighter.app, Stellar docs, or Lumenloop record)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/freighter
  - https://freighter.app/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "GROUNDED 2026-06-22: Scout confirms Freighter (User-Facing App, type Wallet, Live, NOT SCF-awarded, freighter.app): 'the Stellar Development Foundation's official non-custodial Stellar wallet: a browser extension (Chrome, Firefox, Brave) and iOS/Android apps. Users self-custody their private keys...' Per-project identity → lumenloop_get_project. SDF authorship + non-custodial + Stellar/Soroban."
---

## Reference answer (gospel)

**Freighter** is the **Stellar Development Foundation's official non-custodial Stellar wallet** [1][2]:
a **browser extension** (Chrome, Firefox, Brave) plus **iOS/Android** apps. Users **self-custody** their
keys to hold/send/receive XLM and Stellar assets and to **sign Stellar/Soroban transactions** in the
browser [1]. Features include Blockaid scam protection, DEX swaps, native NFT management and
multi-address handling; mobile apps add biometric unlock and recovery-phrase import.

Sources: [1] stellarlight.xyz Freighter record (Scout); [2] freighter.app.

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`; directory/docs acceptable.

## Edge / traps

Don't attribute Freighter to Ultra Stellar/LOBSTR; it is **non-custodial** and Stellar/Soroban-focused,
not a general multi-chain wallet.
