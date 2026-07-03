---
id: q-scf-hackathons-active
q: "What Stellar hackathons are currently active or upcoming that I could join?"
category: scf-grants-builders
subcategory: hackathons
axes: [tool-targeted]
query_type: freshness
difficulty: easy
freshness_sensitive: true
freshness_horizon: "weekly"

expected_cards: [scout_hackathons]
acceptable_cards: [scout_research]
forbidden_cards: [scout_hackathon_compare]
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns active/upcoming Stellar hackathons from the hackathon catalog.", weight: 5 }
  - { claim: "Flags that hackathon status is time-sensitive and should be confirmed against the live catalog / DoraHacks.", weight: 3 }
should_have:
  - { claim: "Many Stellar hackathons are hosted via DoraHacks (dorahacks.io/org/stellar).", weight: 2 }
  - { claim: "Where available, surfaces prize pools and themes.", weight: 2 }
nice_to_have:
  - { claim: "As of the 2026-06-29 catalog, the active theme was Stellar Hacks: Real-World ZK, with recent completed examples like Stellar Hacks: Agents and Scaffold Stellar Hackathon.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert specific hackathons as definitely active without a freshness caveat (status changes).", weight: 4 }
  - { claim: "Do NOT invent hackathon names, dates, or prize pools not in the catalog.", weight: 4 }
must_cite:
  - "Stellar Light's hackathon catalog (scout_hackathons) / dorahacks.io/org/stellar."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/hackathons
  - https://dorahacks.io/org/stellar
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Dossier §6. scout_hackathons catalog (q ignored; status enum active|upcoming|completed). scout_hackathon_compare is dormant → forbidden. Freshness — confidence medium; reward staleness-flagging. Re-verified live 2026-06-29 (/api/hackathons): 12 DoraHacks events / 0 curated, active theme 'Stellar Hacks: Real-World ZK', status=upcoming returns 0. Replaced unverified 'Build On Stellar (India)' example with catalog-confirmed entries."
---

## Reference answer (gospel)

- Route active/upcoming hackathon discovery to the Stellar Light hackathon catalog (`scout_hackathons`, status enum active|upcoming|completed). Sources: https://stellarlight.xyz/hackathons , https://dorahacks.io/org/stellar
- FRESHNESS: hackathon status is time-sensitive — report the June-2026 live state but flag it must be confirmed against the live catalog / DoraHacks org page, not asserted as fixed. Source: https://stellarlight.xyz/hackathons
- As of 2026-06-29 the catalog held 12 DoraHacks events (0 curated); the current/notable live theme was "Stellar Hacks: Real-World ZK" (ZK on Stellar, Protocol 25/26 host functions). Source: https://dorahacks.io/org/stellar
- A `status=upcoming` query currently returns ZERO curated upcoming events (between events), with a fallback advisory pointing to @BuildOnStellar on X and the DoraHacks org page — surface that advisory rather than inventing an upcoming event. Source: https://dorahacks.io/org/stellar
- Many Stellar hackathons are hosted via DoraHacks (dorahacks.io/org/stellar, SDF org). Source: https://dorahacks.io/org/stellar
- Do NOT assert specific events as definitely active without a freshness caveat, and do NOT invent names/dates/prize pools; `scout_hackathon_compare` is dormant → must not fire.

## Why these cards (routing rationale)

Hackathon discovery by status → `scout_hackathons` (status enum). `scout_hackathon_compare` is
dormant/not-routable → forbidden. General-web is a miss.

## Edge / traps

Trap: asserting fixed active events without a freshness note; the dormant compare card firing.
