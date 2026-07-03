---
id: q-pc-multisig-setup-lifecycle
q: "How do I set up and manage classic Stellar multisig, including SetOptions 2-of-3, master-key weight, thresholds, signer rotation, and lockout risk?"
category: protocol-core
subcategory: accounts-multisig
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Uses SetOptions to add/remove signers and change thresholds/master-key weight, treating signer-update/threshold changes as high-threshold operations.", weight: 5 }
  - { claim: "Explains master-key weight 0 disables the account key and can lock the user out without sufficient alternate signers.", weight: 5 }
  - { claim: "Covers signer rotation safely by adding/testing replacement authority before removing old authority.", weight: 5 }
should_have:
  - { claim: "Assumes the weight/threshold model (signers have weights; low/medium/high thresholds) as background; deep threshold theory is owned by q-protocol-accounts-signers-thresholds.", weight: 2 }
  - { claim: "Mentions sequence/fee and that the SetOptions transaction itself must be authorized under current thresholds.", weight: 2 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT suggest setting master weight to 0 before another signer set can meet thresholds.", weight: 5 }
  - { claim: "Do NOT confuse classic multisig with Soroban custom-account auth.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/signatures-multisig
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#set-options
  - https://developers.stellar.org/docs/tools/cli/cookbook/tx-new#set-options
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Reviewed 2026-06-29: differentiated (D1) from q-protocol-accounts-signers-thresholds — this question owns the operational lifecycle verbs (SetOptions add/remove/rotate, master-weight-0 lockout, safe rotation); the conceptual weight/threshold model is demoted to assumed background (owned by the sibling). Verified against official signatures/multisig, SetOptions, and CLI docs. Covers classic account multisig, not Soroban custom-account authentication."
---

## Reference answer (gospel)

Classic Stellar multisig is account-level weighted signing. Each account has a master-key weight, additional signers with weights, and low/medium/high thresholds; each operation type requires the relevant threshold total [1]. `SetOptions` is the operation used to add/remove signers and change master weight and thresholds; updating signers or thresholds is a high-threshold action, while other SetOptions changes are medium threshold [2]. A typical 2-of-3 setup gives three signer keys weight 1, sets medium/high threshold to 2, and sets the master-key weight deliberately (often 0 only after the alternate signers are proven sufficient). If the master-key weight is 0, the account key cannot sign transactions and the docs warn this can permanently lock the account if other signers cannot meet thresholds [1]. Rotate safely by adding the replacement signer, submitting/test-signing under the new quorum, then removing the old signer with a transaction still authorized under the current thresholds.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because official multisig and SetOptions docs define thresholds, signer weights, and lockout behavior. Scout is acceptable only as secondary corroboration.

## Edge / traps

The dangerous trap is setting master weight to 0 before any alternate signer set can meet medium/high thresholds. Another trap is mixing classic account multisig with Soroban smart-wallet/custom-account auth; they are related authorization topics but different mechanisms.
