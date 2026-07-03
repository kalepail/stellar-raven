---
id: q-defi-lumenloop-document-record
q: "Pull the full record for that specific content item — the one in the 'research' collection with id rfl-oracle-design — I want the complete document, not just a snippet."
category: defi-ecosystem
subcategory: oracle
axes: [tool-targeted]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_document]
acceptable_cards: [lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Fetches the full document record for the specific content item identified by collection + id (research / rfl-oracle-design), returning the complete record rather than a search snippet.", weight: 5 }
  - { claim: "Treats this as an id-gated single-item lookup, not a fresh semantic search.", weight: 4 }
should_have:
  - { claim: "Notes that retrieving a specific document needs a prior collection+id (or slug) — surfaced by an upstream semantic search.", weight: 2 }
nice_to_have:
  - { claim: "Returns the item's source/provenance with the full record.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate the document's contents if the id/collection does not resolve — report no match instead.", weight: 5 }
  - { claim: "Do NOT silently substitute a different item than the requested collection+id.", weight: 3 }
must_cite:
  - "The Lumenloop document record (lumenloop_get_document) for the given collection+id, with its source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/api/research
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "EXPANSION-LANE behavioral case (no external fact to verify). lumenloop_get_document is id-gated — reached only after lumenloop_search_content_semantic (or similar) surfaces the collection+id/slug — so the semantic-search card is the acceptable upstream discovery card. The id 'research / rfl-oracle-design' is ILLUSTRATIVE: the test is the routing/behavior (id-gated single-record fetch + anti-fabrication on a non-resolving id), not that this exact id resolves. Grading is about the gate, not a factual essay. REVIEWED 2026-06-29: routing model re-checked against CARDS.md — get_document is the id-gated detail/expansion lane and search_content_semantic the upstream discovery card; both card ids valid. No factual claim to re-ground (illustrative id by design); anti-fabrication-on-non-resolving-id gate preserved."
---

## Reference answer (gospel)

This is a **behavioral / routing** case, not a factual lookup. The user supplies a **collection + id**
(`research` / `rfl-oracle-design`) and wants the **complete record**, so the correct Raven move is an
**id-gated single-item fetch** → `lumenloop_get_document(collection, id)`, returning the full record
**verbatim** rather than running a fresh semantic search. The id/slug is normally surfaced by a prior
`lumenloop_search_content_semantic` (the expansion upstream). If the id/collection does **not resolve**,
the correct behavior is to **report no match** — never fabricate the document's contents or silently
substitute a different item. (The specific id here is illustrative; what's graded is the gate, not that
this exact id exists in the live corpus.)

## Why these cards (routing rationale)

Full record for one content item addressed by collection+id → `lumenloop_get_document` (id-gated
detail/expansion lane). It is reached after a prior semantic search surfaces the id/slug, so
`lumenloop_search_content_semantic` is the acceptable upstream discovery card. A fresh semantic search
as the primary would miss the explicit single-record intent.

## Edge / traps

Expansion-aware: needs a prior collection+id/slug. Traps: fabricating contents on a non-resolving id,
or substituting a different item.
