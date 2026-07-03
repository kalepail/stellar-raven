---
id: q-scf-funded-similar-passkey
q: "I'm building a passkey/smart-wallet SDK for Stellar — has the SCF funded anything similar already?"
category: scf-grants-builders
subcategory: scf-archive-topic
axes: [tool-targeted]
query_type: discovery
difficulty: hard
freshness_sensitive: true
freshness_horizon: "quarterly"

expected_cards: [lumenloop_find_similar_scf_submissions]
acceptable_cards: [scout_rfps, scout_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Searches the SCF submissions archive by topic (passkey / smart wallet) for prior funded work.", weight: 5 }
  - { claim: "Returns named prior SCF submissions in the passkey/smart-account space grounded in the archive.", weight: 4 }
should_have:
  - { claim: "May also surface that 'Passkey UI' is an active SCF RFP, signalling current demand in this area.", weight: 2 }
nice_to_have:
  - { claim: "Frames overlap as differentiation guidance, not disqualification.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate funded passkey projects or award amounts not in the archive.", weight: 5 }
  - { claim: "Do NOT escalate to a metered deep-research lane for a topical archive lookup.", weight: 3 }
must_cite:
  - "Lumenloop's SCF submissions archive (find_similar_scf_submissions); optionally the SCF RFP feed."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/socketfi
  - https://communityfund.stellar.org/awards
  - https://stellarlight.xyz/rfps
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "3rd archive-by-topic case. Cross-links to the Passkey UI RFP (dossier §4.2) — acceptable scout_rfps secondary. Verified 2026-06-29 via /api/projects: SocketFi $88,200 (rounds 31,32,39,43), JS-Capacitor Passkey Kit $10,000 (Tooling, rounds 37,40,41), Zig3v2 $2,500 (round 11) — all match. Amounts are live totals → freshness-sensitive."
---

## Reference answer (gospel)

- Route to the SCF submissions archive by topic (passkey / smart wallet) via `lumenloop_find_similar_scf_submissions`; ground the answer in the archive, not general web. Source: https://communityfund.stellar.org/awards
- Return NAMED prior funded work in the passkey/smart-account space — e.g. SocketFi ($88,200), JS-Capacitor Passkey Kit ($10,000, Tooling), Zig3v2 ($2,500). Source (named example): https://stellarlight.xyz/project/socketfi
- Secondary signal: "Passkey UI" appeared as an SCF RFP topic historically, signalling demand in this area — surfacing it via `scout_rfps` is acceptable. (Treat specific current-RFP titles as freshness-sensitive against the live feed.) Source: https://stellarlight.xyz/rfps
- Frame overlap as differentiation guidance, not disqualification.
- Honesty case — do NOT fabricate funded passkey projects or amounts; do NOT over-escalate to a metered deep-research lane for a topical archive lookup.

## Why these cards (routing rationale)

Topic prior-funding check → `lumenloop_find_similar_scf_submissions`; `scout_rfps` acceptable since
"Passkey UI" is also an open RFP.

## Edge / traps

Trap: over-escalating to deep research for an archive lookup, or fabricating funded projects.
