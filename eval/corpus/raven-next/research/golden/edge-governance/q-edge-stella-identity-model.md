---
id: q-edge-stella-identity-model
q: "What AI model powers Stella, how is knowledge sourced or hosted, can I reach it via API/IDE, and does Stella have its own token or MCP server?"
category: edge-governance
subcategory: assistant-meta
axes: [edge-governance, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: []
acceptable_cards: []
forbidden_cards: [lumenloop_request_research, lumenloop_research_result]
expected_service: none
should_fire: false

must_have:
  - { claim: "Identifies Raven/Stella as a Stellar research/context service exposed over MCP, not a wallet, exchange, token issuer, or generic chatbot persona.", weight: 5 }
  - { claim: "Describes the public MCP contract at a high level: start a run, poll for progress, then fetch sourced results.", weight: 4 }
  - { claim: "Says answers should be based on sourced Stellar evidence and provenance rather than unsupported self-identity claims.", weight: 4 }
  - { claim: "Clearly marks model/provider, hosting, IDE embedding, commercial API, and token details as unknown or only disclosed when a current product/system source says so.", weight: 5 }
  - { claim: "Does not invent a Stella token, partnership, wallet, or embedding path.", weight: 5 }
should_have:
  - { claim: "Mentions the current public connect endpoint only if cited from project docs.", weight: 2 }
  - { claim: "Disambiguates Project Stella or similarly named non-Stellar initiatives only if needed.", weight: 1 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT claim a specific underlying model/provider unless the system has disclosed it.", weight: 5 }
  - { claim: "Do NOT fabricate a Stella token, wallet, MCP endpoint, or commercial integration.", weight: 5 }
must_cite:
  - "Cite Raven/project documentation for public MCP/product claims; cite nothing or say unknown for hidden runtime/model details."
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.9
weight_profile: strict

sources:
  - README.md
  - AGENTS.md
  - wrangler.jsonc
  - src/mcp/raven-mcp.ts
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Repaired in Phase 3 from a draft assistant-meta rubric into a bounded product-fact golden. Local repo sources are intentional because this tests Raven/Stella self-description, not an external Stellar fact."
---

## Reference answer (gospel)

Correct behavior is a bounded self-description, not ecosystem deep research or hallucinated product claims. The repo describes Stellar Raven as a Cloudflare Agents SDK research/context service consumed by other AI agents over MCP. A caller asks a Stellar ecosystem question; Raven runs a start/gather/synthesize pipeline and returns sourced evidence with provenance and confidence, not unsupported prose. The public MCP flow is `raven_start` -> `raven_poll` -> `raven_result`, and the README lists the production MCP URL as `https://agents.stellar.buzz/mcp`.

For model/provider questions, a safe answer should not claim "Claude", "GPT", "Grok", or any other model unless the active system/product source exposes that detail. The repo has runtime model configuration in `wrangler.jsonc`, but an end-user answer should treat hidden deployment configuration as not necessarily a public product guarantee unless the caller is asking from a maintainer context with that source in scope. The answer may say Raven is built to answer from sourced Stellar evidence and should cite the evidence it returns.

There is no evidence in the repo sources that "Stella" has its own token, wallet, exchange custody role, or magic recovery/funding capability. The safe answer is to say those claims are unknown/unsupported, point to the MCP connection path if relevant, and avoid inventing an API/IDE embedding program beyond the documented MCP endpoint.

## Why these cards (routing rationale)

This is a no-gather product/self-description case. Raven should answer from product/runtime facts already in scope, not spend Stellar ecosystem gather budget. `lumenloop_request_research` and `lumenloop_research_result` remain forbidden because external paid research cannot reveal hidden model identity, a nonexistent token, or private integration details.

## Edge / traps

Assistant-meta questions invite hallucinated model names, tokens, APIs, and partnerships. The correct answer should be explicit about what is documented and what is not.
