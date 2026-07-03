---
id: q-tool-cli-skills-discovery
q: "What install-ready Stellar developer tooling exists — MCP servers, CLIs, and agent skills I can plug in?"
category: tooling-infra
subcategory: tooling-catalog-discovery
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_skills]
acceptable_cards: [scout_repos, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns a catalog of install-ready Stellar skills / MCP servers / SDKs / CLI tooling (the kind of agent tooling that exists for Stellar).", weight: 5 }
  - { claim: "Surfaces concrete tooling entries (e.g. Stellar/Soroban MCP servers, the Stellar CLI, dev skills) rather than a single prose doc.", weight: 3 }
should_have:
  - { claim: "Spans the FULL multi-kind catalog (skill-md, mcp-server, sdk, cli, agent-kit, tool) rather than scoping to a single kind such as MCP servers only.", weight: 2 }
  - { claim: "Distinguishes tooling-catalog discovery from a conceptual docs lookup.", weight: 2 }
nice_to_have:
  - { claim: "Notes results can be filtered by source/kind.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate tools/MCP servers that do not exist in the catalog.", weight: 4 }
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
notes: "2026-06-29 differentiation vs q-tool-mcp-servers-skills-discovery: this file owns the BROAD multi-kind catalog sweep (skill-md/mcp-server/sdk/cli/agent-kit/tool); mcp-discovery owns the NARROW kind=mcp-server filter. Scout /api/skills returns those kinds across sources [sdf, stellarlight, lumenloop, external, community]. Fabrication is the trap."
---

## Reference answer (gospel)

This is a **tooling-catalog discovery** question — the right surface is the **Scout skills catalog**
(`stellarlight.xyz/api/skills`), which returns **install-ready** Stellar tooling, not a single prose
doc page.

- Results are concrete catalog entries spanning **kinds**: `skill-md`, `mcp-server`, `sdk`, `cli`,
  `agent-kit`, `tool` — e.g. Stellar/Soroban **MCP servers**, the **Stellar CLI**, SDKs, and agent
  skills (across sources `sdf`, `stellarlight`, `lumenloop`, `external`, `community`).
- The catalog can be **filtered by source/kind** (e.g. only `cli` or only `mcp-server`).

Answer from the **returned catalog entries** — do not fabricate tools/MCP servers that aren't in it.

## Why these cards (routing rationale)

'What install-ready tooling exists' is exactly `scout_skills`' catalog lane. `scout_repos` acceptable for raw code, `stellar_docs_mcp` for official tooling docs. Deep-research/general-web are misses.

## Edge / traps

Fabricated tools/MCP servers are the trap.
