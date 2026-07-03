---
id: q-sor-force-fast-archival-localnet
q: "On a local/standalone network, how do I configure low state-archival TTL limits so a contract/entry archives quickly to test the restore flow, and detect when it's archived?"
category: soroban
subcategory: state-archival
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
  - { claim: "Says to lower state-archival/network TTL settings in the local stellar-core/quickstart/standalone configuration, then produce ledgers until the target entry's `liveUntilLedger` passes.", weight: 5 }
  - { claim: "Explains detection via RPC/simulation/ledger entry lookup: expired persistent/instance entries appear archived/restorable, while temporary entries disappear.", weight: 5 }
  - { claim: "Uses the state archival restore/extend workflow for testing: invoke/simulate to discover footprint, restore/auto-restore, then retry the call.", weight: 4 }
  - { claim: "Warns not to generalize tiny local TTLs to public testnet/mainnet network config.", weight: 3 }
should_have:
  - { claim: "Mentions proactive contract TTL extension and deliberately disabling/skipping it in a test contract if the goal is to force archival.", weight: 3 }
  - { claim: "Recommends verifying the exact quickstart/core config names against the installed version because flags move.", weight: 2 }
nice_to_have:
  - { claim: "Mentions `stellar snapshot`/fork testing as a separate way to test with real deployed state, not a fast-archival mechanism.", weight: 1 }
must_avoid:
  - { claim: "Do not imply ordinary public RPC retention/backfill settings control on-ledger state archival.", weight: 5 }
  - { claim: "Do not say expired temporary entries can be restored.", weight: 5 }
  - { claim: "Do not provide stale exact config flag names without caveating version drift.", weight: 3 }
must_cite:
  - "Official state archival docs for TTL/archive/restore behavior."
  - "Official storage docs for persistent/instance/temporary differences."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival"
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage"
  - "https://developers.stellar.org/docs/build/guides/testing/fork-testing"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Authoritative TTL/archive semantics verified. Exact standalone/quickstart config flag names are version-sensitive and should be spot-checked in Phase 3 against the local quickstart/core version if the eval expects commands."
---

## Reference answer (gospel)

For a local/standalone archival test, configure the local network's state archival TTL parameters to very small values, deploy/write a contract entry, then close enough ledgers for the entry's `liveUntilLedger` to pass. Use a test contract that does not immediately extend its own TTL, otherwise your test may keep the entry live. Stellar's storage docs define the three classes: persistent and instance entries can archive and be restored; temporary entries are deleted at expiry and cannot be restored. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage.

Detect archival by querying/simulating the entry or invoking the contract path that reads it. The state archival docs say restore/extend starts by identifying entries, usually from RPC simulation, then preparing the footprint operation, simulating for fees/resources, submitting, and retrying the intended action. Starting in Protocol 23, archived entries in an invoke footprint are automatically restored, but the footprint/resource flow still matters. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival.

Do not confuse this with RPC event/history retention. Lowering an RPC retention window will not make ledger entries archive faster; archival is network/ledger-state behavior. Also do not copy toy local TTLs into testnet/mainnet assumptions. For real deployed-state tests, `stellar snapshot create` and fork tests can preload state, but snapshots are not a fast-archival substitute. Source: https://developers.stellar.org/docs/build/guides/testing/fork-testing.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is official Soroban state archival behavior. `scout_research` or `scout_repos` can supplement with quickstart/core examples, but the durable answer should not depend on stale flag names.

## Edge / traps

The main trap is mixing three unrelated concepts: state archival TTL, RPC history retention, and event retention. Another trap is testing with temporary storage and expecting a restore flow; temporary data expires permanently.
