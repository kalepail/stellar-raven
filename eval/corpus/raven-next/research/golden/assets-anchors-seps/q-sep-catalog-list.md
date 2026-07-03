---
id: q-sep-catalog-list
q: "List the most commonly used Stellar Ecosystem Proposals (SEPs) for wallets and anchors with their numbers and purposes."
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "SEP-1 = stellar.toml info/discovery file.", weight: 4 }
  - { claim: "SEP-10 = Stellar Web Authentication.", weight: 4 }
  - { claim: "SEP-12 = KYC API; SEP-24 = hosted/interactive deposit & withdrawal; SEP-6 = programmatic deposit & withdrawal.", weight: 4 }
  - { claim: "SEP-31 = cross-border payments API; SEP-38 = Anchor RFQ/quotes API.", weight: 3 }
should_have:
  - { claim: "Includes SEP-7 (web+stellar URI scheme) and SEP-8 (regulated assets).", weight: 3 }
  - { claim: "Includes SEP-41 (Soroban token interface).", weight: 2 }
nice_to_have:
  - { claim: "Mentions SEP-9 (standard KYC fields) feeding SEP-12.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber any SEP (e.g. SEP-24 as KYC, SEP-12 as deposit, SEP-31 as interactive deposit).", weight: 5 }
  - { claim: "Do NOT invent SEP numbers/titles that do not exist in the stellar-protocol ecosystem registry.", weight: 4 }
must_cite:
  - "The SEPs index on developers.stellar.org or the stellar-protocol/ecosystem README."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-ecosystem-proposals
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/README.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "REQUIRED list question. Dossier §7, §7.1. All numbers/titles verified against the stellar-protocol/ecosystem master README on 2026-06-22."
---

## Reference answer (gospel)

The wallet/anchor SEPs, with verified numbers, titles, and statuses (stellar-protocol/ecosystem
registry) [1][2]:

| SEP | Title / purpose | Status |
|---|---|---|
| **SEP-1** | Stellar Info File (`stellar.toml`) — discovery of an org's endpoints/assets | Active |
| **SEP-6** | Deposit and Withdrawal API — programmatic (non-interactive) on/off-ramp | Active |
| **SEP-7** | URI Scheme to facilitate delegated signing (`web+stellar:`) | Active |
| **SEP-8** | Regulated Assets — per-tx issuer approval server | Final |
| **SEP-9** | Standard KYC Fields — the data dictionary SEP-12 uses | Active |
| **SEP-10** | Stellar Authentication (sign a challenge → JWT) | Active |
| **SEP-12** | KYC API — upload customer info to an anchor | Active |
| **SEP-24** | Hosted Deposit and Withdrawal — anchor-hosted interactive webview | Active |
| **SEP-31** | Cross-Border Payments API — anchor-to-anchor sends | Active |
| **SEP-38** | Anchor RFQ API — price quotes between assets | Draft |
| **SEP-41** | Soroban Token Interface — the SAC token interface | Draft |

Roles split cleanly: **discovery** (SEP-1), **auth** (SEP-10), **KYC** (SEP-9 fields / SEP-12 API),
**deposit/withdrawal** (SEP-6 programmatic, SEP-24 interactive), **cross-border** (SEP-31),
**quotes** (SEP-38), **signing URI** (SEP-7), **regulated assets** (SEP-8), **Soroban token**
(SEP-41). (SEP-43 is the *Standard Web Wallet API Interface*, Draft; contract-account web-auth is SEP-45, Draft.)

Sources: [1] developers.stellar.org SEPs index; [2] stellar-protocol `ecosystem/README.md`.

## Why these cards (routing rationale)

Enumeration of standards → `stellar_docs_mcp` + the SEP registry.

## Edge / traps

Any wrong SEP-to-purpose mapping is a gate failure; this is the core misnumbering test.
