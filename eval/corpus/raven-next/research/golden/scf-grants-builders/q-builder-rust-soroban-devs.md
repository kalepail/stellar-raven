---
id: q-builder-rust-soroban-devs
q: "Who are some experienced Soroban / Rust smart-contract builders in the Stellar ecosystem I could reach out to?"
category: scf-grants-builders
subcategory: builder-discovery
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_builders]
acceptable_cards: [scout_projects, scout_repos]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns named builder/people profiles filtered by skill (Soroban / Rust smart contracts).", weight: 5 }
  - { claim: "Draws from the curated Stellar builder profiles, not generic web search.", weight: 3 }
should_have:
  - { claim: "Surfaces builder attributes (skills, and where available SCF tier or location).", weight: 2 }
nice_to_have:
  - { claim: "Can point toward their projects/repos for further context.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate builder names or profiles that aren't in the curated builder directory.", weight: 5 }
  - { claim: "Do NOT return a list of projects/repos when the user asked for people/builders.", weight: 3 }
must_cite:
  - "Stellar Light's builder directory (scout_builders) profiles."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/builders
  - https://discord.gg/stellardev
  - https://github.com/topics/stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "scout_builders = ~110 builder profiles by skill/location/SCF tier. People-discovery, not project-discovery. On a no-match it returns a structured filter-miss advisory, never fabricated names."
---

## Reference answer (gospel)

- Query the curated Stellar Light builder directory filtered by skill (Soroban / Rust smart contracts); it indexes ~110 builder/people profiles with filters `q` / `location` / `scfTier` / `featured`. Source: https://stellarlight.xyz/builders
- The directory returns named builder profiles with attributes (skills, and where present SCF tier / location); surface those that match rather than a generic web list. Source: https://stellarlight.xyz/builders
- Each profile can link to that builder's projects/repos for deeper context (acceptable adjacent signal, but the primary ask is people). Source: https://stellarlight.xyz/builders
- Honesty case — on a no-match the directory returns a STRUCTURED "filter-miss" advisory (110 profiles total; broaden filters) that points to the Stellar Discord "Looking for Collaborators" channel and the `topic:stellar` GitHub tag. The correct behavior is to report that advisory, NOT to invent builder names. Sources: https://discord.gg/stellardev , https://github.com/topics/stellar

## Why these cards (routing rationale)

People-by-skill discovery → `scout_builders` (the builder/people directory). Projects/repos are
acceptable adjacent context but the primary ask is people.

## Edge / traps

Trap: fabricating names, or returning projects when people were asked for.
