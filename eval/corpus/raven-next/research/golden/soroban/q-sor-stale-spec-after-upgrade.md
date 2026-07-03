---
id: q-sor-stale-spec-after-upgrade
q: "After upgrading a contract, my correctly-formed BytesN argument gets re-interpreted (Bytes(5553) / UnreachableCodeReached) during simulation — how do I refresh the contract spec / bypass Contract.call() so the SDK/RPC stops using the stale spec?"
category: soroban
subcategory: soroban-development
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that contract specs are emitted from the WASM/custom sections and clients use them to encode/decode arguments; after an upgrade, stale generated bindings or cached specs can encode the wrong ScVal shape.", weight: 5 }
  - { claim: "Recommends regenerating bindings/spec artifacts from the upgraded WASM or deployed contract and clearing any app/RPC/client-side cached spec before using high-level `Contract.call()` wrappers.", weight: 5 }
  - { claim: "Explains that a `BytesN<32>` argument misread as `Bytes(...)` indicates a spec/type mismatch or manual encoding mismatch, not necessarily malformed bytes.", weight: 4 }
  - { claim: "Gives a bypass path: construct `InvokeContract` args manually as exact SCVal/XDR or use lower-level SDK operation builders instead of the stale high-level generated wrapper.", weight: 4 }
  - { claim: "Mentions that upgrade preserves the contract id but changes WASM/spec; storage migration/layout compatibility is still the contract author's responsibility.", weight: 3 }
should_have:
  - { claim: "Mentions verifying against CLI invocation/spec output and simulation diagnostic events.", weight: 2 }
nice_to_have:
  - { claim: "Mentions adding a versioned spec/hash check in deployment CI.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say the contract address changes just because the WASM was upgraded in-place.", weight: 5 }
  - { claim: "Do NOT keep using old generated bindings after changing function signatures or UDTs.", weight: 5 }
  - { claim: "Do NOT diagnose all `UnreachableCodeReached` traps as host bugs without checking spec/arg encoding first.", weight: 4 }
must_cite:
  - "Official contract specs/client docs."
  - "Official transaction/InvokeHostFunction docs for lower-level invocation."
  - "Official or skill-backed upgrade pattern source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/dapps/working-with-contract-specs
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
  - https://developers.stellar.org/docs/tools/cli/stellar-cli
  - https://github.com/stellar/rs-soroban-sdk
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Phase 3 should reproduce exact JS SDK bypass method names for the current SDK version; primary issue is verified as spec/ScVal mismatch class, but helper APIs drift."
---

## Reference answer (gospel)

Soroban clients encode arguments from the contract spec. An in-place upgrade preserves the contract id but changes the WASM and may change exported spec entries, UDT definitions, or argument types. If your high-level JS generated wrapper or `Contract.call()` path still uses the old spec, a correct 32-byte value can be encoded/decoded as the wrong ScVal shape, which can show up as `Bytes(...)`/`UnreachableCodeReached` during simulation.

The fix is to refresh the spec source: rebuild the upgraded WASM, regenerate bindings/spec artifacts, update any deployed-contract spec cache your app uses, and re-run simulation. Compare the CLI's working invocation against the JS-generated XDR. If the wrapper remains stale, bypass it by constructing an `InvokeContract` host function manually with the exact function name and exact `SCVal` args, or use the SDK's lower-level operation/XDR builders instead of the generated convenience method.

Treat this as a deployment hygiene issue too: store the current WASM hash/spec version, include a migration entrypoint if storage layout changed, and fail CI if generated clients are not regenerated from the upgraded WASM/spec.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because contract specs, CLI, and invocation XDR are official docs. `scout_repos` can help inspect SDK source when the exact wrapper API has changed.

## Edge / traps

The trap is debugging bytes while ignoring the type layer. `BytesN<32>` and dynamic `Bytes` are different ScVal/spec types. Another trap is assuming an upgrade creates a new contract id; the id can remain the same while the spec changes.
