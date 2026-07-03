---
id: q-scf-hackathons-dorahacks
q: "Where does the Stellar Development Foundation run its hackathons, and what was the most recent one?"
category: scf-grants-builders
subcategory: hackathons
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: "weekly"

expected_cards: [scout_hackathons]
acceptable_cards: [scout_research, lumenloop_search_content_semantic]
forbidden_cards: [scout_hackathon_compare]
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "States the SDF runs/sponsors hackathons primarily via DoraHacks (dorahacks.io/org/stellar).", weight: 5 }
  - { claim: "Surfaces a recent Stellar hackathon from the catalog and flags that 'most recent' is time-sensitive.", weight: 3 }
should_have:
  - { claim: "Notes hackathon themes (e.g. AI agents / x402 micropayments, regional bounties).", weight: 2 }
nice_to_have:
  - { claim: "As of June 2026, recent catalog examples included Stellar Hacks: Agents (x402 + Stripe, now completed) under the live 'Stellar Hacks: Real-World ZK' theme.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar hackathons run on a non-existent or wrong platform (e.g. only Devpost/Gitcoin) as the SDF's primary venue.", weight: 4 }
  - { claim: "Do NOT fabricate a 'most recent' hackathon, date, or prize without catalog grounding.", weight: 4 }
must_cite:
  - "dorahacks.io/org/stellar and the Stellar Light hackathon catalog."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://dorahacks.io/org/stellar
  - https://stellarlight.xyz/hackathons
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Dossier §6.1-6.2. perplexity_search is acceptable-adjacent for DoraHacks-as-company context but the hackathon list is scout_hackathons. Freshness — confidence medium; reward staleness-flagging. Re-verified live 2026-06-29: DoraHacks remains the SDF venue (org page), catalog holds 12 events, active theme 'Stellar Hacks: Real-World ZK'. Dropped unverified 'Build On Stellar (India)' example."
---

## Reference answer (gospel)

- The SDF runs/sponsors its hackathons primarily via DoraHacks — the Stellar Development Foundation org page at dorahacks.io/org/stellar (org id 3096). Source: https://dorahacks.io/org/stellar
- Pull the recent-event answer from the Stellar Light hackathon catalog (`scout_hackathons`); the catalog corroborates DoraHacks as the platform. Source: https://stellarlight.xyz/hackathons
- FRESHNESS: "most recent" is time-sensitive. As of 2026-06-29 the notable live (active) theme was "Stellar Hacks: Real-World ZK"; "Stellar Hacks: Agents (x402 + Stripe)" is now an OLDER/completed event. Report the live catalog state and flag that "most recent" must be confirmed against it. Sources: https://dorahacks.io/org/stellar , https://stellarlight.xyz/hackathons
- Note themes where present (e.g. ZK / Protocol 25-26 host functions, AI agents / x402 micropayments, regional bounties like Build On Stellar India). Source: https://stellarlight.xyz/hackathons
- Do NOT name a wrong primary platform (e.g. Devpost/Gitcoin) as the SDF's venue, and do NOT fabricate a "most recent" event, date, or prize without catalog grounding.

## Why these cards (routing rationale)

Hackathon venue + recent events → `scout_hackathons`; the DoraHacks-as-platform fact is corroborated
by the catalog and Scout research.

## Edge / traps

Trap: naming the wrong primary platform, or inventing a 'most recent' event.
