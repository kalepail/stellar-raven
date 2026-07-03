---
id: q-comp-security-disclosure-programs
q: "What security audit, bug-bounty, and vulnerability-disclosure programs does Stellar run?"
category: compliance-rwa-payments
subcategory: audits-incidents-risks
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null
expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Stellar runs a vulnerability disclosure program via HackerOne for the protocol/repos.", weight: 4 }
  - { claim: "Stellar runs a Bug Bounty Program covering vulnerabilities in the Stellar protocol and its repos.", weight: 4 }
  - { claim: "The Soroban Security Audit Bank provides structured security audits for eligible SCF-funded projects.", weight: 4 }
should_have:
  - { claim: "Notes these form the principal on-chain/protocol disclosure regime.", weight: 2 }
nice_to_have:
  - { claim: "Notes there is no public record of a Stellar-protocol-level funds-loss incident on mainnet.", weight: 2 }
must_avoid:
  - { claim: "Do NOT invent specific CVE numbers or audit firms as official without evidence (e.g. attaching unrelated CVEs like CVE-2020-3961, which is a VMware product).", weight: 4 }
  - { claim: "Do NOT claim a major Stellar-protocol funds-loss hack occurred without evidence.", weight: 4 }
must_cite:
  - "stellar.org bug-bounty / audit-bank pages and/or the HackerOne program."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://hackerone.com/stellar
  - https://stellar.org/grants-and-funding/bug-bounty
  - https://stellar.org/grants-and-funding/soroban-audit-bank
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Three SDF programs: HackerOne vulnerability disclosure, Stellar Bug Bounty, Soroban Security Audit Bank (for SCF-funded projects). Trap: inventing CVEs (e.g. CVE-2020-3961 is a VMware product, unrelated) or an unproven protocol funds-loss hack. NOTE: a YieldBlox/Blend POOL exploit (~$10M, Feb 2026) did occur, but that is an app/pool-config issue, not a Stellar-protocol-level funds-loss."
---

## Reference answer (gospel)

- **HackerOne Vulnerability Disclosure Program** — for the Stellar protocol/repos [1].
- **Stellar Bug Bounty Program** — bounties for vulnerabilities/exploits in the Stellar protocol and its
  repos [2].
- **Soroban Security Audit Bank** — structured security audits for eligible **SCF-funded** projects [3].
- Together these form the principal **protocol-level disclosure regime**. There is **no public record of a
  Stellar-protocol-level funds-loss incident on mainnet** (an app-level pool exploit like the Feb-2026
  YieldBlox/Blend incident is **not** a protocol compromise). Do **not** attach unrelated CVEs
  (e.g. CVE-2020-3961 is a VMware product) or assert an unproven protocol hack.

Sources: [1] hackerone.com/stellar; [2] stellar.org Bug Bounty; [3] Soroban Audit Bank.

## Why these cards (routing rationale)

SDF program pages live in the Scout corpus / docs → `scout_research`; `stellar_docs_mcp`/`perplexity_search` acceptable.

## Edge / traps

Trap: fabricating CVEs/audit firms or asserting an unproven protocol hack.
