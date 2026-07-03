---
id: q-defi-streaming-payments-prior-art
q: "I want to build a streaming/recurring-payments contract on Soroban — what existing Stellar projects, repos, or SCF submissions should I study?"
category: defi-ecosystem
subcategory: payments-prior-art
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_repos]
acceptable_cards: [lumenloop_find_similar_scf_submissions, parallel_search, lumenloop_request_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Points to real, Scout-grounded prior-art repos for streaming/recurring payments on Stellar (e.g. luanlabs/fluxity-interface token-streaming, tosinshada/tide-streaming, and x402/MPP payment repos like winsznx/routedock).", weight: 5 }
  - { claim: "Each surfaced item carries Scout/SCF provenance (repo link or id), not bare names.", weight: 4 }
should_have:
  - { claim: "References relevant SCF submissions or an SDF/MPP recurring-payments writeup as study material.", weight: 3 }
nice_to_have:
  - { claim: "Notes the SAC transfer / payment-channel (MPP session) pattern these tend to use.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent projects/repos not in the corpus.", weight: 5 }
  - { claim: "Do NOT write the streaming-payments contract code — this is discovery, not code generation.", weight: 4 }
must_cite:
  - "Scout repo / SCF submission provenance for each surfaced item."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
  - https://github.com/luanlabs/fluxity-interface
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "GROUNDED + CORRECTED: live Scout repo search (2026-06-22, /api/repos/search) does NOT surface the Phase-1 illustrative names (FlowFi, Quipay, stellar-drips). Real streaming/recurring-payment prior art: luanlabs/fluxity-interface (token streaming), tosinshada/tide-streaming, Handilusa/Ferrule (MPP session channels), and x402/MPP payment-execution repos (winsznx/routedock, davidmaronio/StellarPay402). Do NOT hard-gate on a single exact name set — the gate is 'real Scout-grounded repos with provenance', and must_avoid forbids invented repos. 2026-06-29 RE-VERIFIED on live Scout + GitHub: CORRECTED handle luanlabs/fluxity -> luanlabs/fluxity-interface (bare 'luanlabs/fluxity' 404s; the luanlabs/fluxity-* family is fluxity-interface (Scout 28, desc 'token streaming solution'), fluxity-v1-core (Soroban contract V1), fluxity-api, fluxity.finance). Confirmed Scout-graded: tosinshada/tide-streaming (in corpus), Handilusa/Ferrule (repoScore 53, desc 'Pay-per-token AI agents...MPP session channels'), winsznx/routedock (repoScore 69, 'unified payment execution layer for x402/MPP'), davidmaronio/StellarPay402 (repoScore 85). Source github.com/luanlabs/fluxity-interface resolves 200."
---

## Reference answer (gospel)

This is a **discovery / prior-art** query: Raven should return **real, Scout-grounded** streaming or
recurring-payments work on Stellar to **study**, each with provenance — verified examples from the live
corpus include **`luanlabs/fluxity-interface`** (token-streaming), **`tosinshada/tide-streaming`**,
**`Handilusa/Ferrule`** (MPP session channels for pay-per-token AI agents), and x402/MPP payment-
execution repos like **`winsznx/routedock`** and **`davidmaronio/StellarPay402`** — plus relevant **SCF
submissions** and the Stellar **agentic-payments / MPP** docs (SAC transfers + payment channels). It
should **not write the contract**. (The Phase-1 example names FlowFi / Quipay / stellar-drips did not
verify against live Scout — the gate is "real, sourced repos", not those exact names.)

Source: stellarlight.xyz repo search (Scout, 2026-06-22).

## Why these cards (routing rationale)

"What prior art / repos / SCF submissions exist" → **`scout_repos`** (with
`lumenloop_find_similar_scf_submissions` / `parallel_search` acceptable). The metered LumenLoop research
lane (`lumenloop_request_research`) is an **acceptable escalation** if the free repo/corpus search comes
back thin — it's the higher-signal Stellar prior-art synthesis — but it must never be the primary; the
expensive deep-research tiers stay out.

## Edge / traps

Traps: (a) **inventing** plausible repos/projects; (b) sliding into **code generation** — the ask is
prior art to study, and Raven returns sourced evidence, not code. Both are `must_avoid`.
