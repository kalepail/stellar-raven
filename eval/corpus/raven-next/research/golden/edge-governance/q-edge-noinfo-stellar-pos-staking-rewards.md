---
id: q-edge-noinfo-stellar-pos-staking-rewards
q: "How much can I earn staking XLM directly in Stellar's proof-of-stake protocol, and what are the validator rewards?"
category: edge-governance
subcategory: honest-no-info
axes: [edge-governance]
query_type: governance-negative
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [lumenloop_search_content_semantic]
forbidden_cards: [lumenloop_request_research, lumenloop_research_result]
expected_service: stellar_docs
should_fire: true   # false premise: Stellar uses SCP (FBA), not proof-of-stake with staking rewards

must_have:
  - { claim: "Corrects the false premise: Stellar uses the Stellar Consensus Protocol (federated Byzantine agreement), not proof-of-stake, and validators do NOT earn native staking/block rewards.", weight: 5 }
  - { claim: "Does NOT invent a native XLM staking yield or validator reward schedule.", weight: 5 }
should_have:
  - { claim: "Notes any 'XLM staking' products are third-party / app-layer (e.g. liquid staking), not a protocol feature.", weight: 2 }
nice_to_have:
  - { claim: "Explains validators run for network health, not for inflation/block rewards (inflation was disabled in 2019).", weight: 1 }
must_avoid:
  - { claim: "Do NOT state an APY/reward rate for native XLM proof-of-stake staking as if it exists.", weight: 5 }
  - { claim: "Do NOT describe Stellar as a proof-of-stake chain.", weight: 4 }
must_cite:
  - "Point to docs on SCP / consensus and the 2019 end of inflation."
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Honest-no-info via false premise: Stellar is SCP/FBA, not PoS; no native staking/block rewards (and inflation was disabled in 2019). Reward correcting; trap is inventing an APY. Cross-checks the protocol-core consensus facts."
---

## Reference answer (gospel)

**False-premise / honest-no-info case.** Stellar is **not a proof-of-stake chain**. It runs the
**Stellar Consensus Protocol (SCP)**, a federated Byzantine agreement model — validators participate for
**network health, not for staking/block rewards**, and there is **no native XLM staking yield**
([SCP docs](https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol)). Raven
must correct the premise and **not** quote an APY or validator reward schedule as if native PoS staking
exists. It should note any "XLM staking" products are **third-party / app-layer** (e.g. liquid staking),
not a protocol feature, and may add that the protocol **inflation mechanism was disabled in 2019**.

## Why these cards (routing rationale)

Docs/corpus confirm SCP/FBA consensus and no native staking. The honest output corrects the premise
and flags third-party staking products as app-layer, not protocol.

## Edge / traps

Wrong answers: quoting a native staking APY; calling Stellar proof-of-stake.
