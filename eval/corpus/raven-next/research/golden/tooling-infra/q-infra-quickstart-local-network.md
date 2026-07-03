---
id: q-infra-quickstart-local-network
q: "How do I run a full Stellar network locally for development and CI?"
category: tooling-infra
subcategory: quickstart-localdev
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The `stellar/quickstart` Docker image runs all components of a Stellar network locally.", weight: 5 }
  - { claim: "It can be configured as `--local`, `--testnet`, or `--pubnet` at container start.", weight: 4 }
should_have:
  - { claim: "`stellar network container start testnet` (Stellar CLI) boots the Quickstart container with a testnet-friendly config.", weight: 3 }
  - { claim: "Quickstart exposes Friendbot (e.g. at `http://localhost:8000/friendbot`) for funding.", weight: 2 }
nice_to_have:
  - { claim: "Use `--local` for hermetic CI, `--testnet` for public-testnet interop.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent a non-existent local-network tool or claim you must run raw stellar-core by hand for local dev.", weight: 3 }
must_cite:
  - "developers.stellar.org Quickstart docs or the stellar/quickstart image/repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/quickstart
  - https://github.com/stellar/quickstart
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Quickstart container + CLI integration; covers quickstart/localdev subtopic."
---

## Reference answer (gospel)

Use the **`stellar/quickstart` Docker image** — it runs all components of a Stellar network locally in
one container. Configure the target network at start: **`--local`**, **`--testnet`**, or **`--pubnet`**
(e.g. `docker run --rm -p 8000:8000 stellar/quickstart --local`). The container exposes **Friendbot at
`http://localhost:8000/friendbot`** for funding accounts.

The Stellar CLI wraps this: **`stellar network container start testnet`** boots the Quickstart container
with a testnet-friendly config. Use **`--local`** for hermetic CI, **`--testnet`** for public-testnet
interop. You do not need to run raw stellar-core by hand.

## Why these cards (routing rationale)

Local-dev how-to → `stellar_docs_mcp`; `scout_repos` acceptable (quickstart repo). Deep-research/general-web are misses.

## Edge / traps

Inventing a non-existent local-network tool, or claiming you must hand-run stellar-core, is the trap.
