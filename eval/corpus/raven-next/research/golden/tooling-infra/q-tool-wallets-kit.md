---
id: q-tool-wallets-kit
q: "How do I support multiple Stellar wallets (Freighter, LOBSTR, xBull, hardware wallets) in one dApp with a single integration?"
category: tooling-infra
subcategory: wallets-kit
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Use the Stellar Wallets Kit — the multi-wallet abstraction published by Creit-Tech as the npm package `@creit.tech/stellar-wallets-kit`.", weight: 5 }
  - { claim: "It gives a single uniform interface (e.g. one StellarWalletsKit class + per-wallet modules) over many wallets so you don't write per-wallet adapters.", weight: 4 }
should_have:
  - { claim: "Supported wallets include Freighter, LOBSTR, xBull, Albedo, Rabet, Hana, WalletConnect, plus Ledger/Trezor hardware modules.", weight: 3 }
nice_to_have:
  - { claim: "It is community-maintained (Creit Technologies LLP), distinct from SDF's Freighter.", weight: 1 }
  - { claim: "The newer distribution is on JSR under the hyphenated scope `@creit-tech/stellar-wallets-kit`; the npm package keeps the dotted `@creit.tech/` scope.", weight: 1 }
must_avoid:
  - { claim: "Do NOT give the wrong package name (e.g. unscoped `stellar-wallets-kit` / `stellar-wallet-kit`) as the canonical one.", weight: 4 }
  - { claim: "Do NOT claim the Wallets Kit is an SDF product or is the same thing as Freighter.", weight: 3 }
must_cite:
  - "The @creit.tech/stellar-wallets-kit package / Creit-Tech repo, and/or developers.stellar.org wallets docs."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://www.npmjs.com/package/@creit.tech/stellar-wallets-kit
  - https://github.com/Creit-Tech/Stellar-Wallets-Kit
  - https://stellarwalletskit.dev/installation.html
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified: npm package.json name is `@creit.tech/stellar-wallets-kit` (dotted scope); published by Creit Technologies LLP. The newer JSR distribution uses the hyphenated `@creit-tech/stellar-wallets-kit` scope (the maintainers note the old npm `@creit.tech` vs new JSR `@creit-tech` split). Lookalike unscoped packages are the trap."
---

## Reference answer (gospel)

Use the **Stellar Wallets Kit** — the multi-wallet abstraction published by **Creit-Tech (Creit
Technologies LLP)** as the npm package **`@creit.tech/stellar-wallets-kit`**
([npm](https://www.npmjs.com/package/@creit.tech/stellar-wallets-kit),
[repo](https://github.com/Creit-Tech/Stellar-Wallets-Kit)).

- It exposes a **single `StellarWalletsKit` class** plus per-wallet modules, giving one uniform
  `signTransaction(...)`/connect interface so you **don't write per-wallet adapters**.
- Supported wallets include **Freighter, LOBSTR, xBull, Albedo, Rabet, Hana, WalletConnect**, plus
  **Ledger / Trezor** hardware modules (and others like Hot/Klever/OneKey/Bitget).
- **Package-name nuance:** the **npm** scope is dotted **`@creit.tech/...`**; the **newer JSR**
  distribution uses the hyphenated **`@creit-tech/...`** scope (the maintainers note this `@creit.tech`
  → `@creit-tech` split). Both refer to the same kit.

Don't use a lookalike unscoped name (`stellar-wallets-kit` / `stellar-wallet-kit`) as the canonical
package, and don't claim the Kit is an SDF product or the same thing as Freighter.

## Why these cards (routing rationale)

Multi-wallet how-to → `stellar_docs_mcp` (wallets docs reference the Kit); `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Wrong/lookalike package name and miscrediting it to SDF are the traps.
