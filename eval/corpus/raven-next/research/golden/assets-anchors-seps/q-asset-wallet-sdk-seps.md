---
id: q-asset-wallet-sdk-seps
q: "What is the Stellar Wallet SDK and which anchor SEP flows does it wrap?"
category: assets-anchors-seps
subcategory: anchor-platform
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Wallet SDK is SDF's (TypeScript) library for building Stellar wallet apps that consume anchor flows.", weight: 5 }
  - { claim: "It wraps client-side SEP-10 (auth), SEP-12 (KYC), SEP-24 (hosted deposit/withdraw), SEP-31 (cross-border), and SEP-38 (quotes).", weight: 4 }
should_have:
  - { claim: "It is the wallet-side counterpart to the (Java) Anchor Platform.", weight: 2 }
nice_to_have:
  - { claim: "Notes it lets a wallet interoperate with any compliant anchor without per-anchor integration.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber the SEPs it wraps.", weight: 4 }
  - { claim: "Do NOT describe the Wallet SDK as anchor backend infrastructure (that is the Anchor Platform).", weight: 3 }
must_cite:
  - "The Wallet SDK page on stellar.org or the stellar/typescript-wallet-sdk repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/products-and-tools/wallet-sdk
  - https://github.com/stellar/typescript-wallet-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §6.3. Wallet SDK = SDF TypeScript library (stellar/typescript-wallet-sdk) wrapping anchor SEP flows; wallet-side counterpart to the Java Anchor Platform. SEP numbers verified against the anchor stack."
---

## Reference answer (gospel)

The **Stellar Wallet SDK** is SDF's **TypeScript library for building wallet apps** that consume
anchor flows, so a wallet integrates the anchor SEPs once rather than per-anchor [1]. It wraps the
**client-side** anchor flows: **SEP-10** (auth), **SEP-12** (KYC), **SEP-24** (hosted
deposit/withdraw), **SEP-31** (cross-border), and **SEP-38** (quotes) — plus **SEP-1** discovery of
the anchor [1][2]. It is the **wallet-side counterpart to the (Java) Anchor Platform**, which is the
**anchor backend**; the Wallet SDK is **not** anchor infrastructure itself. A wallet built on it can
interoperate with any compliant anchor without bespoke per-anchor integration.

Sources: [1] stellar.org Wallet SDK page; [2] github.com/stellar/typescript-wallet-sdk.

## Why these cards (routing rationale)

Product/docs fact → `stellar_docs_mcp`; `scout_repos` acceptable.

## Edge / traps

SEP misnumbering or confusing the Wallet SDK with the Anchor Platform.
