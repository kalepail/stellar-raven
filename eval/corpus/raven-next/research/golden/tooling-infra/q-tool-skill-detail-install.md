---
id: q-tool-skill-detail-install
q: "Show me the full install doc and metadata for the Stellar 'soroban' agent skill — what it covers and how to install it."
category: tooling-infra
subcategory: tooling-catalog-discovery
axes: [tool-targeted]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_skill_detail]
acceptable_cards: [scout_skills]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns the single-skill detail record for the named skill (the soroban skill) — its install instructions and metadata (source, kind, what it covers).", weight: 5 }
  - { claim: "Sources install/metadata from the skill detail record rather than fabricating install steps.", weight: 4 }
should_have:
  - { claim: "Notes a detail lookup needs the skill resolved first (the skills catalog supplies the slug/id the detail card expands on).", weight: 2 }
nice_to_have:
  - { claim: "Surfaces the skill's source/kind (e.g. SKILL.md playbook, MCP/CLI) where the record carries it.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate install commands, metadata, or coverage not present in the skill detail record.", weight: 5 }
  - { claim: "Do NOT answer purely from general developer docs when the request is for the catalog's install/metadata record.", weight: 3 }
must_cite:
  - "The Stellar Light skill detail record (scout_skill_detail) for the named skill."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/api/research
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Re-verified 2026-06-29: Scout skills catalog live (stellarlight.xyz/api/skills, validKinds [skill-md, mcp-server, sdk, cli, agent-kit, tool]); slugs present, so the two-step scout_skills→scout_skill_detail expansion is reachable. EXPANSION-LANE: scout_skill_detail is reached only after scout_skills surfaces the slug/id. The 'answer' is the correct two-step expansion behavior, not a fixed factual record (record contents freshness-sensitive)."
---

## Reference answer (gospel)

This is an **expansion-lane** request: a full install doc + metadata for **one named skill** (the
`soroban` skill). The correct behavior is a **two-step route**:

1. Resolve the skill via the **skills catalog** (`scout_skills`) to get its slug/id, then
2. Expand that id with **`scout_skill_detail`** — the bounded single-item detail lane — to return the
   **install instructions and metadata (source, kind, what it covers)** straight from the **skill detail
   record**.

The deliverable is the **catalog's per-skill install/metadata record**, sourced from the detail card —
**not fabricated install steps** and **not** a generic developer-docs answer. The detail card carries
fields the catalog list alone doesn't (e.g. full install doc, source/kind such as a SKILL.md playbook or
MCP/CLI).

## Why these cards (routing rationale)

Full install doc + metadata for one named skill → `scout_skill_detail`, the bounded single-item
detail-expansion lane, reached after `scout_skills` surfaces the slug/id (so the catalog card is the
acceptable upstream discovery card). General-web/docs alone is a miss for the catalog's install record.

## Edge / traps

Expansion-aware: needs a prior slug/id from the skills catalog. Trap: fabricating install steps or
metadata, or answering purely from general developer docs.
