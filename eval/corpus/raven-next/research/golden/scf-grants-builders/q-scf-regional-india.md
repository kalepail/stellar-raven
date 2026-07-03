---
id: q-scf-regional-india
q: "Is there an active Stellar builder community or regional program in India?"
category: scf-grants-builders
subcategory: ambassador-regional
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [scout_builders, scout_hackathons, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Confirms an active India-region Stellar community via the Ambassador Program / regional chapters.", weight: 4 }
  - { claim: "Grounds the answer in ecosystem evidence (e.g. India-based hackathons/community activity) rather than assumption.", weight: 4 }
should_have:
  - { claim: "Notes regional chapters can recommend Instawards for local builders.", weight: 2 }
nice_to_have:
  - { claim: "As of June 2026, India-based activity included Stellar Build Station 21-day builder sprints (e.g. Kozhikode/Kerala and Kolkata).", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate a named India chapter, organizer, or event without evidence.", weight: 4 }
  - { claim: "Do NOT route to general web (Parallel) when curated ecosystem corpora cover the regional program.", weight: 3 }
must_cite:
  - "Stellar Light research/builder/hackathon corpora and/or the Ambassador Program page for the India region."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.gitbook.io/ambassador-program
  - https://stellarlight.xyz
  - https://dorahacks.io/org/stellar
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Dossier §7.4. Near-edge: a regional-community question that stays inside Stellar corpora (vs general web). Reviewed 2026-06-29: the unverified 'Build On Stellar National Bounty (India)' DoraHacks event is not in the live catalog; replaced with corpus-confirmed India activity (Stellar Build Station Kozhikode/Kerala and Kolkata 21-day sprints, June 2026, from the Stellar weekly-roundup research corpus surfaced via scout_research). India active-region claim well-evidenced → confidence raised."
---

## Reference answer (gospel)

- Answer from Stellar corpora (scout_research / scout_builders / scout_hackathons + the Ambassador Program), NOT general web — the regional-community question is in-corpus.
- India is an active Stellar region: the Ambassador Program supports builders/educators forming regional chapters (events, meetups, docs). Source: https://stellar.gitbook.io/ambassador-program
- Ground the activity in evidence — the Stellar weekly-roundup corpus (via scout_research) records recent India-based community sprints such as Stellar Build Station Kozhikode (Kerala) and Kolkata, both 21-day builder sprints (June 2026). Source: Stellar Light research corpus (https://stellarlight.xyz)
- Regional chapters can recommend Instawards (≤ $15K XLM) for local builders; they do not hand out the $150K Build grant. Source: https://stellar.gitbook.io/ambassador-program
- Honesty case — do NOT fabricate a specific named chapter, organizer, or event beyond what the corpora/Ambassador page support.

## Why these cards (routing rationale)

Regional community → `scout_research` (ambassador/community corpus); builders/hackathons acceptable.

## Edge / traps

Trap: fabricating a named chapter/organizer, or jumping to general web for in-corpus info.
