---
id: q-soroban-contract-id-derivation
q: "How is a Soroban contract's address (the C... id) determined at deploy time, and is it deterministic?"
category: soroban
subcategory: deploy-upgrade
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The contract address (a `C...` strkey) is a deterministic hash derived from the deployer/source plus a salt (the ContractIDPreimage).", weight: 5 }
  - { claim: "The same deployer + same salt yields the same contract address; varying the salt yields distinct addresses.", weight: 3 }
should_have:
  - { claim: "The address is NOT derived from the Wasm hash itself, so upgrading the Wasm does not change the address.", weight: 3 }
  - { claim: "Upload (Wasm hash) and create/deploy (instance address) are separate steps.", weight: 2 }
nice_to_have:
  - { claim: "Notes this enables counterfactual / pre-computed addresses for factory patterns.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the address is the Ethereum-style `keccak(sender, nonce)` / CREATE2 of the bytecode.", weight: 4 }
  - { claim: "Do NOT claim the contract id changes when you upgrade the Wasm.", weight: 4 }
must_cite:
  - "A developers.stellar.org page on contract creation / addresses / deployment."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Address = SHA-256 over ContractIDPreimage (CONTRACT_ID_PREIMAGE_FROM_ADDRESS: deployer address + salt) plus network id; NOT the Wasm hash. Upload vs create are separate ops. Verified against the Stellar transaction fundamentals page."
---

## Reference answer (gospel)

A Soroban contract address (the `C...` strkey) is **deterministic**: it is the **SHA-256 of a
`ContractIDPreimage` together with the network identifier** (as a `HashIDPreimage`). [tx]

- The common deploy path uses **`CONTRACT_ID_PREIMAGE_FROM_ADDRESS`** = **deployer/source address +
  salt** (and requires that address's authorization). Same deployer + same salt ⇒ **same address**;
  varying the salt ⇒ distinct addresses. (A second variant, `..._FROM_ASSET`, derives the SAC address
  from the asset.) [tx]
- The address is **NOT** derived from the **Wasm hash**. **Upload** (`UPLOAD_CONTRACT_WASM`, keyed by
  the SHA-256 of the Wasm) and **create/deploy** (`CREATE_CONTRACT`, the instance) are **separate
  steps**. [tx]
- Therefore **upgrading the Wasm does not change the contract address** — the instance address is
  preserved; only the executable behind it changes. This enables counterfactual/pre-computed addresses
  for factory patterns.

Traps: claiming it is Ethereum-style `keccak(sender, nonce)` / CREATE2 of the bytecode; or claiming the
contract id changes when you upgrade the Wasm.

## Why these cards (routing rationale)

Address-derivation fact → `stellar_docs_mcp`. `scout_research`/`scout_repos` acceptable.

## Edge / traps

CREATE2/keccak(sender,nonce) framing; claiming address changes on Wasm upgrade.
