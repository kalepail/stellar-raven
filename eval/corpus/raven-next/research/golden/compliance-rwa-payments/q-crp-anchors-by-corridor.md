---
id: q-crp-anchors-by-corridor
q: "Which Stellar anchors serve a specific country or currency corridor, what do anchor-to-anchor costs depend on, and when should I build my own anchor instead?"
category: compliance-rwa-payments
subcategory: anchors-corridors
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: true
freshness_horizon: monthly

expected_cards: [lumenloop_search_directory]
acceptable_cards: [scout_projects, lumenloop_find_similar_projects_semantic, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Frames the task as SELECTING among candidate anchors for a corridor, treating coverage as live and source-dependent rather than a fixed protocol fact.", weight: 5 }
  - { claim: "Explains anchor-to-anchor cost depends on each provider's fee schedule, FX/quote spread (SEP-38), payout rail, liquidity, country, amount, KYC tier, and settlement time, not a single protocol price.", weight: 5 }
  - { claim: "Lays out the build-vs-integrate decision: integrating an existing anchor is usually the lower-risk first launch, while building your own anchor requires licensing/compliance, banking/payout relationships, liquidity/float, and SEP/API implementation.", weight: 5 }
should_have:
  - { claim: "Names candidate discovery surfaces such as ecosystem directories, anchor docs, or specific anchor quote/info/interactive endpoints to compare corridors.", weight: 3 }
  - { claim: "Avoids giving universal per-transaction costs without querying dated anchor quote sources.", weight: 3 }
nice_to_have:
  - { claim: "Gives a concrete comparison checklist (supported asset, country/currency support, fees, FX spread, limits, settlement, refunds) for choosing between anchors.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert a corridor is currently supported without dated evidence from the anchor or ecosystem directory.", weight: 5 }
  - { claim: "Do NOT confuse SEP-defined APIs with a guarantee of liquidity, licensing, or coverage.", weight: 5 }
  - { claim: "Do NOT collapse this into a last-mile mobile-money payout how-to; this question owns corridor selection, cost structure, and build-vs-integrate.", weight: 3 }
must_cite:
  - "Dated anchor directory or anchor documentation for any named corridor; SEP docs for API flow claims."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/anchors"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md"
  - "https://developer.moneygram.com/moneygram-developer/docs/integrate-moneygram-ramps"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: Differentiated to own corridor SELECTION + anchor-to-anchor cost structure + build-vs-integrate; dropped mobile-money lane (now owned by q-crp-regional-offramp-mobilemoney) and added a must_avoid against collapsing into a last-mile payout how-to. MoneyGram Ramps figures (174 off-ramp countries, USDC SEP-10/24, $5-$2,500 off-ramp) re-verified against developer.moneygram.com. Corridor/provider coverage stays monthly-freshness."
---

## Reference answer (gospel)

Anchors are the businesses that connect Stellar assets to external banking, cash, or payment rails; Stellar supplies open protocols, not a global table of guaranteed corridors or prices. Treat a corridor question as a SELECTION problem: use official anchor docs for the model, then compare candidate providers on current/dated evidence. SEP-24 covers interactive deposit/withdrawal flows, SEP-31 covers cross-border payments, and SEP-38 covers quotes; none of those standards proves that USD->PKR, TZS->KES, or NGN/KES/ZMW is live with a given provider, nor what it costs.

Anchor-to-anchor cost is not a single protocol number. It depends on each provider's fee schedule, FX/quote spread (typically surfaced through SEP-38), the payout rail, available liquidity, the country and amount, the customer's KYC tier, and settlement time. So Raven should return a short provider-discovery and comparison workflow: identify candidate anchors/wallets in Stellar ecosystem directories or Scout/LumenLoop; open each provider's docs, `/info`, quote, fee, and country/currency support surfaces; compare supported assets, limits, KYC/KYB, fees, FX spread, settlement time, refunds, and support; then cite the dated provider page. MoneyGram Ramps is one cited example of an anchor-like integration surface (Stellar USDC, SEP-10/SEP-24, published production limits/country availability), but that is one provider, not proof of any other corridor.

Build your own anchor only when you need a corridor no suitable provider exposes, or when you need to own onboarding, liquidity, pricing, risk, and support. Becoming an anchor means compliance/licensing, bank or payout relationships, liquidity/float, treasury reconciliation, customer support, and SEP/API implementation. If an existing anchor covers the route with acceptable economics and compliance terms, integration is usually the lower-risk first launch path. (Last-mile mobile-money/agent-network payout integration is a separate question.)

## Why these cards (routing rationale)

Named anchor/corridor discovery should use `lumenloop_search_directory` or `scout_projects` first because the answer depends on live ecosystem providers. `stellar_docs_mcp` is supporting context for SEP-24/31/38 semantics, and `parallel_search`/`perplexity_search` are acceptable for provider pages and fresh coverage.

## Edge / traps

Do not turn a SEP capability into a live corridor claim. Do not quote a universal per-transaction cost from the protocol; anchor cost depends on the provider's fee schedule, FX quote, rail, liquidity, country, amount, KYC tier, and date queried.
