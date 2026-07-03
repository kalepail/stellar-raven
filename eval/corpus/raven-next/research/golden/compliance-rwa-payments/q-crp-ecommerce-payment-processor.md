---
id: q-crp-ecommerce-payment-processor
q: "How can an e-commerce merchant accept card payments and settle through Stellar, given Stellar itself does not process credit cards?"
category: compliance-rwa-payments
subcategory: merchant-payments
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_projects, lumenloop_search_directory]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "States Stellar does not natively process card acquiring, chargebacks, card network rules, or WooCommerce/Shopify checkout by itself.", weight: 5 }
  - { claim: "Explains a merchant needs a payment processor/gateway or anchor-like service that accepts cards or local payments and settles to a Stellar asset such as USDC/XLM if supported.", weight: 5 }
  - { claim: "Requires checking current processor support for Stellar assets, merchant country, plugins, fees, refunds, chargebacks, KYC/KYB, and settlement terms.", weight: 4 }
should_have:
  - { claim: "Distinguishes card-to-crypto processing from accepting on-chain Stellar wallet payments directly.", weight: 3 }
  - { claim: "Mentions common e-commerce plugin claims must be verified against current provider documentation.", weight: 2 }
nice_to_have:
  - { claim: "Notes stablecoin settlement reduces crypto volatility compared with XLM settlement.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present Stellar as a Stripe replacement for card acquiring without a processor.", weight: 5 }
  - { claim: "Do NOT recommend a named payment processor as supporting Stellar settlement unless cited from current provider docs.", weight: 5 }
must_cite:
  - "Current payment-processor/provider documentation for any named card-to-Stellar route."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://docs.rozo.ai/integration/rozointentpay"
  - "https://nowpayments.io/woocommerce-plugin"
  - "https://nowpayments.io/payment-integration/shopify-plugin"
  - "https://documenter.getpostman.com/view/7907941/S1a32n38"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Processor/plugin support is freshness-sensitive. Phase 3 should re-check named providers and not grade on a single vendor."
---

## Reference answer (gospel)

Stellar is not a card acquirer and does not by itself handle credit-card authorization, card-network rules, chargebacks, PCI/KYB onboarding, WooCommerce/Shopify checkout, or fiat settlement. A merchant that wants "cards in, Stellar asset out" needs an off-chain processor/gateway or anchor-like service that accepts card/local payments and can settle in a Stellar asset. A merchant that only wants on-chain payments can accept Stellar wallet payments directly, but that is not the same product as card checkout.

Current provider examples should be cited narrowly. Rozo Intent Pay documents a checkout button where a customer can pay from multiple chains and the merchant receives a chosen asset, including Stellar USDC/EURC. NOWPayments documents WooCommerce and Shopify crypto-payment integrations and an API that can accept a range of cryptocurrencies and convert/send payouts, but Raven must verify whether the exact desired Stellar asset, merchant country, plugin, refunds, chargebacks, KYC/KYB, and settlement terms are supported at answer time.

The safe implementation advice is: decide whether the checkout is card acquiring, direct crypto checkout, or cross-chain/stablecoin checkout; verify the provider's supported assets and jurisdictions; prefer stablecoin settlement such as USDC/EURC if volatility is unacceptable; and keep accounting/refund/chargeback handling outside the Stellar transaction itself.

## Why these cards (routing rationale)

`perplexity_search` or `parallel_search` should fire because merchant processor/plugin support is current provider-web data, not a stable Stellar protocol fact. `scout_projects`/LumenLoop are acceptable when the user asks for Stellar-native payment projects.

## Edge / traps

Do not blur on-chain payment acceptance with card acquiring. Do not call Stellar a Stripe replacement unless a named processor is providing card acquiring, compliance onboarding, disputes, and settlement for the merchant's jurisdiction.
