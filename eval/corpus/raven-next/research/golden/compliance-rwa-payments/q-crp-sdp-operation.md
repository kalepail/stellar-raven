---
id: q-crp-sdp-operation
q: "How do I deploy and operate the Stellar Disbursement Platform, and what recipient account types can it disburse to?"
category: compliance-rwa-payments
subcategory: disbursement-platform
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Mentions deployment/operation specifics such as Docker Compose or Helm/Kubernetes components, the admin dashboard, Dashboard/Admin APIs, API keys (granular permissions/IP restrictions), dashboard auth with MFA/OTP and reCAPTCHA, distribution/funding accounts, and the Transaction Submission Service.", weight: 5 }
  - { claim: "States recipients receive funds in receiver-registered Stellar wallet accounts: in the standard flow recipients are reached by phone/email and register a supported wallet via SEP-24, and the newer Embedded Wallets feature provisions a passkey-secured smart-contract (C-address) wallet per receiver.", weight: 5 }
  - { claim: "Identifies SDP as the Stellar Disbursement Platform for managing bulk disbursements through an admin/API operational stack.", weight: 3 }
should_have:
  - { claim: "Mentions testing on testnet/sandbox before production and monitoring failed or pending payments.", weight: 3 }
  - { claim: "Distinguishes SDP disbursement operations from Anchor Platform on/off-ramp operations.", weight: 2 }
nice_to_have:
  - { claim: "Mentions pooled/custodial versus direct recipient accounts may change compliance and support obligations.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim SDP disburses to muxed accounts, sponsored accounts, or arbitrary third-party custodial destinations unless the current docs support that exact claim (note the documented receiver types are SEP-24-registered wallets and Embedded-Wallet C-addresses).", weight: 5 }
  - { claim: "Do NOT treat SDP as a replacement for compliance, recipient verification, or treasury controls.", weight: 4 }
must_cite:
  - "Current Stellar Disbursement Platform docs (admin guide / embedded-wallets) or repository documentation."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/platforms/stellar-disbursement-platform/admin-guide/design-and-architecture"
  - "https://developers.stellar.org/docs/platforms/stellar-disbursement-platform/admin-guide/embedded-wallets"
  - "https://developers.stellar.org/docs/platforms/stellar-disbursement-platform/api-reference/api-keys"
  - "https://github.com/stellar/stellar-disbursement-platform-backend"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29 RESEARCH-FIX: pinned recipient account types against current SDP docs. Architecture (design-and-architecture) confirms receivers register a supported wallet via SEP-24 (phone/email -> OTP -> Wallet Registration); TSS pays those receiver wallet accounts. Embedded Wallets page + advanced-configuration (verified in stellar/stellar-docs source) confirm SDP now provisions a passkey-secured smart-contract C-address wallet per receiver, so contract-account receivers ARE documented (the old must_avoid forbidding contract accounts was outdated and is corrected). Muxed/sponsored/arbitrary custodial remain unsupported absent explicit docs. Demoted the bare definition; promoted operational specifics + recipient discipline to 5-weight."
---

## Reference answer (gospel)

SDP is the Stellar Disbursement Platform: an operational stack for organizations to manage bulk disbursements, recipients, messages, dashboard/API access, transaction submission, and payment status. Current docs and repo material show Docker Compose/`make setup` for quick start, Helm for deployment, admin and dashboard APIs, API keys with granular permissions/IP restrictions, dashboard authentication, MFA/OTP by email, reCAPTCHA configuration, messaging providers, Horizon/RPC configuration, and a Transaction Submission Service.

A production operator should configure tenants, distribution/funding accounts, channel accounts/TSS, API keys, dashboard auth, CAPTCHA/MFA, SMS/email/WhatsApp messaging, secrets, monitoring, failed/pending payment handling, and testnet/sandbox runs before mainnet. SDP is not the same thing as Anchor Platform: SDP helps send/manage disbursements, while anchors handle deposit/withdrawal/cross-border rails.

Recipient accounts are receiver-registered Stellar wallets, not arbitrary destinations. In the standard flow the SDP's Messaging Service contacts each receiver (SMS/email) to download the disbursement's selected wallet and verify with an OTP, and the Wallet Registration web app registers the receiver through SEP-24 Hosted Deposit/Withdrawal; the Transaction Submission Service then pays those receiver wallet accounts. As of 2026 the SDP also ships an Embedded Wallets feature that "automatically creates a lightweight, passkey-secured smart contract wallet for each receiver" — a Stellar C-address — so contract-account receivers are now documented. What remains unsupported (absent explicit docs) is disbursing to muxed accounts, sponsored accounts, pooled custodial ledgers, or arbitrary third-party custodial destinations; Raven should state recipient support from current docs/source, not guess.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because SDP is first-party Stellar docs/repo material. `scout_repos` is acceptable for source-level verification when docs are ambiguous.

## Edge / traps

Avoid unsupported claims about account-type compatibility. Also avoid treating SDP as a replacement for recipient verification, treasury controls, compliance, or payout/support operations.
