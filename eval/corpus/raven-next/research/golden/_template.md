---
id: q-CATEGORY-SHORTSLUG
q: ""
category: ""            # protocol-core | soroban | assets-anchors-seps | defi-ecosystem | scf-grants-builders | history-org-tokenomics | tooling-infra | compliance-rwa-payments | edge-governance
subcategory: ""
axes: []                # tool-targeted | ecosystem-spectrum | edge-governance
query_type: ""          # factual | how-to | comparison | discovery | freshness | list | governance-negative | edge-nonstellar
difficulty: ""          # easy | medium | hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: []      # card ids from src/capability-index.ts that SHOULD fire
acceptable_cards: []    # also-correct alternates (not a routing miss)
forbidden_cards: []     # cards whose firing would be wrong
expected_service: ""    # stellar_light | lumenloop | stellar_docs | perplexity | parallel | (none)
should_fire: true       # false => Raven should decline / scope down

must_have: []           # [{ claim, weight 1-5 }]  absent => FAIL
should_have: []         # [{ claim, weight 1-5 }]  strongly expected
nice_to_have: []        # [{ claim, weight 1-5 }]  bonus
must_avoid: []           # [{ claim, weight 1-5 }]  present => FAIL (hallucination traps)
must_cite: []           # citation requirements (prose)
must_not_use_tier: []   # governance: tiers that must NOT have run

pass_threshold: 0.7
weight_profile: standard  # standard | strict

sources: []             # canonical source URLs (Phase 2)
status: draft           # draft | answered | reviewed | final
authored: { phase1: null, phase2: null, reviewed: null }
confidence: medium      # high | medium | low
notes: ""
---

## Reference answer (gospel)

<!-- Phase 2: concise, fully-cited "this is the correct Raven-shaped answer". -->

## Why these cards (routing rationale)

<!-- Phase 1/2: which capability cards should fire and why; what a routing miss would look like. -->

## Edge / traps

<!-- The plausible wrong answers and why they're wrong (source of the must_avoid claims). -->
