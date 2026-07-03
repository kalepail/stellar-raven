---
id: q-sor-p23-auto-restore-extendto
q: "Under Protocol 23, does archived data auto-restore when a tx reads it (and can I still simulate-read it), what TTL does a restore grant, and how do I compute extendTo / the max-TTL gap for extendFootprintTtl?"
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
  - { claim: "States that starting in Protocol 23, archived persistent/instance entries can be automatically restored for `InvokeHostFunctionOp` only when simulation/manual construction includes them in the transaction restore list; `RestoreFootprintOp` is mostly for rare/manual cases.", weight: 5 }
  - { claim: "Explains that simulation is used to discover footprint/resource data and prepare restore/extend transactions, but ordinary RPC retention still limits how far back data/events can be read.", weight: 4 }
  - { claim: "Explains `extendTo` as a desired live-until ledger bounded by current ledger plus the network max TTL; use the network config/max TTL, not a hardcoded universal value.", weight: 4 }
  - { claim: "Distinguishes persistent/instance archival from temporary storage deletion; temporary entries cannot be restored after TTL expiry.", weight: 4 }
should_have:
  - { claim: "Gives the three-step restore/extend flow: identify entries, build footprint operation, simulate/fill fees, submit and retry the original action.", weight: 3 }
  - { claim: "Mentions SDK `extend_ttl(min_ttl, extend_to)` / persistent `extend_ttl(&key, min_ttl, extend_to)` for proactive extension.", weight: 2 }
nice_to_have:
  - { claim: "Mentions that P23 is Whisk/CAP-66 auto-restore but avoids depending on a contested activation date.", weight: 1 }
must_avoid:
  - { claim: "Do not say archived temporary entries can be restored.", weight: 5 }
  - { claim: "Do not imply automatic restore removes the need to include correct footprints or pay restore/extension fees.", weight: 4 }
  - { claim: "Do not freeze one max-TTL constant without checking network config/current docs.", weight: 4 }
must_cite:
  - "Official state archival docs for Protocol 23 auto-restore and restore/extend workflow."
  - "Official Soroban storage docs or SDK docs for temporary vs persistent/instance TTL behavior."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival"
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage"
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/events#reading-events"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Phase 3 tightened auto-restore wording against current Stellar docs: archived entries are restored before host execution only when included in the transaction restore list, usually populated by RPC simulation."
---

## Reference answer (gospel)

Under Protocol 23, archived persistent/instance entries can be automatically restored before an `InvokeHostFunctionOp` runs, but only when the transaction includes the archived entries in its restore list. In practice, RPC simulation normally detects the archived access and populates that list; if you hand-build a transaction without the needed restore list entries, auto-restore will not happen and the invocation can still fail. The state archival docs say the manual `RestoreFootprintOp` is mostly no longer needed except rare cases. The workflow is still explicit: identify entries, usually from RPC simulation; prepare restore/extension footprint data and simulate/fill resource fees when needed; submit it, then retry the original action. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival.

Auto-restore does not mean arbitrary history is always readable. RPC servers have retention windows for event/history APIs, and archived ledger entries must be identified and paid for in the transaction footprint. Temporary storage is different: temporary entries are cheaper and are deleted at TTL expiry, so they cannot be restored like persistent or instance entries. Source: https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage.

For TTL extension, compute the desired `extendTo` / live-until ledger from the current ledger plus a safe target duration, bounded by the network's maximum TTL. In contract code, extend proactively with instance `extend_ttl(min_ttl, extend_to)` or persistent `extend_ttl(&key, min_ttl, extend_to)` when the remaining TTL falls below your threshold. Do not hardcode one "max TTL gap" for every network; read current network config or use SDK/network helpers where available.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because state archival, Protocol 23 behavior, and footprint operations are official platform mechanics. Scout is acceptable for corroborating CAP-66/P23 material, but primary docs should carry the answer.

## Edge / traps

The wrong answer is "P23 makes archive invisible, reads just work forever." Auto-restore reduces manual restore handling for simulated invoke transactions, but restore-list construction, footprints, fees, and provider retention still matter. Temporary entries are not restorable.
