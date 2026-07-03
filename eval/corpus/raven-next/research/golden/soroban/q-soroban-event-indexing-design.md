---
id: q-soroban-event-indexing-design
q: "How should I design event topics in a Soroban token contract so off-chain indexers can subscribe reliably?"
category: soroban
subcategory: events
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Put the most stable identifier (a `Symbol` constant naming the event, e.g. `transfer`) as the leading indexed topic so consumers can filter on it.", weight: 4 }
  - { claim: "A contract's event schema is effectively a public API; keep topic ordering and value encodings stable across upgrades.", weight: 4 }
should_have:
  - { claim: "Encode `Address`/structured values via the SDK's conversions (`IntoVal`) for spec-compatible decoding.", weight: 2 }
  - { claim: "Note Protocol 23 (CAP-0067) unified Soroban + classic asset events and changed SAC/mint event topics.", weight: 2 }
nice_to_have:
  - { claim: "References the standard token event shape (transfer/mint/burn) from the SEP-41 / SAC convention.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim there is no limit on indexed topics or that all data fields are filterable (only the leading topics are).", weight: 3 }
  - { claim: "Do NOT treat events as mutable/editable after emission.", weight: 2 }
must_cite:
  - "A developers.stellar.org events ingest guide or token-event convention."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/events/ingest
  - https://stellar.org/blog/developers/announcing-protocol-23
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: medium
notes: "Design guidance; only leading topics are filterable; event schema is a stable public API; ties to CAP-0067 (P23) unified asset events. Specific indexed-topic count is implementation-detail — gate on 'leading topics filterable, not all fields'."
---

## Reference answer (gospel)

An event is emitted with `env.events().publish((topics...), data)`; **only the leading indexed
`topics` are filterable** by off-chain consumers — the `data` payload is not. Design for that: [ingest]

- **Lead with the most stable identifier** — a **`Symbol` constant** naming the event (e.g.
  `transfer`) as the first topic — so indexers can subscribe on it reliably. [ingest]
- **Treat the event schema as a public API**: keep **topic ordering and value encodings stable across
  upgrades**; consumers depend on it.
- Encode `Address`/structured values with the SDK's conversions (**`IntoVal`**) so off-chain decoders
  stay spec-compatible.
- **Protocol 23 (CAP-0067)** unified Soroban + classic-asset events and changed SAC/mint event topics —
  follow the standard token event shape (**transfer / mint / burn**, per SEP-41/SAC). [p23]

Traps: assuming there is no limit on indexed topics or that **all data fields are filterable** (only the
leading topics are); or treating events as mutable/editable after emission (they are immutable records
in tx meta).

## Why these cards (routing rationale)

Event-design guidance → `stellar_docs_mcp`. `scout_research`/`scout_repos` acceptable.

## Edge / traps

Assuming unlimited indexed topics or all-fields-filterable; treating event schema as private/mutable.
