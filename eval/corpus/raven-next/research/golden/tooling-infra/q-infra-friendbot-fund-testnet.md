---
id: q-infra-friendbot-fund-testnet
q: "How do I fund a testnet account (and a contract address) with XLM using Friendbot?"
category: tooling-infra
subcategory: friendbot-testnet
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Friendbot is a testnet faucet that creates & funds new accounts (and contract addresses) by hitting a REST endpoint.", weight: 5 }
  - { claim: "The public Testnet Friendbot is at `https://friendbot.stellar.org`, called with the address as a query param (e.g. `?addr=<G... or C...>`).", weight: 4 }
should_have:
  - { claim: "Friendbot funds both `G...` account addresses and `C...` contract addresses.", weight: 2 }
  - { claim: "The Stellar Lab also offers a Friendbot funding UI for testnet.", weight: 1 }
nice_to_have:
  - { claim: "On a local Quickstart container Friendbot is exposed at `http://localhost:8000/friendbot`; a separate Futurenet Friendbot exists at friendbot-futurenet.stellar.org.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Friendbot funds Mainnet accounts (it is testnet/dev only).", weight: 5 }
must_cite:
  - "developers.stellar.org friendbot/faucet docs or the stellar/friendbot repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/friendbot
  - https://developers.stellar.org/docs/tools/quickstart/faucet
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Friendbot is testnet-only; claiming mainnet funding is the trap. Verified: REST GET|POST / with ?addr=; funds G... and (when fund_contract_addresses enabled) C...; ~10,000 fake XLM; Futurenet has its own friendbot-futurenet.stellar.org."
---

## Reference answer (gospel)

**Friendbot** is Stellar's native asset **faucet** — a REST endpoint that *creates & funds* new
**accounts and contract addresses** with fake XLM on test networks
([stellar/friendbot](https://github.com/stellar/friendbot)).

- Public **Testnet** Friendbot: `https://friendbot.stellar.org`, called with the address as a query
  param: `GET|POST https://friendbot.stellar.org/?addr=<G... or C...>` (funds ~10,000 fake XLM).
- It funds both **`G...` account addresses** and **`C...` contract addresses** (contract funding
  requires `fund_contract_addresses` + an RPC URL on the Friendbot instance).
- The **Stellar Lab** (`lab.stellar.org/account/fund`) offers a Friendbot UI for testnet funding.
- On a local **Quickstart** container Friendbot is at `http://localhost:8000/friendbot`; **Futurenet**
  has its own at `https://friendbot-futurenet.stellar.org`.

Friendbot is **testnet/dev only** — it does **not** fund Mainnet accounts.

## Why these cards (routing rationale)

Faucet how-to → `stellar_docs_mcp`. Deep-research/general-web are misses.

## Edge / traps

Claiming Friendbot funds mainnet is the central trap.
