---
id: q-defi-lending-scf-flagships
q: "I'm scoping a new lending protocol on Soroban. Who has already built lending or yield/credit primitives on Stellar, and which of those teams have SCF backing?"
category: defi-ecosystem
subcategory: lending
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: true
freshness_horizon: "monthly"

expected_cards: [scout_projects]
acceptable_cards: [scout_research, lumenloop_find_similar_scf_submissions, lumenloop_get_scf_submissions]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "States that lending/yield/credit on Stellar is not greenfield: Blend is the base lending primitive and multiple adjacent lending/yield/CDP teams exist.", weight: 5 }
  - { claim: "Names Blend as a live SCF-backed Soroban lending/money-market protocol.", weight: 4 }
  - { claim: "Names at least two other real Stellar lending/yield/credit projects with SCF evidence, such as Slender and DeFindex; Orbit/OrbitCDP may be mentioned with caveats if the current directory record differs.", weight: 4 }
should_have:
  - { claim: "Distinguishes direct lenders from Blend-routing yield vaults, CDPs, leveraged-spot, or keeper/automation infrastructure.", weight: 3 }
  - { claim: "Uses dated directory/project records for SCF status and avoids treating dollar amounts as permanent.", weight: 2 }
nice_to_have:
  - { claim: "Mentions additional related funded projects surfaced by the current directory, such as Turbolong or Nectar Network, while keeping category caveats clear.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim lending is greenfield or that no one has built lending on Stellar.", weight: 5 }
  - { claim: "Do NOT list only generic EVM protocols such as Aave/Compound instead of Stellar-native projects.", weight: 4 }
  - { claim: "Do NOT invent SCF amounts, rounds, or project names not present in the cited records.", weight: 4 }
must_cite:
  - "Current Scout/Stellar Light project records or SCF submission records for each named funded project."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/blend
  - https://stellarlight.xyz/project/slender
  - https://stellarlight.xyz/project/defindex
status: reviewed
authored: { phase1: 2026-06-25, phase2: 2026-06-25, reviewed: 2026-06-29 }
confidence: medium
notes: "Added from theboycoder/StellarLight data-layer intake. Freshness-sensitive because Scout project records and SCF totals move. Live Scout re-check 2026-06-29 confirms Blend, Slender (noncustodial money-market by eq-lab), DeFindex as live lending/yield records; Orbit naming fuzzy (Orbit Finance unfunded in project search, OrbitCDP appears in research/audit context), so Orbit is not a hard gate. This file OWNS the SCF-backed-landscape lane (scout_projects; 'who built lending + which have SCF backing') — DISTINCT from q-defi-blend-alternatives (find_similar; 'are there direct substitutes for Blend')."
---

## Reference answer (gospel)

The correct Raven-shaped answer is not "greenfield." Stellar already has a funded lending/yield
cluster:

- **Blend** is the base Soroban lending / money-market primitive, live and SCF-backed in the Scout
  project record. It is the canonical pool/lending layer other apps route through. [1]
- **Slender** is a noncustodial lending/borrowing protocol on Soroban by eq-lab, live and SCF-backed
  in the current Scout project record. [2]
- **DeFindex** is not a standalone lender; it is PaltaLabs yield infrastructure / tokenized vaults
  that can route deposits across underlying protocols including Blend. It is live and SCF-backed in
  the current Scout project record. [3]

A thorough answer may mention adjacent funded credit/yield infrastructure, but must label it clearly:
CDPs, Blend-routing vaults, leveraged spot, or keeper/automation are not all direct Blend competitors.
Use dated directory/SCF records and avoid freezing award totals as permanent facts.

Sources: [1] Scout Blend project record; [2] Scout Slender project record; [3] Scout DeFindex project
record.

## Why these cards (routing rationale)

This is a project/funding landscape question. `scout_projects` is the primary card because the user
needs real projects plus SCF status. Lumenloop SCF submission cards are acceptable for deeper
funding provenance.

## Edge / traps

The traps are claiming lending is greenfield, importing generic EVM protocols as the answer, or
flattening different primitives into one category without caveats.
