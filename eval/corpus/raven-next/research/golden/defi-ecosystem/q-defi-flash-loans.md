---
id: q-defi-flash-loans
q: "Are flash loans possible on Stellar or Soroban, and how would atomic multi-contract logic work in one transaction?"
category: defi-ecosystem
subcategory: flash-loans-atomicity
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains Stellar transactions are atomic: included operations/contract invocations either succeed together or fail together.", weight: 5 }
  - { claim: "Explains a flash-loan-like feature requires a protocol/contract that lends and enforces repayment within the same transaction or invocation flow; it is not a native guaranteed lending primitive by itself.", weight: 5 }
  - { claim: "Mentions Soroban supports contract calls and authorization/footprint/resource constraints that matter for composing multiple calls.", weight: 4 }
should_have:
  - { claim: "Names XycLoans as the credible Soroban flash-loans protocol (flash-loans-only, per-token liquidity pools enforcing same-transaction repayment), with current evidence required for any live-availability claim.", weight: 3 }
  - { claim: "Mentions simulation/testing for resource limits and failure behavior.", weight: 2 }
nice_to_have:
  - { claim: "Compares conceptually to EVM flash loans without implying identical execution semantics.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar has built-in native flash loans without a lending protocol/contract.", weight: 5 }
  - { claim: "Do NOT claim EVM flash-loan code can be copied directly to Soroban.", weight: 4 }
  - { claim: "Do NOT attribute flash loans to Slender (a noncustodial lending money market) — XycLoans is the credible Soroban flash-loans protocol.", weight: 4 }
must_cite:
  - "Stellar/Soroban transaction and contract invocation docs, plus dated protocol docs for any live flash-loan implementation."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/transaction-lifecycle"
  - "https://developers.stellar.org/docs/build/guides/transactions/invoke-contract-tx-sdk"
  - "https://stellarlight.xyz/project/xycloans"
  - "https://sorobansecurity.com/report/33"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "CORRECTED 2026-06-29: prior version misattributed flash loans to Slender. Live Scout confirms Slender is a noncustodial lending/borrowing money market (by eq-lab), NOT a flash-loan protocol. XycLoans is the credible Soroban flash-loans protocol ('a decentralized flash loans protocol that runs on Soroban... a flash loans-only protocol'), audited by OtterSec Jan 2024 (sorobansecurity.com/report/33). Slender reference removed; XycLoans is the named flash-loan provider, with dated/source evidence required before treating as production-safe."
---

## Reference answer (gospel)

Flash-loan-like designs are possible on Soroban, but not because Stellar has a native flash-loan primitive. A transaction's operations are applied as a unit through the ledger close path; contract invocations are submitted in transactions and must satisfy authorization, footprint, and resource constraints. A lending protocol must explicitly lend and enforce repayment within the same atomic transaction/invocation flow.

Scout surfaces **XycLoans** as the credible Soroban flash-loans protocol — a flash-loans-only protocol that runs liquidity pools per supported token and enforces same-transaction repayment by design (OtterSec-audited, Jan 2024). Note **Slender** is a noncustodial lending/borrowing money market (by eq-lab), **not** a flash-loan protocol — do not attribute flash loans to it. A correct answer may name XycLoans only with dated project/source evidence and should not say "all Soroban contracts have flash loans." Builders need simulation, resource-limit testing, failure-path tests, and protocol-specific docs before composing multiple calls.

## Why these cards (routing rationale)

`stellar_docs_mcp` is expected for transaction/contract invocation mechanics. Scout/repos/web are acceptable for current protocol availability.

## Edge / traps

The common error is to copy an EVM mental model and ignore Soroban authorization, footprint, and metering. Atomicity is necessary for flash loans, not sufficient.
