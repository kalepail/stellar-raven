---
id: q-soroban-canonical-examples-source
q: "Where are the canonical Stellar examples and recommended libraries a coding agent should cite to build a Soroban contract or a Freighter payment flow?"
category: soroban
subcategory: examples-libraries
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos, scout_skills]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Points to developers.stellar.org getting-started / examples (e.g. increment/counter) as canonical Soroban example sources.", weight: 5 }
  - { claim: "Points to the soroban-examples repo as a canonical example source.", weight: 4 }
  - { claim: "Recommends the right libraries: stellar-sdk (JS) + Freighter API + Stellar Wallets Kit for the client flow.", weight: 4 }
  - { claim: "Recommends OpenZeppelin Stellar (Soroban) contract libraries.", weight: 3 }
should_have:
  - { claim: "Frames the answer as sourced evidence + recommended libraries (where to look), not a finished implementation.", weight: 3 }
nice_to_have:
  - { claim: "Notes the soroban-sdk (Rust) as the contract-side library.", weight: 1 }
must_avoid:
  - { claim: "Do not generate the code itself — Raven returns sourced evidence, not code.", weight: 5 }
  - { claim: "Do NOT recommend deprecated tooling (e.g. the old soroban-cli as the current CLI, or abandoned SDKs).", weight: 4 }
must_cite:
  - "A primary developers.stellar.org getting-started/examples page and the soroban-examples repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started
  - https://github.com/stellar/soroban-examples
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "The code-gen REFRAME case: point a coding agent at canonical SOURCES + recommended libraries, NOT writing code. Confirmed the getting-started section (hello world / storing data / increment / deploy-to-testnet) and the soroban-examples repo are current; CLI is `stellar` not legacy `soroban`."
---

## Reference answer (gospel)

This is the **code-gen reframe**: a coding agent asks "where do I cite," and Raven returns **canonical
sources + recommended libraries**, **not** a finished implementation.

- **Soroban examples** — developers.stellar.org **getting-started / examples** (e.g. **increment /
  counter**) and the **`soroban-examples`** repo. Contract-side library: **`soroban-sdk` (Rust)**.
- **Freighter payment flow** — **stellar-sdk (JS)** + **Freighter API** + **Stellar Wallets Kit**.
- **Contract libraries** — **OpenZeppelin Stellar** (Soroban).

Raven points at these **sources to cite**; it does **not** generate the contract/app code.

## Why these cards (routing rationale)

"Where are the canonical examples / which libraries" → first-party docs + repo discovery →
**`stellar_docs_mcp`** (with `scout_repos` / `scout_skills` acceptable). Deep-research tier is
forbidden.

## Edge / traps

The defining trap: **generating the code itself** — Raven returns **sourced evidence, not code** (the
weight-5 `must_avoid`). Secondary trap: recommending **deprecated tooling** (old `soroban-cli`,
abandoned SDKs).
