---
id: q-eco-lobstr-wallet
q: "Who builds LOBSTR and what is its scale and chain support?"
category: defi-ecosystem
subcategory: wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_project]
acceptable_cards: [scout_projects, lumenloop_find_content_about_project]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "LOBSTR is a Stellar wallet built by Ultra Stellar, an independent commercial entity unaffiliated with the Stellar Development Foundation.", weight: 5 }
should_have:
  - { claim: "Spans web, iOS, and Android, with components like LOBSTR Vault and a Signer Extension.", weight: 3 }
  - { claim: "Supports Stellar plus the XRP Ledger.", weight: 2 }
nice_to_have:
  - { claim: "Notes large scale (over a million users / millions of monthly transactions) per its own figures.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim LOBSTR is built/operated by the Stellar Development Foundation.", weight: 5 }
  - { claim: "Do NOT fabricate user/transaction counts beyond what the source data states.", weight: 3 }
must_cite:
  - "A source identifying LOBSTR / Ultra Stellar."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/lobstr
  - https://lobstr.co/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "GROUNDED 2026-06-22: Scout confirms Lobstr (User-Facing App, type Wallet, Live, SCF $232,000, lobstr.co): 'a widely used non-custodial Stellar wallet on iOS, Android, web and a browser extension. Users hold, send, receive, buy and swap XLM, USDC and Stellar assets... fiat on/off-ramp.' Built by Ultra Stellar (independent of SDF). The dossier's '1M+ users / 10M+ monthly tx' figures are LOBSTR's own marketing claims — kept as nice_to_have, not hard-gated. Per-project identity → lumenloop_get_project."
---

## Reference answer (gospel)

**LOBSTR** is a widely used **non-custodial Stellar wallet** built by **Ultra Stellar**, an independent
commercial entity **unaffiliated with the Stellar Development Foundation** [1][2]. It spans **web, iOS,
Android, and a browser extension** (with components like LOBSTR Vault and a Signer Extension), lets
users hold/send/receive/buy/swap XLM, USDC and Stellar assets, trade on the SDEX, and use fiat
on/off-ramps [1]. It also supports the **XRP Ledger** alongside Stellar. LOBSTR cites large scale
(1M+ users, millions of monthly transactions) in its own materials.

Sources: [1] stellarlight.xyz Lobstr record (Scout); [2] lobstr.co / ultrastellar.com.

## Why these cards (routing rationale)

Named-project identity → `lumenloop_get_project`.

## Edge / traps

LOBSTR is independent (**Ultra Stellar**), **not** built/operated by SDF. Don't fabricate
user/transaction counts beyond the source figures.
