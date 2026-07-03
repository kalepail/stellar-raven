---
id: q-crp-tokenize-personal-rwa
q: "How can an individual or small business tokenize a real-world asset on Stellar, and what legal structuring and compliance issues should they consider?"
category: compliance-rwa-payments
subcategory: rwa-tokenization
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search, parallel_search, lumenloop_find_similar_projects_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Distinguishes the technical act of issuing a Stellar asset or SAC-backed token from the legal act of creating enforceable rights to off-chain assets or cash flows.", weight: 5 }
  - { claim: "Explains RWA tokenization usually needs legal entity/trust/SPV or contractual structure, ownership/servicing records, disclosure, transfer restrictions, investor/customer compliance, and redemption/enforcement process.", weight: 5 }
  - { claim: "Warns that securities, lending, commodities, real estate, carbon credit, and consumer-protection laws can apply depending on asset and jurisdiction.", weight: 5 }
should_have:
  - { claim: "Mentions Stellar controls such as authorization flags, clawback, SEP-8/approval flows, and SAC/Soroban token patterns may help enforce transfer restrictions but do not create legal rights by themselves.", weight: 3 }
  - { claim: "Recommends consulting qualified legal/compliance professionals before selling tokens to others.", weight: 3 }
nice_to_have:
  - { claim: "Mentions institutional RWA examples as models, not copy-paste legal templates.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say anyone can legally tokenize and sell any personal asset simply by issuing a Stellar token.", weight: 5 }
  - { claim: "Do NOT provide definitive legal advice for a jurisdiction without sourced legal authority.", weight: 5 }
must_cite:
  - "Stellar asset/regulated asset docs plus dated legal/regulatory or project-structure sources for RWA claims."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/tokens/control-asset-access"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0057.md"
  - "https://www.franklintempleton.com/investments/options/money-market-funds/products/29386/SINGLCLASS/franklin-on-chain-u-s-government-money-fund/FOBXX"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "High-stakes legal/compliance question. Phase 3 should ensure the answer declines definitive legal advice and treats BENJI/SEP-0057 as examples, not templates."
---

## Reference answer (gospel)

An individual or small business can technically issue a Stellar asset, expose it through SAC/Soroban, and use controls such as authorization flags, clawback, SEP-8 approval flows, and draft SEP-0057/T-REX-style permissioning. That technical token does not by itself create enforceable rights to a receivable, promissory note, rental income stream, real estate interest, whisky barrel, artwork, carbon credit, or other off-chain asset.

The legal work is the hard part: define the issuer/entity/trust/SPV or contract, ownership and servicing records, investor/customer eligibility, disclosures, transfer restrictions, redemption/enforcement mechanics, tax/accounting treatment, custody/safekeeping, dispute process, and what happens on default or loss of the underlying asset. Securities, lending, commodities, real-estate, consumer-protection, carbon-market, and money-transmission laws may apply depending on the asset and jurisdiction.

Stellar controls can help enforce a policy already defined off-chain. `AUTH_REQUIRED`, revocable authorization, clawback, SEP-8 approval servers, and draft SEP-0057 identity/compliance modules can restrict who receives/transfers a token and support regulatory actions. Institutional examples such as Franklin Templeton's FOBXX/BENJI are useful models of regulated structure and recordkeeping, not copy-paste legal templates for a private issuer. Raven should recommend qualified legal/compliance counsel before selling tokens to others.

## Why these cards (routing rationale)

`scout_research` is appropriate for RWA examples and current ecosystem context. `stellar_docs_mcp` is required for Stellar asset controls, SEP-8, and SEP-0057/T-REX mechanics. General web is acceptable for issuer/project primary sources.

## Edge / traps

The token is not the legal wrapper. Do not say "just issue a token" for securities or fractionalized physical assets, and do not provide jurisdiction-specific legal advice without sourced legal authority.
