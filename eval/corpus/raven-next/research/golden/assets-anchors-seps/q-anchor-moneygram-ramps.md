---
id: q-anchor-moneygram-ramps
q: "How does MoneyGram fit into Stellar's anchor model for cash-in/cash-out?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search, lumenloop_find_content_by_entity]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "MoneyGram Ramps is an anchor implementation providing fiat on/off ramps (cash-in/cash-out) on Stellar.", weight: 4 }
  - { claim: "It runs on the Stellar Ramps standard so wallets get one integration to many cash points.", weight: 3 }
should_have:
  - { claim: "Uses Stellar USDC as the on-chain settlement asset between the cash legs.", weight: 3 }
  - { claim: "Wallets integrate via SEP-24 (hosted deposit/withdrawal) with SEP-10 auth; one integration reaches all MoneyGram locations.", weight: 2 }
nice_to_have:
  - { claim: "Notes the wallet does not need to know the underlying bank/cash rails, and users need no bank account.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim MoneyGram runs its own Stellar validator or issues its own L1 token.", weight: 3 }
  - { claim: "Do NOT fabricate a partnership detail or a settlement asset not backed by the corpus (it is USDC, not a MoneyGram coin).", weight: 3 }
must_cite:
  - "A stellar.org MoneyGram/ramps page or the developers.stellar.org MoneyGram Access integration guide."
must_not_use_tier: []

pass_threshold: 0.65
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/apps/moneygram-access-integration-guide
  - https://stellar.org/products-and-tools/moneygram
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §5.3, §5.5. Verified: MoneyGram Access/Ramps is an anchor doing cash-in/out of Stellar USDC; wallets integrate via SEP-24 + SEP-10 (not primarily SEP-38). ~170+ countries (MoneyGram dev docs cite 174); on-ramp 5-950 USDC/tx per MoneyGram dev portal."
---

## Reference answer (gospel)

- **MoneyGram Access / Ramps** is an **anchor** (built on Stellar) that lets wallet/exchange users **cash-in (deposit) and cash-out (withdraw)** physical cash at MoneyGram locations, settling in **Stellar USDC** — no bank account required [1][2].
- Wallets integrate the **client side of SEP-24** (interactive hosted deposit/withdrawal) authenticated via **SEP-10**; MoneyGram opens a hosted webview for KYC, then the wallet sends/receives USDC with a memo [1].
- It runs on the **Stellar Ramps** standard, so a **single integration** reaches MoneyGram's cash network across **~170+ countries** (MoneyGram dev docs cite 174) without per-anchor custom work [2].
- The wallet never deals with the underlying bank/cash rails; MoneyGram abstracts them behind the SEP flow [2].

## Why these cards (routing rationale)

Stellar-specific anchor fact → `stellar_docs_mcp` (MoneyGram Access integration guide); `perplexity_search` acceptable for MoneyGram's general corporate background.

## Edge / traps

Claiming MoneyGram runs its own Stellar validator or issues its own L1 token, or naming a settlement asset other than **Stellar USDC** (there is no "MoneyGram coin"). Also: the live integration is **SEP-24**, not primarily SEP-38.
