---
id: q-sor-testing-negative-auth-events
q: "In Soroban unit tests, how do I test that an *unauthorized* caller is rejected (mock_auths/set_auths vs mock_all_auths) and assert that a specific event with given topics was emitted?"
category: soroban
subcategory: authorization-patterns
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
  - { claim: "States that `mock_all_auths()` is useful for happy paths but is the wrong default for negative authorization tests because it approves every `require_auth`.", weight: 5 }
  - { claim: "Explains testing unauthorized calls by omitting auth, using only specific `mock_auths`, or lower-level `set_auths`/`try_invoke_contract_check_auth` when testing custom account auth.", weight: 5 }
  - { claim: "Requires asserting the call returns/panics with the expected auth failure or contract error rather than only checking final state.", weight: 4 }
  - { claim: "Explains that emitted events can be inspected from `env.events().all()`/testutils and compared against expected contract id, topics, and data ScVals/values.", weight: 4 }
  - { claim: "Distinguishes testing contract business auth from testing host/custom-account `__check_auth` behavior.", weight: 3 }
should_have:
  - { claim: "Mentions that simulation recording mode does not emulate authorization failures; use enforcement/custom auth paths when validating signatures.", weight: 2 }
nice_to_have:
  - { claim: "Suggests a positive auth test and a negative auth test for each privileged path.", weight: 1 }
must_avoid:
  - { claim: "Do NOT use `mock_all_auths()` and claim it proves unauthorized callers are rejected.", weight: 5 }
  - { claim: "Do NOT assert only state changes while ignoring the error path.", weight: 4 }
  - { claim: "Do NOT compare event display strings when exact topics/data ScVals are available.", weight: 3 }
must_cite:
  - "Official contract authorization testing docs."
  - "Official transaction simulation/auth-mode docs where recording-vs-enforcement is discussed."
  - "Soroban SDK testing docs/source for events if used."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/auth/contract-authorization
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/transaction-simulation
  - https://developers.stellar.org/docs/build/smart-contracts/example-contracts/events
  - https://github.com/stellar/rs-soroban-sdk
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: ""
---

## Reference answer (gospel)

Do not use `mock_all_auths()` for the negative test. It makes every `require_auth` succeed, so it is a happy-path convenience, not proof that unauthorized callers are rejected. For a negative auth test, call the function with no matching auth, or use `mock_auths` with a deliberately different address/argument tree, and assert the expected failure. For custom account authorization, use the lower-level `set_auths` or `try_invoke_contract_check_auth` style path when you need to exercise `__check_auth` semantics.

The test should assert the error/panic/result and not merely that state did not change. Pair each privileged path with a positive test that supplies the exact expected auth and a negative test that omits or mismatches it. Remember that simulation recording mode records expected auth trees; it does not emulate authorization failures. Use enforcement/custom-auth paths when validating rejection behavior.

For events, inspect the test environment's event collection, typically through `env.events().all()` in SDK testutils. Compare the emitted contract id, topics, and data against the exact expected values/ScVals rather than display strings.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is official Soroban auth/test semantics. `scout_repos` is acceptable for SDK testutils source examples.

## Edge / traps

The main false positive is a test suite where every test calls `mock_all_auths()`. That proves the happy path executes but masks missing or wrong `require_auth` calls. Another trap is asserting event text instead of the structured topics/data.
