---
id: q-tool-cli-testnet-identity-howto
q: "How do I set up a funded testnet identity (keypair) with the Stellar CLI so I can sign transactions on testnet?"
category: tooling-infra
subcategory: cli
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
  - { claim: "Uses the Stellar CLI to generate a named identity (e.g. `stellar keys generate <name> --network testnet`).", weight: 5 }
  - { claim: "Funds the testnet account via Friendbot (the CLI can fund on generate, or `--fund`).", weight: 4 }
should_have:
  - { claim: "Notes the identity can then be referenced by name as the source/signer in subsequent CLI commands.", weight: 3 }
  - { claim: "Mentions inspecting the public key (e.g. `stellar keys address <name>`).", weight: 2 }
nice_to_have:
  - { claim: "Notes testnet is periodically reset, so funded testnet accounts are not permanent.", weight: 1 }
must_avoid:
  - { claim: "Do NOT use the deprecated `soroban` CLI binary name as the current command (it is the unified `stellar` CLI).", weight: 4 }
  - { claim: "Do NOT claim a new testnet account is usable without funding (it needs the base reserve from Friendbot).", weight: 4 }
must_cite:
  - "A Stellar CLI / keys / testnet setup page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup
  - https://developers.stellar.org/docs/tools/cli/stellar-cli
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Axis-C how-to rebalance. Procedure → stellar_docs_mcp. Distinct from q-infra-friendbot-fund-testnet (funding focus) and q-tool-cli-install. Trap = deprecated `soroban` binary or unfunded account."
---

## Reference answer (gospel)

Use the **unified `stellar` CLI** (not the old `soroban` binary):

1. **Generate a named identity and fund it on testnet in one step:**
   `stellar keys generate <name> --network testnet --fund`
   (the `--fund` flag funds the new account via **Friendbot**; without it the account is unfunded and
   unusable until funded).
2. **Inspect the public key:** `stellar keys address <name>`.
3. **Use it as the signer** by name in later commands, e.g.
   `stellar contract invoke --source <name> --network testnet ...`.

Note: **testnet is periodically reset**, so a funded testnet account is not permanent. A brand-new
account needs the base reserve from Friendbot before it can sign/submit.

## Why these cards (routing rationale)

CLI procedure to create+fund a testnet identity → `stellar_docs_mcp`; `scout_research` acceptable.
General-web/deep-research are misses.

## Edge / traps

Using the deprecated `soroban` binary name, or claiming a new testnet account works without Friendbot
funding.
