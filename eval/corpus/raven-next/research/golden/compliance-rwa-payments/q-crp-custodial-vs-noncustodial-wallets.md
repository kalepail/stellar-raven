---
id: q-crp-custodial-vs-noncustodial-wallets
q: "What's the difference between custodial and non-custodial wallets on Stellar, and how should a remittance or SEP-31 app choose between them?"
category: compliance-rwa-payments
subcategory: custody-models
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_research]
acceptable_cards: [lumenloop_search_directory, scout_projects, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Defines custodial wallets as provider-controlled/key-custody or ledger-account models where the provider can move funds, and non-custodial wallets as user-controlled signing/key models.", weight: 5 }
  - { claim: "Explains custody choice affects user recovery, compliance/KYC, travel-rule/recordkeeping, operational risk, UX, liability, and regulatory obligations.", weight: 5 }
  - { claim: "For remittance/SEP-31 apps, explains the model must align with anchor/user authentication, KYC, payout support, and who bears custody and support responsibilities.", weight: 4 }
should_have:
  - { claim: "Mentions wallet/provider examples only with current sourced evidence and distinguishes consumer wallets from custody infrastructure providers.", weight: 3 }
  - { claim: "Notes smart accounts/passkeys can improve UX without necessarily making a wallet custodial.", weight: 2 }
nice_to_have:
  - { claim: "Mentions pooled accounts and muxed-account bookkeeping as custody/operations design considerations if sourced.", weight: 1 }
must_avoid:
  - { claim: "Do NOT label a wallet custodial or non-custodial without current evidence of its control model.", weight: 5 }
  - { claim: "Do NOT say non-custodial design eliminates KYC/compliance obligations for regulated remittance flows.", weight: 5 }
must_cite:
  - "Current wallet/provider docs for examples and Stellar SEP docs for remittance/auth flow claims."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/apps/overview"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md"
  - "https://developers.stellar.org/docs/build/apps/moneygram-access-integration-guide"
  - "https://stellarlight.xyz/project/decaf"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Provider labels can change; Phase 3 should re-check any named wallet/provider examples if used in grading."
---

## Reference answer (gospel)

Custodial means the provider controls signing/key custody or maintains an internal ledger that lets it move user funds. Non-custodial means the user controls signing authority and the app cannot move funds without user authorization. On Stellar, the same remittance UX can be built either way, but the risk allocation changes: custodial designs improve recovery/support and simplify some payout operations while increasing custody, safeguarding, recordkeeping, licensing, and operational-liability burdens; non-custodial designs reduce custody risk but still do not remove KYC/AML, sanctions, travel-rule, fraud, or support obligations for regulated remittance flows.

For SEP-31/cross-border apps, choose the custody model around the anchor and payout flow: who authenticates through SEP-10, who submits KYC through SEP-12, who funds the Stellar payment, who handles memos/muxed-account bookkeeping, who can refund or remediate failed payouts, and who is responsible if the user loses keys. The MoneyGram Access guide shows this distinction explicitly by describing custodial and non-custodial authentication patterns for SEP-10/SEP-24 integration.

Examples must be dated and sourced. Scout currently lists Decaf as a non-custodial wallet for cross-border money movement using Stellar/Solana and MoneyGram/partner ramps, while the official TypeScript Wallet SDK is a build tool, not a custody provider. Do not label a wallet or custody vendor by marketing category alone.

## Why these cards (routing rationale)

`scout_research` and `scout_projects` fit because the user often wants current provider examples. `stellar_docs_mcp` is supporting evidence for SEP-31/SEP-10/SEP-24 flow mechanics.

## Edge / traps

Custody model is about key/control and obligations, not a marketing label. Smart accounts, passkeys, muxed accounts, and pooled accounts can change UX and bookkeeping without automatically deciding the legal custody model.
