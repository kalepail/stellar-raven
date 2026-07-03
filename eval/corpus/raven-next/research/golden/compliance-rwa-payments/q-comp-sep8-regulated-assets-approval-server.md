---
id: q-comp-sep8-regulated-assets-approval-server
q: "How does SEP-8 let an issuer enforce compliance on a regulated asset, and what is the approval server's role in the transaction flow?"
category: compliance-rwa-payments
subcategory: sep8-regulated-assets
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
  - { claim: "Names SEP-8 as the 'Regulated Assets' standard.", weight: 5 }
  - { claim: "An Approval Server validates client transactions against the issuer's approval criteria and (re)signs validated transactions with the asset issuer's account before they are submitted to the network.", weight: 5 }
should_have:
  - { claim: "The regulated asset is configured so transfers require issuer approval (authorization gating), tied to the asset's authorization flags.", weight: 3 }
  - { claim: "WisdomTree-style issuers used SEP-8 to create assets that require issuer approval to transact, without a smart contract.", weight: 2 }
nice_to_have:
  - { claim: "Notes SEP-8 is distinct from SEP-12 (KYC upload) and SEP-10 (auth).", weight: 2 }
must_avoid:
  - { claim: "Do NOT say SEP-8 is the KYC standard (that is SEP-12) or the authentication standard (that is SEP-10).", weight: 5 }
  - { claim: "Do NOT claim SEP-8 requires a Soroban smart contract to function (it is a four-step native-asset pattern).", weight: 3 }
must_cite:
  - "The SEP-8 spec (stellar-protocol GitHub) or developers.stellar.org regulated-assets docs."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md
  - https://stellar.org/case-studies/wisdomtree
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Canonical on-chain mechanic. Verified vs SEP-0008: title 'Regulated Assets'; the Approval Server 'receives a signed transaction, checks for compliance, and signs it on success' (the wallet then submits). Trap is conflating SEP-8 (regulated assets) with SEP-12 (KYC)/SEP-10 (auth)."
---

## Reference answer (gospel)

- **SEP-8 is the "Regulated Assets" standard** — for assets whose issuer must approve each transfer [1].
- The issuer runs an **Approval Server**: a single endpoint that **receives a client's signed transaction,
  checks it against the issuer's compliance/approval criteria, and signs it (with the asset issuer's
  account) on success** [1]. It can also reject, request a revision, mark pending, or require an action.
  The **wallet** (not the server) then submits the dual-signed transaction to the network [1].
- The regulated asset is configured so transfers require this issuer co-signature, tied to the asset's
  **authorization flags** (e.g. `AUTH_REQUIRED`) — a native-asset pattern that needs **no Soroban smart
  contract** (WisdomTree used "the Stellar network standard for Regulated Assets" this way) [2].
- SEP-8 is distinct from **SEP-12** (KYC upload) and **SEP-10** (web auth).

Sources: [1] SEP-0008 (Regulated Assets); [2] stellar.org WisdomTree case study.

## Why these cards (routing rationale)

On-chain compliance spec → `stellar_docs_mcp` (and SEP-0008 repo) is primary; `scout_research` (SEPs corpus) acceptable. General-web/deep-research wrong — fully first-party.

## Edge / traps

The defining trap is SEP misattribution: SEP-8 is regulated-assets/approval-server, NOT KYC (SEP-12) or auth (SEP-10).
