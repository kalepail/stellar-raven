---
id: q-defi-agent-identity-stellar-experimental
q: "What exists for on-chain AI-agent identity/reputation (ERC-8004 style) on Stellar, and how mature is it?"
category: defi-ecosystem
subcategory: agentic-payments
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_repos]
acceptable_cards: [perplexity_search, scout_research, lumenloop_request_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "ERC-8004 is an Ethereum agent-identity/reputation standard (live on Ethereum mainnet 2026-01-29), not a Stellar standard.", weight: 5 }
  - { claim: "On Stellar, on-chain agent identity is experimental/hackathon-stage (e.g. trionlabs/stellar-8004, progax01/stellar8004), NOT a mature or ratified standard.", weight: 5 }
  - { claim: "Raven flags the immaturity honestly rather than overstating maturity.", weight: 4 }
should_have:
  - { claim: "Surfaces real Stellar agent-identity experiments with provenance (Scout repo links, e.g. trionlabs/stellar-8004 from the Agentic Hackathon).", weight: 3 }
nice_to_have:
  - { claim: "Notes the gap is an open whitespace / early-stage area on Stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert that a mature on-chain agent-identity standard exists on Stellar.", weight: 5 }
  - { claim: "Do NOT present ERC-8004 as a Stellar standard.", weight: 5 }
must_cite:
  - "Scout repo provenance for any Stellar experiment named; an ERC-8004 reference for the Ethereum framing."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/trionlabs/stellar-8004
  - https://eips.ethereum.org/EIPS/eip-8004
  - https://x.com/DavideCrapis/status/2016893815857066212
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness:true + honesty case. Phase-2 VERIFIED: ERC-8004 ('Trustless Agents') proposed Aug 13 2025, went LIVE on Ethereum mainnet Jan 29 2026 (still EIP 'Draft' status), excludes payments and composes with x402. On Stellar, agent-identity is real but EARLY/hackathon-stage — Scout shows trionlabs/stellar-8004 ('Trustless Agents (8004) on Stellar/Soroban', repoScore 69, Agentic Hackathon, judgeScore 0.8, homepage stellar8004.com) and progax01/stellar8004 — NOT a ratified Stellar standard. emperorsixpacks/-bear-protocol also bundles agent identity. Reward honest immaturity-flagging. 2026-06-29 RE-VERIFIED: ERC-8004 EIP still 'Draft' (eips.ethereum.org) and composes with x402 for payments per The Graph/eco.com writeups; Scout repos confirm trionlabs/stellar-8004 (repoScore 69, judge 0.8, homepage stellar8004.com) and progax01/stellar8004 (repoScore 53, judge 0.6). CORRECTED repo handle bear-protocol -> emperorsixpacks/-bear-protocol (leading dash; bare 'bear-protocol' 404s); GitHub-confirmed (desc: 'commerce layer for AI agent payments on Stellar. Job escrow, agent identity, and x402 micropayments'). Confidence stays medium: the exact Jan-29 mainnet date leans on a single social-post source."
---

## Reference answer (gospel)

**ERC-8004 ("Trustless Agents")** is an **Ethereum** agent-identity/reputation/validation standard:
proposed **Aug 13 2025**, **live on Ethereum mainnet Jan 29 2026** (still **EIP "Draft"** status), and
it deliberately **excludes payments** (composing with x402 for settlement) [eips.ethereum.org/EIPS/eip-8004].
On **Stellar**, on-chain agent identity is **experimental / hackathon-stage, not a ratified standard**.
Scout surfaces real but early efforts: **trionlabs/stellar-8004** ("Trustless Agents (8004) on
Stellar/Soroban", repoScore 69, Agentic Hackathon, homepage stellar8004.com) and
**progax01/stellar8004**; **emperorsixpacks/-bear-protocol** also bundles "agent identity" with x402
payments. The correct Raven-shaped answer **honestly flags the immaturity** — these are
experiments/ports, not a mature Stellar standard — and never presents ERC-8004 as a Stellar standard.

## Why these cards (routing rationale)

"What repos/experiments exist on Stellar" → **`scout_repos`** (with `scout_research` /
`perplexity_search` acceptable for the ERC-8004 Ethereum framing). The metered LumenLoop research lane
(`lumenloop_request_research`) is an **acceptable escalation** if the free repo/corpus search comes back
thin — it's the higher-signal Stellar prior-art synthesis — but it must never be the primary. The value
here is **honesty** — flagging the gap, not manufacturing a standard. The expensive uncarded
deep-research tiers (Parallel/Perplexity deep modes) stay governance-forbidden.

## Edge / traps

The traps: (a) asserting a **mature Stellar agent-identity standard** exists; (b) presenting
**ERC-8004 as a Stellar standard**. Both are weight-5 `must_avoid`. Reward for explicitly flagging
immaturity / unverifiable claims.
