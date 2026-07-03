---
id: q-crp-become-an-anchor-licensing
q: "What does it take to become a Stellar anchor, including SEP and Anchor Platform setup, licensing, liquidity or float, and on-ramp/off-ramp operating requirements?"
category: compliance-rwa-payments
subcategory: anchor-compliance
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains an anchor connects fiat or external rails to Stellar assets and typically implements SEP flows such as SEP-1, SEP-10, SEP-12, SEP-24/6, SEP-31, and/or SEP-38 depending on use case.", weight: 5 }
  - { claim: "Covers the operating economics: enough liquidity/float to redeem withdrawals and fund payouts, a treasury/issuer model, reconciliation between Stellar and external rails, monitoring, and failed-payment handling.", weight: 5 }
  - { claim: "States money-transmitter, MSB, e-money, payment-institution, KYC/AML, sanctions, and local licensing obligations vary by jurisdiction and require legal/compliance counsel.", weight: 5 }
should_have:
  - { claim: "Distinguishes on-ramp-only, off-ramp, and cross-border anchor roles by their float/liquidity profiles (e.g. on-ramp may collect fiat before issuing, while off-ramp/cross-border generally need prefunded liquidity or payout-partner credit).", weight: 3 }
  - { claim: "Mentions Anchor Platform can implement much of the technical SEP surface but is not a license and does not remove business, banking, and operational requirements.", weight: 3 }
nice_to_have:
  - { claim: "Mentions sandbox/testnet and staged corridor launch before production.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say running Anchor Platform alone makes the operator legally licensed.", weight: 3 }
  - { claim: "Do NOT provide jurisdiction-specific legal advice as if it were definitive without cited legal sources.", weight: 5 }
must_cite:
  - "Stellar Anchor Platform or anchor docs plus dated jurisdiction/regulatory sources for legal claims."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/anchors"
  - "https://developers.stellar.org/docs/category/anchor-platform"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: Re-weighted toward anchor operations/economics — promoted liquidity/float, treasury/reconciliation, and on/off-ramp float profiles to must_have; demoted the 'Anchor Platform != license' point to should_have/weight-3 must_avoid (that misconception is owned by q-comp-anchor-platform and q-pay-anchor-msb-licensing). Legal/licensing stays jurisdiction-specific; reward bounded compliance framing, not definitive legal advice."
---

## Reference answer (gospel)

To become a Stellar anchor, separate the technical job from the regulated business job. Technically, an anchor connects external rails to Stellar assets and normally publishes SEP-1 metadata, authenticates wallets with SEP-10, collects customer information through SEP-12, and implements deposit/withdrawal or payment flows through SEP-24/SEP-6, SEP-31, and quotes through SEP-38 where relevant. The Anchor Platform is SDF's reference implementation for much of this API surface, but it is not a license and does not supply bank accounts, payout partners, liquidity, customer support, or regulatory approval.

Operationally, an anchor needs a supported asset and issuer/treasury model, enough liquidity or float to redeem withdrawals and fund payouts, reconciliation between Stellar and external rails, monitoring, refunds/failed-payment handling, and production controls for keys, webhooks, secrets, and support. On-ramp-only, off-ramp, and cross-border anchors have different float and risk profiles: on-ramp can sometimes collect fiat before issuing, while off-ramp and cross-border payout generally require prefunded liquidity or payout partner credit.

Compliance must be answered by jurisdiction and customer type. A production anchor may trigger money-transmitter, MSB, e-money/payment-institution, sanctions-screening, KYC/AML, travel-rule, consumer-protection, and data-protection obligations. Raven should tell a builder to use Stellar's SEP/Anchor Platform docs for the technical checklist and qualified counsel/regulatory sources for the legal checklist; it should not imply that deploying Anchor Platform makes the business licensed.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the core answer is first-party Stellar anchor and SEP documentation. General web tools are acceptable only to cite dated jurisdiction-specific legal context if the user asks about a specific country.

## Edge / traps

The central trap is treating technical integration as regulatory permission. Also avoid implying that every anchor must implement every SEP; the required SEP set depends on whether the business offers deposits, withdrawals, cross-border payments, quotes, or regulated asset transfer.
