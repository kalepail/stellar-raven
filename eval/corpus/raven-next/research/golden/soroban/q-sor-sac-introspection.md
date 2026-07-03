---
id: q-sor-sac-introspection
q: "How do I detect whether a contract address is a SAC, deterministically derive a SAC's contract id from its classic asset, and read the underlying asset code/issuer back out of a SAC?"
category: soroban
subcategory: sac-token-interop
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that every classic Stellar asset has a reserved built-in Stellar Asset Contract address derived from `ContractIDPreimage::FromAsset` plus the network id, and that anyone can deploy the SAC instance.", weight: 5 }
  - { claim: "Gives an actionable derivation path: use SDK/CLI SAC helpers where available, or compute the protocol contract-id preimage from the `Asset` and network passphrase; do not hash asset code/issuer ad hoc.", weight: 4 }
  - { claim: "Explains that a SAC implements SEP-41 plus SAC-specific admin functions, but custom SEP-41 tokens can share the SEP-41 surface, so method presence alone is not proof of SAC.", weight: 4 }
  - { claim: "Explains that underlying code/issuer is not a generic SEP-41 introspection field; reliable reverse lookup comes from deterministic derivation over candidate assets, deployment transaction/preimage, or indexer metadata.", weight: 4 }
  - { claim: "Distinguishes account/trustline balances for `Address::Account` from contract-data balances for `Address::Contract`.", weight: 4 }
should_have:
  - { claim: "Mentions native XLM's SAC has no issuer/admin.", weight: 2 }
nice_to_have:
  - { claim: "Mentions that the SAC is the only way contracts interact with Stellar classic assets.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say any contract implementing SEP-41 is necessarily a SAC.", weight: 5 }
  - { claim: "Do NOT claim the SAC exposes a universal `asset()`/`issuer()` read method in SEP-41.", weight: 5 }
  - { claim: "Do NOT treat native XLM, issued assets, custom SEP-41 tokens, and SACs as one storage model.", weight: 5 }
must_cite:
  - "Official SAC docs."
  - "Official contract transaction/XDR docs for `CONTRACT_ID_PREIMAGE_FROM_ASSET`."
  - "SEP-41 or token guide for token-interface distinction."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
  - https://developers.stellar.org/docs/build/guides/tokens/stellar-asset-contract
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: ""
---

## Reference answer (gospel)

A SAC is a built-in contract instance reserved for a classic Stellar asset. The protocol derives its contract id from `HashIDPreimage::CONTRACT_ID` containing the network id and `ContractIDPreimage::CONTRACT_ID_PREIMAGE_FROM_ASSET`; the executable is `CONTRACT_EXECUTABLE_TOKEN`. Use CLI/SDK helpers for SAC deployment/lookup where available, or compute that exact protocol preimage from the classic `Asset` and network passphrase. Do not invent an address by hashing `code:issuer` yourself.

Detection has two layers. Positive derivation is strongest: for a known classic asset, derive its SAC contract id and compare it with the candidate `C...` address. Interface detection is weaker: a SAC implements SEP-41, but so can custom contract tokens, and SAC also exposes CAP-46-6 administrative behavior. Method presence alone proves "token-like", not "this is the SAC for USD:G...".

Reverse lookup is not a generic SEP-41 method. If all you have is a `C...`, recover the underlying asset by consulting deployment/indexer metadata or by deriving candidate asset SAC ids and matching. Native XLM has a SAC but no issuer/admin. For issued assets, `Address::Account` balances are classic account/trustline balances, while `Address::Contract` balances are stored as contract data.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer is in official SAC and transaction/XDR docs. `scout_research`/`scout_repos` are acceptable for examples or SDK helper discovery, but not required for the protocol facts.

## Edge / traps

The main trap is treating SEP-41 as an introspection standard. It is a token interface, not proof that a contract is a SAC or a way to read a classic asset issuer. Another trap is missing the network id in deterministic SAC derivation.
