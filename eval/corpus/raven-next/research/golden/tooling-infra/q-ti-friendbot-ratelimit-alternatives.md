---
id: q-ti-friendbot-ratelimit-alternatives
q: "Friendbot keeps rate-limiting my testnet funding - what are the legitimate ways to get testnet XLM, and is there an official backup faucet wallet?"
category: tooling-infra
subcategory: wallets-keys
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Identifies official Testnet funding paths: Friendbot directly or via Stellar Lab/account fund; for local development, Quickstart/local Friendbot.", weight: 5 }
  - { claim: "Explains that rate limits are expected for public faucets and should be handled by waiting, reusing funded test accounts, local Quickstart, or CI seeding, not by asking strangers for keys/funds.", weight: 4 }
  - { claim: "States there is no need to use or trust an unofficial backup faucet wallet unless SDF docs point to it.", weight: 4 }
  - { claim: "Keeps testnet XLM distinct from mainnet XLM and warns that testnet funds have no real value.", weight: 4 }
should_have:
  - { claim: "Mentions Circle faucet only for testnet USDC after creating a trustline, not as a replacement for XLM Friendbot.", weight: 2 }
nice_to_have:
  - { claim: "Suggests checking Testnet reset timing if a previously funded account vanished.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT point users to an unofficial backup faucet wallet or ask them to send funds/keys.", weight: 5 }
must_cite:
  - "Official Stellar Lab/Friendbot/Quickstart docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/apps/example-application-tutorial/overview#dev-helpers"
  - "https://developers.stellar.org/docs/tools/quickstart/advanced-usage/container"
  - "https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide#setting-up-a-testnet-wallet"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "No official backup faucet wallet was verified. If one appears later, require a dated SDF/developers.stellar.org citation before treating it as legitimate."
---

## Reference answer (gospel)

Use the official faucet paths: Friendbot funds Testnet accounts with fake XLM and is reachable directly as `https://friendbot.stellar.org/?addr=G...` [1], and Stellar Lab's account funding flow wraps the same idea [3]. If the public faucet rate-limits you, wait/retry later, reuse already funded Testnet accounts, or run a local Quickstart network; the Quickstart container includes friendbot, horizon, stellar-core, and stellar-rpc [2].

There is no verified official "backup faucet wallet" to trust with keys or seed phrases. Do not send anyone your secret key, recovery phrase, or mainnet funds to get testnet XLM. Circle's faucet is relevant for testnet USDC after creating a trustline, not for native Testnet XLM [3].

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for the official Friendbot/Lab/Quickstart evidence. `parallel_search` is acceptable only for a current outage/status check, not as the basis for an unofficial faucet recommendation.

## Edge / traps

The trap is accepting a random "backup faucet" as official or asking users to send secrets/funds. Another trap is confusing testnet XLM with mainnet XLM or Circle's testnet USDC faucet.
