---
id: q-sor-decode-hosterror-codes
q: "How do I read a Soroban HostError diagnostic log — `Error(Contract, #N)`, `Error(WasmVm,…)`, `Error(Budget, ExceededLimit)`, `Bad union switch` from scValToNative — where's the standard contract-error reference, and how do I fix common test/runtime failures (`Error(Auth, InternalError)` despite mock_all_auths, 'no contract ID', empty `events().all()`, `set_timestamp` not found)?"
category: soroban
subcategory: encoding-diagnostics
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
  - { claim: "Explains that high-level tx/op result codes are often coarse and Soroban diagnostic events / transaction meta are the primary debugging source.", weight: 5 }
  - { claim: "`Error(Contract, #N)` is contract-defined; decode it using the contract's error enum/spec/source, not a universal Stellar error table.", weight: 5 }
  - { claim: "Maps `Error(Budget, ExceededLimit)` to resource/budget exhaustion and recommends simulation/resource inspection or reducing work.", weight: 4 }
  - { claim: "Maps WasmVm and `Bad union switch`/`scValToNative` failures to type/XDR/spec mismatches, stale bindings, or decoding the wrong SCVal shape.", weight: 4 }
  - { claim: "Gives practical fixes for common tests: register/import contract before client use, use `testutils::Events` for `events().all()`, use ledger testutils for timestamp, and avoid assuming `mock_all_auths` covers every custom-account/auth context.", weight: 4 }
should_have:
  - { claim: "Cites official debugging-errors docs, error-enum convention docs, and testing docs/examples.", weight: 3 }
  - { claim: "Recommends re-running with CLI/RPC simulation and verbose diagnostics before changing contract logic.", weight: 2 }
nice_to_have:
  - { claim: "Mentions `stellar contract invoke ... -- --help` can inspect the implicit CLI derived from the contract schema.", weight: 1 }
must_avoid:
  - { claim: "Do not treat all `Error(Contract, #N)` values as globally standardized Stellar errors.", weight: 5 }
  - { claim: "Do not ignore diagnostic events and only quote txFAILED/invoke-host-function failed.", weight: 4 }
  - { claim: "Do not decode arbitrary XDR/SCVal with guessed shapes.", weight: 4 }
must_cite:
  - "Must cite Stellar debugging-errors docs and at least one official testing or contract-error convention source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/errors-and-debugging/debugging-errors
  - https://developers.stellar.org/docs/build/guides/conventions/error-enum
  - https://developers.stellar.org/docs/build/guides/testing/differential-tests
  - https://developers.stellar.org/docs/build/guides/testing/integration-tests
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Verified core guidance with official docs and local skill snippets. Some example-specific fixes (`set_timestamp` import path, custom auth internals) are SDK-version-sensitive; Phase 3 should compile a tiny test if it wants exact imports."
---

## Reference answer (gospel)

Start from diagnostics, not just the top-level result code. Stellar's debugging docs say Soroban
transaction/op errors are often coarse and diagnostic events in transaction meta are the more detailed
source of truth (https://developers.stellar.org/docs/learn/fundamentals/contract-development/errors-and-debugging/debugging-errors).

Interpret common classes this way:

- `Error(Contract, #N)` is the contract's own error code. There is no single universal table for `#N`;
  read the contract's `#[contracterror]` / error enum, generated spec, bindings, or source. The error
  enum convention docs are the right standard reference for how contracts define those codes
  (https://developers.stellar.org/docs/build/guides/conventions/error-enum).
- `Error(Budget, ExceededLimit)` means resource/budget exhaustion; simulate, inspect cost/footprint,
  reduce work/input size, or adjust leeway where appropriate.
- `Error(WasmVm, ...)` points below contract business logic: Wasm execution/trap/type problems.
- `Bad union switch` from `scValToNative` is usually a decoding boundary problem: stale bindings,
  wrong SDK version, wrong return type, or trying to decode an XDR/SCVal variant as a different
  native shape.

For tests: "no contract ID" generally means the contract was not registered/imported before creating
the client. Empty `events().all()` can mean the function did not publish events, the call failed and
rolled back, or the test did not import the `testutils::Events` trait; official differential-test docs
show `use soroban_sdk::{testutils::Events as _, Env};` before calling `env.events().all()`
(https://developers.stellar.org/docs/build/guides/testing/differential-tests). `set_timestamp` is a
ledger testutils API, so check the current SDK testutils import. `mock_all_auths` only helps within
the SDK's mock auth model; custom-account `__check_auth`, wrong invocation tree, or missing auth
context can still fail and should be debugged from the simulated auth entries.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer requires official debugging, error-convention, and
testing docs. `scout_repos` is acceptable when the user gives a concrete repo/contract error enum;
repo source may be required to map `#N` to its actual variant.

## Edge / traps

The biggest trap is inventing a global table for `Error(Contract, #N)`. Another is stopping at
`txFAILED` or `INVOKE_HOST_FUNCTION_TRAPPED` instead of reading diagnostic events. For JS decoding,
do not paper over SCVal shape mismatches by stringifying random objects; regenerate bindings or decode
from the expected spec.
