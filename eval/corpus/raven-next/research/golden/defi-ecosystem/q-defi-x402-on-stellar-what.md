---
id: q-defi-x402-on-stellar-what
q: "What is x402 on Stellar and how does it let APIs or AI agents charge per request?"
category: defi-ecosystem
subcategory: agentic-payments
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_projects]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "x402 is an open protocol from Coinbase Developer Platform that revives the HTTP 402 (Payment Required) status code for per-request payments.", weight: 5 }
  - { claim: "On Stellar, x402 payments settle via Soroban authorization entries.", weight: 5 }
  - { claim: "x402 uses SEP-41 tokens (USDC by default) as the payment asset.", weight: 4 }
  - { claim: "A facilitator model (e.g. Coinbase's x402 facilitator, or the OpenZeppelin Relayer plugin) verifies and settles the signed payment via /verify, /settle, /supported endpoints.", weight: 4 }
should_have:
  - { claim: "Enables APIs and AI agents to charge micro-payments per HTTP request without prior account setup.", weight: 3 }
nice_to_have:
  - { claim: "First-party Stellar docs cover x402 under agentic / agentic-payments build docs; the OZ Relayer facilitator works on Testnet and Mainnet.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say x402 is a Stellar-invented standard (it originates from Coinbase Developer Platform).", weight: 5 }
  - { claim: "Do NOT claim x402 requires API keys, pre-existing accounts, or a native gas token to pay per request.", weight: 4 }
  - { claim: "Do NOT conflate x402 with MPP (Machine Payments Protocol) — they are distinct.", weight: 4 }
must_cite:
  - "At least one primary developers.stellar.org agentic-payments / x402 docs page (or stellar.org/x402)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/agentic-payments/x402
  - https://stellar.org/x402
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "VERIFIED 2026-06-22 against developers.stellar.org/docs/build/agentic-payments/x402: Coinbase Developer Platform origin, HTTP 402 revival, Soroban authorization entries, any SEP-41 token with USDC default (distinct Testnet/Mainnet contract addresses), facilitator model with two options — Coinbase x402 facilitator (Testnet, sponsored fees) and OpenZeppelin Relayer plugin (Testnet+Mainnet, /verify //settle //supported endpoints). NOTE: the Phase-1 '~5 second settlement' figure is NOT stated in the docs — REMOVED from the gate; the facilitator claim now keys on the verify/settle model. MPP is documented on the SAME agentic-payments index page as a distinct sibling protocol (so the 'don't conflate x402 with MPP' trap stands). Freshness:true. 2026-06-29 RE-VERIFIED: both sources (developers.stellar.org/docs/build/agentic-payments/x402, stellar.org/x402) resolve 200; x402 Coinbase/HTTP-402 origin corroborated by independent writeups. No fabricated names. Confidence stays medium (fast-moving)."
---

## Reference answer (gospel)

x402 is an **open protocol from Coinbase Developer Platform** that revives the dormant **HTTP 402
"Payment Required"** status code so a server can demand a payment in the HTTP response and have the
client (a browser, script, or **AI agent**) pay and retry — enabling **per-request / pay-per-call**
monetization with no API keys or pre-funded accounts [1].

On **Stellar**, an x402 payment is a **Soroban authorization entry** the client signs; the asset is any
**SEP-41 token (USDC by default**, with distinct Testnet/Mainnet contract addresses) [1]. A
**facilitator** sits between the resource server and the chain to **verify and settle** the signed
payment via `/verify`, `/settle`, `/supported` endpoints — two options exist: the **Coinbase x402
facilitator** (Testnet, sponsored fees) and the **OpenZeppelin Relayer plugin** (Testnet + Mainnet) [1].

Source of truth: [1] developers.stellar.org agentic-payments / x402 docs (and stellar.org/x402).

## Why these cards (routing rationale)

First-party concept explained in official docs → **`stellar_docs_mcp`**. `scout_research` /
`scout_projects` are acceptable corroboration (ecosystem framing, real implementers). A
**deep-research** tier is governance-forbidden for a definitional lookup.

## Edge / traps

Plausible-wrong answers: (a) treating x402 as a Stellar-invented standard (it is Coinbase's); (b)
claiming it needs API keys / accounts / a native gas token (the whole point is keyless per-call pay);
(c) conflating it with **MPP**, a separate machine-payments protocol. The rubric's `must_avoid`
encodes each.
