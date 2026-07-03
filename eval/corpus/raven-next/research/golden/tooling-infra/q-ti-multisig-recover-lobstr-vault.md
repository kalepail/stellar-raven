---
id: q-ti-multisig-recover-lobstr-vault
q: "How do I remove signers or change thresholds on an existing multisig, and what are my options if I lost the LOBSTR Vault recovery phrase but still control the source account?"
category: tooling-infra
subcategory: authorization-patterns
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that classic Stellar multisig is controlled by account signers, signer weights, master-key weight, and low/medium/high thresholds, changed with Set Options.", weight: 5 }
  - { claim: "States that removing a signer means setting that signer's weight to 0, and changing thresholds requires a transaction signed by signers whose combined weight still meets the current threshold.", weight: 5 }
  - { claim: "Warns that if the remaining usable signers cannot meet the current threshold, the account cannot be recovered by Stellar/SDF/LOBSTR because the network has no backdoor.", weight: 5 }
  - { claim: "For the LOBSTR Vault edge case, distinguishes losing the Vault recovery phrase from still controlling enough signer weight on the source account; if enough authority remains, rotate/remove the Vault signer before lowering safety assumptions.", weight: 4 }
should_have:
  - { claim: "Mentions checking the current signer set and thresholds in Horizon/Lab/CLI before submitting changes.", weight: 3 }
  - { claim: "Notes reserve and result-code caveats for adding signers, including low reserve and the 20-signer limit.", weight: 2 }
nice_to_have:
  - { claim: "Mentions SEP-30 recoverable-account patterns as a planned recovery design, not a retrofit for an already-unrecoverable signer set.", weight: 1 }
must_avoid:
  - { claim: "Do NOT imply a lost signer or LOBSTR Vault phrase can be reset off-chain if on-chain thresholds cannot be met.", weight: 5 }
  - { claim: "Do NOT confuse classic G-account signer thresholds with Soroban contract `require_auth` semantics.", weight: 4 }
  - { claim: "Do NOT recommend setting the master key weight to 0 until replacement signers and thresholds have been verified.", weight: 5 }
must_cite:
  - "Primary Stellar docs for Set Options signer/threshold semantics and account signer fields."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#set-options"
  - "https://developers.stellar.org/docs/tools/cli/cookbook/tx-new#set-options"
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts"
  - "https://developers.stellar.org/docs/build/apps/wallet/sep30#create-recoverable-account"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "LOBSTR Vault product-specific phrase recovery behavior should be rechecked in Phase 3 if a primary LOBSTR support URL is required; the on-chain Stellar signer/threshold mechanics are verified from primary Stellar docs."
---

## Reference answer (gospel)

On classic Stellar accounts, multisig is not a separate contract. The account has signer entries, signer weights, a master-key weight, and low/medium/high thresholds; `set_options` changes those fields. To remove a signer, submit a `set_options` operation for that signer with weight `0`; to change thresholds, set the low/medium/high threshold fields. The transaction still has to be authorized by the current signer set, so you must have enough currently valid signer weight before the change can take effect.

If you lost a LOBSTR Vault recovery phrase but still control enough signer weight on the source account, the practical recovery is to rotate away from the lost Vault signer: inspect current signers and thresholds, submit a Set Options transaction that removes or reduces the Vault signer and adds/reweights a replacement signer, then verify the resulting threshold policy. If you no longer control enough signer weight to meet the existing threshold, the network will not let you rewrite the account; Stellar's signer system has no administrative recovery path.

Use extra caution before setting the master-key weight to `0`: the Stellar wallet docs explicitly warn this can lock the account irreversibly if replacement signers/weights are wrong. Adding signers also consumes reserve and can fail for low reserve or too many signers.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer is determined by primary Stellar protocol/tooling docs: account signer fields, Set Options, and CLI transaction construction. `scout_research` is acceptable for broader recovery-pattern context such as SEP-30, but the core answer should not depend on ecosystem search.

## Edge / traps

The main trap is treating LOBSTR Vault as if it can override on-chain authorization. Wallet support may help with product UX, but it cannot change a Stellar account unless a valid transaction meets the current thresholds. Another trap is lowering thresholds or disabling the master key in the wrong order, which can make a recoverable account unrecoverable.
