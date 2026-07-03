---
id: q-eco-xbull-wallet
q: "What is xBull and who builds it?"
category: defi-ecosystem
subcategory: wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [scout_repos, scout_projects, lumenloop_find_content_about_project]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "xBull is a Stellar wallet (browser extension) built by Creit-Tech.", weight: 5 }
should_have:
  - { claim: "Notes its V2 introduced a passkey-based hybrid wallet experience.", weight: 2 }
nice_to_have:
  - { claim: "References the Creit-Tech/xBull-Wallet GitHub repo.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute xBull to the Stellar Development Foundation or Ultra Stellar.", weight: 4 }
  - { claim: "Do NOT confuse xBull (wallet) with Reflector/CreitTech's oracle node role — Creit-Tech builds both, but xBull is the wallet.", weight: 3 }
must_cite:
  - "A source identifying xBull / Creit-Tech."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/xbull
  - https://github.com/Creit-Tech/xBull-Wallet
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Per-project identity → lumenloop_get_project. Verified on Scout: xBull = open-source non-custodial Stellar wallet (browser ext + web + iOS/Android) by Creit-Tech; repo Creit-Tech/xBull-Wallet (TypeScript, ~32 stars, repoScore 61). Creit-Tech (CreitTech) also runs a Reflector oracle node — but xBull is the wallet. V2 = passkey-based hybrid."
---

## Reference answer (gospel)

**xBull** is an **open-source, non-custodial Stellar wallet** — browser extension, web app, and iOS/
Android — built by **Creit-Tech**. Users hold/send/receive/swap XLM and Stellar assets, manage multiple
accounts, and sign Stellar + Soroban dApp transactions; it is widely integrated as a wallet-connect
option across Stellar dApps [Scout: stellarlight.xyz/project/xbull]. Code: **Creit-Tech/xBull-Wallet**
(TypeScript, ~32 stars). Its **V2** introduced a **passkey-based hybrid** wallet experience. Do NOT
attribute xBull to the SDF or Ultra Stellar. (Note: Creit-Tech also operates a **Reflector oracle
node** — but xBull is the wallet.)

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`; repos/directory acceptable.

## Edge / traps

xBull = Creit-Tech, not SDF/Ultra Stellar; don't conflate the wallet with Creit-Tech's Reflector node role.
