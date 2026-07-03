---
id: q-protocol-base-reserve-min-balance
q: "What is the base reserve on Stellar and how does it determine an account's minimum XLM balance?"
category: protocol-core
subcategory: fee-model
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States the base reserve is 0.5 XLM.", weight: 5 }
  - { claim: "States an account's minimum balance = (2 + number of subentries) × base reserve (base account requires 2 base reserves = 1 XLM).", weight: 4 }
should_have:
  - { claim: "Notes subentries that consume reserves include trustlines, offers, signers, and data entries (each adds one base reserve).", weight: 3 }
nice_to_have:
  - { claim: "Notes the reserve is locked (not spendable) but recoverable when the subentry is removed; it is a network parameter set by validators.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state the wrong base reserve (e.g. 1 XLM or 5 XLM) or claim the minimum account balance is 0.", weight: 5 }
  - { claim: "Do NOT claim trustlines/offers/signers are free and do not increase the minimum balance.", weight: 3 }
must_cite:
  - "The minimum-balance / base-reserve docs on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/lumens
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Base reserve 0.5 XLM; base min balance = 2 reserves (1 XLM) + 1 per subentry. Trap is wrong magnitude."
---

## Reference answer (gospel)

- The base reserve is **0.5 XLM** [1].
- An account's minimum balance = **(2 + number of subentries) × base reserve** [1]. A base (empty) account holds 2 base reserves = **1 XLM** [1].
- Each subentry adds one base reserve (0.5 XLM): **trustlines, offers, additional signers, and data entries** [1].
- The reserve is locked (not spendable) but recoverable when the subentry is removed; the base reserve is a network parameter set by validators [1].

## Why these cards (routing rationale)

Canonical reserve fact → `stellar_docs_mcp`; `scout_research` acceptable. No general-web/deep-research.

## Edge / traps

Wrong base-reserve value (it's 0.5 XLM), claiming a zero minimum balance, or claiming subentries are free
are the traps.
