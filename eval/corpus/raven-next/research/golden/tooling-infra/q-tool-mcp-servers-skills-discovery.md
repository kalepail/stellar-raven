---
id: q-tool-mcp-servers-skills-discovery
q: "Are there any MCP servers for Stellar/Soroban I can install for my coding agent?"
category: tooling-infra
subcategory: mcp-discovery
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_skills]
acceptable_cards: [scout_repos, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Scopes the answer specifically to the catalog's `mcp-server` kind — filters `scout_skills` by kind=mcp-server rather than dumping the whole multi-kind catalog.", weight: 5 }
  - { claim: "Surfaces concrete catalogued MCP servers (real entries returned by the catalog) rather than a single prose doc page.", weight: 3 }
should_have:
  - { claim: "Treats this as a narrow tooling-catalog discovery question (kind=mcp-server) rather than a conceptual docs lookup or a broad multi-kind tooling sweep.", weight: 2 }
nice_to_have:
  - { claim: "Notes catalogued MCP servers carry source metadata (sdf/lumenloop/stellarlight/external) and can be cross-checked against scout_repos.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate MCP servers that do not exist in the catalog.", weight: 4 }
must_cite:
  - "Scout skills catalog (stellarlight.xyz/api/skills) results."
must_not_use_tier: []

pass_threshold: 0.68
weight_profile: standard

sources:
  - https://stellarlight.xyz/api/skills
  - https://stellarlight.xyz/skills
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "2026-06-29 differentiation vs q-tool-cli-skills-discovery: this file owns the NARROW kind=mcp-server filter lane (MCP servers specifically); cli-skills-discovery owns the BROAD multi-kind catalog sweep. Scout /api/skills returns a `mcp-server` kind among [skill-md, mcp-server, sdk, cli, agent-kit, tool]. Fabrication is the trap."
---

## Reference answer (gospel)

Yes — install-ready Stellar/Soroban **MCP servers** are catalogued in the **Scout skills catalog**
(`stellarlight.xyz/api/skills`), which is a tooling-discovery surface, not a prose doc page.

- `/api/skills` returns concrete catalog entries with a **`kind`** field including **`mcp-server`**
  (alongside `skill-md`, `sdk`, `cli`, `agent-kit`, `tool`), so you can **filter to MCP servers**.
- Entries carry source/kind metadata (sources include `sdf`, `lumenloop`, `external`, `stellarlight`).

Surface the **actual catalog entries**; do not invent MCP servers that aren't in the catalog.

## Why these cards (routing rationale)

'What MCP servers exist for Stellar' is the `scout_skills` install-ready catalog lane. `scout_repos` acceptable for raw repos. Deep-research/general-web are misses.

## Edge / traps

Fabricated MCP servers are the trap.
