---
id: q-crp-regional-offramp-mobilemoney
q: "Which wallets or anchors let users cash Stellar USDC or XLM out to local bank, card, or mobile-money rails, and how should a builder integrate last-mile cash-out?"
category: compliance-rwa-payments
subcategory: cashout-mobile-money
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: true
freshness_horizon: monthly

expected_cards: [lumenloop_search_directory]
acceptable_cards: [scout_projects, lumenloop_find_content_by_entity, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Treats wallet/anchor cash-out availability by country and rail as a live, dated discovery problem.", weight: 5 }
  - { claim: "Explains Stellar itself does not provide local bank, debit-card, M-Pesa, Wave, Orange Money, MoMo, or USSD payout rails; those come from anchors, wallets, payment processors, or local partners.", weight: 5 }
  - { claim: "Says integration requires checking supported assets, countries, KYC, fees, limits, settlement time, and API/SEP support for each provider.", weight: 4 }
should_have:
  - { claim: "Separates consumer wallet availability (a user can cash out) from builder/API availability (a separate partner/API contract, KYB, webhooks, SLAs, reconciliation).", weight: 4 }
  - { claim: "Treats failed/partial/reversed last-mile payout (wrong number, agent-network outage, USSD failure, dormant mobile-money account) as a remediation/support requirement the builder must design for.", weight: 3 }
  - { claim: "Maps SEP-24/6 withdrawal (and SEP-31 for cross-border) as the on-chain side that hands off to the off-chain payout partner, not the payout itself.", weight: 3 }
nice_to_have:
  - { claim: "Names concrete last-mile rail types (M-Pesa/agent network, Wave, Orange Money, MoMo, USSD cash-out, bank/card) and notes coverage is partner- and country-specific.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim a mobile-money corridor is supported without current provider evidence.", weight: 5 }
  - { claim: "Do NOT imply Stellar can directly push funds to mobile-money or bank rails without an off-chain partner.", weight: 5 }
  - { claim: "Do NOT answer only at the corridor-selection/cost-structure level; this question owns the last-mile payout-rail integration, including failed-payout remediation.", weight: 3 }
must_cite:
  - "Dated provider/anchor docs or directory entries for any named cash-out option."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developer.moneygram.com/moneygram-developer/docs/integrate-moneygram-ramps"
  - "https://stellar.org/products-and-tools/moneygram"
  - "https://stellarlight.xyz/project/honey-coin"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: Sharpened to own last-mile payout-rail integration — promoted consumer-wallet-vs-builder-API split and failed-payout remediation to should_have, added a must_avoid against answering only at the corridor-selection level (that lane is owned by q-crp-anchors-by-corridor). MoneyGram USDC cash-out and HoneyCoin mobile-money lead unchanged; country/mobile-money support stays monthly-freshness."
---

## Reference answer (gospel)

Treat this as provider discovery, not a static Stellar feature list. Stellar settles assets such as USDC/XLM; local bank, debit-card, cash, M-Pesa, Wave, Orange Money, MoMo, USSD, and agent-network payouts are supplied by wallets, anchors, processors, or local partners. A correct answer asks for the country, asset, payout rail, amount, and user type, then verifies the provider's current support, limits, fees, KYC, settlement time, and API availability.

MoneyGram Ramps is the clearest cited cash-access example: SDF describes it as letting wallets/apps convert cash to digital dollars and back via Stellar USDC, and MoneyGram's developer docs document SEP-10/SEP-24 integration, USDC asset details, production onboarding/KYB/legal steps, and production limits/country availability. Scout also surfaces HoneyCoin as an African fiat-to-stablecoin anchor with mobile-money/bank rails across multiple markets and USDC cash-out at MoneyGram on Stellar; that is a directory lead to verify against HoneyCoin's own current docs before promising a corridor.

For builders, distinguish consumer wallet availability from API availability. A wallet may let a user cash out, while a builder may need a separate partner/API contract, KYB, compliance review, webhooks, support SLAs, and reconciliation. SEP-24/SEP-6 are the on-chain withdrawal patterns and SEP-31 is relevant for cross-border payments, but the SEP flow only hands the value to the off-chain payout partner — it does not perform the M-Pesa/Wave/Orange Money/USSD/agent-network leg. Design for last-mile failure explicitly: a wrong phone number, dormant mobile-money account, agent liquidity outage, or USSD timeout can leave a payout pending/failed after the on-chain leg succeeds, so reconciliation, retries, refunds, and user support are part of the integration, not an afterthought.

## Why these cards (routing rationale)

`lumenloop_search_directory` and `scout_projects` should fire because cash-out availability is provider and country specific. `parallel_search`/`perplexity_search` are acceptable to verify current provider docs.

## Edge / traps

Do not confuse chain settlement with last-mile payout. Do not assert M-Pesa/Wave/Orange Money/MoMo support for a country without a dated provider source, and do not imply direct bank/mobile-money payout exists just because Stellar settlement is available.
