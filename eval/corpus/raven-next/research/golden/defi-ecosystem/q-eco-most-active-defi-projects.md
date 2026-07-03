---
id: q-eco-most-active-defi-projects
q: "What are the most active Stellar DeFi projects right now by development activity?"
category: defi-ecosystem
subcategory: adoption
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_leaderboard]
acceptable_cards: [scout_projects, scout_repos, scout_clusters]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns a ranked list of active Stellar projects (by activity/stars/issues) and flags that activity rankings shift over time.", weight: 5 }
should_have:
  - { claim: "Surfaces DeFi-relevant projects (e.g. Soroswap, Aquarius, Blend, Reflector, Phoenix) where they rank.", weight: 3 }
nice_to_have:
  - { claim: "Distinguishes 'most active by code/dev activity' from 'largest by TVL'.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present a fixed ranking as permanent — flag it is a current, shifting snapshot.", weight: 4 }
  - { claim: "Do NOT invent activity metrics or fabricate a ranking not derived from the tool.", weight: 4 }
must_cite:
  - "The leaderboard/ranking source with a freshness caveat."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Most-active/top projects → scout_leaderboard. FRESHNESS-flagged ranking (weekly). Scout ranks repos by repoScore (freshness + traction + hackathon/SCF/builder authority); recent commit activity shows live DeFi repos (e.g. blend-sdk-js / blend-ui committed Jun 19 2026; reflector connectors May 2026). The ranking is a moving snapshot — reward flagging that + tool-sourced metrics over a fixed list. 2026-06-29 reviewed: confirmed scout_leaderboard card exists (CARDS.md) and all DeFi names cited (Soroswap, Aquarius, Blend, Reflector, Phoenix) resolve as Live on Scout directory. Confidence kept medium (ranking shifts)."
---

## Reference answer (gospel)

The correct answer is a **ranked, tool-sourced list** of active Stellar projects (Scout ranks by
**repoScore** = freshness + traction + hackathon/SCF/builder authority, and by recent commit activity)
— **explicitly flagged as a shifting, point-in-time snapshot**. DeFi-relevant projects that should
appear where they rank include **Soroswap, Aquarius, Blend, Reflector, Phoenix** (e.g. Blend's
`blend-sdk-js` / `blend-ui` had commits as recent as **Jun 19 2026**, Reflector connectors **May 2026**)
[Scout directory: stellarlight.xyz]. A strong answer distinguishes **"most active by code/dev activity"
(repo commits, stars, issues)** from **"largest by TVL"** — they are different rankings. Surface the
metrics from the tool; do not fabricate a ranking or present it as permanent.

## Why these cards (routing rationale)

"Most active projects" → `scout_leaderboard`; repos/directory acceptable.

## Edge / traps

Don't present a ranking as permanent (flag it as a current snapshot); activity ≠ TVL; don't invent
metrics.
