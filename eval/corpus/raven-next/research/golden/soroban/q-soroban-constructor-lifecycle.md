---
id: q-soroban-constructor-lifecycle
q: "Does Soroban support a contract constructor that runs once at deploy time, and how do I define one?"
category: soroban
subcategory: sdk-macros
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Soroban supports a constructor: a `__constructor` function in the `#[contractimpl]` that the host runs exactly once at instantiation/deploy time.", weight: 5 }
  - { claim: "Constructor support was added at the protocol level via CAP-0058 (Protocol 22).", weight: 3 }
should_have:
  - { claim: "Constructor arguments are passed at deploy/create-contract time (e.g., via the CLI deploy `--` args or SDK deployer).", weight: 3 }
  - { claim: "Before constructors existed, the common pattern was a separately-called `initialize`/`init` function guarded against re-init.", weight: 2 }
nice_to_have:
  - { claim: "Notes the constructor cannot be re-invoked after deployment.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Soroban has no constructor mechanism at all (it does, since P22/CAP-0058).", weight: 4 }
  - { claim: "Do NOT describe a Solidity `constructor` keyword or `selfdestruct` semantics.", weight: 3 }
must_cite:
  - "A developers.stellar.org page or CAP-0058 reference for the constructor lifecycle."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0058.md
  - https://stellar.org/blog/developers/announcing-protocol-22
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "CAP-0058 (Final), Protocol 22 — Testnet 2024-11-12, Mainnet vote 2024-12-05. __constructor must return Val::Void; runs atomically once at create-contract time via HOST_FUNCTION_TYPE_CREATE_CONTRACT_V2."
---

## Reference answer (gospel)

Yes — Soroban supports a **constructor** since **Protocol 22 (CAP-0058, status Final;** mainnet vote
Dec 5, 2024**)**. [cap0058][p22]

- **Define it** as a reserved function named **`__constructor`** inside the `#[contractimpl]` block. A
  Wasm that exports `__constructor` is treated as having a constructor. [cap0058]
- **Runs exactly once, atomically, at contract creation** — the host calls it immediately after
  creating the instance entry; if it traps or returns a non-`Void` value, contract creation **fails
  and rolls back**. It cannot be re-invoked afterward (and is NOT re-run on a Wasm code upgrade).
  [cap0058]
- **Arguments** are passed at create/deploy time via the `HOST_FUNCTION_TYPE_CREATE_CONTRACT_V2`
  host function (CLI `stellar contract deploy ... -- <args>` / SDK deployer). It may take 0..N args.
  [cap0058]
- **Before P22** the standard pattern was a separately-called `initialize`/`init` function guarded
  against re-initialization; constructors remove that round-trip and reduce front-running risk on
  init. [p22]

Traps: claiming Soroban has no constructor at all (stale, pre-P22); or describing a Solidity
`constructor` keyword / `selfdestruct` semantics.

## Why these cards (routing rationale)

Protocol-gated SDK how-to → `stellar_docs_mcp`. `scout_research`/`scout_repos` acceptable.

## Edge / traps

Saying Soroban has no constructor (stale, pre-P22); Solidity constructor semantics.
