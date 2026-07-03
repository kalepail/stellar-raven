---
id: q-soroban-unit-testing
q: "How do I write unit tests for a Soroban contract, including faking authorization?"
category: soroban
subcategory: testing
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Tests use a simulated host via `Env::default()` and register the contract, then call it through the generated test client.", weight: 5 }
  - { claim: "Use `env.mock_all_auths()` (or `mock_auths`) to satisfy `require_auth` in tests without real signatures.", weight: 4 }
should_have:
  - { claim: "Tests run with normal `cargo test`; no live network is needed (the host is in-process).", weight: 3 }
  - { claim: "You can assert emitted events, returned values, and authorizations via `env` test utilities.", weight: 2 }
nice_to_have:
  - { claim: "Notes the `testutils` feature / SDK test module is required.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe Foundry/`forge test` or Hardhat/Waffle as the Soroban test framework.", weight: 4 }
  - { claim: "Do NOT claim you must deploy to testnet to run unit tests.", weight: 3 }
must_cite:
  - "The developers.stellar.org testing documentation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/storing-data
  - https://developers.stellar.org/docs/build/guides/testing
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Env::default() + register + mock_all_auths is the canonical in-process test surface; runs under cargo test, no network. Foundry/Hardhat is the EVM trap. 2026-06-29 differentiation: this file is the happy-path unit-testing how-to where mock_all_auths is the recommended convenience; the failure-path concern (proving an UNAUTHORIZED caller is rejected — where mock_all_auths is the wrong tool) is owned by q-sor-testing-negative-auth-events."
---

## Reference answer (gospel)

Soroban contracts are unit-tested **in-process against a simulated host** — no live network:

- Create a simulated host with **`Env::default()`**, **register** the contract on it, and call it
  through the **generated test client** (`ContractClient::new(&env, &id)`).
- Use **`env.mock_all_auths()`** (or the finer `env.mock_auths(...)`) to satisfy `require_auth` in
  tests **without real signatures**.
- Tests run with plain **`cargo test`**; the host is in-process so **no testnet deploy is required**.
  You can assert returned values, emitted **events**, and recorded **authorizations** via the `env`
  test utilities. The SDK **`testutils`** feature / test module provides these helpers.

Traps: describing Foundry (`forge test`) or Hardhat/Waffle as the Soroban test framework; or claiming
you must deploy to testnet to run unit tests.

## Why these cards (routing rationale)

Testing how-to → `stellar_docs_mcp`; `scout_repos` acceptable for examples.

## Edge / traps

Foundry/Hardhat framing; claiming testnet deploy is required for unit tests.
