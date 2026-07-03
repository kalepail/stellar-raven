---
id: q-builder-by-scf-tier
q: "Which Stellar builders have a high SCF tier / track record of SCF awards that I could recruit as advisors?"
category: scf-grants-builders
subcategory: builder-discovery
axes: [tool-targeted]
query_type: discovery
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_builders]
acceptable_cards: [scout_projects, lumenloop_get_scf_submissions]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns builder profiles filtered/ranked by SCF tier or SCF award track record.", weight: 5 }
  - { claim: "Uses the curated builder directory's SCF-tier attribute, not invented standing.", weight: 4 }
should_have:
  - { claim: "Surfaces each builder's skills and the SCF signal that justifies inclusion.", weight: 2 }
nice_to_have:
  - { claim: "Can cross-reference a builder's projects' SCF submissions for corroboration.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent SCF tiers/standings for people not in the directory.", weight: 5 }
  - { claim: "Do NOT conflate 'SCF tier' (a builder-directory attribute) with SCF Verified-Member voting tiers — they are different concepts.", weight: 3 }
must_cite:
  - "Stellar Light's builder directory (scout_builders) SCF-tier field."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/builders
  - https://stellar.gitbook.io/scf-handbook/governance/verified-members
  - https://discord.gg/stellardev
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "3rd builder-discovery case; exercises the SCF-tier filter. Trap: builder SCF tier vs Verified-Member governance tiers. Verified 2026-06-29 via /api/builders: directory total = 110 profiles (matches ~110) and each profile record carries an scfTier field, confirming the directory's SCF-tier attribute exists. Routing claims hold."
---

## Reference answer (gospel)

- Query the curated builder directory with the `scfTier` filter to surface builders ranked/filtered by SCF tier / award track record; it indexes ~110 profiles (`q` / `location` / `scfTier` / `featured`). Source: https://stellarlight.xyz/builders
- Return profiles with the SCF-tier signal plus skills that justify inclusion; use the directory's recorded SCF-tier attribute, not invented standing. Source: https://stellarlight.xyz/builders
- A builder's projects' SCF submissions can corroborate the tier signal (acceptable cross-reference), but the SCF-tier field on the profile is the primary source. Source: https://stellarlight.xyz/builders
- Distinction (trap): the directory's "SCF tier" is a builder-profile attribute and is NOT the same as SCF Verified-Member governance standing (the reputation tier that grants NQG voting weight). Don't conflate them. Source: https://stellar.gitbook.io/scf-handbook/governance/verified-members
- Honesty case — on a no-match, surface the structured filter-miss advisory (broaden filters; Discord "Looking for Collaborators") rather than inventing SCF standings for people not in the directory. Source: https://discord.gg/stellardev

## Why these cards (routing rationale)

Builders by SCF tier → `scout_builders` (it indexes profiles by SCF tier).

## Edge / traps

Trap: inventing standing; conflating builder-directory SCF tier with the Verified-Member voting tiers.
