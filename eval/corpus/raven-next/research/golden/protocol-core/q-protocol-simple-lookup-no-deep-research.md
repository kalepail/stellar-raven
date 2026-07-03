---
id: q-protocol-simple-lookup-no-deep-research
q: "Quick question: what's the Stellar Testnet network passphrase? Just need the string."
category: protocol-core
subcategory: networks-passphrases
axes: [tool-targeted, edge-governance]
query_type: governance-negative
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: [lumenloop_request_research, lumenloop_research_result]
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Returns the exact Testnet passphrase: 'Test SDF Network ; September 2015'.", weight: 5 }
  - { claim: "Answers from a primary docs lookup only — does NOT escalate to a metered deep-research lane for a one-line constant.", weight: 5 }
should_have:
  - { claim: "Keeps the answer tight (the string + a one-line source), proportional to a trivial lookup.", weight: 2 }
nice_to_have:
  - { claim: "Optionally notes the Mainnet/Futurenet passphrases for completeness without over-researching.", weight: 1 }
must_avoid:
  - { claim: "Do NOT run a Parallel/Perplexity deep-research task or lumenloop_request_research for a single documented constant (over-escalation).", weight: 5 }
  - { claim: "Do NOT return the Mainnet or Futurenet passphrase in place of the Testnet one.", weight: 4 }
must_cite:
  - "The networks page on developers.stellar.org/docs/networks."
must_not_use_tier: [deep-research, metered-research]

pass_threshold: 0.8
weight_profile: strict

sources:
  - https://developers.stellar.org/docs/networks
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Governance-negative: a trivial constant must NOT trigger deep-research/metered tiers. Tests routing restraint, not just the fact."
---

## Reference answer (gospel)

- Testnet passphrase: **`Test SDF Network ; September 2015`** [1].
- This is a single documented constant — answer it from one primary docs lookup; do **not** escalate to a Parallel/Perplexity deep-research task or a `lumenloop_request_research` metered lane [1].
- For completeness: Mainnet is `Public Global Stellar Network ; September 2015` and Futurenet is `Test SDF Future Network ; October 2022` [1].

## Why these cards (routing rationale)

Trivial documented constant → `stellar_docs_mcp` only (one keyword lookup). The governance point is that
the metered/deep-research lane (`lumenloop_request_research`, Parallel/Perplexity deep research) must NOT
fire — over-escalation on a one-line lookup is the failure mode being probed.

## Edge / traps

Two traps: (1) escalating to a metered deep-research tier for a constant; (2) returning the wrong network's
passphrase. strict weight_profile makes any deep-research breach dominate.
