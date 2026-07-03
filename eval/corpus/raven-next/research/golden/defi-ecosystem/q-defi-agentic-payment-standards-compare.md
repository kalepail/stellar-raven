---
id: q-defi-agentic-payment-standards-compare
q: "How do x402, MPP, AP2, and ACP compare for agent payments, and which are Stellar-specific vs general?"
category: defi-ecosystem
subcategory: agentic-payments
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [perplexity_search, parallel_search, scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "x402 = Coinbase's HTTP-402 per-request protocol; on Stellar it settles via Soroban authorization entries.", weight: 5 }
  - { claim: "MPP = Machine Payments Protocol (sessions / pre-authorized streaming); on Stellar it uses Soroban SAC transfers / payment channels.", weight: 5 }
  - { claim: "First-party Stellar docs cover x402 and MPP as the two agent-payment patterns documented for Stellar settlement.", weight: 4 }
  - { claim: "AP2 = Google's Agent Payments Protocol and ACP = a general agent-commerce protocol — both general/coordination standards, NOT Stellar-native settlement mechanisms.", weight: 4 }
should_have:
  - { claim: "Distinguishes Stellar-settlement standards (x402, MPP) from general/coordination standards (AP2, ACP).", weight: 3 }
  - { claim: "Notes AP2 is a coordination layer that can route the underlying payment through a settlement protocol like x402 (industry framing, not a Stellar-docs claim).", weight: 2 }
nice_to_have:
  - { claim: "Notes the payment asset across these is typically a SEP-41 token / USDC.", weight: 1 }
must_avoid:
  - { claim: "Do NOT present AP2 or ACP (or a Stripe/Tempo MPP chain) as Stellar-native settlement mechanisms.", weight: 5 }
  - { claim: "Do NOT fabricate capabilities or conflate the four protocols into one.", weight: 4 }
must_cite:
  - "At least one primary developers.stellar.org agentic-payments docs page (x402 + MPP)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/agentic-payments
  - https://developers.stellar.org/docs/build/agentic-payments/x402
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "VERIFIED 2026-06-22: developers.stellar.org/docs/build/agentic-payments documents EXACTLY TWO Stellar-settlement patterns side-by-side — x402 (Coinbase, per-request, Soroban authorization entries, facilitator verify/settle) and MPP (Machine Payments Protocol: direct on-chain settlement via Soroban SAC transfers, supporting one-time charge payments AND high-frequency off-chain payment channels). AP2 (Google Agent Payments Protocol) and ACP are general/coordination standards NOT documented as Stellar-native settlement. The AP2 'routes the actual payment through x402' framing is reasonable coordination-vs-settlement industry framing but NOT a Stellar-docs claim — DEMOTED from must_have to should_have. Freshness:true (fast-moving). 2026-06-29 RE-VERIFIED: both source docs pages (agentic-payments, agentic-payments/x402) resolve 200; AP2=Google Agent Payments Protocol composing with x402 corroborated by independent writeups (The Graph, foojay.io). No fabricated SEP/contract/project names — SEP-41 is real. Confidence stays medium (fast-moving standards space)."
---

## Reference answer (gospel)

Four agent-payment standards, two of which Stellar documents for **on-chain settlement**:

- **x402** — Coinbase Developer Platform's open protocol reviving **HTTP 402** for **per-request**
  payments; on Stellar it settles via **Soroban authorization entries** (SEP-41 / USDC).
- **MPP (Machine Payments Protocol)** — **sessions / pre-authorized streaming** payments; on Stellar
  it settles via **Soroban SAC transfers and payment channels**. First-party Stellar docs cover
  **both x402 and MPP**.
- **AP2 (Agent Payments Protocol, Google)** — a **coordination layer** for agent-to-agent payment
  intent; it **routes the actual payment through x402**, it is not itself Stellar settlement.
- **ACP** — a **general agent-commerce protocol**, not a Stellar-native settlement mechanism.

So: **x402 + MPP = Stellar-settled**; **AP2 + ACP = general / coordination**.

## Why these cards (routing rationale)

The Stellar-specific half (x402, MPP) is first-party → **`stellar_docs_mcp`**. The general half (AP2,
ACP framing) can lean on `perplexity_search` / `parallel_search` / `scout_research` as acceptable
secondary sources. Deep-research tier is governance-forbidden.

## Edge / traps

The trap is presenting **AP2/ACP (or a Stripe/Tempo MPP variant)** as Stellar-native settlement, or
fabricating per-protocol capabilities. Both are `must_avoid`.
