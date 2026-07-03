---
id: q-scf-funded-similar-oracle
q: "Has the SCF already funded any price-oracle projects? I want to avoid duplicating something that exists."
category: scf-grants-builders
subcategory: scf-archive-topic
axes: [tool-targeted]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [lumenloop_find_similar_scf_submissions]
acceptable_cards: [scout_research, lumenloop_search_content_semantic, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Searches the SCF submissions archive by topic (oracle) to find already-funded similar projects.", weight: 5 }
  - { claim: "Returns named prior SCF submissions/awards in the oracle space (e.g. Reflector) rather than a generic yes/no.", weight: 4 }
should_have:
  - { claim: "Frames the result as 'similar prior SCF work' to inform differentiation, not a definitive 'this exact idea is taken'.", weight: 2 }
nice_to_have:
  - { claim: "Notes that overlapping prior funding doesn't disqualify a meaningfully differentiated proposal.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate SCF-funded oracle projects or award amounts not in the archive.", weight: 5 }
  - { claim: "Do NOT answer from general web knowledge of oracles instead of the SCF submissions archive.", weight: 3 }
must_cite:
  - "Lumenloop's SCF submissions archive (find_similar_scf_submissions) results."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/reflector
  - https://communityfund.stellar.org/awards
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Topic-level 'has anything like X been funded' → find_similar_scf_submissions (its exact good_at). Verified 2026-06-29 via /api/projects: Reflector $444,840 (rounds 15,20,26,29), Band $100,000, Lightecho $93,110, Orally $48,000, DIA $38,000 — all match. Amounts are live totals → freshness-sensitive."
---

## Reference answer (gospel)

- Route to the SCF submissions archive by topic (oracle) via `lumenloop_find_similar_scf_submissions`; answer from the archive, not general oracle knowledge. Source: https://communityfund.stellar.org/awards
- Return NAMED prior funded oracle projects, not a generic yes/no — e.g. Reflector ($444,840), plus Band ($100,000), Lightecho ($93,110), Orally ($48,000), DIA ($38,000). Source (named example): https://stellarlight.xyz/project/reflector
- Frame as "similar prior SCF work to inform differentiation," NOT "this exact idea is taken" — overlapping prior funding doesn't disqualify a meaningfully differentiated proposal.
- Honesty case — amounts come from the archive/directory record; do NOT fabricate oracle projects or award amounts not present in it.

## Why these cards (routing rationale)

"Has the SCF funded anything like X" (topic, not a named project) → `lumenloop_find_similar_scf_submissions`.

## Edge / traps

Trap: answering from general oracle knowledge instead of the SCF archive; or inventing funded projects.
