---
id: q-hist-ukraine-ehryvnia-cbdc
q: "Was there an electronic hryvnia (e-hryvnia) CBDC pilot on Stellar in Ukraine?"
category: history-org-tokenomics
subcategory: deployments
axes: [ecosystem-spectrum, edge-governance]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "A pilot to issue an electronic hryvnia (e-hryvnia) on Stellar was run in Ukraine, supervised/backed by the National Bank of Ukraine.", weight: 5 }
should_have:
  - { claim: "The pilot involved TASCOMBANK and fintech Bitt, with the National Bank of Ukraine as the controlling/platform operator.", weight: 3 }
  - { claim: "It was announced around late 2021.", weight: 2 }
nice_to_have:
  - { claim: "Use cases included programmable payroll and P2P/merchant payments.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim there was no Ukraine CBDC pilot on Stellar.", weight: 4 }
  - { claim: "Do NOT attribute the e-hryvnia pilot to Ripple/XRP or a different blockchain.", weight: 3 }
must_cite:
  - "A reputable dated source on the e-hryvnia pilot on Stellar (stellar.org press, CoinDesk, or NBU)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/ukraine-electronic-hryvnia-pilot-launched-by-tascombank-and-bitt-on-stellar
  - https://www.coindesk.com/policy/2021/12/14/ukraine-commercial-bank-to-test-digital-currency-built-on-stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "e-hryvnia pilot (TASCOMBANK + Bitt, supervised by National Bank of Ukraine, announced Dec 14 2021) on stellar.org press + CoinDesk. Use cases: programmable payroll (Diia City), P2P, merchant payments. The 'didn't happen' and Ripple-attribution traps matter. Verified 2026-06-22."
---

## Reference answer (gospel)

- Yes — a pilot to issue an **electronic hryvnia (e-hryvnia) on Stellar** was run in **Ukraine**, announced **December 14, 2021** [1][2].
- It was run by **TASCOMBANK** with fintech **Bitt**, **supervised by the National Bank of Ukraine** (which acted as platform operator, controlling issuance) [1][2].
- Use cases tested included **programmable payroll** (for Diia City employees), **P2P** and **merchant payments** [1].
- Traps to avoid: claiming there was no Ukraine CBDC pilot on Stellar, or attributing it to **Ripple/XRP** / a different chain [1][2].

- [1] stellar.org/press/ukraine-electronic-hryvnia-pilot-launched-by-tascombank-and-bitt-on-stellar
- [2] coindesk.com/policy/2021/12/14/ukraine-commercial-bank-to-test-digital-currency-built-on-stellar

## Why these cards (routing rationale)

A dated CBDC-pilot news item with official + press sourcing → `perplexity_search`; `scout_research`
acceptable for the stellar.org press release.

## Edge / traps

Traps: denying the pilot, or attributing it to Ripple.
