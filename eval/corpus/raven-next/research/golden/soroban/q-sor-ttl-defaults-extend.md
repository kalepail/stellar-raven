---
id: q-sor-ttl-defaults-extend
q: "What are the default TTLs for a freshly deployed contract, will an actively-used contract still get archived if I never call `extend_ttl`, and how do I separately extend contract *code* TTL vs instance/persistent-entry TTL (there is no `bump()`)?"
category: soroban
subcategory: state-archival
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States that Soroban contract data has TTL measured in ledgers and must be extended; active use does not automatically make all entries permanent unless the contract/client actually extends TTL.", weight: 5 }
  - { claim: "Explains storage behavior: Temporary expires/deletes, Persistent and Instance can archive/restore, and Instance storage shares a TTL with the contract instance.", weight: 5 }
  - { claim: "Explains that `env.storage().instance().extend_ttl(...)` extends instance storage and also code/instance lifetimes, while persistent/temporary entries require per-key `extend_ttl(&key, ...)`.", weight: 4 }
  - { claim: "Explains separate code vs instance extension APIs: `env.deployer().extend_ttl_for_code()` and `extend_ttl_for_contract_instance()`; `env.deployer().extend_ttl()` covers both.", weight: 4 }
  - { claim: "Explains that client-side `ExtendFootprintTTLOp` can extend ledger entries without a contract method, but there is no generic `bump()` magic method.", weight: 4 }
should_have:
  - { claim: "Says default/max TTLs are network settings and tests should set or read them rather than freezing a stale number.", weight: 3 }
nice_to_have:
  - { claim: "Mentions Temporary TTL should not be relied on for security because anyone can extend an entry's TTL.", weight: 1 }
must_avoid:
  - { claim: "Do NOT imply active reads/writes automatically extend all relevant TTLs.", weight: 5 }
  - { claim: "Do NOT say expired Temporary entries can be restored.", weight: 5 }
  - { claim: "Do NOT hardcode a default TTL without identifying it as a network setting subject to change.", weight: 4 }
must_cite:
  - "Official state archival docs."
  - "Official TTL extension testing/client-side docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
  - https://developers.stellar.org/docs/build/guides/archival/test-ttl-extension
  - https://developers.stellar.org/docs/build/guides/dapps/state-archival
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/persisting-data
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: ""
---

## Reference answer (gospel)

Soroban TTL is measured in ledgers and is not automatically permanent because a contract is popular. Entries stay live only if contract code, contract methods, clients, or maintenance jobs actually extend TTL. Default/max TTL values are network settings; tests should set/read network settings rather than hardcoding a stale constant.

Storage behavior differs by type. Temporary entries are deleted when TTL expires and cannot be restored. Persistent entries can be archived and restored. Instance storage is one contract-instance ledger entry with one TTL shared by all instance entries. `env.storage().instance().extend_ttl(threshold, extend_to)` extends that instance entry and, per official docs, also extends the contract code entry. Persistent and temporary entries are per-key: call `env.storage().persistent().extend_ttl(&key, threshold, extend_to)` or the temporary equivalent for each entry.

If you need code and instance separately, use `env.deployer().extend_ttl_for_code()` and `env.deployer().extend_ttl_for_contract_instance()`; `env.deployer().extend_ttl()` covers both. Off-chain clients can also submit `ExtendFootprintTTLOp` for entries in a transaction footprint. There is no generic `bump()` method that makes all contract state safe.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because state archival and TTL APIs are official docs. Repo search is only needed for examples or current SDK signatures.

## Edge / traps

The dangerous answers are "active contracts do not archive" and "Temporary can be restored later". Another common trap is conflating allowance expiration, event retention, and storage TTL; they are separate concepts.
