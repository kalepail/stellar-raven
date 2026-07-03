---
id: q-sep-wallet-seps-list
q: "List the common SEPs a Stellar wallet typically needs to implement to support anchors and interoperability."
category: assets-anchors-seps
subcategory: seps
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names SEP-1 (stellar.toml — anchor/asset discovery metadata).", weight: 4 }
  - { claim: "Names SEP-10 (web authentication — challenge/response to authenticate an account with an anchor).", weight: 5 }
  - { claim: "Names SEP-24 (interactive/hosted deposit & withdrawal) and/or SEP-6 (programmatic deposit & withdrawal).", weight: 4 }
should_have:
  - { claim: "Names SEP-12 (KYC/customer info) and SEP-38 (anchor quotes) as commonly paired with deposit/withdraw flows.", weight: 3 }
  - { claim: "May name SEP-7 (URI request scheme) for deep-link/payment requests.", weight: 2 }
nice_to_have:
  - { claim: "Notes SEP-31 is for cross-border anchor-to-anchor flows (relevant to some wallets/remittance use cases).", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber the SEPs (e.g. call web auth SEP-12 or KYC SEP-10).", weight: 5 }
  - { claim: "Do NOT invent a non-existent SEP number as a canonical wallet requirement.", weight: 3 }
must_cite:
  - "A SEP overview / wallet-guide page on developers.stellar.org or the stellar-protocol SEP repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-ecosystem-proposals
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/README.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Axis-C list rebalance. Enumeration of the wallet-relevant SEPs → stellar_docs_mcp. Trap = misnumbering SEP-10/12/24. All numbers verified against the ecosystem README."
---

## Reference answer (gospel)

A Stellar wallet supporting anchors/interoperability typically implements [1][2]:

- **SEP-1** — Stellar Info File (`stellar.toml`): discover an anchor's endpoints, currencies, keys.
- **SEP-10** — Stellar (Web) Authentication: sign a challenge tx to get a JWT and authenticate with the anchor.
- **SEP-24** — Hosted (interactive) Deposit & Withdrawal, and/or **SEP-6** — programmatic Deposit & Withdrawal.
- **SEP-12** — KYC API: submit customer info to the anchor.
- **SEP-38** — Anchor RFQ/quotes: price an exchange before deposit/withdraw/send.
- **SEP-7** — URI scheme (`web+stellar:`) for deep-link/payment-signing requests (optional).
- **SEP-31** — Cross-Border Payments API (relevant to remittance-style wallets).

SDF's TypeScript **Wallet SDK** wraps SEP-10/12/24/31/38 client-side.

## Why these cards (routing rationale)

Enumerating wallet-relevant SEPs → `stellar_docs_mcp` (SEP overview / wallet guide); `scout_research`
acceptable. General-web is a miss for an exact SEP enumeration.

## Edge / traps

Misnumbering SEP-10 (web auth) vs SEP-12 (KYC) vs SEP-24/6 (deposit/withdraw), or inventing a SEP number.
