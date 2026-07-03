---
id: q-comp-sep10-auth-role
q: "What is SEP-10 and why does an anchor need it before it will accept a KYC submission or process a deposit?"
category: compliance-rwa-payments
subcategory: sep10-auth-compliance
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "SEP-10 is 'Stellar Web Authentication': the wallet signs a challenge transaction to prove control of a Stellar account.", weight: 5 }
  - { claim: "On successful verification the anchor issues a signed token (JWT) the client uses to authenticate downstream calls (e.g. SEP-12 KYC, SEP-6/24 transfers).", weight: 4 }
should_have:
  - { claim: "SEP-10 establishes account identity/authentication, which gates compliance steps like KYC and regulated transfers.", weight: 3 }
nice_to_have:
  - { claim: "Supports both custodial and non-custodial (client/memo) authentication flows.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe SEP-10 as the KYC standard (SEP-12) or the regulated-asset approval standard (SEP-8).", weight: 5 }
  - { claim: "Do NOT claim SEP-10 sends a password or shares a private key to the anchor.", weight: 3 }
must_cite:
  - "The SEP-10 spec / developers.stellar.org SEP-10 authentication docs."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md
  - https://developers.stellar.org/docs/build/apps/wallet/sep10
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Canonical. Verified vs SEP-0010 ('Stellar Web Authentication', a mutual challenge-response using Stellar txs; server returns a JWT). SEP-12 requires SEP-10 (or SEP-45) on all its endpoints. Trap: SEP-10 vs SEP-12 vs SEP-8 confusion."
---

## Reference answer (gospel)

- **SEP-10 is "Stellar Web Authentication"** — a mutual challenge-response that encodes the challenge as a
  Stellar transaction. The server hands the wallet a **challenge transaction**; the wallet **signs it to
  prove control** of its Stellar account and returns it [1].
- On successful verification the anchor issues a **signed JWT** the client uses to authenticate
  downstream calls — SEP-12 (KYC), SEP-6/SEP-24 transfers, etc. (SEP-12 requires SEP-10 or SEP-45 auth on
  all its endpoints) [1][2].
- So SEP-10 establishes **account identity/authentication**, which is the gate before any KYC submission
  or deposit. No password is sent and **no private key is shared** with the anchor — only a signature [1].
- It supports custodial and non-custodial (client/memo) flows [2].

Sources: [1] SEP-0010; [2] developers.stellar.org SEP-10 docs.

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp`; `scout_research` acceptable corroboration.

## Edge / traps

Trap: attributing KYC (SEP-12) or regulated-asset approval (SEP-8) to SEP-10.
