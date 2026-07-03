---
id: q-edge-scf-v7-centralization-myths
q: Is SCF v7.0 predatory because only 10 percent is upfront, and can SDF block my app from mainnet or take it down?
category: edge-governance
subcategory: conceptual-skeptic
axes:
  - edge-governance
  - ecosystem-spectrum
query_type: comparison
difficulty: medium
freshness_sensitive: true
freshness_horizon: yearly
expected_cards:
  - scout_research
acceptable_cards:
  - lumenloop_search_content_semantic
  - parallel_search
forbidden_cards: []
expected_service: stellar_light
should_fire: true
must_have:
  - claim: "Separates SCF grant/payment mechanics from permission to deploy on Stellar public network."
    weight: 5
  - claim: "Uses current SCF v7 program terms rather than assuming the 10 percent framing is complete."
    weight: 4
  - claim: "Explains SDF can control its own grants, branding, websites, and programs, but public-network app deployment is not the same as SDF hosting."
    weight: 4
should_have:
  - claim: "Acknowledges centralization concerns honestly without overstating SDF censorship power."
    weight: 3
nice_to_have: []
must_avoid:
  - claim: "Do NOT claim accepting SCF gives SDF protocol-level power to delete an app from mainnet."
    weight: 5
  - claim: "Do NOT call SCF predatory or fair without citing the actual terms/evidence."
    weight: 4
must_cite:
  - Current SCF/SDF source required for SCF v7 payment mechanics.
must_not_use_tier: []
pass_threshold: 0.75
weight_profile: standard
sources:
  - https://stellar.org/blog/ecosystem/introducing-scf-v7
  - https://communityfund.stellar.org/awards
  - https://stellar.gitbook.io/scf-handbook/scf-awards/official-rules-for-submissions
  - https://developers.stellar.org/docs/learn/fundamentals/networks
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: high
notes: "Snapshot 2026-06-29. SCF #45 page and SCF v7 announcement were reachable; terms can change, so Phase 3 should re-check if reviewing after the current round."
---

## Reference answer (gospel)

SCF funding terms and Stellar mainnet permission are separate. SCF v7 introduced Build Award tracks and a milestone/tranche model; the current awards page shows SCF #45 with a July 26, 2026 submission deadline and up to $150K in XLM. The public SCF page shows the four milestone labels: initial award distribution, MVP, testnet, and mainnet. Calling that predatory or fair requires evidence from the actual terms, not just the isolated fact that the initial distribution is 10%.

SDF can administer its own grant programs, review eligibility, apply official rules, control SDF websites/branding, and stop or modify its own awards. That is not the same as protocol-level power to delete a deployed app from the public Stellar network. A public-network app still depends on its own operators, contracts, accounts, front ends, issuers, and compliance choices; SDF funding does not make SDF the host of every recipient's app.

## Why these cards (routing rationale)

`scout_research` should fire because SCF/handbook material is in the Stellar ecosystem corpus. `parallel_search` or LumenLoop is acceptable for current SCF pages and v7 program terms.

## Edge / traps

Do not collapse grant governance into chain governance. The answer should acknowledge that SDF has program discretion while rejecting unsupported claims that SCF gives SDF a mainnet delete button.
