---
id: q-tool-leaderboard-open-issues
q: "Which Stellar projects have the most open issues right now — rank them so I can see where the most active maintenance/backlog is."
category: tooling-infra
subcategory: repo-activity-discovery
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_leaderboard]
acceptable_cards: [scout_repos, scout_projects]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns a ranked list of Stellar projects by open issues (the leaderboard's issues dimension) and flags the ranking is a current, shifting snapshot.", weight: 5 }
  - { claim: "Uses the most-active/top-projects leaderboard rather than a free-text project directory as the primary route.", weight: 3 }
should_have:
  - { claim: "Distinguishes 'most open issues' from 'most stars' or 'most dev activity' (different leaderboard dimensions).", weight: 2 }
nice_to_have:
  - { claim: "Notes open-issue count is a backlog/maintenance signal, not a quality ranking.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present a fixed ranking as permanent — flag it is a current, shifting snapshot.", weight: 4 }
  - { claim: "Do NOT invent issue counts or fabricate a ranking not derived from the leaderboard tool.", weight: 4 }
must_cite:
  - "The Stellar Light leaderboard (scout_leaderboard, issues dimension) with a freshness caveat."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/api/repos/search
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Re-verified 2026-06-29: Scout repos/leaderboard endpoint live (stellarlight.xyz/api/repos/search?sort=issues, repoScore-graded). 'Top projects by open issues' maps to the leaderboard's issues dimension (activity|stars|issues). Freshness-flagged ranking; fabrication is the trap. Rubric gates on routing + freshness flag, not specific projects/counts."
---

## Reference answer (gospel)

This maps to Stellar Light's **leaderboard `issues` dimension** → route to **`scout_leaderboard`** and
return a **ranked list of Stellar projects by open-issue count**, explicitly flagged as a **current,
shifting snapshot** (counts change daily). Use the **most-active/top-projects leaderboard** as the
primary route rather than a free-text project directory. Distinguish "most open issues" from "most stars"
or "most dev activity" — they're **different leaderboard dimensions** (`activity | stars | issues`).
Open-issue count is a **backlog/maintenance signal, not a quality ranking**. Do not assert specific
counts or a fixed ordering as permanent.

## Why these cards (routing rationale)

"Top projects by open issues" is the leaderboard's `issues` dimension → `scout_leaderboard`;
`scout_repos`/`scout_projects` acceptable for raw repo data. General-web/deep-research are misses.

## Edge / traps

Don't present a ranking as permanent; don't conflate open-issue count with stars or quality; don't
fabricate counts not derived from the leaderboard tool.
