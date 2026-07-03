---
id: q-defi-x402-projects-discovery
q: "Which Stellar projects or repos implement x402 / agentic per-call payments?"
category: defi-ecosystem
subcategory: agentic-payments
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_projects, scout_repos]
acceptable_cards: [lumenloop_search_directory]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Surfaces real Stellar x402 / agentic-payment projects grounded in Scout (e.g. project ApiCharge — Soroban pay-per-call API monetization).", weight: 5 }
  - { claim: "Surfaces real x402-related repos grounded in Scout (e.g. davidmaronio/StellarPay402, 402md/agentcard, emperorsixpacks/-bear-protocol — all from the Agentic Hackathon).", weight: 4 }
should_have:
  - { claim: "References the Agentic Payments skill as a discovery surface.", weight: 3 }
  - { claim: "Each surfaced project/repo carries provenance (a Scout link / id), not bare names.", weight: 3 }
nice_to_have:
  - { claim: "Notes results are a live snapshot that should be re-queried for freshness.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent projects or repos that are not in the Scout corpus.", weight: 5 }
  - { claim: "Do NOT present unsourced names as confirmed x402 implementers.", weight: 4 }
must_cite:
  - "Scout (stellarlight.xyz) project/repo provenance for each surfaced item."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/apicharge
  - https://github.com/davidmaronio/StellarPay402
  - https://github.com/402md/agentcard
  - https://github.com/emperorsixpacks/-bear-protocol
  - https://developers.stellar.org/docs/build/agentic-payments
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Freshness:true discovery. Phase-2 RE-VERIFIED against live Scout (2026-06-22): project ApiCharge (Soroban pay-per-call API monetization, SCF ~$79K) is real; the Phase-1 repo seeds 'Agent-Paywall-Router' and 'XLMx402earn' did NOT surface — replaced with verified Agentic-Hackathon repos: davidmaronio/StellarPay402 (repoScore 85, judgeScore 1.0), 402md/agentcard (x402 prepaid cards, repoScore 85), emperorsixpacks/-bear-protocol (agent payments + x402 + agent identity). Names are still a live snapshot — re-query; do not hard-code as the ONLY acceptable hits. 2026-06-29 RE-VERIFIED on live Scout + GitHub: ApiCharge still Live, SCF $79K (Scout project search, github streamcharge/apicharge); 402md/agentcard repoScore 85 judge 1.0; emperorsixpacks/-bear-protocol repoScore 69 (GitHub-confirmed, leading-dash handle); davidmaronio/StellarPay402 repoScore 85. All five sources resolve 200. Confidence raised medium->high: every surfaced item is Scout/GitHub-grounded with provenance."
---

## Reference answer (gospel)

This is a **discovery** query — Raven should return **real, Scout-grounded** Stellar projects/repos
implementing x402 / agentic per-call payments, each with provenance. Verified (Scout, 2026-06-22):
- **Project:** **ApiCharge** — Soroban-based **pay-per-call / streaming API monetization** with a
  native marketplace; SCF-awarded (~$79K) [Scout: stellarlight.xyz/project/apicharge].
- **Repos (Agentic Hackathon):** **davidmaronio/StellarPay402** (agent-to-agent API marketplace; x402
  payments, MCP discovery, Soroban registry; repoScore 85), **402md/agentcard** (x402 programmable
  prepaid cards for AI agents with on-chain spending limits; repoScore 85),
  **emperorsixpacks/-bear-protocol** (commerce layer for AI-agent payments: job escrow, agent identity,
  x402 micropayments).
- The **Agentic Payments** docs/skill (developers.stellar.org/docs/build/agentic-payments) is a
  discovery surface for the x402/402-status pattern.

The exact set is a **live snapshot** and should be re-queried for freshness.

## Why these cards (routing rationale)

"Which projects/repos implement X" is the canonical **`scout_projects`** (with `scout_repos` /
`lumenloop_search_directory` acceptable) discovery shape — this case proves Scout
projects/repos discovery works. Deep-research / metered lanes are forbidden for a corpus lookup.

## Edge / traps

The trap is **inventing** plausible-sounding projects/repos or presenting unsourced names as
confirmed implementers. Every surfaced item must be Scout-grounded with a link/id.
