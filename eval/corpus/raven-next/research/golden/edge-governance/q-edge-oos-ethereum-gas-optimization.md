---
id: q-edge-oos-ethereum-gas-optimization
q: "How do I optimize gas usage in my Ethereum Solidity contract?"
category: edge-governance
subcategory: out-of-scope-nonstellar
axes: [edge-governance]
query_type: governance-negative
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: []
acceptable_cards: []
forbidden_cards: [lumenloop_request_research, lumenloop_research_result, scout_research, scout_repos, stellar_docs_mcp]
expected_service: none
should_fire: false   # Ethereum gas optimization is out of Raven's Stellar scope

must_have:
  - { claim: "Recognizes Ethereum gas optimization is outside Raven's Stellar scope and declines or scopes down.", weight: 5 }
  - { claim: "Does NOT supply detailed Ethereum gas-optimization techniques as if Raven is the authority.", weight: 4 }
should_have:
  - { claim: "May note Stellar/Soroban uses a different resource-metering/fee model (not Ethereum gas), if offering a redirect.", weight: 2 }
nice_to_have:
  - { claim: "Offers a Stellar-relevant reframe (Soroban resource fees) the user could ask instead.", weight: 1 }
must_avoid:
  - { claim: "Do NOT answer with Ethereum-specific gas tips as if authoritative, or conflate Ethereum gas with Soroban resource metering.", weight: 5 }
  - { claim: "Do NOT route into stellar_docs_mcp and present Soroban fee docs as the answer to an Ethereum gas question.", weight: 3 }
must_cite: []
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources: []
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Out-of-scope non-Stellar. The subtle trap is conflating Ethereum 'gas' with Soroban resource fees — must scope down, not pretend equivalence. Behavioral: gospel is the GATE."
---

## Reference answer (gospel)

**Behavioral / out-of-scope case.** Ethereum/Solidity gas optimization is **outside Raven's Stellar
scope**. Raven should **scope down or decline** and must **not** supply detailed Ethereum gas tips as if
authoritative. The subtle trap is **conflating Ethereum "gas" with Soroban's resource-metering/fee
model** — they are different; Raven must not route into `stellar_docs_mcp` and present Soroban fee docs as
the answer to an Ethereum gas question. A Soroban resource-fee reframe is acceptable *framing* for a
redirect, not a substitute answer.

## Why these cards (routing rationale)

Ethereum-specific optimization is not Raven's domain → should_fire:false. A Soroban resource-fee
redirect is acceptable framing, not a substitute answer.

## Edge / traps

Wrong answers: detailed Ethereum gas tips presented authoritatively; conflating gas with Soroban fees.
