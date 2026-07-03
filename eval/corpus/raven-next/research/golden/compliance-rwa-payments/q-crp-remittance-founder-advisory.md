---
id: q-crp-remittance-founder-advisory
q: "I want to build a cross-border payment or remittance business on Stellar; which stablecoin and SEP rails should I use, and how should I structure corridors with on- and off-ramps?"
category: compliance-rwa-payments
subcategory: remittance-founder-advisory
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_directory, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Frames Stellar as useful for fast low-cost settlement but not a complete remittance business by itself.", weight: 5 }
  - { claim: "Explains the corridor design needs source on-ramp, Stellar settlement asset, FX/quote path, destination off-ramp, KYC/AML/sanctions, liquidity, reconciliation, and customer support (the business architecture, not just a protocol).", weight: 5 }
  - { claim: "Drives stablecoin selection by issuer quality, liquidity, destination/geography, redemption, and regulatory fit (e.g. USDC vs EURC vs a local-currency stablecoin) rather than defaulting to XLM or one asset universally.", weight: 5 }
should_have:
  - { claim: "Maps relevant SEP rails as applicable: SEP-1 discovery, SEP-10 auth, SEP-12 KYC, SEP-24/6 deposit-withdrawal, SEP-31 cross-border payments, SEP-38 quotes.", weight: 3 }
  - { claim: "Mentions integrating existing anchors is usually lower lift than becoming an anchor in every corridor.", weight: 3 }
nice_to_have:
  - { claim: "Mentions SDP may help disbursement use cases but is not the whole remittance stack.", weight: 1 }
must_avoid:
  - { claim: "Do NOT give legal or licensing advice as definitive for all jurisdictions.", weight: 5 }
  - { claim: "Do NOT imply Stellar removes the need for fiat partners, KYC/AML, liquidity, or customer remediation.", weight: 5 }
must_cite:
  - "Stellar SEP/anchor docs plus dated corridor/provider sources for concrete recommendations."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/anchors"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0038.md"
  - "https://developers.stellar.org/docs/build/apps/moneygram-access-integration-guide"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29: Differentiated toward stablecoin-selection + business architecture — promoted stablecoin-choice to a 5-weight must_have, demoted the SEP rail-map to should_have (the rail-map lane is owned by q-crp-become-an-anchor-licensing). Specific corridor/provider recommendations still require fresh provider checks; architecture/stablecoin-selection guidance is high confidence."
---

## Reference answer (gospel)

Stellar can be a good settlement layer for a remittance business because it gives fast settlement, standardized anchor protocols, and liquid stablecoin rails, but it is not a complete remittance company by itself. A real corridor needs: source on-ramp, customer onboarding/KYC, settlement asset, FX/quote path, destination off-ramp, liquidity/float, sanctions/fraud controls, reconciliation, refunds, customer support, and legal/compliance coverage in each jurisdiction.

Map rails to the job. SEP-1 lets wallets discover anchor metadata; SEP-10 authenticates account control; SEP-12 handles KYC/customer data; SEP-24/SEP-6 handle deposit and withdrawal flows; SEP-31 handles cross-border payments; SEP-38 gives price/FX quotes. MoneyGram Access is an example of a USDC cash-in/cash-out integration using SEP-10 and SEP-24, not proof that every remittance corridor is available.

Stablecoin choice should be corridor-specific: use issuer quality, liquidity, redemption, geography, compliance fit, and anchor support rather than defaulting universally to XLM or one stablecoin. Most founders should first integrate existing anchors/ramp partners in a narrow corridor, measure quote quality and failure handling, and only become an anchor where owning licensing, payout rails, liquidity, and support creates an advantage.

## Why these cards (routing rationale)

`scout_research` is useful for ecosystem examples, while `stellar_docs_mcp` is required for the SEP/anchor rail map. LumenLoop/Scout directory cards are acceptable when the user asks for named providers in a corridor.

## Edge / traps

Avoid converting architectural guidance into legal or commercial guarantees. Do not imply Stellar removes the need for licenses, fiat partners, liquidity, KYC/AML, sanctions screening, or customer remediation.
